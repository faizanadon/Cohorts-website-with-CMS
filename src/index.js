import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Navigate to /#admin to open the CMS admin panel
if (window.location.hash === '#admin') {
  import('./admin/AdminPanel').then(({ default: AdminPanel }) => {
    root.render(
      <React.StrictMode>
        <AdminPanel />
      </React.StrictMode>
    );
  });
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
