import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles/global.css';

import App from './pages/App';
import { UserProvider } from './context/UserContext';
import { ProjectProvider } from './context/ProjectContext';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page');
  const root = createRoot(container);
  root.render(
    <UserProvider>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </UserProvider>
  );
});
