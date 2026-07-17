import { useNavigate } from "react-router-dom";

const SLIDE_IMAGE = "https://picsum.photos/seed/nearby-pool/800/1400";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto h-screen max-w-md overflow-hidden">
      <img
        src={SLIDE_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 pt-24">
        <h1 className="font-display text-4xl leading-tight text-paper">
          Discover amazing
          <br />
          nearby spots
        </h1>
        <p className="mt-3 text-sm text-paper/70">
          Skip the endless scrolling — pick a mood and let us find the place
          that fits it, wherever you are.
        </p>

        <div className="mt-6 flex gap-1.5">
          <span className="h-1.5 w-6 rounded-pill bg-gold" />
          <span className="h-1.5 w-1.5 rounded-pill bg-paper/40" />
          <span className="h-1.5 w-1.5 rounded-pill bg-paper/40" />
        </div>

        <button
          onClick={() => navigate("/Login")}
          className="mt-8 w-full rounded-pill bg-paper py-4 text-sm font-semibold text-night transition-transform active:scale-[0.98]"
        >
          Get started
        </button>
      </div>
    </div>
  );
}
