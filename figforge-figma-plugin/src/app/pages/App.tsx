import React from 'react';
import Login from './Login/Login';
import Projects from './Projects/Projects';
import CreateProject from './CreateProject/CreateProject';
import { RouterProvider } from '../context/RouterProvider';
import Route from '../components/Route';
import Editor from './Editor/Editor';
import Export from './Export/Export';

import '../styles/ui.css';

function App() {
  return (
    <RouterProvider>
      <Route path="/">
        <Login />
      </Route>

      <Route path="/projects">
        <Projects />
      </Route>

      <Route path="/projects/create">
        <CreateProject />
      </Route>
      <Route path="/editor">
        <Editor />
      </Route>
      <Route path="/export">
        <Export />
      </Route>
    </RouterProvider>
  );
}

export default App;
