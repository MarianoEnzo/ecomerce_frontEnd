import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";

const VIDEO_URL =
  "https://res.cloudinary.com/dm8vhezlk/video/upload/v1772470485/4985551-hd_1920_1080_25fps.mp4";

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
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />

      <div className="relative z-10 flex min-h-screen flex-col items-start justify-end px-6 pb-24 lg:px-16 xl:px-24">
        <span className="mb-6 text-[10px] uppercase tracking-widest text-white/40">
          SS 2025 · Streetwear
        </span>

        <h2 className="font-serif text-5xl leading-[0.95] text-white sm:text-6xl lg:text-[88px]">
          WEAR IT.
          <br />
          <span className="italic">MOVE IN IT.</span>
        </h2>

        <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
          Designed for those who let the movement speak. Silence is the loudest
          statement.
        </p>

        <Link
          to="/catalog"
          className="mt-10 inline-flex items-center bg-accent px-8 py-3.5 text-xs uppercase tracking-widest text-white transition-all hover:opacity-75"
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
