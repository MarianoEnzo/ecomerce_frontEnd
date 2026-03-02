import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";

const VIDEO_URL =
  "https://media.istockphoto.com/id/1450642470/video/fitness-city-and-man-running-on-bridge-training-in-a-cardio-exercise-or-workout-for-a-sports.mp4?s=mp4-640x640-is&k=20&c=N6XYqvxVKmGXGYIvOGXTVpf_oPku7owT0DKRYjUgz8E=";

export default function EditorialBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center lg:px-8">
        <span className="mb-6 text-[10px] uppercase tracking-widest text-white/40">
          SS 2025 · Limited Edition
        </span>

        <h2 className="font-serif text-5xl leading-[1.0] text-white sm:text-6xl lg:text-[80px]">
          QUALITY OVER
          <br />
          <span className="italic">EVERYTHING</span>
        </h2>

        <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
          Every piece crafted with premium materials and meticulous attention to
          detail. Built to last, designed to transcend seasons.
        </p>

        <Link
          to="/catalog"
          className="mt-10 inline-flex items-center border border-white/30 px-8 py-3.5 text-xs uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
        >
          Shop the Collection
        </Link>
      </div>

      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-10 flex h-9 w-9 items-center justify-center border border-white/20 text-white/50 transition-colors hover:border-white/50 hover:text-white"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <VolumeX className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <Volume2 className="h-4 w-4" strokeWidth={1.5} />
        )}
      </button>
    </section>
  );
}
