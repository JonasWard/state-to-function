import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './theme/fonts';
import './theme/base.css';
import './index.css';
import { App } from './App';
import { applyCssVariables } from './theme/cssVariables';
import { ThemeRoot } from './theme/ThemeRoot';

applyCssVariables();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeRoot>
      <Router>
        <Routes>
          <Route element={<App />} path="/:base64InputStateString/:base64AppletStateString" />
          <Route element={<App />} path="/:base64InputStateString" />
          <Route element={<App />} path="/" />
        </Routes>
      </Router>
    </ThemeRoot>
  </React.StrictMode>
);
