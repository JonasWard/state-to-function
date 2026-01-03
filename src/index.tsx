import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ModelCheck } from './InputsRenderer';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* <Route element={<Applet />} path="/:methodStateString/:inputStateString" /> */}
        {/* <Route element={<MethodComposerApp />} path="/:methodStateString" /> */}
        <Route element={<ModelCheck />} path="/" />
      </Routes>
    </Router>
  </React.StrictMode>
);
