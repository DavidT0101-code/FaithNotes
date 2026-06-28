"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileAudio, FileVideo, Loader2, CheckCircle2, X, Sparkles, AlertCircle, BookOpen, Calendar, Brain, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = {
  "audio/mpeg": [".mp3"],
  "audio/wav": [".wav"],
  "video/mp4": [".mp4"],
};

const steps = ["uploading", "transcribing", "analyzing", "done"] as const;
type Step = "idle" | typeof steps[number];

const stepConfig: Record<string, { label: string; detail: string }> = {
  uploading: { label: "Uploading your sermon...", detail: "Securely transferring your file." },
  transcribing: { label: "Transcribing audio...", detail: "Converting speech to text with high accuracy." },
  analyzing: { label: "AI is analyzing the sermon...", detail: "Extracting insights, Bible verses, devotions, and quiz questions." },
  done: { label: "Done! Redirecting...", detail: "Your spiritual growth plan is ready." },
};

const features = [
  { icon: BookOpen, text: "200-word summary + main points + key takeaways" },
  { icon: Target, text: "Action steps for the week" },
  { icon: Sparkles, text: "All Bible verses detected and quoted" },
  { icon: Calendar, text: "6-day personal devotion plan" },
  { icon: Brain, text: "5-question comprehension quiz" },
  { icon: Zap, text: "Daily prayer focus" },
];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("idle");

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) { setFile(accepted[0]); setError(""); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
    onDropRejected: (r) => setError(r[0]?.errors[0]?.message || "File not accepted"),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Please select a file");

    setProcessing(true);
    setError("");
    setStep("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("source_type", file.type.startsWith("audio") ? "audio" : "video");

      setStep("transcribing");
      const res = await fetch("/api/process-sermon", { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Processing failed");
      }

      setStep("analyzing");
      const { sermon_id } = await res.json();
      setStep("done");
      setTimeout(() => router.push(`/sermon/${sermon_id}`), 800);
    } catch (err) {
      setError((err as Error).message);
      setStep("idle");
      setProcessing(false);
    }
  }

  const activeStepIndex = steps.indexOf(step as typeof steps[number]);

  return (
    <div className="p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Upload a Sermon</h1>
        <p className="text-white/40">Upload an audio or video file to generate your personalized devotion plan.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {processing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-12 text-center"
          >
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-violet-500/10 border border-violet-500/20 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                {step === "done" ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                ) : (
                  <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
                )}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {stepConfig[step]?.label || "Processing..."}
            </h2>
            <p className="text-sm text-white/40 mb-8 max-w-xs mx-auto">
              {stepConfig[step]?.detail}
            </p>
            <div className="flex justify-center gap-2">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i < activeStepIndex ? "bg-violet-500/40 w-6" : i === activeStepIndex ? "bg-violet-400 w-10" : "bg-white/10 w-6"
                  )}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {file ? (
              <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                {file.type.startsWith("audio") ? (
                  <FileAudio className="w-8 h-8 text-violet-400 shrink-0" />
                ) : (
                  <FileVideo className="w-8 h-8 text-violet-400 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm text-white">{file.name}</p>
                  <p className="text-xs text-white/40">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <button type="button" onClick={() => setFile(null)} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-300",
                  isDragActive ? "border-violet-500/60 bg-violet-500/8" : "border-white/10 hover:border-violet-500/30 hover:bg-white/3"
                )}
              >
                <input {...getInputProps()} />
                <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} transition={{ type: "spring", bounce: 0.3 }}>
                  <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                </motion.div>
                <p className="font-medium text-white mb-1">
                  {isDragActive ? "Drop it here" : "Drag & drop your sermon file"}
                </p>
                <p className="text-sm text-white/35 mb-3">or click to browse</p>
                <p className="text-xs text-white/25">MP3 · WAV · MP4 · Up to 100MB</p>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="rounded-xl border border-white/8 bg-white/3 p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <Sparkles className="w-4 h-4 text-violet-400" />
                What you&apos;ll get
              </div>
              <ul className="space-y-2">
                {features.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-white/45">
                    <Icon className="w-3.5 h-3.5 text-violet-400/70 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary w-full py-3.5 text-base font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              Process Sermon with AI
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
