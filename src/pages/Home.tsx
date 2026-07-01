import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const HERO_IMAGE =
  "https://cdn.poehali.dev/projects/6038a985-0abf-4169-a538-8b944a6b2559/files/b577e154-54d0-4adb-b86d-1aa620e5bff3.jpg";

const FEATURES = [
  { icon: "Infinity", text: "Без ограничений по весу" },
  { icon: "Zap", text: "Назначение мгновенно" },
  { icon: "RotateCcw", text: "Полный возврат за 15 мин" },
  { icon: "ShieldCheck", text: "Стандарты РЖД и IATA" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F3EF] font-golos text-[#1A1A1A]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#E31E24]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E31E24] rounded flex items-center justify-center">
              <span className="text-white font-black text-xs tracking-tight">РЖД</span>
            </div>
            <div className="w-px h-6 bg-[#DDD]" />
            <span className="font-bold text-[15px] text-[#1A1A1A] tracking-tight">
              Сервис сопровождения
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/railway")}
              className="text-sm font-semibold text-[#555] border border-[#DDD] px-4 py-2 rounded-lg hover:border-[#E31E24] hover:text-[#E31E24] transition-all"
            >
              🚆 РЖД / Поезд
            </button>
            <button
              onClick={() => navigate("/airport")}
              className="bg-[#E31E24] hover:bg-[#C01A1F] text-white text-sm font-bold px-4 py-2 rounded-lg transition-all"
            >
              ✈️ Аэропорт
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/85 via-[#0D0D0D]/70 to-[#0D0D0D]/90" />
        <div className="absolute top-16 left-0 right-0 h-1 bg-[#E31E24] z-10" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
          {/* Лейбл */}
          <div className="inline-flex items-center gap-2 bg-[#E31E24] px-4 py-1.5 rounded mb-8">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold uppercase tracking-[0.15em]">
              Профессиональный сервис переноски багажа
            </span>
          </div>

          {/* Заголовок */}
          <h1 className="text-5xl md:text-[68px] font-black text-white leading-[1.0] tracking-tight mb-6 max-w-3xl">
            Ваш багаж —<br />
            наша <span className="text-[#E31E24]">забота</span>
          </h1>
          <p className="text-xl text-white/70 leading-relaxed mb-4 max-w-xl">
            Профессиональные носильщики на вокзалах и в аэропортах России. Встретим у вагона или у выхода из самолёта и доставим до автомобиля.
          </p>
          <p className="text-white/40 text-sm mb-14 max-w-lg">
            Без ожиданий, без очередей — специалист уже ждёт вас в нужном месте
          </p>

          {/* ВЫБОР УСЛУГИ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
            {/* РЖД */}
            <button
              onClick={() => navigate("/railway")}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#E31E24]/60 backdrop-blur rounded-2xl p-7 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(227,30,36,0.2)]"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="ArrowRight" size={18} className="text-[#E31E24]" />
              </div>
              <div className="w-14 h-14 bg-[#E31E24]/15 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#E31E24]/25 transition-colors">
                <span className="text-3xl">🚆</span>
              </div>
              <h2 className="text-xl font-black text-white mb-2">Вокзал / РЖД</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Носильщик встретит вас у вагона и доставит багаж до выхода, такси или зала ожидания
              </p>
              <div className="mt-5 flex items-center gap-2 text-[#E31E24] text-sm font-semibold">
                <span>Выбрать этот сервис</span>
                <Icon name="ChevronRight" size={16} className="text-[#E31E24]" />
              </div>
            </button>

            {/* АЭРОПОРТ */}
            <button
              onClick={() => navigate("/airport")}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#C8A96E]/60 backdrop-blur rounded-2xl p-7 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(200,169,110,0.2)]"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="ArrowRight" size={18} className="text-[#C8A96E]" />
              </div>
              <div className="w-14 h-14 bg-[#C8A96E]/15 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#C8A96E]/25 transition-colors">
                <span className="text-3xl">✈️</span>
              </div>
              <h2 className="text-xl font-black text-white mb-2">Аэропорт</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Встретим у выхода из зоны прилёта, у ленты выдачи или в терминале — и проводим с багажом до авто
              </p>
              <div className="mt-5 flex items-center gap-2 text-[#C8A96E] text-sm font-semibold">
                <span>Выбрать этот сервис</span>
                <Icon name="ChevronRight" size={16} className="text-[#C8A96E]" />
              </div>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E31E24] via-[#C8A96E] to-[#E31E24] opacity-70" />
      </section>

      {/* БЫСТРЫЕ ФАКТЫ */}
      <section className="py-16 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-[#1A1A1A] px-8 py-8 flex flex-col gap-3">
                <div className="w-10 h-10 bg-[#E31E24]/10 rounded-xl flex items-center justify-center">
                  <Icon name={f.icon} size={20} className="text-[#E31E24]" />
                </div>
                <p className="text-white font-semibold text-sm leading-snug">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КАК МЫ РАБОТАЕМ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-1 h-14 bg-[#E31E24]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#E31E24] font-bold mb-1">Одинаково для всех</p>
              <h2 className="text-4xl font-black tracking-tight">Как устроен сервис</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "FileText",
                title: "Оставляете заявку",
                desc: "Выбираете вокзал или аэропорт, указываете время прибытия и количество мест",
              },
              {
                step: "02",
                icon: "UserCheck",
                title: "Получаете специалиста",
                desc: "Носильщик назначается мгновенно — никаких звонков и подтверждений",
              },
              {
                step: "03",
                icon: "Luggage",
                title: "Встречаетесь у точки подачи",
                desc: "Специалист ждёт вас у вагона или у выхода из зоны прилёта с табличкой",
              },
            ].map((item, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-[#E8E4DF] hover:border-[#E31E24] transition-colors group">
                <span className="text-5xl font-black text-[#F0EDE8] group-hover:text-[#E31E24]/15 transition-colors block mb-4">
                  {item.step}
                </span>
                <div className="w-10 h-10 bg-[#E31E24]/8 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={item.icon} size={20} className="text-[#E31E24]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-[#888] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ВЫБОР СНОВА */}
      <section className="py-20 bg-[#F5F3EF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-3 tracking-tight">Выберите ваш тип поездки</h2>
          <p className="text-[#777] mb-10">
            Каждый сервис адаптирован под свою инфраструктуру и точки встречи
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/railway")}
              className="flex items-center justify-center gap-3 bg-[#E31E24] hover:bg-[#C01A1F] text-white font-black px-10 py-4 rounded-xl text-base transition-all hover:scale-[1.03] shadow-[0_6px_24px_rgba(227,30,36,0.3)]"
            >
              <span className="text-xl">🚆</span>
              <span>Вокзал / РЖД</span>
            </button>
            <button
              onClick={() => navigate("/airport")}
              className="flex items-center justify-center gap-3 bg-[#1A1A1A] hover:bg-[#333] text-white font-black px-10 py-4 rounded-xl text-base transition-all hover:scale-[1.03]"
            >
              <span className="text-xl">✈️</span>
              <span>Аэропорт</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] py-10 border-t-2 border-[#E31E24]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E31E24] rounded flex items-center justify-center">
              <span className="text-white font-black text-[10px]">РЖД</span>
            </div>
            <span className="text-white/70 text-sm font-medium">Сервис сопровождения багажа</span>
          </div>
          <p className="text-white/25 text-xs text-center">
            © 2024 · Вокзалы и аэропорты России
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/railway")}
              className="text-white/40 text-xs border border-white/10 px-3 py-1.5 rounded hover:border-[#E31E24]/40 hover:text-[#E31E24] transition-all"
            >
              🚆 РЖД
            </button>
            <button
              onClick={() => navigate("/airport")}
              className="text-white/40 text-xs border border-white/10 px-3 py-1.5 rounded hover:border-[#C8A96E]/40 hover:text-[#C8A96E] transition-all"
            >
              ✈️ Аэропорт
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
