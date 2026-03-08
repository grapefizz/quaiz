"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, RefreshCw, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/AppHeader";

type QuizResult = {
  score: number;
  total: number;
  userAnswers: Array<{
    question: string;
    user_answer: string | null;
    correct_answer: string;
  }>;
};

export default function ResultPage() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("quiz_results");
    if (saved) {
      const parsedResults = JSON.parse(saved);
      setResults(parsedResults);
      
      // Save to history array if not already saved during this session
      const sessionId = sessionStorage.getItem("current_quiz_saved");
      if (!sessionId) {
          const historyItem = {
              id: Date.now().toString(),
              date: new Date().toISOString(),
              score: parsedResults.score,
              total: parsedResults.total,
              title: `Quiz: ${parsedResults.total} Questions`
          };
          
          const existingHistory = JSON.parse(localStorage.getItem("quiz_history_list") || "[]");
          localStorage.setItem("quiz_history_list", JSON.stringify([historyItem, ...existingHistory]));
          sessionStorage.setItem("current_quiz_saved", "true");
      }
    } else {
      // Handle the case where someone visits /result directly
      router.push("/");
    }
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const percentage = Math.round((results.score / results.total) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-500 bg-green-50 dark:bg-green-500/10";
    if (percentage >= 50) return "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10";
    return "text-destructive bg-destructive/10";
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
       <AppHeader />
       {/* Background Decoration */}
       <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
       
       <main className="flex-1 w-full max-w-4xl mx-auto z-10 p-6 md:p-12 relative">
          
          {/* Header & Score Summary */}
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl ring-1 ring-black/5 dark:ring-white/10 text-center mb-12 animate-in slide-in-from-bottom-4 duration-500">
             <div className="inline-flex items-center justify-center p-4 mb-6 rounded-full bg-primary/10 text-primary">
                 <Trophy className="w-12 h-12" />
             </div>
             
             <h1 className="text-4xl md:text-5xl font-bold mb-4">Quiz Complete!</h1>
             <p className="text-xl text-foreground/60 font-medium mb-10">
                 Here is how you performed against the clock.
             </p>

             <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
                 {/* Score Circle */}
                 <div className={cn("p-8 rounded-3xl border border-foreground/5 shadow-sm", getScoreColor())}>
                    <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">Final Score</p>
                    <div className="text-6xl font-black tabular-nums tracking-tighter">
                        {percentage}%
                    </div>
                 </div>

                 <div className="p-8 rounded-3xl bg-secondary/30 dark:bg-foreground/5 border border-foreground/5 shadow-sm flex flex-col justify-center">
                    <p className="text-sm font-bold uppercase tracking-wider opacity-60 mb-2">Answers</p>
                    <div className="text-4xl font-black font-mono tracking-tighter">
                        {results.score} / {results.total}
                    </div>
                 </div>
             </div>

             <button
               onClick={() => router.push("/")}
               className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-bold transition-all shadow-lg active:scale-95"
             >
                 <RefreshCw className="w-5 h-5" />
                 Start a New Quiz
             </button>
          </div>

          {/* Question Review Section */}
          <h2 className="text-2xl font-bold mb-6 px-2">Detailed Review</h2>
          
          <div className="space-y-6">
             {results.userAnswers.map((answer, index) => {
                 const isCorrect = answer.user_answer === answer.correct_answer;
                 const isSkipped = answer.user_answer === null;

                 return (
                    <div 
                      key={index} 
                      className="bg-card rounded-3xl p-6 md:p-8 shadow-md border border-foreground/5 animate-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                       <div className="flex gap-4 mb-6 border-b border-foreground/5 pb-6">
                          <div className={cn(
                             "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-sm",
                             isCorrect ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400" 
                                       : isSkipped ? "bg-foreground/10 text-foreground/60" 
                                                   : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                          )}>
                             {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : isSkipped ? <Clock className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                          </div>
                          
                          <div className="w-full">
                             <div className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-2">Question {index + 1}</div>
                             <h3 className="text-xl md:text-2xl font-semibold leading-relaxed">{answer.question}</h3>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {/* Your Answer */}
                           <div className={cn(
                              "p-5 rounded-2xl border", 
                              isCorrect ? "bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20" 
                                        : isSkipped ? "bg-foreground/5 border-foreground/10 border-dashed"
                                                    : "bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20"
                           )}>
                              <p className="text-xs uppercase font-bold tracking-wider opacity-70 mb-2">Your Answer</p>
                              <p className="font-medium text-lg">
                                  {isSkipped ? <span className="italic opacity-60">Time ran out (No answer)</span> : answer.user_answer}
                              </p>
                           </div>
                           
                           {/* Correct Answer (Show only if wrong or skipped) */}
                           {!isCorrect && (
                              <div className="p-5 rounded-2xl bg-green-50 border border-green-200 dark:bg-green-500/10 dark:border-green-500/20">
                                <p className="text-xs uppercase font-bold tracking-wider opacity-70 mb-2 text-green-700 dark:text-green-400">Correct Answer</p>
                                <p className="font-medium text-lg text-green-900 dark:text-green-300">
                                    {answer.correct_answer}
                                </p>
                              </div>
                           )}
                       </div>
                    </div>
                 );
             })}
          </div>
       </main>
    </div>
  );
}
