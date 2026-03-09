import { supabase } from './supabase.js';

/**
 * Fetches all CMS data from Supabase and returns an object
 * with the same shape as siteConfig.js exports.
 * Returns null if Supabase is unavailable (falls back to siteConfig).
 */
export async function loadSupabaseData() {
  if (!supabase) return null;

  try {
    const [
      settingsRes, plansRes, modulesRes, solutionsRes,
      typesRes, locationsRes, postsRes, guidesRes,
      testimonialsRes, statsRes,
    ] = await Promise.all([
      supabase.from('site_settings').select('*'),
      supabase.from('pricing_plans').select('*').order('sort_order'),
      supabase.from('platform_modules').select('*').order('sort_order'),
      supabase.from('solutions').select('*').order('sort_order'),
      supabase.from('retreat_types').select('*').order('sort_order'),
      supabase.from('locations').select('*').order('sort_order'),
      supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('guides').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').order('sort_order'),
      supabase.from('site_stats').select('*').order('sort_order'),
    ]);

    // Extract settings
    const settings = {};
    (settingsRes.data || []).forEach(row => { settings[row.key] = row.value; });

    const brand = settings.brand || null;
    const pricingMeta = settings.pricing_meta || {};

    // Transform pricing plans
    const plans = (plansRes.data || []).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      interval: p.interval,
      badge: p.badge,
      highlight: p.highlight,
      description: p.description,
      features: Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]'),
      cta: p.cta,
      ctaUrl: p.cta_url,
    }));

    const pricing = plans.length ? {
      ...pricingMeta,
      plans,
    } : null;

    // Transform modules
    const modules = (modulesRes.data || []).map(m => ({
      id: m.id,
      name: m.name,
      icon: m.icon,
      desc: m.description,
      url: m.url,
    }));

    // Transform solutions
    const solutions = (solutionsRes.data || []).map(s => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      icon: s.icon,
      color: s.color,
      desc: s.description,
    }));

    // Transform retreat types
    const retreatTypes = (typesRes.data || []).map(t => ({
      id: t.id,
      label: t.label,
      emoji: t.emoji,
      color: t.color,
      slug: t.slug,
      desc: t.description,
    }));

    // Transform locations
    const locations = (locationsRes.data || []).map(l => ({
      id: l.id,
      label: l.label,
      slug: l.slug,
      region: l.region,
    }));

    // Rebuild seoMatrix from live retreat types + locations
    const seoMatrix = retreatTypes.flatMap(type =>
      locations.map(location => ({
        type,
        location,
        slug: `/${type.slug}/${location.id}`,
        title: `${type.label} Retreat Software ${location.label}`,
        metaTitle: `${type.label} Retreat Management Software for ${location.label} | Cohorts`,
        metaDesc: `Run your ${type.label.toLowerCase()} retreat in ${location.label} without chaos.`,
      }))
    );

    // Transform blog posts
    const blogPosts = (postsRes.data || []).map(p => ({
      id: p.id,
      title: p.title,
      cat: p.category,
      read: p.read_time,
      body: p.body,
      published: p.published,
    }));

    // Transform guides
    const guides = (guidesRes.data || []).map(g => ({
      id: g.id,
      title: g.title,
      desc: g.description,
      icon: g.icon,
      pages: g.pages,
      color: g.color,
    }));

    // Transform testimonials
    const testimonials = (testimonialsRes.data || []).map(t => ({
      id: t.id,
      name: t.name,
      role: t.role,
      location: t.location,
      initials: t.initials,
      color: t.color,
      quote: t.quote,
      metric: t.metric,
    }));

    // Transform stats
    const stats = (statsRes.data || []).map(s => ({
      value: s.value,
      label: s.label,
    }));

    return {
      ...(brand ? { brand } : {}),
      ...(pricing ? { pricing } : {}),
      ...(modules.length ? { modules } : {}),
      ...(solutions.length ? { solutions } : {}),
      ...(retreatTypes.length ? { retreatTypes } : {}),
      ...(locations.length ? { locations } : {}),
      ...(seoMatrix.length ? { seoMatrix } : {}),
      ...(blogPosts.length ? { blogPosts } : {}),
      ...(guides.length ? { guides } : {}),
      ...(testimonials.length ? { testimonials } : {}),
      ...(stats.length ? { stats } : {}),
    };
  } catch (err) {
    console.error('[Cohorts] Supabase fetch failed, using siteConfig fallback:', err);
    return null;
  }
}
