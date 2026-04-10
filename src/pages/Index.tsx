import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE =
  "https://cdn.poehali.dev/projects/6038a985-0abf-4169-a538-8b944a6b2559/files/b577e154-54d0-4adb-b86d-1aa620e5bff3.jpg";

const API_URL = "https://functions.poehali.dev/9001157e-c13b-430a-9b7b-45006fdec995";

const STATIONS = [
  "Москва Казанская",
  "Москва Ярославская",
  "Москва Павелецкая",
  "Москва Курская",
  "Москва Белорусская",
  "Москва Киевская",
  "Санкт-Петербург Главный",
  "Санкт-Петербург Витебский",
];

const STEPS = [
  {
    num: "01",
    icon: "FileText",
    title: "Оставляете заявку",
    desc: "Заполняете форму за 2 минуты. Никаких лишних полей — только то, что нужно.",
  },
  {
    num: "02",
    icon: "CreditCard",
    title: "Оплачиваете онлайн",
    desc: "Безопасная оплата картой. Фиксированная цена — никаких доплат на месте.",
  },
  {
    num: "03",
    icon: "UserCheck",
    title: "Назначаем носильщика",
    desc: "Мгновенно и автоматически. Без звонков и подтверждений с вашей стороны.",
  },
  {
    num: "04",
    icon: "MessageSquare",
    title: "Получаете SMS",
    desc: "Имя и фото специалиста приходят на телефон. Вы знаете, кто вас встретит.",
  },
  {
    num: "05",
    icon: "Luggage",
    title: "Встречаете носильщика у вагона",
    desc: "Специалист ждёт именно у вашего вагона и сопровождает до выхода или автомобиля.",
  },
];

const BENEFITS = [
  {
    icon: "Infinity",
    title: "Нет ограничений по весу",
    desc: "Любое количество мест, любой вес. Чемоданы, коробки, спортивный инвентарь — справимся.",
    tag: "Без ограничений",
  },
  {
    icon: "Zap",
    title: "Заявку не подтверждаем",
    desc: "Вы оплатили — носильщик назначен. Мгновенно. Никаких ожиданий и обратных звонков.",
    tag: "Мгновенно",
  },
  {
    icon: "RotateCcw",
    title: "Полный возврат за 15 минут",
    desc: "Решили отказаться? Деньги вернутся в полном объёме в течение 15 минут. Гарантированно.",
    tag: "Гарантия",
  },
  {
    icon: "Clock",
    title: "Заявка за 15 минут до прибытия",
    desc: "Поезд уже подъезжает? Не проблема — оформить заявку можно прямо сейчас.",
    tag: "Срочно",
  },
];

const TRUST_ITEMS = [
  { icon: "ShieldCheck", text: "Соответствие стандартам РЖД" },
  { icon: "Award", text: "Профессиональная подготовка персонала" },
  { icon: "Lock", text: "Полная конфиденциальность" },
  { icon: "Star", text: "Рейтинг 4.9 / 5 среди клиентов" },
];

export default function Index() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    train_number: "",
    arrival_time: "",
    station: "",
    bags_count: "1",
    notes: "",
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
      setError("Заполните обязательные поля: ФИО, телефон и станцию.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bags_count: parseInt(form.bags_count) }),
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
    "w-full bg-white border border-[#DDD8D0] rounded-lg px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#AAA] focus:outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/30 transition-all";
  const labelCls =
    "block text-xs font-semibold text-[#555] mb-1.5 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#F5F3EF] font-golos text-[#1A1A1A]">

      {/* ═══ NAV ═══ */}
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

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#555]">
            <a href="#how" className="hover:text-[#E31E24] transition-colors">Как работает</a>
            <a href="#benefits" className="hover:text-[#E31E24] transition-colors">Преимущества</a>
            <a href="#order-form" className="hover:text-[#E31E24] transition-colors">Заказать</a>
          </div>

          <button
            onClick={scrollToForm}
            className="bg-[#E31E24] hover:bg-[#C01A1F] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02]"
          >
            Заказать носильщика
          </button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/92 via-[#0D0D0D]/75 to-[#0D0D0D]/30" />
        <div className="absolute top-16 left-0 right-0 h-1 bg-[#E31E24] z-10" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#E31E24] px-4 py-1.5 rounded mb-8">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-[0.15em]">
                Персональный сервис РЖД
              </span>
            </div>

            <h1 className="text-5xl md:text-[64px] font-black text-white leading-[1.0] tracking-tight mb-6">
              Носильщик<br />
              встретит вас<br />
              <span className="text-[#E31E24]">у вагона</span>
            </h1>

            <p className="text-xl text-white/70 leading-relaxed mb-3 max-w-lg">
              Бережная доставка багажа без ограничений по весу — от вагона до автомобиля или выхода
            </p>
            <p className="text-[#E31E24] font-semibold text-sm mb-10 flex items-center gap-2">
              <Icon name="Clock" size={14} className="text-[#E31E24]" />
              Оформить можно за 15 минут до прибытия поезда
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToForm}
                className="bg-[#E31E24] hover:bg-[#C01A1F] text-white font-black px-10 py-4 rounded-xl text-base tracking-wide transition-all duration-200 hover:scale-[1.03] shadow-[0_8px_32px_rgba(227,30,36,0.5)]"
              >
                Заказать сервис
              </button>
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur rounded-xl px-5 py-4">
                <Icon name="ShieldCheck" size={20} className="text-[#E31E24]" />
                <span className="text-white/80 text-sm font-medium">Полный возврат при отмене</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {[
                "✓ Без ограничений по весу",
                "✓ Мгновенное назначение",
                "✓ Возврат за 15 минут",
              ].map((t) => (
                <span key={t} className="text-white/50 text-sm">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E31E24] via-[#C8A96E] to-[#E31E24] opacity-70" />
      </section>

      {/* ═══ КАК РАБОТАЕТ ═══ */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-1 h-14 bg-[#E31E24]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#E31E24] font-bold mb-1">Простой процесс</p>
              <h2 className="text-4xl font-black tracking-tight">Как это работает</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {STEPS.map((step, i) => (
              <div key={i} className="group">
                <div className="flex flex-col items-start lg:items-center text-left lg:text-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#F5F3EF] border-2 border-[#E8E4DF] flex items-center justify-center group-hover:border-[#E31E24] group-hover:bg-[#E31E24]/5 transition-all duration-300">
                      <Icon name={step.icon} size={28} className="text-[#E31E24]" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#E31E24] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-black">{i + 1}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-2 text-sm">{step.title}</h3>
                    <p className="text-[#888] text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#333] text-white font-bold px-10 py-4 rounded-xl text-base transition-all duration-200 hover:scale-[1.02]"
            >
              <span>Оформить заявку сейчас</span>
              <Icon name="ArrowRight" size={18} className="text-white" />
            </button>
            <p className="text-[#AAA] text-xs mt-3">Займёт меньше 2 минут</p>
          </div>
        </div>
      </section>

      {/* ═══ ПРЕИМУЩЕСТВА ═══ */}
      <section id="benefits" className="py-24 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-1 h-14 bg-[#E31E24]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#E31E24] font-bold mb-1">Наши условия</p>
              <h2 className="text-4xl font-black tracking-tight text-white">Почему выбирают нас</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="group relative bg-[#222] border border-white/5 rounded-2xl p-8 hover:border-[#E31E24]/30 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#E31E24]/10 rounded-bl-3xl" />
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#E31E24]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#E31E24]/20 transition-colors">
                    <Icon name={b.icon} size={22} className="text-[#E31E24]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white">{b.title}</h3>
                      <span className="text-[10px] bg-[#E31E24]/20 text-[#E31E24] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
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

      {/* ═══ ДОВЕРИЕ ═══ */}
      <section className="py-14 bg-[#F5F3EF] border-y border-[#E8E4DF]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E4DF] flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} size={18} className="text-[#E31E24]" />
                </div>
                <p className="text-[#555] text-sm font-medium leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ФОРМА ═══ */}
      <section id="order-form" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Левая — текст */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-14 bg-[#E31E24]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#E31E24] font-bold mb-1">Заявка</p>
                  <h2 className="text-4xl font-black tracking-tight leading-tight">Оформить<br />сервис</h2>
                </div>
              </div>

              <p className="text-[#666] mb-8 leading-relaxed">
                Заполните форму — специалист будет назначен автоматически. Никаких звонков и ожиданий.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: "Zap", text: "Мгновенное назначение носильщика" },
                  { icon: "Clock", text: "Можно оформить за 15 минут до прибытия" },
                  { icon: "RotateCcw", text: "Полный возврат в течение 15 минут" },
                  { icon: "Infinity", text: "Любой вес и количество мест" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E31E24]/8 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} size={14} className="text-[#E31E24]" />
                    </div>
                    <span className="text-[#555] text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-[#F5F3EF] border-l-4 border-[#C8A96E] rounded-r-xl">
                <p className="text-[#555] text-sm leading-relaxed italic">
                  «Сервис реализован в соответствии со стандартами РЖД. Персонал проходит подготовку и работает по регламенту.»
                </p>
              </div>
            </div>

            {/* Правая — форма */}
            <div className="lg:col-span-3">
              {success ? (
                <div className="bg-[#F5F3EF] border border-[#E8E4DF] rounded-2xl p-12 text-center">
                  <div className="w-20 h-20 bg-[#E31E24]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="CheckCircle" size={40} className="text-[#E31E24]" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">Заявка принята!</h3>
                  {orderId && (
                    <p className="text-[#E31E24] font-bold mb-3">Номер заявки: №{orderId}</p>
                  )}
                  <p className="text-[#666] leading-relaxed max-w-sm mx-auto">
                    Носильщик назначен автоматически. Вы получите SMS с именем и фото специалиста.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-[#F5F3EF] border border-[#E8E4DF] rounded-2xl p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="md:col-span-2">
                      <label className={labelCls}>
                        ФИО <span className="text-[#E31E24]">*</span>
                      </label>
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
                      <label className={labelCls}>
                        Телефон <span className="text-[#E31E24]">*</span>
                      </label>
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
                      <label className={labelCls}>
                        Станция прибытия <span className="text-[#E31E24]">*</span>
                      </label>
                      <select
                        name="station"
                        value={form.station}
                        onChange={handleChange}
                        className={inputCls}
                        required
                      >
                        <option value="">Выберите вокзал</option>
                        {STATIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Номер поезда</label>
                      <input
                        name="train_number"
                        value={form.train_number}
                        onChange={handleChange}
                        placeholder="002А"
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

                    <div>
                      <label className={labelCls}>Количество мест багажа</label>
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
                        placeholder="Крупногабаритный груз, коляска..."
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mb-5 flex items-center gap-2 text-[#E31E24] bg-[#E31E24]/8 border border-[#E31E24]/20 rounded-lg px-4 py-3 text-sm">
                      <Icon name="AlertCircle" size={16} className="text-[#E31E24] flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#E31E24] hover:bg-[#C01A1F] disabled:opacity-60 text-white font-black py-4 rounded-xl text-base tracking-wide transition-all duration-200 hover:scale-[1.01] shadow-[0_6px_24px_rgba(227,30,36,0.35)] flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Отправляем...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={18} className="text-white" />
                        <span>Оформить заявку</span>
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

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#1A1A1A] py-10 border-t-2 border-[#E31E24]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E31E24] rounded flex items-center justify-center">
              <span className="text-white font-black text-[10px]">РЖД</span>
            </div>
            <span className="text-white/70 text-sm font-medium">Сервис сопровождения багажа</span>
          </div>
          <p className="text-white/25 text-xs text-center">
            © 2024 · Персональный сервис сопровождения · Соответствует стандартам РЖД
          </p>
          <button
            onClick={scrollToForm}
            className="text-[#E31E24] text-xs font-bold border border-[#E31E24]/40 px-4 py-2 rounded-lg hover:border-[#E31E24] hover:bg-[#E31E24]/10 transition-all"
          >
            Заказать →
          </button>
        </div>
      </footer>
    </div>
  );
}
