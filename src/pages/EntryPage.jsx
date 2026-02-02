import { motion } from 'motion/react';


 const EntryPage = ({ onStartGame, onHowToPlay }) => {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-[var(--mafia-gold)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-['Cairo']">
          مافيوسو
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl md:text-2xl text-[var(--mafia-off-white)] font-['Cairo']"
        >
   مين الكداب ؟
        </motion.p>
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.8,
            },
          },
        }}
      >
        <motion.button
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartGame}
          className="bg-[var(--mafia-gold)] text-[var(--mafia-black)] px-8 py-4 rounded-2xl text-xl font-bold shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:bg-[var(--mafia-gold-dark)] transition-colors font-['Cairo']"
        >
         ودي
        </motion.button>

        <motion.button
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHowToPlay}
          className="bg-[var(--mafia-dark-red)] text-[var(--mafia-off-white)] px-8 py-4 rounded-2xl text-xl font-bold border-2 border-[var(--mafia-gold)] shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:bg-[var(--mafia-red)] transition-colors font-['Cairo']"
        >
ازاي نلعب مافيوسو
        </motion.button>
      </motion.div>

      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[var(--mafia-gold)] opacity-30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[var(--mafia-gold)] opacity-30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[var(--mafia-gold)] opacity-30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[var(--mafia-gold)] opacity-30 rounded-br-lg" />
    </div>
  );
}

export default EntryPage