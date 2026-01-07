import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import { InputView } from './InputView';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* <Route element={<Applet />} path="/:methodStateString/:inputStateString" /> */}
        {/* <Route element={<MethodComposerApp />} path="/:methodStateString" /> */}
        <Route element={<InputView />} path="/" />
        <Route element={<InputView />} path="/:base64String" />
      </Routes>
    </Router>
  </React.StrictMode>
);
