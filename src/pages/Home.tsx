import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SPLIT_IMAGE =
  "https://cdn.poehali.dev/projects/6038a985-0abf-4169-a538-8b944a6b2559/files/2006f593-d699-428e-9704-04b85551d0e6.jpg";

const STATS = [
  { value: "8", label: "аэропортов" },
  { value: "12", label: "вокзалов" },
  { value: "15 мин", label: "до прибытия" },
  { value: "4.9★", label: "средний рейтинг" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-golos text-white overflow-x-hidden">

      {/* ══════════ NAV ══════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: "68px" }}>
          {/* Логотип */}
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 bg-[#E31E24] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-[11px] tracking-tight">РЖД</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#C8A96E] rounded-full flex items-center justify-center">
                <span className="text-[6px] text-white font-black">✈</span>
              </div>
            </div>
            <div>
              <div className="font-black text-white text-[15px] leading-none tracking-tight">PORTER</div>
              <div className="text-[10px] text-white/30 tracking-[0.15em] uppercase">Concierge Service</div>
            </div>
          </button>

          {/* Центр — переключатели */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
            <button
              onClick={() => navigate("/railway")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all"
            >
              <span>🚆</span>
              <span className="font-medium">РЖД / Вокзал</span>
            </button>
            <div className="w-px h-5 bg-white/10" />
            <button
              onClick={() => navigate("/airport")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all"
            >
              <span>✈️</span>
              <span className="font-medium">Аэропорт</span>
            </button>
          </div>

          {/* Кабинет */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 border border-white/15 hover:border-[#C8A96E]/50 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-[#C8A96E] transition-all"
          >
            <Icon name="User" size={15} className="text-current" />
            <span>Личный кабинет</span>
          </button>
        </div>
      </nav>

      {/* ══════════ HERO — SPLIT ══════════ */}
      <section className="relative min-h-screen flex flex-col" style={{ paddingTop: "68px" }}>

        {/* Фоновое изображение */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SPLIT_IMAGE})`, top: "68px" }}
        />

        {/* Общий оверлей */}
        <div className="absolute inset-0 bg-[#0A0A0A]/60" style={{ top: "68px" }} />

        {/* Золотая вертикальная линия-разделитель */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[68px] bottom-0 w-px z-20 hidden lg:block">
          <div className="h-full bg-gradient-to-b from-transparent via-[#C8A96E]/60 to-transparent" />
          {/* Центральная эмблема */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#0A0A0A] border border-[#C8A96E]/40 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#C8A96E] rounded-full" />
          </div>
        </div>

        {/* Контент */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-68px)]">

          {/* ══ ЛЕВАЯ — АВИА ══ */}
          <div
            className="flex-1 flex flex-col justify-between p-10 lg:p-16 group cursor-pointer relative overflow-hidden"
            onClick={() => navigate("/airport")}
          >
            {/* Тонкий золотой оверлей при hover */}
            <div className="absolute inset-0 bg-[#C8A96E]/0 group-hover:bg-[#C8A96E]/5 transition-all duration-700" />

            <div className="relative z-10">
              {/* Лейбл */}
              <div className="inline-flex items-center gap-2 bg-[#C8A96E]/15 border border-[#C8A96E]/30 px-4 py-2 rounded-full mb-10">
                <span className="text-lg">✈️</span>
                <span className="text-[#C8A96E] text-xs font-bold uppercase tracking-[0.2em]">Авиа — Аэропорты</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
                Встреча<br />в<br />
                <span className="text-[#C8A96E]">аэропорту</span>
              </h2>

              <p className="text-white/50 text-base leading-relaxed max-w-sm mb-8">
                Носильщик ждёт у ленты выдачи или у выхода из зоны прилёта. Доставим до авто или такси.
              </p>

              {/* Мини-список */}
              <div className="space-y-2.5">
                {[
                  "8 аэропортов России",
                  "Встреча в любой точке терминала",
                  "Приём заявок за 15 минут",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-white/40 text-sm">
                    <div className="w-1 h-1 bg-[#C8A96E] rounded-full flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA снизу */}
            <div className="relative z-10 mt-16">
              <div className="inline-flex items-center gap-3 bg-[#C8A96E] group-hover:bg-[#A8893E] text-white font-black px-8 py-4 rounded-xl text-sm tracking-wide transition-all duration-300 group-hover:scale-[1.02] shadow-[0_8px_32px_rgba(200,169,110,0.3)] group-hover:shadow-[0_12px_48px_rgba(200,169,110,0.5)]">
                <span>Заказать в аэропорту</span>
                <Icon name="ArrowRight" size={16} className="text-white group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-white/20 text-xs mt-3">Шереметьево, Домодедово, Внуково, Пулково...</p>
            </div>
          </div>

          {/* ══ ПРАВАЯ — РЖД ══ */}
          <div
            className="flex-1 flex flex-col justify-between p-10 lg:p-16 group cursor-pointer relative overflow-hidden"
            onClick={() => navigate("/railway")}
          >
            {/* Красный оверлей при hover */}
            <div className="absolute inset-0 bg-[#E31E24]/0 group-hover:bg-[#E31E24]/5 transition-all duration-700" />

            <div className="relative z-10">
              {/* Лейбл */}
              <div className="inline-flex items-center gap-2 bg-[#E31E24]/15 border border-[#E31E24]/30 px-4 py-2 rounded-full mb-10">
                <span className="text-lg">🚆</span>
                <span className="text-[#E31E24] text-xs font-bold uppercase tracking-[0.2em]">РЖД — Вокзалы</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
                Встреча<br />у<br />
                <span className="text-[#E31E24]">вагона</span>
              </h2>

              <p className="text-white/50 text-base leading-relaxed max-w-sm mb-8">
                Носильщик встречает прямо у вашего вагона и сопровождает до выхода, зала ожидания или автомобиля.
              </p>

              <div className="space-y-2.5">
                {[
                  "12 вокзалов Москвы и регионов",
                  "Встреча у вашего вагона",
                  "Без ограничений по весу",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-white/40 text-sm">
                    <div className="w-1 h-1 bg-[#E31E24] rounded-full flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-16">
              <div className="inline-flex items-center gap-3 bg-[#E31E24] group-hover:bg-[#C01A1F] text-white font-black px-8 py-4 rounded-xl text-sm tracking-wide transition-all duration-300 group-hover:scale-[1.02] shadow-[0_8px_32px_rgba(227,30,36,0.3)] group-hover:shadow-[0_12px_48px_rgba(227,30,36,0.5)]">
                <span>Заказать на вокзале</span>
                <Icon name="ArrowRight" size={16} className="text-white group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-white/20 text-xs mt-3">Казанский, Ярославский, Павелецкий...</p>
            </div>
          </div>
        </div>

        {/* Заголовок поверх — центральный оверлей */}
        <div className="absolute top-[68px] left-0 right-0 z-30 pointer-events-none">
          <div className="flex flex-col items-center pt-12 pb-6">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-4">
              <div className="w-1.5 h-1.5 bg-[#C8A96E] rounded-full animate-pulse" />
              <span className="text-white/60 text-xs uppercase tracking-[0.2em]">Премиальный сервис сопровождения</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white text-center tracking-tight">
              Ваш багаж — <span className="text-[#C8A96E]">наша забота</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="bg-[#0D0D0D] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {STATS.map((s, i) => (
              <div key={i} className="px-10 py-10 text-center group hover:bg-white/2 transition-colors">
                <div className="text-3xl font-black text-white mb-1 group-hover:text-[#C8A96E] transition-colors">{s.value}</div>
                <div className="text-white/30 text-xs uppercase tracking-[0.15em]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ОБЩИЕ ПРЕИМУЩЕСТВА ══════════ */}
      <section className="py-28 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[#C8A96E] text-xs uppercase tracking-[0.25em] mb-3">Единый стандарт</p>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Одинаково для всех направлений</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "Infinity", title: "Без ограничений по весу", desc: "Любой груз, любое количество мест" },
              { icon: "Zap", title: "Мгновенное назначение", desc: "Без звонков и подтверждений с вашей стороны" },
              { icon: "RotateCcw", title: "Возврат за 15 минут", desc: "Полная сумма, без вопросов и формальностей" },
              { icon: "Lock", title: "Конфиденциальность", desc: "Данные клиентов под защитой. Всегда." },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-white/3 border border-white/6 rounded-2xl p-7 hover:border-white/12 hover:bg-white/5 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#C8A96E]/5 rounded-bl-3xl" />
                <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#C8A96E]/10 transition-colors">
                  <Icon name={item.icon} size={20} className="text-[#C8A96E]" />
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
                <p className="text-white/35 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ЛИЧНЫЙ КАБИНЕТ ПРОМО ══════════ */}
      <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 bg-gradient-to-r from-white/3 to-white/1 border border-white/8 rounded-3xl p-10 lg:p-14 relative overflow-hidden">
            {/* Декор */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#C8A96E]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-2 bg-[#C8A96E]/10 border border-[#C8A96E]/20 px-4 py-1.5 rounded-full mb-6">
                <Icon name="User" size={12} className="text-[#C8A96E]" />
                <span className="text-[#C8A96E] text-xs font-bold uppercase tracking-[0.15em]">Личный кабинет</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">
                Все заказы —<br />в одном месте
              </h2>
              <p className="text-white/40 leading-relaxed text-sm">
                История поездок, статус оплаты, персональные данные и уникальный ID клиента. Войдите по email, чтобы увидеть все свои заказы.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 bg-[#C8A96E] hover:bg-[#A8893E] text-white font-black px-10 py-4 rounded-xl text-base transition-all hover:scale-[1.03] shadow-[0_6px_24px_rgba(200,169,110,0.3)]"
              >
                <Icon name="LayoutDashboard" size={18} className="text-white" />
                <span>Открыть кабинет</span>
              </button>
              <p className="text-white/20 text-xs">Войти по email без пароля</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="bg-[#050505] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-[#E31E24] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-[10px]">РЖД</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#C8A96E] rounded-full flex items-center justify-center">
                <span className="text-[5px] text-white font-black">✈</span>
              </div>
            </div>
            <div>
              <div className="text-white font-black text-sm">PORTER</div>
              <div className="text-white/25 text-[10px] tracking-[0.1em]">Concierge Service</div>
            </div>
          </div>
          <p className="text-white/15 text-xs">© 2024 · Сервис сопровождения на вокзалах и в аэропортах</p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/railway")} className="text-white/30 text-xs border border-white/8 px-3 py-1.5 rounded-lg hover:border-[#E31E24]/40 hover:text-[#E31E24] transition-all">🚆 РЖД</button>
            <button onClick={() => navigate("/airport")} className="text-white/30 text-xs border border-white/8 px-3 py-1.5 rounded-lg hover:border-[#C8A96E]/40 hover:text-[#C8A96E] transition-all">✈️ Аэропорт</button>
            <button onClick={() => navigate("/dashboard")} className="text-white/30 text-xs border border-white/8 px-3 py-1.5 rounded-lg hover:border-white/20 hover:text-white transition-all">👤 Кабинет</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
