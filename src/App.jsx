import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import  EntryPage from './pages/EntryPage';
 import  ExplanationPage  from './pages/ExplanationPage';
import  SetupPage  from './pages/SetupPage';
import yalabena from './assets/yalabena.mp3';
import  RoleRevealPage  from './pages/RoleRevealPage';
import  DiscussionPage  from './pages/DiscussionPage';
import  VotingPage  from './pages/VotingPage';
import  ResultsPage  from './pages/ResultsPage';


export default function App() {
  const [currentPage, setCurrentPage] = useState('entry');

  const playAndGo = (nextPage, sound) => {
  if (sound) {
    const audio = new Audio(sound);
    audio.volume = 1;

    audio.play().catch(err => {
      console.warn('Sound failed:', err);
    });
  }

  setCurrentPage(nextPage);
};

  return (

      <GameProvider>
        <div
          className="min-h-screen bg-[var(--mafia-burgundy)] text-[var(--mafia-off-white)] relative overflow-hidden"
          style={{ fontFamily: "'Cairo', 'Inter', sans-serif" }}
        >
   
          <AnimatePresence mode="wait">
            {currentPage === 'entry' && (
    <EntryPage
      key="entry"
      onStartGame={() =>
        playAndGo('setup',yalabena)
      }
      onHowToPlay={() =>
        playAndGo('explanation')
      }
    />
  )}

  {currentPage === 'explanation' && (
    <ExplanationPage
      key="explanation"
      onStartGame={() =>
        playAndGo('setup', yalabena)
      }
      onBack={() =>
        playAndGo('entry')
      }
    />
  )}

  {currentPage === 'setup' && (
    <SetupPage
      key="setup"
      onStartGame={() =>
        playAndGo('roleReveal', yalabena)
      }
      onBack={() =>
        playAndGo('entry')
      }
    />
  )}
            {currentPage === 'roleReveal' && (
              <RoleRevealPage
                key="roleReveal"
                onComplete={() => setCurrentPage('discussion')}
              />
            )}
            {currentPage === 'discussion' && (
              <DiscussionPage
                key="discussion"
                onComplete={() => setCurrentPage('voting')}
              />
            )}
            {currentPage === 'voting' && (
              <VotingPage
                key="voting"
                onComplete={() => setCurrentPage('results')}
              />
            )}
             {currentPage === 'results' && (
            <ResultsPage
              key={`results-${Date.now()}`}  // force remount so win-condition re-evaluates each round
              onPlayAgain={() => setCurrentPage('setup')}
              onBackToMenu={() => setCurrentPage('entry')}
              onBackToDiscussion={() => setCurrentPage('discussion')}  // ← loop back for next round
            />
          )}
          </AnimatePresence>

          {/* Decorative background pattern */}
          <div className="fixed inset-0 -z-20 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(212, 175, 55, 0.1) 10px,
                  rgba(212, 175, 55, 0.1) 20px
                )`,
              }}
            />
          </div>
        </div>
      </GameProvider>

  );
}