import React from 'react';
import './App.css';
import MangaList from './components/MangaList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Nomatsu Manga Reader</h1>
      </header>
      <main>
        <MangaList />
      </main>
    </div>
  );
}

export default App;