import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DnDFlow from './App';
import Flow from './Flow';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <DnDFlow /> */}
    <Flow />
  </React.StrictMode>
);

