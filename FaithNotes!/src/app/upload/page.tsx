"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, Youtube, FileAudio, FileVideo, Link2, X, Loader2,
  CheckCircle, AlertCircle, ChevronRight, FileText,
} from "lucide-react";
import { getCurrentUser, saveSermon, generateId } from "@/lib/storage";
import { Sermon, ProcessingStatus } from "@/lib/types";
import { extractYouTubeId } from "@/lib/anthropic";

type SourceType = "youtube" | "audio" | "video" | "text";

const STAGES: ProcessingStatus["stage"][] = [
  "uploading", "transcribing", "analyzing", "generating_devotions", "generating_quiz", "complete",
];

const STAGE_LABELS: Record<ProcessingStatus["stage"], string> = {
  uploading: "Uploading sermon...",
  transcribing: "Extracting transcript...",
  analyzing: "Analyzing with AI...",
  generating_devotions: "Generating 6-day devotion plan...",
  generating_quiz: "Creating quiz questions...",
  complete: "Done!",
  error: "Something went wrong",
};

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sourceType, setSourceType] = useState<SourceType>("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [manualTranscript, setManualTranscript] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const [error, setError] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      if (dropped.type.startsWith("audio/")) setSourceType("audio");
      else if (dropped.type.startsWith("video/")) setSourceType("video");
    }
  }, []);

  const simulateProgress = async () => {
    for (let i = 0; i < STAGES.length - 1; i++) {
      setStatus({ stage: STAGES[i], progress: Math.round(((i + 1) / STAGES.length) * 100), message: STAGE_LABELS[STAGES[i]] });
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    }
  };

  const handleProcess = async () => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setError("");

    // Validate
    if (sourceType === "youtube" && !youtubeUrl.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }
    if (sourceType === "youtube") {
      const vid = extractYouTubeId(youtubeUrl);
      if (!vid) { setError("Invalid YouTube URL. Please check and try again."); return; }
    }
    if ((sourceType === "audio" || sourceType === "video") && !file && !manualTranscript.trim()) {
      setError("Please select a file or paste the sermon transcript.");
      return;
    }
    if (sourceType === "text" && manualTranscript.trim().length < 100) {
      setError("Transcript is too short. Please paste the full sermon text.");
      return;
    }

    const progressPromise = simulateProgress();

    const formData = new FormData();
    if (sourceType === "youtube") {
      formData.append("type", "youtube");
      formData.append("url", youtubeUrl);
    } else if (sourceType === "text") {
      formData.append("type", "text");
      formData.append("transcript", manualTranscript);
    } else {
      formData.append("type", sourceType);
      if (file) formData.append("file", file);
      if (manualTranscript) formData.append("transcript", manualTranscript);
    }

    try {
      const res = await fetch("/api/process-sermon", { method: "POST", body: formData });
      const data = await res.json();
      await progressPromise;

      if (!res.ok) {
        if (data.needsTranscript) {
          setShowTranscript(true);
          setStatus(null);
          setError("Please paste the sermon transcript below to continue.");
          return;
        }
        throw new Error(data.error || "Processing failed");
      }

      setStatus({ stage: "complete", progress: 100, message: "Done!" });

      const videoId = sourceType === "youtube" ? extractYouTubeId(youtubeUrl) : null;
      const sermon: Sermon = {
        id: generateId(),
        userId: user.id,
        userName: user.name,
        source: sourceType === "text" ? "audio" : sourceType,
        sourceUrl: sourceType === "youtube" ? youtubeUrl : undefined,
        fileName: file?.name,
        thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined,
        rawTranscript: data.transcript,
        analysis: data.analysis,
        isPublic: false,
        sharedWith: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveSermon(sermon);
      await new Promise((r) => setTimeout(r, 800));
      router.push(`/sermon/${sermon.id}`);
    } catch (err: unknown) {
      await progressPromise.catch(() => {});
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setStatus(null);
    }
  };

  const processing = status !== null && status.stage !== "complete" && status.stage !== "error";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-serif mb-3">Upload a Sermon</h1>
          <p className="text-gray-500 text-lg">Choose your source and we&apos;ll handle the rest.</p>
        </div>

        {/* Source type tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
          {(
            [
              { type: "youtube" as const, icon: Youtube, label: "YouTube" },
              { type: "audio" as const, icon: FileAudio, label: "Audio" },
              { type: "video" as const, icon: FileVideo, label: "Video" },
              { type: "text" as const, icon: FileText, label: "Paste Text" },
            ] as const
          ).map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => { setSourceType(type); setError(""); setFile(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                sourceType === type ? "bg-white shadow-sm text-faith-700" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className="card space-y-6">
          {/* YouTube input */}
          {sourceType === "youtube" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="input pl-10"
                  placeholder="https://youtube.com/watch?v=..."
                  disabled={processing}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Supports regular videos, shorts, and embedded links.</p>
            </div>
          )}

          {/* File upload */}
          {(sourceType === "audio" || sourceType === "video") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {sourceType === "audio" ? "Audio File (MP3, WAV)" : "Video File (MP4)"}
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragging ? "border-faith-400 bg-faith-50" : "border-gray-200 hover:border-faith-300 hover:bg-faith-50/50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={sourceType === "audio" ? ".mp3,.wav,audio/*" : ".mp4,video/mp4"}
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle size={20} className="text-emerald-500" />
                    <span className="font-medium text-gray-700">{file.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Drag & drop or click to upload</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {sourceType === "audio" ? "MP3, WAV up to 100MB" : "MP4 up to 500MB"}
                    </p>
                  </>
                )}
              </div>
              {!showTranscript && (
                <button
                  type="button"
                  onClick={() => setShowTranscript(true)}
                  className="text-sm text-faith-600 mt-3 hover:underline"
                >
                  Or paste transcript manually →
                </button>
              )}
            </div>
          )}

          {/* Manual transcript */}
          {(sourceType === "text" || showTranscript) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {sourceType === "text" ? "Sermon Transcript" : "Paste Transcript (optional)"}
              </label>
              <textarea
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                className="input h-48 resize-none"
                placeholder="Paste the full sermon transcript here..."
                disabled={processing}
              />
              <p className="text-xs text-gray-400 mt-1">{manualTranscript.length} characters</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Progress */}
          {status && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {status.stage === "complete" ? (
                  <CheckCircle size={20} className="text-emerald-500" />
                ) : (
                  <Loader2 size={20} className="text-faith-600 animate-spin" />
                )}
                <span className="font-medium text-gray-700">{status.message}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-faith-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${status.progress}%` }}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {STAGES.slice(0, -1).map((stage, i) => (
                  <div
                    key={stage}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      STAGES.indexOf(status.stage) > i
                        ? "bg-faith-100 text-faith-700"
                        : STAGES.indexOf(status.stage) === i
                        ? "bg-faith-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {STAGE_LABELS[stage]}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          {!processing && status?.stage !== "complete" && (
            <button onClick={handleProcess} className="btn-primary w-full justify-center text-base py-3.5 flex items-center gap-2">
              <Upload size={18} />
              Process Sermon
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
