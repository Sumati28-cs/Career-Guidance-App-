import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Briefcase, GraduationCap, Sparkles, Compass } from 'lucide-react';

type Step = 'home' | 'quiz' | 'result';
type Level = '10th' | '12th' | 'degree' | '';
type Interest = 'tech' | 'business' | 'arts' | 'health' | '';
type Style = 'analytical' | 'creative' | 'social' | 'leadership' | '';

interface Answers {
  level: Level;
  interest: Interest;
  style: Style;
}

const QUESTIONS = [
  {
    id: 'level',
    question: 'What is your current education level?',
    options: [
      { label: '10th Grade', value: '10th', icon: BookOpen },
      { label: '12th Grade', value: '12th', icon: GraduationCap },
      { label: 'Degree / Graduate', value: 'degree', icon: Briefcase },
    ],
  },
  {
    id: 'interest',
    question: 'What are your primary interests?',
    options: [
      { label: 'Science, Math & Technology', value: 'tech', icon: Sparkles },
      { label: 'Business, Finance & Management', value: 'business', icon: Briefcase },
      { label: 'Arts, Design & Humanities', value: 'arts', icon: Compass },
      { label: 'Healthcare & Biology', value: 'health', icon: BookOpen },
    ],
  },
  {
    id: 'style',
    question: 'What is your preferred work style?',
    options: [
      { label: 'Solving complex problems', value: 'analytical', icon: Sparkles },
      { label: 'Expressing creativity', value: 'creative', icon: Compass },
      { label: 'Helping & communicating', value: 'social', icon: BookOpen },
      { label: 'Leading & organizing teams', value: 'leadership', icon: Briefcase },
    ],
  },
];

function getRecommendation(answers: Answers) {
  const { level, interest } = answers;

  let title = '';
  let description = '';
  let education = [];
  let careers = [];

  if (level === '10th') {
    if (interest === 'tech') {
      title = 'Science & Technology Path';
      description = 'You have a strong foundation for a career in engineering or IT. Focus on building your core science and math skills.';
      education = ['12th Science (PCM)', 'Diploma in Computer Engineering', 'Polytechnic Courses'];
      careers = ['Software Engineer', 'Data Scientist', 'Mechanical Engineer'];
    } else if (interest === 'business') {
      title = 'Commerce & Business Path';
      description = 'You are suited for the corporate world, finance, or entrepreneurship. Start by understanding the basics of economics and accounting.';
      education = ['12th Commerce', 'Diploma in Business Management'];
      careers = ['Chartered Accountant (CA)', 'Business Analyst', 'Entrepreneur'];
    } else if (interest === 'arts') {
      title = 'Arts & Humanities Path';
      description = 'Your creative and expressive skills are your biggest asset. Explore fields that allow you to communicate and design.';
      education = ['12th Arts/Humanities', 'Diploma in Fine Arts', 'Graphic Design Certification'];
      careers = ['Journalist', 'Graphic Designer', 'Lawyer', 'Content Creator'];
    } else {
      title = 'Medical & Healthcare Path';
      description = 'You have a calling to help others through healthcare and biology. Prepare for rigorous but rewarding medical studies.';
      education = ['12th Science (PCB)', 'Diploma in Nursing', 'Paramedical Courses'];
      careers = ['Doctor (MBBS)', 'Pharmacist', 'Physiotherapist'];
    }
  } else if (level === '12th') {
    if (interest === 'tech') {
      title = 'Advanced Technology & Engineering';
      description = 'Ready to dive deep into tech? It is time to specialize in a specific engineering or computer science domain.';
      education = ['B.Tech / B.E. in Computer Science', 'B.Sc in Information Technology', 'BCA'];
      careers = ['Full Stack Developer', 'AI/ML Engineer', 'Systems Architect'];
    } else if (interest === 'business') {
      title = 'Management & Finance';
      description = 'Take the next step into the business world by pursuing a specialized degree in commerce or management.';
      education = ['BBA (Bachelor of Business Administration)', 'B.Com (Hons)', 'CA Foundation'];
      careers = ['Financial Analyst', 'Marketing Manager', 'Investment Banker'];
    } else if (interest === 'arts') {
      title = 'Creative Arts & Media';
      description = 'Turn your passion into a profession by pursuing higher education in design, media, or social sciences.';
      education = ['B.A. in Mass Communication', 'Bachelor of Fine Arts (BFA)', 'Bachelor of Design (B.Des)'];
      careers = ['Art Director', 'UX/UI Designer', 'Public Relations Specialist'];
    } else {
      title = 'Medical Sciences';
      description = 'Continue your journey in healthcare by pursuing a specialized medical or allied health degree.';
      education = ['MBBS', 'BDS (Dentistry)', 'B.Sc Nursing', 'B.Pharma'];
      careers = ['Surgeon', 'Clinical Researcher', 'Healthcare Administrator'];
    }
  } else {
    // Degree
    if (interest === 'tech') {
      title = 'Tech Leadership & Specialization';
      description = 'You already have a degree. Now it is time to specialize further or enter the tech industry as a professional.';
      education = ['M.Tech / MS in Computer Science', 'MCA', 'Certifications (AWS, Google Cloud)'];
      careers = ['Senior Software Engineer', 'CTO', 'Cloud Architect'];
    } else if (interest === 'business') {
      title = 'Executive Management';
      description = 'Accelerate your career trajectory by acquiring advanced management skills and networking.';
      education = ['MBA (Master of Business Administration)', 'CFA (Chartered Financial Analyst)'];
      careers = ['Management Consultant', 'Chief Financial Officer (CFO)', 'Product Manager'];
    } else if (interest === 'arts') {
      title = 'Advanced Media & Design';
      description = 'Master your craft and take on leadership roles in the creative industry.';
      education = ['M.A. in Journalism', 'Master of Design (M.Des)', 'Ph.D. in Humanities'];
      careers = ['Creative Director', 'Senior Editor', 'Professor'];
    } else {
      title = 'Advanced Healthcare & Research';
      description = 'Specialize in a specific medical field or move into healthcare management and research.';
      education = ['MD / MS', 'Master of Public Health (MPH)', 'M.Sc in Clinical Research'];
      careers = ['Specialist Doctor', 'Medical Director', 'Epidemiologist'];
    }
  }

  return { title, description, education, careers };
}

export default function App() {
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authError, setAuthError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [step, setStep] = useState<Step>('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ level: '', interest: '', style: '' });

  useEffect(() => {
    const saved = localStorage.getItem('pathfinder_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed.name) {
          setUser({ name: parsed.name, email: parsed.email });
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (authMode === 'register') {
      if (!name || !email || !password) {
        setAuthError('Please fill in all fields.');
        return;
      }
      const newUser = { name, email, password };
      localStorage.setItem('pathfinder_user', JSON.stringify(newUser));
      setUser({ name, email });
      setStep('home');
    } else {
      if (!email || !password) {
        setAuthError('Please fill in all fields.');
        return;
      }
      const saved = localStorage.getItem('pathfinder_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === email && parsed.password === password) {
          setUser({ name: parsed.name, email: parsed.email });
          setStep('home');
        } else {
          setAuthError('Invalid email or password.');
        }
      } else {
        setAuthError('No account found. Please register.');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStep('home');
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleStart = () => {
    setStep('quiz');
    setCurrentQuestionIndex(0);
    setAnswers({ level: '', interest: '', style: '' });
  };

  const handleAnswer = (value: string) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep('result');
    }
  };

  const handleRetake = () => {
    setStep('home');
  };

  const currentQ = QUESTIONS[currentQuestionIndex];
  const recommendation = step === 'result' ? getRecommendation(answers) : null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#0f172a] font-sans flex flex-col">
      {/* Header */}
      <header className="h-[70px] bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 md:px-10 shrink-0">
        <div className="font-extrabold text-[24px] text-[#2563eb] tracking-tight">Pathfinder.</div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563eb] text-white rounded-full flex items-center justify-center font-bold">
                {getInitials(user.name)}
              </div>
              <div className="text-[14px] font-medium hidden sm:block">{user.name}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-[13px] text-[#64748b] hover:text-[#0f172a] font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {/* AUTH SCREEN */}
            {!user && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 border border-[#e2e8f0] shadow-sm"
              >
                <div className="mb-8 text-center">
                  <h1 className="text-[28px] tracking-tight font-bold text-[#0f172a]">
                    {authMode === 'register' ? 'Create an Account' : 'Welcome Back'}
                  </h1>
                  <p className="text-[#475569] mt-2 text-[14px]">
                    {authMode === 'register' 
                      ? 'Sign up to discover your ideal career path.' 
                      : 'Log in to continue your career journey.'}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authError && (
                    <div className="p-3 bg-red-50 text-red-600 text-[13px] rounded-md font-medium border border-red-100">
                      {authError}
                    </div>
                  )}
                  
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-[13px] font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-[#e2e8f0] rounded-md text-[14px] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-[13px] font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-[#e2e8f0] rounded-md text-[14px] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-[#e2e8f0] rounded-md text-[14px] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-md font-semibold transition-colors mt-2"
                  >
                    {authMode === 'register' ? 'Register' : 'Log In'}
                  </button>
                </form>

                <div className="mt-6 text-center text-[14px] text-[#475569]">
                  {authMode === 'register' ? 'Already have an account?' : 'Don\'t have an account?'}
                  <button 
                    onClick={() => {
                      setAuthMode(authMode === 'register' ? 'login' : 'register');
                      setAuthError('');
                    }}
                    className="ml-1 text-[#2563eb] font-semibold hover:underline"
                  >
                    {authMode === 'register' ? 'Log in' : 'Register'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* HOME SCREEN */}
            {user && step === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="mb-8">
                  <h1 className="text-[32px] tracking-tight font-bold text-[#0f172a]">
                    Explore Your Future, {user.name.split(' ')[0]}
                  </h1>
                  <p className="text-[#475569] mt-1.5">
                    Confused about what to do after 10th, 12th, or your degree? Take our quick 3-question aptitude test to discover the best educational and career paths for you.
                  </p>
                </div>

                <button
                  onClick={handleStart}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-md font-semibold transition-colors w-full sm:w-auto"
                >
                  Start Aptitude Test
                </button>
              </motion.div>
            )}

            {/* QUIZ SCREEN */}
            {user && step === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e8f0] shadow-sm w-full max-w-2xl mx-auto"
              >
                {/* Progress */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-[13px] font-medium text-[#475569] uppercase tracking-wide">
                    <span>Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#f0f4f8] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#2563eb] rounded-full"
                      initial={{ width: `${(currentQuestionIndex / QUESTIONS.length) * 100}%` }}
                      animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-[20px] font-bold text-[#0f172a] mb-6">
                  {currentQ.question}
                </h3>

                {/* Options */}
                <div className="flex flex-col gap-3">
                  {currentQ.options.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className="p-4 border border-[#e2e8f0] rounded-lg bg-white hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-all text-left flex items-center gap-3 text-[#0f172a] group"
                      >
                        <span className="text-[#64748b] group-hover:text-[#2563eb]">
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="font-medium text-[15px]">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* RESULT SCREEN */}
            {user && step === 'result' && recommendation && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full mx-auto space-y-8"
              >
                <div className="mb-8">
                  <h1 className="text-[32px] tracking-tight font-bold text-[#0f172a]">
                    {recommendation.title}
                  </h1>
                  <p className="text-[#475569] mt-1.5">
                    {recommendation.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Education Card */}
                  <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
                    <span className="text-[11px] font-bold uppercase text-[#2563eb] bg-[#e0e7ff] px-2 py-1 rounded inline-block mb-3">
                      Education Steps
                    </span>
                    <h2 className="text-[20px] font-bold mb-4 text-[#0f172a]">Recommended Path</h2>
                    <ul className="list-none">
                      {recommendation.education.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center py-2.5 border-b border-[#e2e8f0] text-[14px] text-[#475569] last:border-0">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career Card */}
                  <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
                    <span className="text-[11px] font-bold uppercase text-[#10b981] bg-[#d1fae5] px-2 py-1 rounded inline-block mb-3">
                      Career Options
                    </span>
                    <h2 className="text-[20px] font-bold mb-4 text-[#0f172a]">Potential Jobs</h2>
                    <ul className="list-none">
                      {recommendation.careers.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center py-2.5 border-b border-[#e2e8f0] text-[14px] text-[#475569] last:border-0">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 bg-[#0f172a] text-white p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-[16px] font-bold">Confused about your choices?</h4>
                    <p className="text-[13px] opacity-70 mt-1">Retake the aptitude test to see different results.</p>
                  </div>
                  <button
                    onClick={handleRetake}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-md font-semibold whitespace-nowrap transition-colors"
                  >
                    Retake Test
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
