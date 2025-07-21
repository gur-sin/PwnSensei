import React from 'react';
import Board from './Board.jsx';

export default function App() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Chess PGN Viewer</h1>
      <Board />
    </div>
  );
}
