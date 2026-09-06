"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

type WorkVideoPlayerProps = {
  src: string;
  poster?: string;
  /** Tiny base64 blur-up shown behind the video until its poster (or first
   * frame) has painted over it — same idea as next/image's blurDataURL,
   * applied by hand since a plain <video> has no such placeholder built in. */
  posterBlurDataURL?: string;
  width: number;
  height: number;
  /** Accessible label describing what the video shows — required since the
   * video itself carries no audio track or captions to convey that. */
  ariaLabel: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function WorkVideoPlayer({
  src,
  poster,
  posterBlurDataURL,
  width,
  height,
  ariaLabel,
  className = "",
  style,
}: WorkVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);

  // Dribbble-style: autoplay as soon as it's mounted — but respect a
  // reduced-motion preference by starting paused instead of forcing motion
  // on people who've asked their OS not to show it.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      if (video.duration && !isDraggingRef.current) {
        setProgress(video.currentTime / video.duration);
      }
    };
    const onLoaded = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    // The event may have already fired before this listener attached (e.g.
    // a small local file whose metadata is ready by mount time) — read the
    // value directly too, rather than relying on the event alone.
    if (video.readyState >= 1) setDuration(video.duration);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const seek = (clientX: number) => {
    const video = videoRef.current;
    const bar = barRef.current;
    if (!video || !bar || !video.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    setProgress(ratio);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    seek(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    seek(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const seekBy = (deltaSeconds: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const time = Math.min(
      video.duration,
      Math.max(0, video.currentTime + deltaSeconds)
    );
    video.currentTime = time;
    setProgress(time / video.duration);
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

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={`relative w-full overflow-hidden rounded-2xl bg-bg-secondary ${className}`}
      style={
        posterBlurDataURL
          ? {
              ...style,
              backgroundImage: `url(${posterBlurDataURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : style
      }
    >
      {/* Silent by design: this clip has no audio track, so there's no mute
          control — muted is required for autoplay and stays on permanently. */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="block h-auto w-full"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="flex shrink-0 items-center gap-1 self-end rounded-full bg-bg-tertiary px-4 py-2 transition-colors duration-150 hover:bg-[#525252]"
        >
          <Icon
            name={isPlaying ? "pause" : "play_arrow"}
            aria-hidden
            size={18}
            className="text-text-primary"
          />
          <span className="font-body text-base font-semibold text-text-primary">
            {isPlaying ? "Pause" : "Play"}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div
            ref={barRef}
            data-cursor="hover"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onKeyDown={handleBarKeyDown}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            className="relative flex flex-1 cursor-pointer touch-none items-center py-2"
          >
            <div className="h-1 w-full rounded-full bg-white/25" />
            <div
              className="absolute h-1 rounded-full bg-text-accent"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className={`absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-bg-secondary bg-text-accent transition-transform ${
                isDragging ? "scale-125" : ""
              }`}
              style={{ left: `${progress * 100}%` }}
            />
          </div>
          <p className="whitespace-nowrap font-body text-sm text-text-primary">
            {formatTime(currentTime)}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
