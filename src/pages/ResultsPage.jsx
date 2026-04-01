import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Trophy, Skull, ArrowRight } from 'lucide-react';
import { ImEvil } from "react-icons/im";
import { TbMoodSad } from "react-icons/tb";


/*
  WIN-CONDITION LOGIC (evaluated AFTER ejection, so players[] is already updated)
  ─────────────────────────────────────────────────────────────────────────────
  1. remainingMafiosos === 0            → CITIZENS WIN  (game over)
  2. remainingPlayers === remainingMafiosos  → MAFIOSOS WIN  (game over)
     (i.e. every surviving player is a mafioso — covers "last player is mafioso")
  3. Otherwise                          → CONTINUE  (back to discussion, new clue)
*/

 const ResultsPage = ({ onPlayAgain, onBackToMenu, onBackToDiscussion }) => {
  const { players, ejectPlayer, nextClue, currentStory, mafioso } = useGame();

  // ── derive state after ejection ──────────────────────────────────────────
  // We need the ejected player info. VotingPage already called ejectPlayer(),
  // so `players` here is the REMAINING list. We reconstruct who was ejected
  // by storing it. We'll use a ref so the effect only fires once on mount.
  const [ejectedPlayer, setEjectedPlayer] = useState(null);
  const [result, setResult] = useState(null); // 'citizens' | 'mafiosos' | 'continue'
  const [newClue, setNewClue] = useState(null);
 
  const initialized = useRef(false);
 const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // ── figure out who was ejected ────────────────────────────────────────
    // The most-voted player was already removed by VotingPage → ejectPlayer().
    // We can't recover them from context, so VotingPage should pass it via
    // a shared state or we re-derive. For now we grab it from localStorage-free
    // approach: VotingPage sets window.__lastEjected (simple, no storage API).
    const ejected = window.__lastEjected || null;
    setEjectedPlayer(ejected);

    // ── evaluate win condition on the CURRENT (post-ejection) players ─────
    const remainingMafiosos = players.filter((p) => p.role?.isMafioso);
    const remainingPlayers = players.length;

    if (remainingMafiosos.length === 0) {
      // All mafiosos have been caught → citizens win
      setResult('citizens');
    } else if (remainingPlayers <= remainingMafiosos.length) {
      // Every remaining player is a mafioso (or fewer players than mafiosos) → mafiosos win
      setResult('mafiosos');
    } else {
      // Game continues → advance clue
      setResult('continue');
      const next = nextClue();
      setNewClue(next);
    }
  }, []);

  

  // ── gather mafioso names for the reveal ──────────────────────────────────
  // `mafioso` from context is the original assigned mafioso role(s).
  // We need the PLAYER names. We stored the full player list at game start
  // — but players shrink each round. Instead we keep a parallel list via context.
  // Simplest correct approach: derive from the original players via mafioso state.
  // mafioso can be a single object or array (see GameContext).
  const mafiosoList = Array.isArray(mafioso) ? mafioso : mafioso ? [mafioso] : [];

  // For the "who was the mafioso" reveal we need the player names that WERE
  // assigned those roles. We stored them on the player objects at assignment time,
  // but ejected players are gone. We'll pull names from window.__allPlayers
  // (set by GameContext or SetupPage when the game starts — see note in GameContext patch).
  const allOriginalPlayers = window.__allPlayers || [];
  const mafiosoPlayers = allOriginalPlayers.filter((p) => p.role?.isMafioso);

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: GAME CONTINUES → show ejected player, "new clue coming", button
  // ──────────────────────────────────────────────────────────────────────────
  if (result === 'continue') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden overflow-y-scroll"
      >
        {/* Subtle background */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 3, opacity: 0.08 }}
          transition={{ duration: 1.2 }}
          className="absolute w-96 h-96 rounded-full blur-3xl bg-yellow-600"
        />

        {/* Ejected card */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14 }}
          className="relative z-10 max-w-md w-full mb-10"
        >
          <div className="bg-gradient-to-br from-[var(--mafia-dark-red)] to-[var(--mafia-burgundy)] rounded-3xl p-8 border-2 border-[var(--mafia-gold)]/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', damping: 10 }}
              className="mb-4"
            >
              <Skull size={72} className="mx-auto text-[var(--mafia-gold)] opacity-70" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-[var(--mafia-off-white)] font-['Cairo'] mb-2"
            >
              تم طرد اللاعب
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-4xl font-bold text-[var(--mafia-gold)] font-['Cairo']"
            >
              {ejectedPlayer?.name || '—'}
            </motion.p>

            {/* Was this player a mafioso? Small hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className={`mt-3 text-lg font-['Cairo'] font-bold flex gap-5 items-center justify-center ${
                ejectedPlayer?.role?.isMafioso ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {ejectedPlayer?.role?.isMafioso ? <ImEvil size={32}/>: <TbMoodSad size={32}/>}
              {ejectedPlayer?.role?.isMafioso ? ' كان مافيوسو!'  :  ' مش المافيوسو '}
            </motion.p>
          </div>
        </motion.div>


        {/* Back to discussion button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToDiscussion}
          className="relative z-10 bg-[var(--mafia-gold)] text-[var(--mafia-black)] px-10 py-4 rounded-2xl text-xl font-bold shadow-[0_8px_24px_rgba(212,175,55,0.5)] hover:bg-[var(--mafia-gold-dark)] transition-colors flex items-center gap-3 font-['Cairo']"
        >
         كمل للراوند الي بعده
          <ArrowRight size={24} />
        </motion.button>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: GAME OVER (citizens win OR mafiosos win)
  // ──────────────────────────────────────────────────────────────────────────
  const citizensWon = result === 'citizens';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
    >
      {/* Confetti — only on citizens win */}
      {citizensWon && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                backgroundColor: ['#d4af37', '#f5f0e8', '#dc143c', '#2e8b57'][
                  Math.floor(Math.random() * 4)
                ],
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
                x: [0, Math.random() * 200 - 100],
                rotate: Math.random() * 720,
                opacity: [1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: i * 0.02,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* Spotlight */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: 0.1 }}
        transition={{ duration: 1.5 }}
        className={`absolute w-96 h-96 rounded-full blur-3xl ${
          citizensWon ? 'bg-green-500' : 'bg-red-600'
        }`}
      />

      {/* Main card */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: 'spring', damping: 15 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div
          className={`bg-gradient-to-br ${
            citizensWon
              ? 'from-green-900 to-[var(--mafia-dark-red)] border-green-500'
              : 'from-red-900 to-[var(--mafia-black)] border-red-600'
          } rounded-3xl p-10 shadow-[0_12px_48px_rgba(0,0,0,0.9)] border-4 text-center`}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: citizensWon ? 0 : 360 }}
            transition={{ delay: 0.5, type: 'spring', damping: 10 }}
            className="mb-5"
          >
            {citizensWon ? (
              <Trophy size={100} className="mx-auto text-green-400" />
            ) : (
              <div className="text-9xl"><ImEvil  size={28}/></div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`text-5xl font-bold mb-3 font-['Cairo'] ${
              citizensWon ? 'text-green-400' : 'text-red-400'
            }`}
            style={{
              textShadow: citizensWon
                ? '0 0 30px rgba(74,222,128,0.6)'
                : '0 0 30px rgba(220,20,60,0.6)',
            }}
          >
            {citizensWon ? 'كسبتوا يا عادين ' : 'المافيوسو كسب!'}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl text-[var(--mafia-off-white)] mb-7 font-['Cairo']"
          >
            {citizensWon
              ? 'تم القبض على كل المافيوسويز '
              : 'المافيوسو كسب  💀'}
          </motion.p>

          {/* Reveal: who were the mafiosos */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-[var(--mafia-black)] rounded-2xl p-5 mb-7 border-2 border-[var(--mafia-gold)]"
          >
            <p className="text-[var(--mafia-gold)] mb-3 font-['Cairo'] text-sm opacity-80">
              المافيوسو كان
            </p>
            <div className="space-y-2">
              {mafiosoPlayers.map((mp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.2 }}
                  className="text-3xl font-bold text-red-400 font-['Cairo'] flex gap-5 justify-center itmes-center"
                >
                  <ImEvil/> {mp.name}
                </motion.div>
              ))}
              {mafiosoPlayers.length === 0 && (
                <p className="text-[var(--mafia-off-white)] font-['Cairo'] opacity-60">—</p>
              )}
            </div>
          </motion.div>

          {/* Action buttons */}
         
        

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToMenu}
              className="bg-[var(--mafia-dark-red)] text-[var(--mafia-off-white)] px-8 py-4 rounded-xl text-xl font-bold border-2 border-[var(--mafia-gold)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:bg-[var(--mafia-red)] transition-colors font-['Cairo']"
            >
              الصفحة الرئيسية
            </motion.button>
          
        </div>
      </motion.div>

      {/* Floating background particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              citizensWon ? 'bg-green-400' : 'bg-red-400'
            } opacity-30`}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default ResultsPage