"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy data for testing until the API is fully wired
const INITIAL_QUESTIONS = [
  {
    question: "What is Next.js primarily used for?",
    options: ["Building mobile applications", "Building full-stack React applications", "Creating Python scripts", "Managing databases"],
    answer: "Building full-stack React applications"
  },
  {
    question: "How long is the strict timer per question in this quiz app?",
    options: ["10 seconds", "15 seconds", "20 seconds", "30 seconds"],
    answer: "20 seconds"
  },
  {
    question: "Which Tailwind CSS directive replaces the older @tailwind approach in v4?",
    options: ["@import 'tailwindcss'", "@layer", "@apply", "@theme"],
    answer: "@import 'tailwindcss'"
  }
];

const TIME_PER_QUESTION = 20;

export default function QuizPage() {
  const router = useRouter();
  
  // Quiz State
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  
  // Interaction State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Array<{question: string, user_answer: string | null, correct_answer: string}>>([]);

  const currentQuestion = questions[currentIndex];
  
  // Setup the Timer
  useEffect(() => {
    if (isFinished || isRevealing) return;

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, isRevealing]);


  const handleTimeUp = () => {
     handleOptionSelect(null); // Automatically submit a blank answer
  };

  const handleOptionSelect = (option: string | null) => {
    if (isRevealing) return;
    
    setSelectedOption(option);
    setIsRevealing(true);
    
    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) setScore((prev) => prev + 1);
    
    setUserAnswers((prev) => [
        ...prev,
        {
            question: currentQuestion.question,
            user_answer: option,
            correct_answer: currentQuestion.answer
        }
    ]);

    // Automatically advance after a brief pause
    setTimeout(() => {
      goToNextQuestion();
    }, 1500);
  };

  const goToNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true);
      // In a real app we might save this to context or URL params
      // For now, we'll redirect and the real app can read from storage
      localStorage.setItem("quiz_results", JSON.stringify({ score, total: questions.length, userAnswers }));
      router.push("/result");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsRevealing(false);
      setTimeLeft(TIME_PER_QUESTION);
    }
  };

  // Calculate timer visual progress (0-100)
  const timerPercentage = (timeLeft / TIME_PER_QUESTION) * 100;
  
  // Determine color based on time remaining
  const timerColorClass = timeLeft <= 5 
     ? "bg-destructive text-destructive" 
     : timeLeft <= 10 
       ? "bg-yellow-500 text-yellow-500" 
       : "bg-primary text-primary";


  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
       {/* Ambient pulsing background matching timer priority */}
       <div 
         className="absolute inset-0 opacity-[0.03] transition-colors duration-1000 pointer-events-none" 
         style={{ backgroundColor: timeLeft <= 5 ? "var(--destructive)" : "transparent" }}
        />

       <main className="w-full max-w-3xl z-10 flex flex-col animate-in slide-in-from-bottom-8 duration-500">
         
         {/* Quiz Header */}
         <div className="flex justify-between items-center mb-8">
            <div className="px-4 py-2 rounded-full bg-card shadow-sm border border-foreground/10 text-sm font-bold tracking-wider uppercase">
               Question {currentIndex + 1} / {questions.length}
            </div>

            <div className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full font-bold shadow-sm border border-foreground/10 transition-colors duration-300",
                timeLeft <= 5 ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-card text-foreground"
            )}>
               <Clock className="w-5 h-5" />
               <span className="text-xl tabular-nums tracking-tighter w-[2ch] inline-block text-right">{timeLeft}</span>
               <span className="text-sm opacity-60">sec</span>
            </div>
         </div>

         {/* Time Progress Bar */}
         <div className="w-full h-2 bg-foreground/10 rounded-full mb-10 overflow-hidden">
            <div 
               className={cn("h-full rounded-full transition-all duration-1000 ease-linear", timerColorClass)}
               style={{ width: `${timerPercentage}%` }}
            />
         </div>

         <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl border border-foreground/5 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, idx) => {
                 const isSelected = selectedOption === option;
                 const isCorrectAnswer = isRevealing && option === currentQuestion.answer;
                 const isWronglySelected = isRevealing && isSelected && option !== currentQuestion.answer;

                 return (
                   <button
                     key={idx}
                     disabled={isRevealing}
                     onClick={() => handleOptionSelect(option)}
                     className={cn(
                        "relative flex items-center p-5 md:p-6 w-full text-left rounded-2xl border-2 transition-all duration-200 group text-lg font-medium",
                        !isRevealing && "border-foreground/10 hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]",
                        isRevealing && !isCorrectAnswer && !isWronglySelected && "border-foreground/5 opacity-50 bg-foreground/5",
                        isCorrectAnswer && "border-green-500 bg-green-50 text-green-900 dark:bg-green-500/20 dark:text-green-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] z-10",
                        isWronglySelected && "border-destructive bg-destructive/10 text-destructive shadow-[0_0_30px_rgba(239,68,68,0.3)] z-10"
                     )}
                   >
                     {/* Option Letter Indicator */}
                     <div className={cn(
                         "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-5 font-bold transition-colors",
                         !isRevealing && "bg-foreground/5 group-hover:bg-primary/20 group-hover:text-primary",
                         isCorrectAnswer && "bg-green-500 text-white",
                         isWronglySelected && "bg-destructive text-white"
                     )}>
                         {String.fromCharCode(65 + idx)}
                     </div>

                     <span className="flex-grow pr-8">{option}</span>

                     {/* Result Icon Indicator */}
                     {isRevealing && isCorrectAnswer && (
                        <CheckCircle2 className="absolute right-6 w-7 h-7 text-green-500 animate-in zoom-in" />
                     )}
                     {isRevealing && isWronglySelected && (
                        <XCircle className="absolute right-6 w-7 h-7 text-destructive animate-in zoom-in" />
                     )}
                   </button>
                 );
              })}
            </div>
         </div>
       </main>
    </div>
  );
}
