import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

// ─── Design tokens ───────────────────────────────────────────
const A  = '#4f46e5';
const BG = '#0a0a10';
const S  = '#111118';
const B  = 'rgba(255,255,255,0.08)';
const T  = '#ffffff';
const M  = 'rgba(255,255,255,0.5)';
const font = "'Inter','Outfit',sans-serif";

// ─── Tiny helpers ────────────────────────────────────────────
const Input = ({ label, value, onChange, type = 'text', placeholder = '', rows }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: M, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>}
    {rows ? (
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: BG, border: `1px solid ${B}`, borderRadius: 8, padding: '10px 12px', color: T, fontFamily: font, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: BG, border: `1px solid ${B}`, borderRadius: 8, padding: '10px 12px', color: T, fontFamily: font, fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
    )}
  </div>
);

const Toggle = ({ label, value, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
    <div onClick={() => onChange(!value)} style={{ width: 40, height: 22, borderRadius: 11, background: value ? A : B, cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
    </div>
    <span style={{ fontFamily: font, fontSize: 13, color: M }}>{label}</span>
  </div>
);

const Btn = ({ children, onClick, variant = 'primary', size = 'md', disabled }) => {
  const pad = size === 'sm' ? '6px 14px' : '10px 20px';
  const bg = variant === 'primary' ? A : variant === 'danger' ? '#ef4444' : 'transparent';
  const border = variant === 'ghost' ? `1px solid ${B}` : 'none';
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: bg, border, borderRadius: 8, padding: pad, color: T, fontFamily: font, fontWeight: 600, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'opacity 0.15s' }}>
      {children}
    </button>
  );
};

const Toast = ({ msg, type }) => msg ? (
  <div style={{ position: 'fixed', bottom: 24, right: 24, background: type === 'error' ? '#ef4444' : '#10b981', color: '#fff', padding: '12px 20px', borderRadius: 10, fontFamily: font, fontSize: 13, fontWeight: 600, zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>{msg}</div>
) : null;

// ─── Modal wrapper ───────────────────────────────────────────
const Modal = ({ title, onClose, children, onSave, saving }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
    <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 16, width: '100%', maxWidth: 540, maxHeight: '85vh', overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: font, fontWeight: 800, fontSize: 17, color: T }}>{title}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: M, cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
      </div>
      {children}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20, borderTop: `1px solid ${B}`, paddingTop: 20 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Btn>
      </div>
    </div>
  </div>
);

// ─── Generic table ───────────────────────────────────────────
const Table = ({ cols, rows, onEdit, onDelete }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
      <thead>
        <tr>
          {cols.map(c => <th key={c.key} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: M, letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: `1px solid ${B}` }}>{c.label}</th>)}
          <th style={{ borderBottom: `1px solid ${B}`, width: 100 }} />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={row.id || ri} style={{ borderBottom: `1px solid ${B}` }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {cols.map(c => (
              <td key={c.key} style={{ padding: '12px 14px', fontSize: 13, color: c.muted ? M : T, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
              </td>
            ))}
            <td style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn size="sm" variant="ghost" onClick={() => onEdit(row)}>Edit</Btn>
                <Btn size="sm" variant="danger" onClick={() => onDelete(row)}>Del</Btn>
              </div>
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr><td colSpan={cols.length + 1} style={{ padding: '32px 14px', textAlign: 'center', color: M, fontSize: 13 }}>No records yet. Add one above.</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

// ─── Confirm delete dialog ───────────────────────────────────
const ConfirmDelete = ({ item, onConfirm, onCancel }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: S, border: `1px solid #ef4444`, borderRadius: 14, padding: 28, maxWidth: 380, width: '100%', margin: 24 }}>
      <div style={{ fontFamily: font, fontWeight: 800, fontSize: 16, color: T, marginBottom: 10 }}>Delete this record?</div>
      <div style={{ fontFamily: font, fontSize: 13, color: M, marginBottom: 24 }}>This cannot be undone. The record will be permanently removed from Supabase.</div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm}>Yes, Delete</Btn>
      </div>
    </div>
  </div>
);

// ─── Section header ──────────────────────────────────────────
const SectionHeader = ({ title, desc, onAdd }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
    <div>
      <h2 style={{ fontFamily: font, fontWeight: 800, fontSize: 22, color: T, margin: 0 }}>{title}</h2>
      {desc && <p style={{ fontFamily: font, fontSize: 13, color: M, marginTop: 4 }}>{desc}</p>}
    </div>
    <Btn onClick={onAdd}>+ Add New</Btn>
  </div>
);

// ─────────────────────────────────────────────────────────────
// SECTION: PRICING
// ─────────────────────────────────────────────────────────────
const PricingAdmin = ({ toast }) => {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);
  const [saving, setSaving] = useState(false);
  const blank = { id: '', name: '', price: '', interval: 'one-time', badge: '', highlight: false, description: '', features: '', cta: 'Apply for Founder Access', cta_url: '/contact' };

  const load = useCallback(async () => {
    const { data } = await supabase.from('pricing_plans').select('*').order('sort_order');
    setRows(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const payload = {
      id: modal.id,
      name: modal.name,
      price: parseInt(modal.price) || 0,
      interval: modal.interval,
      badge: modal.badge || null,
      highlight: modal.highlight,
      description: modal.description,
      features: modal.features.split('\n').filter(Boolean),
      cta: modal.cta,
      cta_url: modal.cta_url,
      sort_order: modal.sort_order || 0,
    };
    const { error } = modal._isNew
      ? await supabase.from('pricing_plans').insert(payload)
      : await supabase.from('pricing_plans').update(payload).eq('id', modal.id);
    setSaving(false);
    if (error) { toast(error.message, 'error'); return; }
    toast('Saved!'); setModal(null); load();
  };

  const remove = async () => {
    await supabase.from('pricing_plans').delete().eq('id', del.id);
    toast('Deleted'); setDel(null); load();
  };

  const openEdit = row => setModal({ ...row, features: Array.isArray(row.features) ? row.features.join('\n') : '' });
  const openAdd  = () => setModal({ ...blank, _isNew: true });

  return (
    <>
      <SectionHeader title="Pricing Plans" desc="Manage the 3-tier pricing shown on the Pricing page." onAdd={openAdd} />
      <Table
        cols={[
          { key: 'name', label: 'Plan Name' },
          { key: 'price', label: 'Price', render: v => `$${v?.toLocaleString()}` },
          { key: 'badge', label: 'Badge', muted: true },
          { key: 'highlight', label: 'Featured', render: v => v ? '⭐ Yes' : '—' },
          { key: 'id', label: 'ID', muted: true },
        ]}
        rows={rows} onEdit={openEdit} onDelete={setDel}
      />
      {modal && (
        <Modal title={modal._isNew ? 'Add Pricing Plan' : 'Edit Plan'} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Input label="Plan ID (e.g. starter)" value={modal.id} onChange={v => setModal(m => ({ ...m, id: v }))} placeholder="starter" />
          <Input label="Name" value={modal.name} onChange={v => setModal(m => ({ ...m, name: v }))} />
          <Input label="Price (USD)" value={modal.price} onChange={v => setModal(m => ({ ...m, price: v }))} type="number" />
          <Input label="Badge (optional — e.g. Most Popular)" value={modal.badge || ''} onChange={v => setModal(m => ({ ...m, badge: v }))} />
          <Input label="Description" value={modal.description} onChange={v => setModal(m => ({ ...m, description: v }))} rows={2} />
          <Input label="Features (one per line)" value={modal.features} onChange={v => setModal(m => ({ ...m, features: v }))} rows={6} placeholder={"Full Retreat OS setup\nParticipant management module\n..."} />
          <Input label="CTA Label" value={modal.cta} onChange={v => setModal(m => ({ ...m, cta: v }))} />
          <Input label="Sort Order" value={modal.sort_order || ''} onChange={v => setModal(m => ({ ...m, sort_order: v }))} type="number" />
          <Toggle label="Featured / Highlighted plan" value={modal.highlight} onChange={v => setModal(m => ({ ...m, highlight: v }))} />
        </Modal>
      )}
      {del && <ConfirmDelete item={del} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION: PLATFORM MODULES
// ─────────────────────────────────────────────────────────────
const ModulesAdmin = ({ toast }) => {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('platform_modules').select('*').order('sort_order');
    setRows(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const payload = { id: modal.id, name: modal.name, icon: modal.icon, description: modal.description, url: modal.url, sort_order: parseInt(modal.sort_order) || 0 };
    const { error } = modal._isNew
      ? await supabase.from('platform_modules').insert(payload)
      : await supabase.from('platform_modules').update(payload).eq('id', modal.id);
    setSaving(false);
    if (error) { toast(error.message, 'error'); return; }
    toast('Saved!'); setModal(null); load();
  };

  const remove = async () => { await supabase.from('platform_modules').delete().eq('id', del.id); toast('Deleted'); setDel(null); load(); };

  return (
    <>
      <SectionHeader title="Platform Modules" desc="The 8 OS modules shown on the Platform page and homepage." onAdd={() => setModal({ id: '', name: '', icon: '', description: '', url: '', sort_order: rows.length + 1, _isNew: true })} />
      <Table
        cols={[
          { key: 'icon', label: '  ', render: v => <span style={{ fontSize: 20 }}>{v}</span> },
          { key: 'name', label: 'Module Name' },
          { key: 'description', label: 'Description', muted: true },
          { key: 'sort_order', label: 'Order', muted: true },
        ]}
        rows={rows} onEdit={r => setModal({ ...r })} onDelete={setDel}
      />
      {modal && (
        <Modal title={modal._isNew ? 'Add Module' : 'Edit Module'} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Input label="Module ID (slug, e.g. command-center)" value={modal.id} onChange={v => setModal(m => ({ ...m, id: v }))} />
          <Input label="Name" value={modal.name} onChange={v => setModal(m => ({ ...m, name: v }))} />
          <Input label="Icon (emoji)" value={modal.icon} onChange={v => setModal(m => ({ ...m, icon: v }))} placeholder="🧭" />
          <Input label="Description" value={modal.description} onChange={v => setModal(m => ({ ...m, description: v }))} rows={3} />
          <Input label="URL path" value={modal.url || ''} onChange={v => setModal(m => ({ ...m, url: v }))} placeholder="/platform/retreat-command-center" />
          <Input label="Sort Order" value={modal.sort_order} onChange={v => setModal(m => ({ ...m, sort_order: v }))} type="number" />
        </Modal>
      )}
      {del && <ConfirmDelete item={del} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION: SOLUTIONS
// ─────────────────────────────────────────────────────────────
const SolutionsAdmin = ({ toast }) => {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('solutions').select('*').order('sort_order');
    setRows(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const payload = { id: modal.id, name: modal.name, slug: modal.slug, icon: modal.icon, color: modal.color, description: modal.description, sort_order: parseInt(modal.sort_order) || 0 };
    const { error } = modal._isNew
      ? await supabase.from('solutions').insert(payload)
      : await supabase.from('solutions').update(payload).eq('id', modal.id);
    setSaving(false);
    if (error) { toast(error.message, 'error'); return; }
    toast('Saved!'); setModal(null); load();
  };

  const remove = async () => { await supabase.from('solutions').delete().eq('id', del.id); toast('Deleted'); setDel(null); load(); };

  return (
    <>
      <SectionHeader title="Solutions" desc="The 6 solution systems shown on the Solutions page." onAdd={() => setModal({ id: '', name: '', slug: '', icon: '', color: '#4f46e5', description: '', sort_order: rows.length + 1, _isNew: true })} />
      <Table
        cols={[
          { key: 'icon', label: '  ', render: v => <span style={{ fontSize: 20 }}>{v}</span> },
          { key: 'name', label: 'Solution Name' },
          { key: 'color', label: 'Color', render: v => <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: v, verticalAlign: 'middle' }} /> },
          { key: 'id', label: 'ID', muted: true },
        ]}
        rows={rows} onEdit={r => setModal({ ...r })} onDelete={setDel}
      />
      {modal && (
        <Modal title={modal._isNew ? 'Add Solution' : 'Edit Solution'} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Input label="ID (e.g. operations)" value={modal.id} onChange={v => setModal(m => ({ ...m, id: v }))} />
          <Input label="Name" value={modal.name} onChange={v => setModal(m => ({ ...m, name: v }))} />
          <Input label="Slug (e.g. retreat-operations-system)" value={modal.slug} onChange={v => setModal(m => ({ ...m, slug: v }))} />
          <Input label="Icon (emoji)" value={modal.icon} onChange={v => setModal(m => ({ ...m, icon: v }))} />
          <Input label="Color (hex)" value={modal.color} onChange={v => setModal(m => ({ ...m, color: v }))} placeholder="#4f46e5" />
          <Input label="Description" value={modal.description} onChange={v => setModal(m => ({ ...m, description: v }))} rows={3} />
          <Input label="Sort Order" value={modal.sort_order} onChange={v => setModal(m => ({ ...m, sort_order: v }))} type="number" />
        </Modal>
      )}
      {del && <ConfirmDelete item={del} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION: BLOG POSTS
// ─────────────────────────────────────────────────────────────
const BlogAdmin = ({ toast }) => {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);
  const [saving, setSaving] = useState(false);
  const CATS = ['Operations','Marketing','Pricing','Technology','Automation','Data','Growth','Strategy'];

  const load = useCallback(async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setRows(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const payload = { title: modal.title, category: modal.category, read_time: modal.read_time, body: modal.body || '', published: modal.published };
    const { error } = modal._isNew
      ? await supabase.from('blog_posts').insert(payload)
      : await supabase.from('blog_posts').update({ ...payload, updated_at: new Date() }).eq('id', modal.id);
    setSaving(false);
    if (error) { toast(error.message, 'error'); return; }
    toast('Saved!'); setModal(null); load();
  };

  const remove = async () => { await supabase.from('blog_posts').delete().eq('id', del.id); toast('Deleted'); setDel(null); load(); };

  return (
    <>
      <SectionHeader title="Blog Posts" desc="Manage blog posts shown on the Resources / Blog page." onAdd={() => setModal({ title: '', category: 'Operations', read_time: '5 min', body: '', published: true, _isNew: true })} />
      <Table
        cols={[
          { key: 'title', label: 'Title' },
          { key: 'category', label: 'Category', muted: true },
          { key: 'read_time', label: 'Read Time', muted: true },
          { key: 'published', label: 'Status', render: v => <span style={{ color: v ? '#10b981' : '#ef4444', fontWeight: 700 }}>{v ? 'Live' : 'Draft'}</span> },
        ]}
        rows={rows} onEdit={r => setModal({ ...r })} onDelete={setDel}
      />
      {modal && (
        <Modal title={modal._isNew ? 'Add Blog Post' : 'Edit Post'} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Input label="Title" value={modal.title} onChange={v => setModal(m => ({ ...m, title: v }))} />
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: M, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>Category</div>
            <select value={modal.category} onChange={e => setModal(m => ({ ...m, category: e.target.value }))}
              style={{ width: '100%', background: BG, border: `1px solid ${B}`, borderRadius: 8, padding: '10px 12px', color: T, fontFamily: font, fontSize: 14, outline: 'none' }}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Read Time (e.g. 8 min)" value={modal.read_time} onChange={v => setModal(m => ({ ...m, read_time: v }))} />
          <Input label="Body / Content (optional)" value={modal.body || ''} onChange={v => setModal(m => ({ ...m, body: v }))} rows={8} placeholder="Write your blog post content here..." />
          <Toggle label="Published (visible on site)" value={modal.published} onChange={v => setModal(m => ({ ...m, published: v }))} />
        </Modal>
      )}
      {del && <ConfirmDelete item={del} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION: GUIDES
// ─────────────────────────────────────────────────────────────
const GuidesAdmin = ({ toast }) => {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('guides').select('*').order('sort_order');
    setRows(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const payload = { id: modal.id, title: modal.title, description: modal.description, icon: modal.icon, pages: modal.pages, color: modal.color, sort_order: parseInt(modal.sort_order) || 0 };
    const { error } = modal._isNew
      ? await supabase.from('guides').insert(payload)
      : await supabase.from('guides').update(payload).eq('id', modal.id);
    setSaving(false);
    if (error) { toast(error.message, 'error'); return; }
    toast('Saved!'); setModal(null); load();
  };

  const remove = async () => { await supabase.from('guides').delete().eq('id', del.id); toast('Deleted'); setDel(null); load(); };

  return (
    <>
      <SectionHeader title="Guides" desc="Downloadable guides shown on the Resources page." onAdd={() => setModal({ id: '', title: '', description: '', icon: '📋', pages: '30 pages', color: '#4f46e5', sort_order: rows.length + 1, _isNew: true })} />
      <Table
        cols={[
          { key: 'icon', label: '  ', render: v => <span style={{ fontSize: 20 }}>{v}</span> },
          { key: 'title', label: 'Guide Title' },
          { key: 'pages', label: 'Pages', muted: true },
          { key: 'color', label: 'Color', render: v => <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: v, verticalAlign: 'middle' }} /> },
        ]}
        rows={rows} onEdit={r => setModal({ ...r })} onDelete={setDel}
      />
      {modal && (
        <Modal title={modal._isNew ? 'Add Guide' : 'Edit Guide'} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Input label="ID (e.g. operations)" value={modal.id} onChange={v => setModal(m => ({ ...m, id: v }))} />
          <Input label="Title" value={modal.title} onChange={v => setModal(m => ({ ...m, title: v }))} />
          <Input label="Description" value={modal.description} onChange={v => setModal(m => ({ ...m, description: v }))} rows={2} />
          <Input label="Icon (emoji)" value={modal.icon} onChange={v => setModal(m => ({ ...m, icon: v }))} />
          <Input label="Pages (e.g. 48 pages)" value={modal.pages} onChange={v => setModal(m => ({ ...m, pages: v }))} />
          <Input label="Color (hex)" value={modal.color} onChange={v => setModal(m => ({ ...m, color: v }))} />
          <Input label="Sort Order" value={modal.sort_order} onChange={v => setModal(m => ({ ...m, sort_order: v }))} type="number" />
        </Modal>
      )}
      {del && <ConfirmDelete item={del} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION: LOCATIONS
// ─────────────────────────────────────────────────────────────
const LocationsAdmin = ({ toast }) => {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);
  const [saving, setSaving] = useState(false);
  const REGIONS = ['Americas','Europe','Asia','Oceania','Africa','Middle East'];

  const load = useCallback(async () => {
    const { data } = await supabase.from('locations').select('*').order('sort_order');
    setRows(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const payload = { id: modal.id, label: modal.label, slug: modal.slug, region: modal.region, sort_order: parseInt(modal.sort_order) || 0 };
    const { error } = modal._isNew
      ? await supabase.from('locations').insert(payload)
      : await supabase.from('locations').update(payload).eq('id', modal.id);
    setSaving(false);
    if (error) { toast(error.message, 'error'); return; }
    toast('Saved!'); setModal(null); load();
  };

  const remove = async () => { await supabase.from('locations').delete().eq('id', del.id); toast('Deleted'); setDel(null); load(); };

  return (
    <>
      <SectionHeader title="Locations" desc="Retreat destination markets. Adding a new location auto-generates SEO pages." onAdd={() => setModal({ id: '', label: '', slug: '', region: 'Americas', sort_order: rows.length + 1, _isNew: true })} />
      <Table
        cols={[
          { key: 'label', label: 'Location' },
          { key: 'region', label: 'Region', muted: true },
          { key: 'id', label: 'ID', muted: true },
          { key: 'slug', label: 'Slug', muted: true },
        ]}
        rows={rows} onEdit={r => setModal({ ...r })} onDelete={setDel}
      />
      {modal && (
        <Modal title={modal._isNew ? 'Add Location' : 'Edit Location'} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Input label="ID (e.g. bali — used in URLs)" value={modal.id} onChange={v => setModal(m => ({ ...m, id: v }))} />
          <Input label="Label (e.g. Bali)" value={modal.label} onChange={v => setModal(m => ({ ...m, label: v }))} />
          <Input label="Slug (e.g. retreat-software-bali)" value={modal.slug} onChange={v => setModal(m => ({ ...m, slug: v }))} />
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: M, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>Region</div>
            <select value={modal.region} onChange={e => setModal(m => ({ ...m, region: e.target.value }))}
              style={{ width: '100%', background: BG, border: `1px solid ${B}`, borderRadius: 8, padding: '10px 12px', color: T, fontFamily: font, fontSize: 14, outline: 'none' }}>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <Input label="Sort Order" value={modal.sort_order} onChange={v => setModal(m => ({ ...m, sort_order: v }))} type="number" />
        </Modal>
      )}
      {del && <ConfirmDelete item={del} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION: RETREAT TYPES
// ─────────────────────────────────────────────────────────────
const RetreatTypesAdmin = ({ toast }) => {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('retreat_types').select('*').order('sort_order');
    setRows(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const payload = { id: modal.id, label: modal.label, emoji: modal.emoji, color: modal.color, slug: modal.slug, description: modal.description, sort_order: parseInt(modal.sort_order) || 0 };
    const { error } = modal._isNew
      ? await supabase.from('retreat_types').insert(payload)
      : await supabase.from('retreat_types').update(payload).eq('id', modal.id);
    setSaving(false);
    if (error) { toast(error.message, 'error'); return; }
    toast('Saved!'); setModal(null); load();
  };

  const remove = async () => { await supabase.from('retreat_types').delete().eq('id', del.id); toast('Deleted'); setDel(null); load(); };

  return (
    <>
      <SectionHeader title="Retreat Types" desc="The 10 retreat categories. Each generates a full software page + SEO matrix pages." onAdd={() => setModal({ id: '', label: '', emoji: '', color: '#4f46e5', slug: '', description: '', sort_order: rows.length + 1, _isNew: true })} />
      <Table
        cols={[
          { key: 'emoji', label: '  ', render: v => <span style={{ fontSize: 20 }}>{v}</span> },
          { key: 'label', label: 'Type' },
          { key: 'color', label: 'Color', render: v => <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: v, verticalAlign: 'middle' }} /> },
          { key: 'id', label: 'ID', muted: true },
        ]}
        rows={rows} onEdit={r => setModal({ ...r })} onDelete={setDel}
      />
      {modal && (
        <Modal title={modal._isNew ? 'Add Retreat Type' : 'Edit Type'} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Input label="ID (e.g. yoga)" value={modal.id} onChange={v => setModal(m => ({ ...m, id: v }))} />
          <Input label="Label (e.g. Yoga)" value={modal.label} onChange={v => setModal(m => ({ ...m, label: v }))} />
          <Input label="Emoji" value={modal.emoji} onChange={v => setModal(m => ({ ...m, emoji: v }))} placeholder="🧘" />
          <Input label="Color (hex)" value={modal.color} onChange={v => setModal(m => ({ ...m, color: v }))} placeholder="#7c3aed" />
          <Input label="Slug (e.g. yoga-retreat-software)" value={modal.slug} onChange={v => setModal(m => ({ ...m, slug: v }))} />
          <Input label="Description" value={modal.description} onChange={v => setModal(m => ({ ...m, description: v }))} rows={3} />
          <Input label="Sort Order" value={modal.sort_order} onChange={v => setModal(m => ({ ...m, sort_order: v }))} type="number" />
        </Modal>
      )}
      {del && <ConfirmDelete item={del} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [err, setErr]     = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (error) setErr(error.message);
    else onLogin();
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font }}>
      <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 20, padding: 40, width: '100%', maxWidth: 400, margin: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: A, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none"><circle cx="14" cy="16" r="6.5" fill="white" fillOpacity="0.4"/><circle cx="22" cy="16" r="6.5" fill="white" fillOpacity="0.4"/><circle cx="18" cy="21" r="6.5" fill="white" fillOpacity="0.4"/><circle cx="18" cy="18" r="2.5" fill="white" fillOpacity="0.9"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: T }}>Cohorts CMS</div>
            <div style={{ fontSize: 12, color: M }}>Admin panel — sign in to continue</div>
          </div>
        </div>
        <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="hello@cohorts.co" />
        <Input label="Password" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
        {err && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: 14 }}>{err}</div>}
        <Btn onClick={submit} disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</Btn>
        <div style={{ marginTop: 16, fontSize: 12, color: M }}>Access is restricted to authorised Cohorts admin accounts only.</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN ADMIN PANEL
// ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'pricing',       label: 'Pricing Plans',   icon: '💳', comp: PricingAdmin },
  { id: 'modules',       label: 'Platform Modules', icon: '🧩', comp: ModulesAdmin },
  { id: 'solutions',     label: 'Solutions',        icon: '⚙️', comp: SolutionsAdmin },
  { id: 'blog',          label: 'Blog Posts',       icon: '📝', comp: BlogAdmin },
  { id: 'guides',        label: 'Guides',           icon: '📋', comp: GuidesAdmin },
  { id: 'locations',     label: 'Locations',        icon: '📍', comp: LocationsAdmin },
  { id: 'retreat-types', label: 'Retreat Types',    icon: '🏕️', comp: RetreatTypesAdmin },
];

export default function AdminPanel() {
  const [session, setSession]     = useState(null);
  const [checking, setChecking]   = useState(true);
  const [section, setSection]     = useState('pricing');
  const [toast, setToastState]    = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToastState({ msg, type });
    setTimeout(() => setToastState({ msg: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); setSession(null); };

  if (!supabase) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, color: T, textAlign: 'center', padding: 24 }}>
      <div><div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div><div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Supabase not configured</div><div style={{ color: M, fontSize: 14 }}>Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to your .env file.</div></div>
    </div>
  );

  if (checking) return <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: M, fontFamily: font }}>Loading…</div>;
  if (!session) return <AdminLogin onLogin={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />;

  const ActiveComp = SECTIONS.find(s => s.id === section)?.comp;

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', fontFamily: font }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: S, borderRight: `1px solid ${B}`, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${B}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: A, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 36 36" fill="none"><circle cx="14" cy="16" r="6.5" fill="white" fillOpacity="0.4"/><circle cx="22" cy="16" r="6.5" fill="white" fillOpacity="0.4"/><circle cx="18" cy="21" r="6.5" fill="white" fillOpacity="0.4"/><circle cx="18" cy="18" r="2.5" fill="white" fillOpacity="0.9"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: T }}>Cohorts CMS</div>
              <div style={{ fontSize: 10, color: M }}>Content Manager</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 10px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: M, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 10px', marginBottom: 8 }}>Content</div>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '9px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: section === s.id ? 'rgba(79,70,229,0.15)' : 'transparent',
              color: section === s.id ? A : M, textAlign: 'left', transition: 'all 0.15s',
              fontFamily: font, fontSize: 13, fontWeight: section === s.id ? 700 : 400,
            }}
              onMouseEnter={e => { if (section !== s.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (section !== s.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 10px', borderTop: `1px solid ${B}` }}>
          <button onClick={() => window.location.hash = ''} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: M, cursor: 'pointer', fontFamily: font, fontSize: 12, marginBottom: 6 }}>
            ← View Site
          </button>
          <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: M, cursor: 'pointer', fontFamily: font, fontSize: 12 }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        {ActiveComp && <ActiveComp toast={showToast} />}
      </div>

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}
