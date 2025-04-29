import React from 'react';
import './App.css';
import './components/DAGViewer'
import DAGViewer from './components/DAGViewer';

function App() {
  return (
    <>
      <h1 style={{"textAlign": "center"}}>Journey Builder React Coding Challenge</h1>
      <DAGViewer />
    </>
  );
}

export default App;
