import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Clock, Search , ArrowRight, BookOpen } from 'lucide-react';
import timerEnds from '../assets/timerEnds.mp3'

 const DiscussionPage = ({ onComplete }) => {
  const { currentStory, getCurrentClue, nextClue, roundTimeMinutes  } = useGame();
  const [timeRemaining, setTimeRemaining] = useState(roundTimeMinutes*60); 
  const [currentClue, setCurrentClue] = useState(getCurrentClue());
  const [showClue, setShowClue] = useState(false);

  useEffect(() => {
    // Show clue after 10 seconds
    const clueTimer = setTimeout(() => {
      setShowClue(true);
    }, 0);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Play sound when timer ends
          playTimerEndSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(clueTimer);
    };
  }, []);

  // Function to play sound when timer ends
  const playTimerEndSound = () => {

    const audio = new Audio(timerEnds);
    audio.volume = 0.7; // Set volume (0.0 to 1.0)
    audio.play().catch(error => {
      console.log('Audio play failed:', error);
    });
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining <= 30;
  const timePercentage = (timeRemaining / (roundTimeMinutes * 60)) * 100;

  useEffect(() => {
  setTimeRemaining(roundTimeMinutes * 60);
}, [roundTimeMinutes]);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--mafia-gold)] mb-4 font-['Cairo']">
          وقت الشك
        </h1>
      </motion.div>

      {/* Story Box */}
      {currentStory && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl w-full mb-8"
        >
          <motion.div
            className="bg-gradient-to-br from-[var(--mafia-dark-red)] to-[var(--mafia-burgundy)] rounded-2xl p-6 border-2 border-[var(--mafia-gold)]/50 shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 mb-4" style={{direction:'rtl'}}>
              <BookOpen size={28} className="text-[var(--mafia-gold)]" />
              <h2 className="text-2xl font-bold text-[var(--mafia-gold)] font-['Cairo']">
                {currentStory.title}
              </h2>
            </div>
            <p className="text-lg text-[var(--mafia-off-white)] text-center font-['Cairo']" style={{ direction: 'rtl' }}>
              {currentStory.story}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Clue */}
      {showClue && currentClue && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="max-w-2xl w-full mb-12"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(212,175,55,0.3)', 
                '0 0 40px rgba(212,175,55,0.6)', 
                '0 0 20px rgba(212,175,55,0.3)'
              ] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-[var(--mafia-black)] rounded-2xl p-8 border-2 border-[var(--mafia-gold)]"
          >
            <div className="flex items-center gap-3 mb-4 justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Search  size={32} className="text-[var(--mafia-gold)]" />
              </motion.div>
              <h3 className="text-2xl font-bold text-[var(--mafia-gold)] font-['Cairo']">
                دليل
              </h3>
            </div>
            <p className="text-xl text-[var(--mafia-off-white)] text-center font-['Cairo']" style={{ direction: 'rtl' }}>
              {currentClue}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Timer */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="mb-12 relative"
      >
        <motion.div
          animate={isLowTime ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: isLowTime ? Infinity : 0 }}
          className={`relative w-64 h-64 rounded-full flex items-center justify-center ${
            isLowTime ? 'bg-red-900' : 'bg-[var(--mafia-dark-red)]'
          } shadow-[0_0_40px_rgba(0,0,0,0.8)]`}
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="rgba(212, 175, 55, 0.2)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke={isLowTime ? '#DC143C' : 'var(--mafia-gold)'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 1 }}
              animate={{ pathLength: timePercentage / 100 }}
              transition={{ duration: 0.5 }}
              style={{
                pathLength: timePercentage / 100,
                strokeDasharray: '753.98',
                strokeDashoffset: 753.98 * (1 - timePercentage / 100),
              }}
            />
          </svg>

          <div className="text-center z-10">
            <Clock size={40} className="mx-auto mb-2 text-[var(--mafia-gold)]" />
            <div className="text-5xl font-bold text-[var(--mafia-off-white)]">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-[var(--mafia-gold)] text-sm mt-2 font-['Cairo']">
              الوقت المتبقي
            </p>
          </div>
        </motion.div>
      </motion.div>



      {/* Discussion hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-8 mb-12"
      >
        {['💬', '🤔', '👀', '🤨'].map((emoji, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            className="text-5xl opacity-50 flex gap-5"
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>

      {/* End Discussion Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="bg-[var(--mafia-gold)] text-[var(--mafia-black)] px-10 py-4 rounded-2xl text-xl font-bold shadow-[0_8px_24px_rgba(212,175,55,0.5)] hover:bg-[var(--mafia-gold-dark)] transition-colors flex items-center gap-3 font-['Cairo']"
      >
      خلصنا
        <ArrowRight size={24} />
      </motion.button>

     
    </motion.div>
  );
}

export default DiscussionPage