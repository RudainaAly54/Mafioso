import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Vote, Check, UserX } from 'lucide-react';

// Phase constants
const PHASE_VOTING = 'voting';
const PHASE_RESULTS = 'results';
const PHASE_GHOST_VOTE = 'ghostVote';
const PHASE_GHOST_DONE = 'ghostDone';

 const  VotingPage = ({ onComplete }) => {
  const { players, voteForPlayer, ejectPlayer, checkWinCondition } = useGame();

  const [phase, setPhase] = useState(PHASE_VOTING);
  const [votesLeft, setVotesLeft] = useState(players.length);
  const [ejectedPlayer, setEjectedPlayer] = useState(null);
  const [ghostVote, setGhostVote] = useState(null);

  // Reset when entering the page
  useEffect(() => {
    setPhase(PHASE_VOTING);
    setVotesLeft(players.length);
    setEjectedPlayer(null);
    setGhostVote(null);
  }, []);

  // ─── VOTING PHASE ───────────────────────────────────
  const handleVote = (playerId) => {
    if (phase !== PHASE_VOTING || votesLeft <= 0) return;
    voteForPlayer(playerId);
    setVotesLeft((prev) => prev - 1);
  };

  const handleFinishVoting = () => {
    setPhase(PHASE_RESULTS);
  };

  // ─── RESULTS PHASE ──────────────────────────────────
  const handleEject = () => {
    const ejected = ejectPlayer(); // removes most-voted, resets votes
    setEjectedPlayer(ejected);

    // If only 2 players remain after ejection → ghost vote phase
    // We check against players.length - 1 because state hasn't updated yet
    if (players.length - 1 <= 2) {
      setPhase(PHASE_GHOST_VOTE);
    } else {
      setPhase(PHASE_GHOST_DONE); // normal done, go to results page
    }
  };

  // ─── GHOST VOTE PHASE (ejected player votes on the last 2) ───
  const handleGhostVote = (playerId) => {
    setGhostVote(playerId);
  };

  const handleGhostConfirm = () => {
    if (ghostVote) {
      voteForPlayer(ghostVote);
      setPhase(PHASE_GHOST_DONE);
    }
  };

  // ─── SORTED for results display ─────────────────────
  const sortedPlayers = [...players].sort((a, b) => b.votes - a.votes);
  const maxVotes = Math.max(...players.map((p) => p.votes), 0);

  // ──────────────────────────────────────────────────────
  // RENDER: VOTING
  // ──────────────────────────────────────────────────────
  if (phase === PHASE_VOTING) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-y-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Vote size={60} className="mx-auto mb-3 text-[var(--mafia-gold)]" />
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--mafia-gold)] font-['Cairo']">
            التصويت
          </h1>
          <p className="text-lg text-[var(--mafia-off-white)] mt-1 font-['Cairo']">
            كل شخص يصوت على شخص واحد
          </p>
        </motion.div>

        {/* Votes remaining badge */}
        <motion.div
          animate={{ scale: votesLeft === 0 ? [1, 1.2, 1] : 1 }}
          className={`mb-6 px-5 py-2 rounded-full font-bold text-lg font-['Cairo'] ${
            votesLeft === 0
              ? 'bg-green-700 text-green-200'
              : 'bg-[var(--mafia-dark-red)] text-[var(--mafia-gold)] border border-[var(--mafia-gold)]/40'
          }`}
        >
          {votesLeft === 0 ? '✓ كل الأصوات تمت' : `الأصوات المتبقية: ${votesLeft}`}
        </motion.div>

        {/* Player cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl w-full mb-8">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * index }}
              className="relative"
            >
              {/* Vote count badge – top right */}
              <AnimatePresence>
                {player.votes > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[var(--mafia-gold)] text-[var(--mafia-black)] flex items-center justify-center text-sm font-bold shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  >
                    {player.votes}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={votesLeft > 0 ? { scale: 1.04 } : {}}
                whileTap={votesLeft > 0 ? { scale: 0.96 } : {}}
                onClick={() => handleVote(player.id)}
                disabled={votesLeft <= 0}
                className={`w-full bg-[var(--mafia-dark-red)] rounded-2xl p-5 text-center transition-all border-2 font-['Cairo']
                  ${votesLeft > 0
                    ? 'border-[var(--mafia-gold)]/30 hover:border-[var(--mafia-gold)]/70 cursor-pointer'
                    : 'border-[var(--mafia-gold)]/15 opacity-70 cursor-not-allowed'
                  }
                  ${player.votes > 0 ? 'shadow-[0_0_14px_rgba(212,175,55,0.25)]' : ''}
                `}
              >
                <h3 className="text-xl font-bold text-[var(--mafia-off-white)]">
                  {player.name}
                </h3>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Finish voting button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={votesLeft === 0 ? { scale: 1.05 } : {}}
          whileTap={votesLeft === 0 ? { scale: 0.95 } : {}}
          onClick={handleFinishVoting}
          disabled={votesLeft > 0}
          className={`px-10 py-4 rounded-2xl text-xl font-bold shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all font-['Cairo'] ${
            votesLeft === 0
              ? 'bg-[var(--mafia-gold)] text-[var(--mafia-black)] hover:bg-[var(--mafia-gold-dark)] cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          عرض النتائج
        </motion.button>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────────────
  // RENDER: RESULTS (before ejection)
  // ──────────────────────────────────────────────────────
  if (phase === PHASE_RESULTS) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-[var(--mafia-gold)] font-['Cairo']">
            نتائج التصويت
          </h2>
        </motion.div>

        {/* Results list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--mafia-dark-red)] rounded-3xl p-6 max-w-2xl w-full shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[var(--mafia-gold)]/20 mb-8"
        >
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.12 }}
                className={`rounded-xl p-4 flex items-center justify-between border-2 ${
                  player.votes === maxVotes && maxVotes > 0
                    ? 'bg-[var(--mafia-burgundy)] border-[var(--mafia-gold)] shadow-[0_0_16px_rgba(212,175,55,0.3)]'
                    : 'bg-[var(--mafia-burgundy)] border-[var(--mafia-gold)]/20'
                }`}
              >
                <span className="text-[var(--mafia-off-white)] font-['Cairo'] text-lg">
                  {player.name}
                  {player.votes === maxVotes && maxVotes > 0 && (
                    <span className="ml-2 text-xs text-red-400 font-bold">● الأكثر أصوات</span>
                  )}
                </span>
                {/* Vote circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    player.votes === maxVotes && maxVotes > 0
                      ? 'bg-[var(--mafia-gold)] text-[var(--mafia-black)]'
                      : 'bg-[var(--mafia-dark-red)] border-2 border-[var(--mafia-gold)]/40 text-[var(--mafia-gold)]'
                  }`}
                >
                  {player.votes}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Eject button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEject}
          className="flex items-center gap-2 bg-red-700 text-white px-10 py-4 rounded-2xl text-xl font-bold shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:bg-red-600 transition-colors font-['Cairo']"
        >
          <UserX size={24} />
          طرد اللاعب الأكثر أصوات
        </motion.button>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────────────
  // RENDER: GHOST VOTE (ejected player picks from last 2)
  // ──────────────────────────────────────────────────────
  if (phase === PHASE_GHOST_VOTE) {
    // players state already updated after eject; these are the remaining 2
    const lastTwo = players;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-3">👻</div>
          <h2 className="text-3xl font-bold text-[var(--mafia-gold)] font-['Cairo']">
            صوت الطارد
          </h2>
          <p className="text-[var(--mafia-off-white)] mt-2 font-['Cairo']">
            <span className="text-[var(--mafia-gold)] font-bold">{ejectedPlayer?.name}</span> — من تشك إنه المافيوسو؟
          </p>
        </motion.div>

        {/* Last 2 player cards */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-md w-full mb-8">
          {lastTwo.map((player, index) => (
            <motion.button
              key={player.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 * index }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleGhostVote(player.id)}
              className={`relative flex-1 bg-[var(--mafia-dark-red)] rounded-2xl p-6 text-center transition-all border-4 font-['Cairo']
                ${ghostVote === player.id
                  ? 'border-[var(--mafia-gold)] shadow-[0_0_28px_rgba(212,175,55,0.5)]'
                  : 'border-[var(--mafia-gold)]/25 hover:border-[var(--mafia-gold)]/60'
                }
              `}
            >
              {ghostVote === player.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--mafia-gold)] flex items-center justify-center"
                >
                  <Check size={16} className="text-[var(--mafia-black)]" />
                </motion.div>
              )}
              <h3 className="text-xl font-bold text-[var(--mafia-off-white)]">
                {player.name}
              </h3>
            </motion.button>
          ))}
        </div>

        {/* Confirm ghost vote */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: ghostVote ? 1 : 0.45, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={ghostVote ? { scale: 1.05 } : {}}
          whileTap={ghostVote ? { scale: 0.95 } : {}}
          onClick={handleGhostConfirm}
          disabled={!ghostVote}
          className={`px-10 py-4 rounded-2xl text-xl font-bold shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all font-['Cairo'] ${
            ghostVote
              ? 'bg-[var(--mafia-gold)] text-[var(--mafia-black)] hover:bg-[var(--mafia-gold-dark)] cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          تأكيد الصوت
        </motion.button>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────────────
  // RENDER: GHOST DONE / normal done → show final summary then go to results
  // ──────────────────────────────────────────────────────
  if (phase === PHASE_GHOST_DONE) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="inline-block mb-3"
          >
            <Check size={72} className="text-green-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-[var(--mafia-gold)] font-['Cairo']">
            {ejectedPlayer ? `تم طرد ${ejectedPlayer.name}` : 'تم التصويت'}
          </h2>
        </motion.div>

        {/* Mini summary of remaining players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--mafia-dark-red)] rounded-2xl p-5 max-w-md w-full border border-[var(--mafia-gold)]/20 mb-8"
        >
          <p className="text-[var(--mafia-off-white)] text-center mb-3 font-['Cairo']">
            اللاعبون المتبقون
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {players.map((p) => (
              <span
                key={p.id}
                className="bg-[var(--mafia-burgundy)] text-[var(--mafia-off-white)] px-4 py-1 rounded-full text-sm font-['Cairo'] border border-[var(--mafia-gold)]/30"
              >
                {p.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Go to results page */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="bg-[var(--mafia-gold)] text-[var(--mafia-black)] px-10 py-4 rounded-2xl text-xl font-bold shadow-[0_8px_24px_rgba(212,175,55,0.5)] hover:bg-[var(--mafia-gold-dark)] transition-colors font-['Cairo']"
        >
          شوف النتيجة
        </motion.button>
      </motion.div>
    );
  }

  return null;
}

export default VotingPage