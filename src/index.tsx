import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme/fonts';
import './theme/base.css';
import { App } from './App';
import { bootstrap } from './state/hashSync';
import { applyCssVariables } from './theme/cssVariables';
import { ThemeRoot } from './theme/ThemeRoot';

applyCssVariables();
void bootstrap();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeRoot>
      <App />
    </ThemeRoot>
  </React.StrictMode>
);
