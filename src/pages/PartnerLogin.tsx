import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/87503926-d030-4509-b7ce-7d101b58eb0c";

export default function PartnerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("partner_auth");
    if (saved) navigate("/partner/dashboard");
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Введите email и пароль");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("partner_auth", JSON.stringify({ token: data.token, user: data.user }));
        navigate("/partner/dashboard");
      } else {
        setError(data.error || "Неверный email или пароль");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#C8A96E]/50 focus:ring-1 focus:ring-[#C8A96E]/20 transition-all";

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-golos text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="w-14 h-14 bg-[#E31E24] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">РЖД</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#C8A96E] rounded-full flex items-center justify-center">
              <span className="text-[9px] text-white font-black">✈</span>
            </div>
          </div>
          <div className="text-center">
            <div className="font-black text-xl leading-none mb-1">PORTER</div>
            <div className="text-[10px] text-white/30 tracking-[0.15em] uppercase">Кабинет партнёра</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/3 border border-white/8 rounded-2xl p-8">
          <div className="w-12 h-12 bg-[#C8A96E]/10 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="Building2" size={22} className="text-[#C8A96E]" />
          </div>
          <h1 className="text-xl font-black mb-1">Вход для партнёров</h1>
          <p className="text-white/35 text-sm mb-6">Банки, турфирмы, консьерж-сервисы</p>

          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@company.ru"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className={inputCls}
                required
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-500/8 border border-red-500/15 rounded-lg px-4 py-3 text-sm">
              <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8A96E] hover:bg-[#A8893E] disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Входим...</span></>
            ) : (
              <><Icon name="LogIn" size={16} className="text-white" /><span>Войти в кабинет</span></>
            )}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full text-center text-white/25 text-xs mt-6 hover:text-white/50 transition-colors"
        >
          ← Вернуться на главную
        </button>
      </div>
    </div>
  );
}
