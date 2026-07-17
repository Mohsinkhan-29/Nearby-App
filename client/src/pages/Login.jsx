import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SLIDE_IMAGE = "https://picsum.photos/seed/nearby-login/800/1400";

// Base URL for your Express API — adjust to match your setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://nearby-app-2u95.onrender.com/api";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Backend should return a signed JWT, e.g.:
      // jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })
      const { token } = data;

      if (!token) {
        throw new Error("No token received from server");
      }

      // Persist the JWT — every future request attaches it as:
      // Authorization: `Bearer ${token}`
      login(data.token, data.user);
      navigate("/discover");

      
    } catch (err) {
      setError(err.message || "Unable to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto h-screen max-w-md overflow-hidden">
      <img
        src={SLIDE_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/20" />

      <div className="absolute inset-x-0 bottom-0 max-h-[85%] overflow-y-auto px-6 pb-10 pt-16">
        <h1 className="font-display text-3xl leading-tight text-paper">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-paper/70">
          {isRegister
            ? "Get started and let us find spots that fit your mood."
            : "Log in to pick up right where you left off."}
        </p>

        {/* Mode toggle */}
        <div className="mt-6 flex rounded-pill bg-paper/10 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-pill py-2 text-sm font-semibold transition-colors ${!isRegister ? "bg-paper text-night" : "text-paper/70"
              }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-pill py-2 text-sm font-semibold transition-colors ${isRegister ? "bg-paper text-night" : "text-paper/70"
              }`}
          >
            Get started
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {isRegister && (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full rounded-pill bg-paper/10 px-5 py-3 text-sm text-paper placeholder:text-paper/50 outline-none focus:bg-paper/20"
            />
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full rounded-pill bg-paper/10 px-5 py-3 text-sm text-paper placeholder:text-paper/50 outline-none focus:bg-paper/20"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded-pill bg-paper/10 px-5 py-3 text-sm text-paper placeholder:text-paper/50 outline-none focus:bg-paper/20"
          />

          {error && (
            <p className="px-2 text-xs font-medium text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-pill bg-gold py-4 text-sm font-semibold text-night transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : isRegister
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-paper/50">
          By continuing you agree to our terms & privacy policy.
        </p>
      </div>
    </div>
  );
}