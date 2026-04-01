import {useState} from 'react'
import {motion, AnimatePresence} from 'motion/react'
import { useGame } from '../context/GameContext'
import {Eye, EyeOff, TriangleAlert } from 'lucide-react'

import { ImEvil } from 'react-icons/im'
import { FaRegEye } from "react-icons/fa";


const RoleRevealPage = ({onComplete}) => {
    const {players} = useGame()
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
    const [showRole, setShowRole] = useState(false);

    const currentPlayer = players[currentPlayerIndex]
    const isLastPlayer = currentPlayerIndex === players.length -1;

    const handleNext = () => {
        setShowRole(false);
        if(isLastPlayer) {
            setTimeout(() => onComplete(), 300);
        }else{
            setTimeout(() => setCurrentPlayerIndex((prev) => prev + 1), 300);
        }
    };

    const handleReveal = () => {
        setShowRole(true)
    }

    return(
        <motion.div
        initial={{opacity: 0}}
        animate= {{opacity:1}}
        exit = {{opacity: 0}}
        className="min-h-screen flex items-center justify-center px-6 py-12 overflow-y-auto"
        >
            <div className='w-full max-w-lg'>
                <AnimatePresence mode='wait'>
                    {!showRole ? (
                        <motion.div
                        key='reveal-prompt'
                        initial = {{opacity: 0, scale:0.8}}
                        animate = {{opacity: 1, scale: 1}}
                        exit = {{opacity: 0, scale: 0.8}}
                        className='text-center'
                        >
                            <motion.div
                            animate={{y: [0,-10,0]}}
                            transition={{duration: 2, repeat: Infinity}}
                            className="mb-8"
                            >
                                <Eye size={80} className='mx-auto text-[var(--mafia-gold)]'/>
                            </motion.div>

                            <h2 className="text-3xl font-bold text-[var(--mafia-off-white)] mb-4 font-['Cairo']">
                                {currentPlayer.name}
                            </h2>
                            <p className="text-xl text-[var(--mafia-gold)] mb-8 font-['Cairo']">
                                دوس عشان تشوف هتبقى مين 
                            </p>

                            <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale:0.95}}
                            onClick={handleReveal}
                             className="bg-[var(--mafia-gold)] text-[var(--mafia-black)] px-12 py-4 rounded-2xl text-2xl font-bold shadow-[0_8px_24px_rgba(212,175,55,0.5)] hover:bg-[var(--mafia-gold-dark)] transition-colors font-['Cairo']"
                            >
                                                <FaRegEye />
                            </motion.button>

                            <p className="text-sm text-[var(--mafia-off-white)]/60 mt-8 font-['Cairo']">
                            {currentPlayerIndex + 1} / {players.length}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                        key='role-display'
                        initial = {{opacity: 0, rotateY: -90}}
                        animate = {{opacity: 1, rotateY: 0}}
                        exit = {{opacity:0, rotateY: 90}}
                        transition={{type: 'spring', damping: 20}}
                        className='text-center'
                        >
                            <motion.div
                            initial= {{scale:0}}
                            animate= {{scale:1}}
                            transition={{delay:0.3, type: 'spring', damping: 15}}
                            className={`bg-gradient-to-br ${
                                currentPlayer.role?.isMafioso 
                                ? 'from-red-900 to-black border-red-600 shadow-[0_0_40px_rgba(220, 20, 60, 0.6)]'
                                : 'from-[var(--mafia-dark-red)] to-[var(--mafia-burgundy border-[var(--mafia-gold)])]'
                            } rounded-3xl p-12 shadow-[0_12px_32px_rgba(0,0,0,0.8)] border-4` }
                            >
                                {currentPlayer.role?.isMafioso ? (
                                    //Mafioso view - show they are the mafioso
                                    <>
                                    <p className="text-red-400 text-2xl mb-4 font-bold font-['Cairo']">
                                        انت المافيوسو
                                    </p>
                                    <motion.div
                                    animate = {{rotate: [0, 5, -5, 0]}}
                                    transition={{duration: 0.5, delay: 0.5}}
                                    className='text-8xl mb-6 flex justify-center text-red-400'
                                    >
                           <ImEvil/>
                                    </motion.div>
                                    <motion.h1
                                    initial={{opacity: 0, y: 20}}
                                    animate= {{opacity: 1, y: 0}}
                                    transition={{delay: 0.6}}
                                    className="text-5xl font-bold text-red-400 mb-6 font-['Cairo']"
                                    style={{textShadow: '0 0 20px rgba(220, 20, 60, 0.8'}}
                                    >
                                     انت الي ارتكبت الجريمةحاول متتمسكش
                                    </motion.h1>

                                    <motion.div
                                    initial={{opacity:0}}
                                    animate={{opacity:1}}
                                    className='bg-yellow-900/30 border-2 border-yellow-600 rounded-xl p-4 mb-4'
                                    >
                                        <p className="text-yellow-400 text-sm font-bold mb-2 font-['Cairo']">
                                            دورك بقى 
                                        </p>

                                        <div className='flex items-center justify-center gap-3 mb-2'>
                                            <span className='text-4xl'>
                                                {currentPlayer.role?.emoji}
                                            </span>
                                            <p className="text-2xl text-[var(--mafia-gold)] font-bold font-['Cairo']">
                                                {currentPlayer.role?.name}
                                            </p>
                                        </div>
                                        <p className="text-sm text-[var(--mafia-off-white)] font-['Cairo']">
                        {currentPlayer.role?.description}
                      </p>
                                    </motion.div>

                                    <motion.div 
                                    initial= {{opacity: 0}}
                                    animate = {{opacity:1}}
                                    transition={{delay: 0.8}}
                                    className='bg-red-950/50 border-red-600 rounded-xl p-4 mt-4' 
                                    >
                                        <p className="text-red-400 text-sm -font-['Cairo'] flex  items-center gap-2">
                                            <TriangleAlert  size={20} className='text-yellow-400'/>
                                            اكرر متقولش انك المافيوسو 
                                            لكن اقول انت {currentPlayer.role?.name}
                                        </p>
                                    </motion.div>
                                    </>
                                ) : (
                                   // Regular player view
                                   <>
                                   <p className="text-[var(--mafia-gold)] text-cl mb-4 font-['Cairo']">
                                    دورك هو بقى
                                   </p>

                                      <motion.div 
                                      animate = {{rotate: [0, 5, -5, 0]}}
                                      transition={{duration: 0.5, delay: 0.5}}
                                      className='text-8xl mb-6'
                                      >
                                        {currentPlayer.role?.emoji || ' '}
                                      </motion.div>

                                      <motion.h1
                                      initial={{opacity: 0, y: 20}}
                                      animate = {{opacity: 1, y: 0}}
                                      transition={{delay: 0.6}}
                                       className="text-5xl font-bold text-[var(--mafia-gold)] mb-4 font-['Cairo']"
                                       style={{
                                           textShadow: '0 4px 12px rgba(0,0,0,0.6)',
                                                   }}
                                      >
                                        {currentPlayer.role?.name || 'دورك مش معروف اخترلك واحد'}
                                      </motion.h1>

                                      <motion.p
                                      initial={{opacity: 0}}
                                      animate = {{opacity: 1}}
                                      transition={{delay: 0.7}}
                                      className="text-lg text-[var(--mafia-off-white)] font-['Cairo'] px-4"
                                      >
                                        {currentPlayer.role?.description || ''}
                                      </motion.p>
                                   </>
                                )}
                            </motion.div>

                            <motion.div
                            initial = {{opacity: 0}}
                            animate ={{opacity: 1}}
                            transition={{delay: 1}}
                            className='mt-8 space-y-4'
                            >
                                <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={handleNext}
                                className="bg-[var(--mafia-gold)] text-[var(--mafia-black)] px-8 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:bg-[var(--mafia-gold-dark)] transition-colors w-full font-['Cairo']"
                                >
                                    {isLastPlayer ? 'ابداء النقاش': "الي  بعدوووووووو"}
                                </motion.button>

                                {!isLastPlayer && (
                                    <p className="text-[var(--mafia-off-white)]/80 text-sm font-['Cairo']">
                                        ادي الموبايل ل {players[currentPlayerIndex + 1]?.name}
                                    </p>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Privacy overlay suggestion */}
            {!showRole && (
                <motion.div
                initial= {{opacity: 0}}
                animate = {{opacity: 0.3}}
                className='absolute inset-0 bg-black pointer-events-none -z-10'
                ></motion.div>
            )}
        </motion.div>
    )
}

export default RoleRevealPage