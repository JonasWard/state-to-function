import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<App />} path="/:base64InputStateString/:base64AppletStateString" />
        <Route element={<App />} path="/:base64InputStateString" />
        <Route element={<App />} path="/" />
      </Routes>
    </Router>
  </React.StrictMode>
);
