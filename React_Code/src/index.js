import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import App from './App';
 

const root = createRoot(document.getElementById('root'));

const resizeLoopErr = /ResizeObserver loop limit exceeded/;
window.addEventListener("error", (e) => {
  if (resizeLoopErr.test(e.message)) {
    e.stopImmediatePropagation();
  }
});

const resizeObserverErr = /ResizeObserver loop completed with undelivered notifications/;
window.addEventListener("error", (e) => {
  if (resizeObserverErr.test(e.message)) {
    e.stopImmediatePropagation();
  }
}); 

root.render(<App />);
