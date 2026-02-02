import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from "../context/GameContext";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

const SetupPage = ({ onStartGame, onBack }) => {
  // Fix: useGame returns an object, not an array
  const { players, addPlayer, removePlayer, startGame } = useGame();
  
  const [errorMessage, setErrorMessage] = useState("");
  const [playerName, setPlayerName] = useState('');
  const [mafiosoCount, setMafiosoCount] = useState(1);
  const [roundTimeMinutes, setRoundTimeMinutes] = useState(5);

  useEffect(() => {
  if (!errorMessage) return;

  const timer = setTimeout(() => {
    setErrorMessage("");
  }, 10000); 

  return () => clearTimeout(timer);
}, [errorMessage]);

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      setErrorMessage("");
      addPlayer(playerName);
      setPlayerName('');
    }
  };

const handleStartGame = () => {
  if (players.length < 4) return;

  if (mafiosoCount >= players.length) {
     setErrorMessage("مينفعش عدد المافيوسو يكون أكتر أو مساوي لعدد اللعيبة ");
     
    return;
  }

  setErrorMessage("");
  startGame(mafiosoCount, roundTimeMinutes);
  onStartGame();
};


  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen px-6 py-12 max-w-3xl mx-auto overflow-y-auto"
    >
      <button
        onClick={onBack}
        className="mb-6 text-[var(--mafia-gold)] hover:text-[var(--mafia-gold-dark)] transition-colors"
      >
        <ArrowLeft size={32} />
      </button>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-[var(--mafia-gold)] mb-8 text-center font-['Cairo']"
      >
        ظبط الدنبا
      </motion.h1>

      {/* Players Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--mafia-dark-red)] rounded-3xl p-6 md:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[var(--mafia-gold)]/20 mb-6"
      >
        <h2 className="text-2xl font-bold text-[var(--mafia-gold)] mb-4 font-['Cairo']">
          اللاعبين ({players.length})
        </h2>

        <div className="flex gap-2 mb-4" style={{ direction: 'rtl' }}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setErrorMessage("");
              setPlayerName(e.target.value)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
            placeholder="اسم اللاعب"
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--mafia-burgundy)] text-[var(--mafia-off-white)] border-2 border-[var(--mafia-gold)]/30 focus:border-[var(--mafia-gold)] outline-none transition-colors font-['Cairo']"
            style={{ direction: 'rtl' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddPlayer}
            className="bg-[var(--mafia-gold)] text-[var(--mafia-black)] px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:bg-[var(--mafia-gold-dark)] transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden md:inline font-['Cairo']">زوّد </span>
          </motion.button>
        </div>

        <AnimatePresence>
          <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-auto">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[var(--mafia-burgundy)] rounded-xl p-4 flex items-center justify-between border border-[var(--mafia-gold)]/20"
              >
                <span className="text-[var(--mafia-off-white)] font-['Cairo']" style={{ direction: 'rtl' }}>
                  {player.name}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setErrorMessage("");
                    removePlayer(player.id)
                  }}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {players.length < 4 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-yellow-400 text-sm mt-4 text-center font-['Cairo']"
          >
        لازم تكونو 4 ع الاقل
          </motion.p>
        )}
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--mafia-dark-red)] rounded-3xl p-6 md:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[var(--mafia-gold)]/20 mb-6"
      >
        <div className="space-y-6">
          {/* Mafioso Count */}
          <div>
            <label className="block text-[var(--mafia-gold)] mb-2 font-bold font-['Cairo']" style={{ direction: 'rtl' }}>
              عدد المافيوسو
            </label>
            <div className="flex gap-2">
              {[1, 2, 3,4, 5, 6].map((count) => (
                <motion.button
                  key={count}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setErrorMessage("");
                    setMafiosoCount(count)
                  }}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    mafiosoCount === count
                      ? 'bg-[var(--mafia-gold)] text-[var(--mafia-black)] shadow-[0_4px_12px_rgba(212,175,55,0.4)]'
                      : 'bg-[var(--mafia-burgundy)] text-[var(--mafia-off-white)] border-2 border-[var(--mafia-gold)]/30'
                  }`}
                >
                  {count}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Error Message */}
      <AnimatePresence>
  {errorMessage && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="mt-4 bg-[var(--mafia-burgundy)] text-white px-6 py-3 rounded-xl text-center font-['Cairo'] shadow-lg border border-2 border-black"
    >
      {errorMessage}
    </motion.div>
  )}
</AnimatePresence>

          {/* Round Time */}
          <div>
            <label className="block text-[var(--mafia-gold)] mb-2 font-bold font-['Cairo']" style={{ direction: 'rtl' }}>
              وقت الراوند (دقايق)
            </label>
            <div className="flex gap-2">
              {[5, 10, 15, 20, 25, 30].map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRoundTimeMinutes(time)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    roundTimeMinutes === time
                      ? 'bg-[var(--mafia-gold)] text-[var(--mafia-black)] shadow-[0_4px_12px_rgba(212,175,55,0.4)]'
                      : 'bg-[var(--mafia-burgundy)] text-[var(--mafia-off-white)] border-2 border-[var(--mafia-gold)]/30'
                  }`}
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: players.length >= 4 ? 1.05 : 1 }}
          whileTap={{ scale: players.length >= 4 ? 0.95 : 1 }}
          onClick={handleStartGame}
          disabled={players.length < 4}
          className={`px-12 py-4 rounded-2xl text-2xl font-bold shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all font-['Cairo'] ${
            players.length >= 4
              ? 'bg-[var(--mafia-gold)] text-[var(--mafia-black)] hover:bg-[var(--mafia-gold-dark)] cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
          }`}
        >
       يلا بينا
        </motion.button>
      </motion.div>

    </motion.div>
  );
};

export default SetupPage;