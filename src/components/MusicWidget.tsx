"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Music2, X } from "lucide-react";

type MusicWidgetProps = {
  src?: string;
  cover?: string;
  title?: string;
  artist?: string;
  className?: string;
  onClose?: () => void;
  autoFocus?: boolean;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function MusicWidget({
  src = "/audio/track.mp3",
  cover = "/images/GNOME - Vestiges of Verumex Visidrome.jpg",
  title = "The Ogre",
  artist = "Gnome",
  className = "",
  onClose,
  autoFocus = false,
}: MusicWidgetProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (autoFocus) playButtonRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnd = () => setIsPlaying(false);
    const onError = () => setReady(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setReady(false));
      setIsPlaying(true);
    }
  };

  const seek = (clientX: number) => {
    const audio = audioRef.current;
    const bar = barRef.current;
    if (!audio || !bar || !audio.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  };

  const seekBy = (deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const time = Math.min(
      audio.duration,
      Math.max(0, audio.currentTime + deltaSeconds)
    );
    audio.currentTime = time;
    setProgress(time / audio.duration);
  };

  const handleBarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        seekBy(5);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        seekBy(-5);
        break;
      case "Home":
        e.preventDefault();
        seekBy(-Infinity);
        break;
      case "End":
        e.preventDefault();
        seekBy(Infinity);
        break;
    }
  };

  const currentTime = (progress || 0) * (duration || 0);

  // TEST 2: full visual layout, no <audio> element mounted.
  return (
    <div
      role="region"
      aria-label="Music player"
      className={`relative flex w-[338px] flex-col gap-0.5 rounded-2xl border border-border-secondary bg-bg-secondary p-1.5 shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_0px_rgba(0,0,0,0.3)] ${className}`}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close music player"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-bg-tertiary text-text-primary transition-colors hover:bg-[#525252]"
        >
          <X aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      )}

      <div className="flex flex-1 items-center gap-3">
        <div className="relative aspect-square h-16 shrink-0 overflow-hidden rounded-xl bg-bg-tertiary">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-secondary">
              <Music2 aria-hidden className="h-6 w-6" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5">
          <p className="w-full truncate font-body text-lg font-semibold text-text-primary">
            {title}
          </p>
          <p className="w-full truncate font-body text-sm text-text-secondary">
            {artist}
          </p>
        </div>

        <button
          ref={playButtonRef}
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex shrink-0 items-center gap-1 rounded-full bg-bg-tertiary px-4 py-2 transition-colors duration-150 hover:bg-[#525252] disabled:opacity-40"
        >
          {isPlaying ? (
            <Pause
              aria-hidden
              className="h-4 w-4 text-text-primary"
              fill="currentColor"
            />
          ) : (
            <Play
              aria-hidden
              className="h-4 w-4 text-text-primary"
              fill="currentColor"
            />
          )}
          <span className="font-body text-base font-semibold text-text-primary">
            {isPlaying ? "Pause" : "Play"}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3 px-2.5">
        <div
          ref={barRef}
          onClick={(e) => seek(e.clientX)}
          onKeyDown={handleBarKeyDown}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration) || 0}
          aria-valuenow={Math.round(currentTime)}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          className="relative flex flex-1 cursor-pointer items-center py-2"
        >
          <div className="h-1 w-full rounded-full bg-bg-tertiary" />
          <div
            className="absolute h-1 rounded-full bg-text-accent"
            style={{ width: `${progress * 100}%` }}
          />
          <div
            className="absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-bg-secondary bg-text-accent"
            style={{ left: `${progress * 100}%` }}
          />
        </div>
        <p className="whitespace-nowrap font-body text-sm text-text-primary">
          {formatTime(currentTime)}
        </p>
      </div>
    </div>
  );
}
