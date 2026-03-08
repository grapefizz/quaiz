"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Clock, Trophy, ArrowRight, BookOpen, Target, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/AppHeader";

type QuizRecord = {
  id: string;
  date: string;
  score: number;
  total: number;
  title: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [history, setHistory] = useState<QuizRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("quiz_history_list");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    setIsLoaded(true);
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your entire quiz history?")) {
      localStorage.removeItem("quiz_history_list");
      setHistory([]);
    }
  };

  const totalQuizzes = history.length;
  
  // Calculate average score percentage
  let avgScore = 0;
  if (totalQuizzes > 0) {
      const totalPercentageSum = history.reduce((acc, curr) => {
          return acc + (curr.score / curr.total);
      }, 0);
      avgScore = Math.round((totalPercentageSum / totalQuizzes) * 100);
  }

  return (
    <div className="min-h-screen bg-background/50 flex flex-col">
       <AppHeader />
       
       <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 z-10 relative">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 animate-in slide-in-from-top-4 duration-500">
             <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
                <p className="text-foreground/60 font-medium">Review your progress or accept a new challenge.</p>
             </div>
             
             <button
               onClick={() => router.push("/create")}
               className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all shadow-md shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-0.5 active:scale-95"
             >
                 <Plus className="w-5 h-5" />
                 Create New Quiz
             </button>
          </div>

          {/* Aggregate Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
             <div className="bg-card rounded-2xl p-6 border border-foreground/5 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 dark:bg-blue-500/10 flex items-center justify-center">
                    <Activity className="w-7 h-7" />
                </div>
                <div>
                   <p className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-1">Total Quizzes Taken</p>
                   <p className="text-3xl font-black">{totalQuizzes}</p>
                </div>
             </div>
             
             <div className="bg-card rounded-2xl p-6 border border-foreground/5 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 dark:bg-green-500/10 flex items-center justify-center">
                    <Target className="w-7 h-7" />
                </div>
                <div>
                   <p className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-1">Average Score</p>
                   <p className="text-3xl font-black">{totalQuizzes > 0 ? `${avgScore}%` : '--'}</p>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/5">
             <BookOpen className="w-5 h-5 text-foreground/70" />
             <h2 className="text-xl font-bold">Recent History</h2>
             
             {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="ml-auto text-sm text-foreground/40 hover:text-destructive transition-colors font-medium hover:underline"
                >
                   Clear History
                </button>
             )}
          </div>

          {!isLoaded ? (
             <div className="w-full flex justify-center py-20">
               <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
             </div>
          ) : history.length === 0 ? (
             <div className="bg-card rounded-3xl p-12 text-center border border-dashed border-foreground/20 animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-6">
                   <Clock className="w-10 h-10 text-foreground/40" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No quizzes yet</h3>
                <p className="text-foreground/60 mb-8 max-w-md mx-auto line-clamp-2">
                   You haven't taken any quizzes on this device. Upload your first document to get started.
                </p>
                <button
                  onClick={() => router.push("/create")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold transition-all"
                >
                   Upload Document <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {history.map((record, idx) => {
                   const percentage = Math.round((record.score / record.total) * 100);
                   const isHigh = percentage >= 80;
                   const isMedium = percentage >= 50 && percentage < 80;
                   
                   return (
                      <div 
                         key={record.id}
                         className="bg-card rounded-2xl p-5 shadow-sm border border-foreground/5 hover:border-primary/20 transition-all hover:shadow-md group flex flex-col animate-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                         style={{ animationDelay: `${idx * 100}ms` }}
                      >
                         <div className="flex justify-between items-start mb-5">
                            <div className={cn(
                               "px-3 py-1.5 rounded-full text-xs font-bold tracking-wider",
                               isHigh ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                               isMedium ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400" :
                               "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                            )}>
                               {percentage}% SCORE
                            </div>
                            <div className="text-xs font-semibold text-foreground/40 bg-foreground/5 px-2 py-1 rounded-md">
                               {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                         </div>
                         
                         <h3 className="text-lg font-bold mb-1 line-clamp-1" title={record.title}>
                            {record.title}
                         </h3>
                         
                         <p className="text-foreground/50 text-sm font-medium mb-6">
                            {record.score} correct out of {record.total}
                         </p>
                         
                         <div 
                             onClick={() => router.push("/create")}
                             className="mt-auto pt-4 border-t border-foreground/5 flex items-center text-primary font-bold text-sm cursor-pointer group-hover:text-primary/80 transition-colors"
                         >
                            Study again <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                         </div>
                      </div>
                   );
                })}
             </div>
          )}
       </main>
    </div>
  );
}
