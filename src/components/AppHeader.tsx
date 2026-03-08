"use client";

import Link from "next/link";
import { Zap, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AppHeader() {
    const router = useRouter();

    const handleLogOut = () => {
         // Because there's no actual auth right now, we'll just redirect to the marketing home
         router.push("/");
    };

    return (
        <header className="w-full bg-card border-b border-foreground/5 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/dashboard" className="font-bold text-lg tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center shadow-inner">
                        <Zap className="w-3 h-3 fill-current" />
                    </div>
                    Quazi Dashboard
                </Link>
                
                <button 
                  onClick={handleLogOut}
                  className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-destructive transition-colors px-3 py-2 rounded-lg hover:bg-destructive/10"
                >
                   <LogOut className="w-4 h-4" />
                   <span className="hidden sm:inline">Exit</span>
                </button>
            </div>
        </header>
    );
}
