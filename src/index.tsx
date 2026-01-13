import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import { InputView } from './InputView';
import { Applet } from './applet/Applet';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<Applet />} path="/:base64MethodStateString/:base64InputStateString" />
        <Route element={<InputView />} path="/" />
        <Route element={<InputView />} path="/:base64MethodStateString" />
      </Routes>
    </Router>
  </React.StrictMode>
);
