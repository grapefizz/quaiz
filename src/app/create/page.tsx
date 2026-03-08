"use client";

import { useState } from "react";
import { UploadCloud, FileType, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";

export default function CreateQuiz() {
  const [isHovering, setIsHovering] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!file) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || "Failed to generate quiz");
      }

      // Store the questions for the quiz page to use
      localStorage.setItem("quiz_questions", JSON.stringify(data.questions));
      
      // Clear any previous results and duplicate prevention flags
      localStorage.removeItem("quiz_results");
      sessionStorage.removeItem("current_quiz_saved");
      
      // Navigate to the quiz
      router.push("/quiz");
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background/50 flex flex-col">
      <AppHeader />
      
      <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-6">
        <div className="text-center mb-10 animate-in slide-in-from-top-4 duration-500">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-6 h-6" />
           </div>
           <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
             Create a New Quiz
           </h1>
           <p className="text-foreground/60 font-medium">
             Upload any document, image, or text to instantly generate a 10-question challenge.
           </p>
        </div>

        <div className="w-full bg-card rounded-3xl p-8 shadow-sm border border-foreground/5 transition-all duration-300 hover:shadow-md animate-in slide-in-from-bottom-8 duration-700">
          <div
            className={cn(
               "relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden group",
               isHovering 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : file 
                  ? "border-primary/50 bg-primary/5" 
                  : "border-foreground/20 hover:border-primary/50 hover:bg-foreground/5 bg-background",
               error && "border-destructive/50 bg-destructive/5"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
            onDragLeave={() => setIsHovering(false)}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,image/*,.txt"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="text-center px-4">
                  <p className="text-lg font-bold text-foreground truncate max-w-[250px] sm:max-w-sm">{file.name}</p>
                  <p className="text-sm font-medium text-foreground/50 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  className="mt-1 text-sm text-destructive hover:underline font-medium px-4 py-2"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-background border border-foreground/5 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                  <FileType className="w-8 h-8 text-foreground/40 group-hover:text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Select a file to upload</h3>
                  <p className="text-foreground/50 text-sm">Drag and drop, or click to browse</p>
                </div>
                <div className="flex gap-2 text-xs font-semibold text-foreground/50 mt-2">
                  <span className="px-3 py-1 rounded-md bg-foreground/5">PDF</span>
                  <span className="px-3 py-1 rounded-md bg-foreground/5">Image</span>
                  <span className="px-3 py-1 rounded-md bg-foreground/5">Text</span>
                </div>
              </div>
            )}
          </div>
          
          {error && (
             <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                {error}
             </div>
          )}
          
          <button
            onClick={handleGenerateQuiz}
            disabled={!file || isGenerating}
            className={cn(
              "w-full mt-6 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300",
              file && !isGenerating
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-0.5 active:scale-95"
                : "bg-foreground/5 text-foreground/40 cursor-not-allowed",
              isGenerating && "bg-primary text-primary-foreground opacity-80 cursor-wait animate-pulse"
            )}
          >
            {isGenerating ? (
              "Generating Questions..."
            ) : (
              <>
                Start Generating <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
