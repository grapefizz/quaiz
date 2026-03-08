import Link from "next/link";
import { ArrowRight, Zap, Target, BrainCircuit, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
        
       {/* Hero Navigation */}
       <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-foreground/5">
           <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
               <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                       <Zap className="w-4 h-4 fill-current" />
                   </div>
                   Quazi
               </div>
               
               <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                     Login
                  </Link>
                  <Link 
                     href="/dashboard"
                     className="text-sm font-bold bg-foreground text-background px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition-all"
                  >
                     Start Free
                  </Link>
               </div>
           </div>
       </nav>

       <main>
           {/* Hero Section */}
           <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
              {/* Abstract decorative blobs */}
              <div className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-primary/20 mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse-slow pointer-events-none" />
              <div className="absolute top-[30%] right-[15%] w-72 h-72 rounded-full bg-blue-500/20 mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
              
              <div className="max-w-4xl mx-auto text-center relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 border border-primary/20 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Powered by GPT-4o
                 </div>
                 
                 <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
                    <span className="block bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60 mb-2 md:mb-4">Quazi.</span>
                    Learn faster.<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-primary animate-gradient">
                       Fail safer.
                    </span>
                 </h1>
                 
                 <p className="text-xl md:text-2xl text-foreground/60 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                    Transform any document, image, or raw text into a high-octane 20-second blitz quiz. Turn your reading material into active recall instantly.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <Link 
                        href="/dashboard"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)]"
                     >
                        Start your first Quiz <ArrowRight className="w-5 h-5" />
                     </Link>
                     <Link 
                        href="#how-it-works"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-foreground/5 text-foreground font-bold text-lg hover:bg-foreground/10 active:scale-95 transition-all"
                     >
                        See how it works
                     </Link>
                 </div>
              </div>
           </section>

           {/* Features Grid */}
           <section id="how-it-works" className="py-24 bg-card border-y border-foreground/5 px-6">
              <div className="max-w-7xl mx-auto">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">No setup. No prompts.</h2>
                    <p className="text-lg text-foreground/60 font-medium">Just upload and test your knowledge immediately.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <FeatureCard 
                        icon={<BrainCircuit className="w-8 h-8 text-primary" />}
                        title="Instant AI Generation"
                        description="Drag and drop PDFs, images, or raw text. Our engineered AI prompt constructs 10 plausible, challenging multiple-choice questions in under 3 seconds."
                     />
                     <FeatureCard 
                        icon={<Target className="w-8 h-8 text-blue-500" />}
                        title="20-Second Pressure"
                        description="Active recall works best under pressure. You have exactly 20 seconds to read, comprehend, and select your answer before the timer forcibly advances."
                     />
                     <FeatureCard 
                        icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
                        title="Persistent Tracking"
                        description="Every quiz you take is securely logged in your local device history. Watch your scores improve and revisit old quizzes directly from your dashboard."
                     />
                 </div>
              </div>
           </section>
           
           {/* Footer */}
           <footer className="py-12 text-center text-foreground/40 font-medium px-6">
               <p>© {new Date().getFullYear()} Quazi App. All rights reserved.</p>
               <p className="mt-2 text-sm">Empowering students through AI-driven active recall.</p>
           </footer>
       </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-background rounded-3xl p-8 shadow-sm border border-foreground/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-foreground/60 leading-relaxed font-medium">
                {description}
            </p>
        </div>
    )
}
