/**
 * Demo Entry Point
 * Loads the Storyboard Enhancement demo
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import Demo from './Demo';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>
);
