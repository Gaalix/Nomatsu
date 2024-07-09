import React, { useState } from 'react';
import './App.css';
import MangaList from './components/MangaList';
import SetupWizard from './components/SetupWizard';

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  return (
    <div className="App">
      {!isSetupComplete ? (
        <SetupWizard onComplete={() => setIsSetupComplete(true)} />
      ) : (
        <>
          <header className="App-header">
            <h1>Nomatsu Manga Reader</h1>
          </header>
          <main>
            <MangaList />
          </main>
        </>
      )}
    </div>
  );
}

export default App;