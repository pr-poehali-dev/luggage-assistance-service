import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/9001157e-c13b-430a-9b7b-45006fdec995";

const AIRPORTS = [
  { label: "Москва — Шереметьево (SVO)", value: "Москва Шереметьево (SVO)" },
  { label: "Москва — Домодедово (DME)", value: "Москва Домодедово (DME)" },
  { label: "Москва — Внуково (VKO)", value: "Москва Внуково (VKO)" },
  { label: "Санкт-Петербург — Пулково (LED)", value: "Санкт-Петербург Пулково (LED)" },
  { label: "Сочи — Адлер (AER)", value: "Сочи Адлер (AER)" },
  { label: "Екатеринбург — Кольцово (SVX)", value: "Екатеринбург Кольцово (SVX)" },
  { label: "Новосибирск — Толмачёво (OVB)", value: "Новосибирск Толмачёво (OVB)" },
  { label: "Казань — Казань (KZN)", value: "Казань (KZN)" },
];

const PICKUP_POINTS = [
  "Выход из зоны прилёта (после таможни)",
  "Лента выдачи багажа",
  "Выход из терминала (улица)",
  "Зона прилёта — у информационного табло",
  "Встреча в зале ожидания до регистрации",
  "Парковка / зона высадки",
];

const STEPS = [
  { icon: "FileText", title: "Оставляете заявку", desc: "Указываете рейс, аэропорт и точку встречи" },
  { icon: "CreditCard", title: "Оплачиваете онлайн", desc: "Фиксированная цена — никаких доплат" },
  { icon: "UserCheck", title: "Назначаем специалиста", desc: "Мгновенно, без звонков и подтверждений" },
  { icon: "MessageSquare", title: "Получаете SMS", desc: "Имя и фото носильщика, точка встречи" },
  { icon: "Luggage", title: "Встречаетесь в аэропорту", desc: "Специалист ждёт вас в условленном месте" },
];

const BENEFITS = [
  { icon: "Infinity", title: "Без ограничений по весу", desc: "Чемоданы, спортинвентарь, детские коляски, крупногабарит — справимся с любым грузом.", tag: "Без ограничений" },
  { icon: "Zap", title: "Мгновенное назначение", desc: "Оплатили — специалист назначен. Никаких ожиданий и перезвонов.", tag: "Мгновенно" },
  { icon: "RotateCcw", title: "Полный возврат за 15 минут", desc: "Передумали? Деньги вернём в течение 15 минут. Гарантированно.", tag: "Гарантия" },
  { icon: "Clock", title: "Заявка за 15 минут", desc: "Самолёт уже приземлился? Оформите прямо сейчас — успеем.", tag: "Срочно" },
];

export default function Airport() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    train_number: "",
    arrival_time: "",
    station: "",
    bags_count: "1",
    notes: "",
    pickup_point: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  const scrollToForm = () => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.station) {
      setError("Заполните обязательные поля: ФИО, телефон и аэропорт.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        bags_count: parseInt(form.bags_count),
        notes: [form.notes, form.pickup_point ? `Точка встречи: ${form.pickup_point}` : ""].filter(Boolean).join(". "),
      };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setOrderId(data.order_id);
      } else {
        setError(data.error || "Ошибка при отправке. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка сети. Проверьте интернет и повторите.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white border border-[#DDD8D0] rounded-lg px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#AAA] focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E]/30 transition-all";
  const labelCls =
    "block text-xs font-semibold text-[#555] mb-1.5 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#F5F3EF] font-golos text-[#1A1A1A]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#C8A96E]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#E31E24] rounded flex items-center justify-center">
              <span className="text-white font-black text-xs tracking-tight">РЖД</span>
            </div>
            <div className="w-px h-6 bg-[#DDD]" />
            <span className="font-bold text-[15px] text-[#1A1A1A] tracking-tight">
              Сервис сопровождения
            </span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[#C8A96E]/10 border border-[#C8A96E]/30 px-3 py-1.5 rounded-lg">
              <span className="text-base">✈️</span>
              <span className="text-sm font-bold text-[#A8893E]">Аэропорт</span>
            </div>
            <button
              onClick={() => navigate("/railway")}
              className="text-sm text-[#888] hover:text-[#E31E24] transition-colors flex items-center gap-1.5"
            >
              <span>🚆</span>
              <span>Переключить на РЖД</span>
            </button>
          </div>

          <button
            onClick={scrollToForm}
            className="bg-[#C8A96E] hover:bg-[#A8893E] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all hover:scale-[1.02]"
          >
            Заказать
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[85vh] flex flex-col justify-center pt-16 overflow-hidden bg-[#0D1A2D]">
        {/* Абстрактный фон аэропорта */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1A2D]/95 via-[#0D1A2D]/85 to-[#1A2D1A]/80" />
        <div className="absolute top-16 left-0 right-0 h-1 bg-[#C8A96E] z-10" />

        {/* Декоративная сетка */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#C8A96E] px-4 py-1.5 rounded mb-8">
              <span className="text-white text-xs font-bold uppercase tracking-[0.15em]">
                ✈️ Сервис в аэропортах
              </span>
            </div>

            <h1 className="text-5xl md:text-[64px] font-black text-white leading-[1.0] tracking-tight mb-6">
              Носильщик<br />
              встретит вас<br />
              <span className="text-[#C8A96E]">в аэропорту</span>
            </h1>

            <p className="text-xl text-white/65 leading-relaxed mb-3 max-w-lg">
              Встреча у ленты выдачи, у выхода из зоны прилёта или в любой удобной точке терминала
            </p>
            <p className="text-[#C8A96E] font-semibold text-sm mb-10 flex items-center gap-2">
              <Icon name="Clock" size={14} className="text-[#C8A96E]" />
              Принимаем заявки за 15 минут до посадки
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToForm}
                className="bg-[#C8A96E] hover:bg-[#A8893E] text-white font-black px-10 py-4 rounded-xl text-base tracking-wide transition-all hover:scale-[1.03] shadow-[0_8px_32px_rgba(200,169,110,0.4)]"
              >
                Заказать встречу
              </button>
              <div className="flex items-center gap-3 bg-white/8 border border-white/15 backdrop-blur rounded-xl px-5 py-4">
                <Icon name="ShieldCheck" size={20} className="text-[#C8A96E]" />
                <span className="text-white/70 text-sm font-medium">Полный возврат при отмене</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {["✓ Без ограничений по весу", "✓ 8 аэропортов России", "✓ Возврат за 15 минут"].map((t) => (
                <span key={t} className="text-white/40 text-sm">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C8A96E] via-[#E8C97E] to-[#C8A96E] opacity-60" />
      </section>

      {/* ТОЧКИ ВСТРЕЧИ — блок-изюминка */}
      <section className="py-16 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1 h-12 bg-[#C8A96E]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C8A96E] font-bold mb-1">Гибко под вас</p>
              <h2 className="text-3xl font-black text-white">Где вас встретит носильщик</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PICKUP_POINTS.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#222] border border-white/5 rounded-xl px-5 py-4 hover:border-[#C8A96E]/30 transition-all"
              >
                <div className="w-6 h-6 bg-[#C8A96E]/15 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#C8A96E] text-xs font-black">{i + 1}</span>
                </div>
                <p className="text-white/70 text-sm leading-snug">{point}</p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-6 text-center">
            Точку встречи указываете при заполнении заявки
          </p>
        </div>
      </section>

      {/* КАК РАБОТАЕТ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-1 h-14 bg-[#C8A96E]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C8A96E] font-bold mb-1">Простой процесс</p>
              <h2 className="text-4xl font-black tracking-tight">Как это работает</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="group flex flex-col items-start lg:items-center text-left lg:text-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#F5F3EF] border-2 border-[#E8E4DF] flex items-center justify-center group-hover:border-[#C8A96E] group-hover:bg-[#C8A96E]/5 transition-all duration-300">
                    <Icon name={step.icon} size={28} className="text-[#C8A96E]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#C8A96E] rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">{i + 1}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2 text-sm">{step.title}</h3>
                  <p className="text-[#888] text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 bg-[#C8A96E] hover:bg-[#A8893E] text-white font-bold px-10 py-4 rounded-xl text-base transition-all hover:scale-[1.02]"
            >
              <span>Оформить заявку</span>
              <Icon name="ArrowRight" size={18} className="text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="py-20 bg-[#F5F3EF]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-14 bg-[#C8A96E]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C8A96E] font-bold mb-1">Условия</p>
              <h2 className="text-4xl font-black tracking-tight">Почему выбирают нас</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="group bg-white border border-[#E8E4DF] rounded-2xl p-7 hover:border-[#C8A96E]/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#C8A96E]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#C8A96E]/20 transition-colors">
                    <Icon name={b.icon} size={22} className="text-[#C8A96E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-[#1A1A1A]">{b.title}</h3>
                      <span className="text-[10px] bg-[#C8A96E]/15 text-[#A8893E] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {b.tag}
                      </span>
                    </div>
                    <p className="text-[#888] text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА */}
      <section id="order-form" className={`py-24 relative overflow-hidden transition-colors duration-1000 ${success ? "bg-[#0D1A2D]" : "bg-white"}`}>

        {/* Самолёт — появляется после успешной отправки */}
        {success && (
          <>
            {/* Звёздное небо */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D1A2D] via-[#0A1520] to-[#06100D]" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() > 0.7 ? "2px" : "1px",
                    height: Math.random() > 0.7 ? "2px" : "1px",
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.6 + 0.1,
                    animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            {/* Самолёт, летящий по диагонали */}
            <div
              className="absolute pointer-events-none z-0"
              style={{
                animation: "plane-fly 8s ease-in-out infinite",
                bottom: "15%",
                left: "-10%",
              }}
            >
              <div style={{ transform: "rotate(-15deg)" }}>
                <svg width="180" height="80" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.12 }}>
                  {/* Фюзеляж */}
                  <ellipse cx="90" cy="40" rx="78" ry="10" fill="white"/>
                  {/* Нос */}
                  <path d="M168 40 Q180 40 175 36 L168 33 Z" fill="white"/>
                  {/* Хвост */}
                  <path d="M12 40 Q4 38 6 32 L20 35 Z" fill="white"/>
                  {/* Крылья */}
                  <path d="M80 40 L110 12 L120 14 L100 40 Z" fill="white"/>
                  <path d="M80 40 L110 68 L120 66 L100 40 Z" fill="white"/>
                  {/* Малые крылья хвоста */}
                  <path d="M22 38 L36 28 L40 30 L30 40 Z" fill="white"/>
                  <path d="M22 42 L36 52 L40 50 L30 40 Z" fill="white"/>
                  {/* Иллюминаторы */}
                  <circle cx="120" cy="37" r="3" fill="#0D1A2D" opacity="0.5"/>
                  <circle cx="133" cy="37" r="3" fill="#0D1A2D" opacity="0.5"/>
                  <circle cx="146" cy="37" r="3" fill="#0D1A2D" opacity="0.5"/>
                </svg>
              </div>
            </div>

            {/* Инверсионный след */}
            <div
              className="absolute pointer-events-none z-0"
              style={{
                animation: "plane-fly 8s ease-in-out infinite",
                bottom: "calc(15% + 8px)",
                left: "-20%",
                width: "300px",
                height: "2px",
                background: "linear-gradient(to right, transparent, rgba(200,169,110,0.15), transparent)",
              }}
            />

            {/* Золотая луна */}
            <div className="absolute top-12 right-16 w-20 h-20 rounded-full bg-gradient-to-br from-[#C8A96E]/20 to-[#C8A96E]/5 border border-[#C8A96E]/15 pointer-events-none" />
            <div className="absolute top-10 right-14 w-16 h-16 rounded-full bg-[#0D1A2D]/80 pointer-events-none" style={{ transform: "translate(30%, -15%)" }} />

            <style>{`
              @keyframes plane-fly {
                0%   { transform: translateX(0) translateY(0); }
                50%  { transform: translateX(110vw) translateY(-80px); }
                50.1%{ transform: translateX(-20%) translateY(0); opacity: 0; }
                51%  { opacity: 0; }
                55%  { opacity: 1; transform: translateX(-10%) translateY(0); }
                100% { transform: translateX(0) translateY(0); }
              }
            `}</style>
          </>
        )}

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Левая — текст */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-14 bg-[#C8A96E]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#C8A96E] font-bold mb-1">Заявка</p>
                  <h2 className={`text-4xl font-black tracking-tight leading-tight transition-colors duration-700 ${success ? "text-white" : "text-[#1A1A1A]"}`}>Заказать<br />встречу</h2>
                </div>
              </div>

              <p className={`mb-8 leading-relaxed transition-colors duration-700 ${success ? "text-white/50" : "text-[#666]"}`}>
                Заполните форму — специалист будет назначен автоматически и встретит вас в указанной точке.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: "MapPin", text: "Встреча в любой точке терминала" },
                  { icon: "Zap", text: "Мгновенное назначение носильщика" },
                  { icon: "RotateCcw", text: "Полный возврат в течение 15 минут" },
                  { icon: "Infinity", text: "Любой вес, крупногабарит, коляски" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C8A96E]/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} size={14} className="text-[#C8A96E]" />
                    </div>
                    <span className={`text-sm transition-colors duration-700 ${success ? "text-white/50" : "text-[#555]"}`}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Переключение на РЖД */}
              <div className="p-4 bg-[#F5F3EF] border border-[#E8E4DF] rounded-xl">
                <p className="text-[#888] text-xs mb-3">Едете поездом?</p>
                <button
                  onClick={() => navigate("/railway")}
                  className="flex items-center gap-2 text-[#E31E24] text-sm font-bold hover:underline"
                >
                  <span>🚆</span>
                  <span>Перейти на сервис РЖД →</span>
                </button>
              </div>
            </div>

            {/* Правая — форма */}
            <div className="lg:col-span-3">
              {success ? (
                <div className="bg-white/5 border border-[#C8A96E]/20 rounded-2xl p-12 text-center backdrop-blur-sm">
                  <div className="w-20 h-20 bg-[#C8A96E]/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C8A96E]/20">
                    <Icon name="CheckCircle" size={40} className="text-[#C8A96E]" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-white">Заявка принята!</h3>
                  {orderId && (
                    <p className="text-[#C8A96E] font-bold mb-3">Номер заявки: №{orderId}</p>
                  )}
                  <p className="text-white/50 leading-relaxed max-w-sm mx-auto">
                    Специалист назначен автоматически. Вы получите SMS с именем и точкой встречи.
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-2 text-white/20 text-xs">
                    <div className="w-1.5 h-1.5 bg-[#C8A96E] rounded-full animate-pulse" />
                    Приятного полёта
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-[#F5F3EF] border border-[#E8E4DF] rounded-2xl p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="md:col-span-2">
                      <label className={labelCls}>ФИО <span className="text-[#C8A96E]">*</span></label>
                      <input
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder="Иванов Иван Иванович"
                        className={inputCls}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Телефон <span className="text-[#C8A96E]">*</span></label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+7 900 000 00 00"
                        className={inputCls}
                        type="tel"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="ivan@example.com"
                        className={inputCls}
                        type="email"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelCls}>Аэропорт <span className="text-[#C8A96E]">*</span></label>
                      <select
                        name="station"
                        value={form.station}
                        onChange={handleChange}
                        className={inputCls}
                        required
                      >
                        <option value="">Выберите аэропорт</option>
                        {AIRPORTS.map((a) => (
                          <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Номер рейса</label>
                      <input
                        name="train_number"
                        value={form.train_number}
                        onChange={handleChange}
                        placeholder="SU 1234 / S7 256"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Время прибытия</label>
                      <input
                        name="arrival_time"
                        value={form.arrival_time}
                        onChange={handleChange}
                        className={inputCls}
                        type="datetime-local"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelCls}>Точка встречи</label>
                      <select
                        name="pickup_point"
                        value={form.pickup_point}
                        onChange={handleChange}
                        className={inputCls}
                      >
                        <option value="">Выберите место встречи</option>
                        {PICKUP_POINTS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Количество мест</label>
                      <select
                        name="bags_count"
                        value={form.bags_count}
                        onChange={handleChange}
                        className={inputCls}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "место" : n < 5 ? "места" : "мест"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Примечания</label>
                      <input
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Коляска, негабаритный груз..."
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mb-5 flex items-center gap-2 text-[#A8893E] bg-[#C8A96E]/8 border border-[#C8A96E]/20 rounded-lg px-4 py-3 text-sm">
                      <Icon name="AlertCircle" size={16} className="text-[#C8A96E] flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C8A96E] hover:bg-[#A8893E] disabled:opacity-60 text-white font-black py-4 rounded-xl text-base transition-all hover:scale-[1.01] shadow-[0_6px_24px_rgba(200,169,110,0.35)] flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Отправляем...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={18} className="text-white" />
                        <span>Заказать встречу в аэропорту</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-[#AAA] mt-4">
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D1A2D] py-10 border-t-2 border-[#C8A96E]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✈️</span>
            <span className="text-white/70 text-sm font-medium">Сервис сопровождения в аэропортах</span>
          </div>
          <p className="text-white/20 text-xs text-center">
            © 2024 · 8 аэропортов России · Без ограничений по весу
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-white/40 text-xs border border-white/10 px-3 py-1.5 rounded hover:border-white/30 transition-all"
            >
              ← На главную
            </button>
            <button
              onClick={() => navigate("/railway")}
              className="text-white/40 text-xs border border-white/10 px-3 py-1.5 rounded hover:border-[#E31E24]/40 hover:text-[#E31E24] transition-all"
            >
              🚆 РЖД
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}