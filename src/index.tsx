import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import { MethodComposerApp } from './MethodComposerApp';
import { Applet } from './Applet';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<Applet />} path='/:methodStateString/:inputStateString' />
        <Route element={<MethodComposerApp desktop />} path='/:methodStateString' />
        <Route element={<MethodComposerApp desktop />} path='/' />
      </Routes>
    </Router>
  </React.StrictMode>
);
