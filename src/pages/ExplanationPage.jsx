import {motion} from 'motion/react'
import {Users, Eye, MessageCircle, Lightbulb, Vote, Trophy, ArrowLeft} from 'lucide-react';
import { Children } from 'react';

const roleCard = [
    {key: 'farmer', icon:'🧑‍🌾', color: '#8B4513', title: 'فلاح'},
    {key: 'vet', icon: '🧑‍⚕️', color: '#2E8B57', title: 'دكتور بيطري'},
    {key: 'guard', icon: '👮‍♂️', color: '#4682B4', title: 'حارس المزرعة'},
    {key: 'butcher', icon: '🔪', color: '#DC143C', title: "جزار"},
    {key: 'mafioso', icon: '😈', color: '#000', title: 'واحد فيهم هو المافيوسو '},
    {key: 'whatToDo', icon: '', color: '#000', title: 'لازم تعرفوا مين الي ف الادوار دي هو المافيوسو و عامل فيها بريئ'}
]

const ExplanationPage = ({onStartGame, onBack}) => {
const Section = ({children, delay =0}) => {
    <motion.div 
    initial = {{opacity: 0, y: 30}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{once: true, margin: '-100px'}}
    transition={{duration: 0.6, delay}}
    className='mb-16'
    >
        {children}
    </motion.div>
};

return(
    <div className='min-h-screen px-6 py-12 max-w-4xl mx-auto overflow-y-auto'>
        {/* Header*/}
        <motion.div
        initial = {{opacity: 0, y:-20}}
        animate = {{opacity: 1, y:0}}
        className='mb-12 text-center'
        >
            <button
            onClick={onBack}
            className='absolute top-6 left-6 text-[var(--mafia-gold)] 
            hover:text-[var(--mafia-gold-dark)] transition-colors'
            >
                <ArrowLeft size= {32}/>
            </button>

            <h1 className="text-4xl md:text-5xl font-bold text-[var(--mafia-gold)] mb-2 font-['Cairo']">
                ازاي نلعب مافيوسو؟
            </h1>
        </motion.div>

        {/* Intro  Section*/}
        <section>
            <div className="bg-[var(--mafia-dark-red)] rounded-3xl p-8 
            shadow-[0_8px_24px_rgba(0,0,0,0.6)] border-[var(--mafia-gold)]/20">
                <motion.div
                initial = 'hidden'
                whileInView='visible'
                viewport={{once:true}}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {staggerChildren: 0.3},
                    },
                }}
                className="space-y-4 text-lg md:text-xl text-[var(--mafia-off-white)] font-['Cairo'] "
                style={{direction: 'rtl'}}
                >
                <motion.p 
                variants={{
                    hidden: {opacity:0, x: -20},
                    visible: {opacity: 1, x: 0}

                }}
                >
                   جريمة ما حصلت في مكان ما 
                </motion.p>
               
                <motion.p 
                variants={{
                    hidden: {opacity:0, x: -20},
                    visible: {opacity: 1, x: 0}

                }}
                >
              كل واحد منكم لي دور هيلعب بيه
                </motion.p>
                <motion.p 
                variants={{
                    hidden: {opacity:0, x: -20},
                    visible: {opacity: 1, x: 0}

                }}
                >
                 وفي واحد فيكم مافيوسو (هو الي ارتكب الجريمة)
                </motion.p>
 
       <motion.p 
                variants={{
                    hidden: {opacity:0, x: -20},
                    visible: {opacity: 1, x: 0}

                }}
                >
                       كل الي هتعمله انك   تدافع عن نفسك  وتتهم غيرك عشان تكسب
                        (او وقع غيرك لو انت المافيوسو)
                        <p className = 'mt-4'>
                  حاول تكتشفوا المافيوسو قبل ما يضحك عليكم كلّكم
                        </p>
                </motion.p>
               
          
                </motion.div>

                <motion.div
                initial = {{scale:0}}
                whileInView={{scale:1}}
                viewport={{once: true}}
                transition={{delay: 0.5, type: 'spring'}}
                className='mt-8 text-center'
                >
                    <Users size={80} className='mx-auto text-[var(--mafia-gold)] opacity-50'/>
                </motion.div>
            </div>
        </section>

        {/* Roles Section */}
        <section className='mt-10'>
            <h2 className="text-3xl font-bold text-[var(--mafia-gold)] mb-6 text-center font-['Cairo']">
              مثال   نفهم بيه 
            </h2>
            <motion.h3 
                    initial = {{opacity:0, rotateY: -90}}
                    whileInView={{opacity: 1, rotateY: 0}}
                    viewport={{once: true}}
                    transition={{delay: 0.5, duration:0.5}}
            className='text-center text-md mb-3'> مثال  عندك جريمة حصلت في مزرعة ما المحصول بتاعها اتسمم بفعل فاعل عندك الاشخاص المتهمين الي هيبقوا ادواركوا الي هتلعبوا بيها </motion.h3>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {roleCard.map((role, index) =>(
                    <motion.div
                    key = {role.key}
                    initial = {{opacity:0, rotateY: -90}}
                    whileInView={{opacity: 1, rotateY: 0}}
                    viewport={{once: true}}
                    transition={{delay: index *0.1, duration:0.5}}
                    whileHover={{scale: 1.05, rotateY: 5}}
                    className={`bg-[var(--mafia-dark-red)] rounded-2xl p-6 text-center shadow-[0_8px_16px_rgba(0,0,0,0.6)] border-2 ${
                role.key === 'mafioso' ? 'border-red-600 shadow-[0_8px_24px_rgba(220,20,60,0.4)]' : 'border-[var(--mafia-gold)]/30'
              }`}
                    >
                        <div className='text-5xl mb-3'>{role.icon}</div>
                        <h3 className="text-xl font-bold text-[var(--mafia-gold)] mb-2 font-['Cairo']">{role.title}</h3>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Setup Section */}
        <section className='mt-10'>
            <h2 className="text-3xl font-bold text-[var(--mafia-gold)] mb-6 text-center font-['Cairo']">
                 نبدأ إزاي؟
            </h2>
            <div className='space-y-4'>
                 {[
                'دخلوا اسماء اللاعبين',
                "اختارو عدد المافيوس",
                "اختاروا وقت الجولة"
            ].map((step, index) => (
                <motion.div
                key = {index}
                initial = {{opacity: 0, x:-50}}
                whileInView={{opacity: 1, x: 0}}
                transition={{delay:index *0.2}}
                viewport={{once: true}}
                className="bg-[var(--mafia-dark-red)] rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-4 border border-[var(--mafia-gold)]/20"
                >
                    <div className="w-12 h-12 rounded-full bg-[var(--mafia-gold)] text-[var(--mafia-black)] flex items-center justify-center text-2xl font-bold flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-lg text-[var(--mafia-off-white)] font-['Cairo']">
                {step}
              </p>
                </motion.div>
            ))
            }
            </div>
        </section>

        {/* Role Reveal Section */}
        <section className='mt-10'>
            <div className="bg-[var(--mafia-dark-red)] rounded-3xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[var(--mafia-gold)]/20 text-center flex flex-col items-center">
            <Eye size={60} className='mx-autp text-[var(--mafia-gold)] mb-4'/>
             <h2 className="text-3xl font-bold text-[var(--mafia-gold)] mb-4 font-['Cairo']">
            شوف دورك
          </h2>
          <motion.p
          initial = {{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once:true}}
          transition={{delay: 0.3}}
          className="text-lg text-[var(--mafia-off-white)] whitespace-pre-line font-['Cairo']"
          >
  الموبايل هيلف على كل لاعب {'\n'} كل واحد يشوف دوره لوحده{'\n'} قول دورك ايه بس متقولش انك المافيوسو
          </motion.p>
            </div>
        </section>

        {/* Disscussion Section */}
        <section className=' mt-10'>
          <div className="bg-[var(--mafia-dark-red)] rounded-3xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[var(--mafia-gold)]/20 text-center">
          <MessageCircle size={60} className="mx-auto text-[var(--mafia-gold)] mb-4" />
          <h2 className="text-3xl font-bold text-[var(--mafia-gold)] mb-4 font-['Cairo']">
            ابداء دافع عن نفسك و اتهم صحابك
          </h2>
          <motion.p
          initial = {{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
          transition={{delay:0.3}}
          className="text-lg text-[var(--mafia-off-white)] whitespace-pre-line font-['Cairo']"
          >
            اتكلموا، اسألوا، اتهموا{'\n'}بس خلي بالك… أي كلمة ممكن تقلب عليك
          </motion.p>
          <motion.div
          initial = {{scale:0}}
          whileInView={{scale:1}}
          viewport={{once: true}}
          transition={{delay:0.5, type: 'spring'}}
          className='mt-6 flex justify-center gap-4'
          >
            {['💬', '🤔', '👀'].map((emoji, i) => (
            <motion.div
            key = {i}
            animate = {{y: [0, -10, 0]}}
            transition={{delay: i*0.2, duration:2, repeat:Infinity}}
            className='text-4xl'
            >
                {emoji}
            </motion.div>
            ))}
          </motion.div>
          </div>
        </section>

        {/*Clues Section*/}
        <section className='mt-10'>
            <div className="bg-[var(--mafia-dark-red)] rounded-3xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[var(--mafia-gold)]/20 text-center">
            <motion.div
            whileInView={{rotate: [0, 10, -10, 0]}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
            >
                <Lightbulb size={60} className='mx-auto text-[var(--mafia-gold)] mb-4'/>
            </motion.div>
            <h2 className="text-3xl font-bold text-[var(--mafia-gold)] mb-4 font-['Cairo']">
            الدلائل
          </h2>
          <motion.p
          initial = {{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{delay:0.3}}
          viewport={{once: true}}
          className="text-lg text-[var(--mafia-off-white)] whitespace-pre-line font-['Cairo']"
          >
            في كل راوند دليل جديد{'\n'}بيقرّبكم من الحقيقة… أو يلغبطكم أكتر
          </motion.p>
          <motion.div
          initial = {{opacity: 0, x: -100}}
          whileInView={{opacity: 1, x: 0}}
          viewport={{once: true}}
          transition={{delay: 0.5}}
          className="mt-6 bg-[var(--mafia-black)] p-4 rounded-xl border-2 border-[var(--mafia-gold)] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <p className="text-[var(--mafia-gold)] font-['Cairo']">
                لقو ابرة مرمية في المزراعة
            </p>
          </motion.div>
            </div>
        </section>

        {/* Voting Section */}
        <section className= 'mt-10'>
        <div className="bg-[var(--mafia-dark-red)] rounded-3xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[var(--mafia-gold)]/20 text-center">
          <Vote size={60} className="mx-auto text-[var(--mafia-gold)] mb-4" />
          <h2 className="text-3xl font-bold text-[var(--mafia-gold)] mb-4 font-['Cairo']">
            التصويت
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-[var(--mafia-off-white)] whitespace-pre-line font-['Cairo']"
          >
            صوّتوا على الشخص اللي شاكين فيه{'\n'}الأصوات بتتحسب قدامكم
          </motion.p>
          <motion.div
            className="mt-6 flex justify-center gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.5 },
              },
            }}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <motion.div
                key={num}
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  visible: { opacity: 1, scale: 1 },
                }}
                className="w-12 h-12 rounded-full bg-[var(--mafia-gold)] text-[var(--mafia-black)] flex items-center justify-center font-bold text-xl"
              >
                {num}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className='mt-10'>
        <h2 className="text-3xl font-bold text-[var(--mafia-gold)] mb-6 text-center font-['Cairo']">
          النتيجة
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-900 to-[var(--mafia-dark-red)] rounded-3xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border-2 border-green-500 text-center"
          >
            <Trophy size={60} className="mx-auto text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-2 font-['Cairo']">
              مبروك… مسكتوه
            </h3>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-4xl mt-4"
            >
              ✨
            </motion.div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-red-900 to-[var(--mafia-black)] rounded-3xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border-2 border-red-600 text-center"
          >
            <div className="text-6xl mb-4">😈</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2 font-['Cairo']">
              المافيوسو كسب{'\n'}ضحك عليكم كلّكم
            </h3>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className='mt-10'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-[var(--mafia-gold)] mb-6 font-['Cairo']">
            جاهزين تبدأوا؟
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={onStartGame}
            className="bg-[var(--mafia-gold)] text-[var(--mafia-black)] px-12 py-4 rounded-2xl text-2xl font-bold shadow-[0_8px_24px_rgba(212,175,55,0.5)] hover:bg-[var(--mafia-gold-dark)] transition-colors font-['Cairo']"
          >
            ابدأ اللعبة دلوقتي
          </motion.button>
        </motion.div>
      </section>
    </div>
)
}

export default ExplanationPage