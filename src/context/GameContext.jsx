import { useContext, createContext, useState } from 'react';
import storiesData from '../data/stories.json';

const GameContext = createContext(undefined);

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 12;

const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [currentStory, setCurrentStory] = useState(null);
  const [mafioso, setMafioso] = useState(null);
  const [roundRoles, setRoundRoles] = useState([]);
  const [roundTimeMinutes, setRoundTimeMinutes] = useState(5);


  //  Players 
  const addPlayer = (name) => {
    if (!name.trim()) return;
    if (players.length >= MAX_PLAYERS) return;
    setPlayers((prev) => [
      ...prev,
      { id: Math.random().toString(), name: name.trim(), votes: 0 },
    ]);
  };

  const removePlayer = (id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  //  Assign roles 
  const assignRoles = (story, mafiosoCount = 1) => {
    const playerCount = Math.min(players.length, story.roles.length);

    const shuffledRoles = [...story.roles].sort(() => Math.random() - 0.5);
    const rolesForPlayers = shuffledRoles.slice(0, playerCount);

    // Pick random mafioso indexes
    const selectedMafiosoIndexes = [];
    while (selectedMafiosoIndexes.length < mafiosoCount) {
      const index = Math.floor(Math.random() * playerCount);
      if (!selectedMafiosoIndexes.includes(index)) {
        selectedMafiosoIndexes.push(index);
      }
    }

    // Set isMafioso flag
    const updatedRoles = rolesForPlayers.map((role, i) => ({
      ...role,
      isMafioso: selectedMafiosoIndexes.includes(i),
    }));

    setRoundRoles(updatedRoles);

    // Assign roles to players
    setPlayers((prev) => {
      const updated = prev.map((player, index) => ({
        ...player,
        role: updatedRoles[index],
        votes: 0,
      }));

      //  snapshot for ResultsPage mafioso reveal 
      // ResultsPage needs to show ALL original mafioso names even after
      // they have been ejected (removed from players[]).
      window.__allPlayers = updated;

      return updated;
    });

    // Set mafioso state (single object or array)
    const mafiosoPlayers = updatedRoles.filter((r) => r.isMafioso);
    setMafioso(mafiosoPlayers.length === 1 ? mafiosoPlayers[0] : mafiosoPlayers);
  };

  //  Start game 
  const startGame = (mafiosoCount = 1, roundTime = 5) => {
    if (players.length < MIN_PLAYERS) return;

    const stories = storiesData.stories;
    const story = stories[Math.floor(Math.random() * stories.length)];
    setCurrentStory(story);
    setCurrentClueIndex(0);
    setRoundTimeMinutes(roundTime);

    assignRoles(story, mafiosoCount);
    setGameStarted(true);
  };

  //  Clues 
  const nextClue = () => {
    if (!currentStory) return null;
    if (currentClueIndex < currentStory.clues.length - 1) {
      setCurrentClueIndex((prev) => prev + 1);
      return currentStory.clues[currentClueIndex + 1];
    }
    return null; // no more clues
  };

  const getCurrentClue = () => {
    return currentStory ? currentStory.clues[currentClueIndex] : '';
  };

  //  Voting 
  const voteForPlayer = (playerId) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, votes: p.votes + 1 } : p))
    );
  };

  const resetVotes = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, votes: 0 })));
  };

  //  Eject most-voted player 
  const ejectPlayer = () => {
    const sortedPlayers = [...players].sort((a, b) => b.votes - a.votes);
    const mostVotedPlayer = sortedPlayers[0];

    if (mostVotedPlayer) {
      // Store ejected player so ResultsPage can read it
      window.__lastEjected = mostVotedPlayer;

      setPlayers((prev) => prev.filter((p) => p.id !== mostVotedPlayer.id));
      resetVotes();
      return mostVotedPlayer;
    }
    return null;
  };

  //  Win condition 
  const checkWinCondition = () => {
    const remainingMafiosos = players.filter((p) => p.role?.isMafioso);

    if (remainingMafiosos.length === 0) return 'citizens';
    if (players.length <= remainingMafiosos.length) return 'mafiosos';
    return null;
  };

  //  Reset 
  const resetGame = () => {
    setPlayers([]);
    setGameStarted(false);
    setCurrentStory(null);
    setRoundRoles([]);
    setCurrentClueIndex(0);
    setMafioso(null);
    window.__lastEjected = null;
    window.__allPlayers = [];
  };

  return (
    <GameContext.Provider
      value={{
        players,
        addPlayer,
        removePlayer,
        gameStarted,
        startGame,
        currentStory,
        currentClueIndex,
        getCurrentClue,
        roundRoles,
        roundTimeMinutes,
        voteForPlayer,
        resetVotes,
        ejectPlayer,
        checkWinCondition,
        mafioso,
        nextClue,
        storyText: currentStory ? currentStory.story : '',
        resetGame,
        MIN_PLAYERS,
        MAX_PLAYERS,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export { GameProvider, useGame };