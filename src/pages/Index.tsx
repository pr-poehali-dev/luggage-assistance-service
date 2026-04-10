import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE =
  "https://cdn.poehali.dev/projects/6038a985-0abf-4169-a538-8b944a6b2559/files/b577e154-54d0-4adb-b86d-1aa620e5bff3.jpg";

const STATIONS = [
  "Москва Казанская",
  "Москва Ярославская",
  "Москва Павелецкая",
  "Москва Курская",
  "Москва Белорусская",
  "Москва Киевская",
  "Санкт-Петербург Главный",
  "Санкт-Петербург Витебский",
  "Новосибирск Главный",
  "Екатеринбург Пассажирский",
];

const PORTERS = [
  {
    name: "Алексей Громов",
    rating: 4.9,
    reviews: 312,
    orders: 1240,
    badge: "Топ-носильщик",
  },
  {
    name: "Дмитрий Павлов",
    rating: 4.8,
    reviews: 218,
    orders: 890,
    badge: "Проверенный",
  },
  {
    name: "Сергей Новиков",
    rating: 4.7,
    reviews: 145,
    orders: 620,
    badge: "Проверенный",
  },
];

const STEPS = [
  { icon: "ClipboardList", title: "Оставьте заявку", desc: "Заполните форму за 2 минуты" },
  { icon: "MapPin", title: "Укажите детали", desc: "Вокзал, время и количество мест" },
  { icon: "CreditCard", title: "Оплатите онлайн", desc: "Фиксированная цена, без доплат" },
  { icon: "UserCheck", title: "Получите носильщика", desc: "Вам назначат проверенного сотрудника" },
  { icon: "Luggage", title: "Встреча на вокзале", desc: "Носильщик встретит вас в условленном месте" },
];

const BENEFITS = [
  { icon: "Clock", title: "Экономия времени", desc: "Не нужно искать помощника на месте — он уже ждёт вас" },
  { icon: "Tag", title: "Фиксированная цена", desc: "Цена известна заранее, никаких скрытых доплат" },
  { icon: "ShieldCheck", title: "Проверенные сотрудники", desc: "Каждый носильщик прошёл проверку и обучение" },
  { icon: "Dumbbell", title: "Тяжёлый багаж — не проблема", desc: "Справимся с чемоданами, сумками и крупногабаритом" },
];

const CONDITIONS = [
  { icon: "Package", label: "До 6 мест багажа" },
  { icon: "Weight", label: "Максимум 50 кг суммарно" },
  { icon: "Bell", label: "Заявка минимум за 2 часа" },
  { icon: "Navigation", label: "Встреча у главного входа" },
  { icon: "Train", label: "10 вокзалов Москвы и СПб" },
];

const FAQS = [
  {
    q: "Что если мой поезд опаздывает?",
    a: "Носильщик отслеживает актуальное расписание. Если поезд задерживается — он скорректирует время прибытия автоматически.",
  },
  {
    q: "Как происходит встреча?",
    a: "После оплаты вы получите имя, фото носильщика и место встречи на вокзале. Он будет держать табличку с вашим именем.",
  },
  {
    q: "Можно отменить заказ?",
    a: "Да, бесплатная отмена возможна за 4 часа до назначенного времени. После — возвращается 50% стоимости.",
  },
  {
    q: "Какие вокзалы обслуживаются?",
    a: "Все крупные вокзалы Москвы и Санкт-Петербурга. Список расширяется — уточняйте при заказе.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= Math.round(rating) ? "text-[#D62B2B]" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function MiniOrderForm() {
  const [station, setStation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <form
      className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4 w-full max-w-md"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Вокзал
        </label>
        <select
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-gray-50"
          value={station}
          onChange={(e) => setStation(e.target.value)}
        >
          <option value="">Выберите вокзал</option>
          {STATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Дата
          </label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-gray-50"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Время
          </label>
          <input
            type="time"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-gray-50"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-[#D62B2B] hover:bg-[#b71c1c] text-white font-bold py-4 rounded-xl transition-all duration-200 text-base tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100"
      >
        Заказать носильщика
      </button>
      <p className="text-center text-xs text-gray-400">
        Фиксированная цена · Без предоплаты
      </p>
    </form>
  );
}

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    station: "",
    date: "",
    time: "",
    bags: "1",
    name: "",
    phone: "",
    comment: "",
  });

  const scrollToForm = () => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-golos text-gray-900">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D62B2B] rounded-lg flex items-center justify-center">
              <Icon name="Luggage" size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              РЖД<span className="text-[#D62B2B]">Носильщик</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#how" className="hover:text-[#D62B2B] transition-colors">Как работает</a>
            <a href="#porters" className="hover:text-[#D62B2B] transition-colors">Носильщики</a>
            <a href="#faq" className="hover:text-[#D62B2B] transition-colors">Вопросы</a>
          </div>
          <button
            onClick={scrollToForm}
            className="bg-[#D62B2B] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#b71c1c] transition-all"
          >
            Заказать
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-[#D62B2B]/20 border border-[#D62B2B]/40 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 bg-[#D62B2B] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-red-200">Официальный сервис на вокзалах РЖД</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-6 tracking-tight">
                Переноска багажа<br />
                <span className="text-[#D62B2B]">на вокзалах РЖД</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Безопасно, быстро и без очередей. Носильщик встретит вас точно в нужное время.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { icon: "ShieldCheck", text: "Проверенные сотрудники" },
                  { icon: "Tag", text: "Фиксированная цена" },
                  { icon: "Clock", text: "Без ожидания" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-gray-300 text-sm">
                    <Icon name={item.icon} size={16} className="text-[#D62B2B]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollToForm}
                className="bg-[#D62B2B] hover:bg-[#b71c1c] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-2xl"
              >
                Заказать носильщика →
              </button>
            </div>
            <div className="w-full lg:w-auto">
              <MiniOrderForm />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#D62B2B] text-sm font-bold uppercase tracking-widest">Просто и понятно</span>
            <h2 className="text-4xl font-black mt-2 tracking-tight">Как это работает</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 z-0" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border-2 border-gray-100 group-hover:border-[#D62B2B] shadow-md flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-lg">
                  <Icon name={step.icon} size={24} className="text-[#D62B2B]" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#D62B2B] rounded-full flex items-center justify-center text-white text-xs font-black">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-bold text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#D62B2B] text-sm font-bold uppercase tracking-widest">Почему выбирают нас</span>
            <h2 className="text-4xl font-black mt-2 tracking-tight">Преимущества сервиса</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-[#D62B2B]/30 hover:shadow-xl transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 bg-[#D62B2B]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D62B2B] transition-all duration-300">
                  <Icon
                    name={b.icon}
                    size={22}
                    className="text-[#D62B2B] group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="font-bold text-base mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONDITIONS */}
      <section className="py-16 bg-[#D62B2B]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight">Условия оказания услуги</h2>
            <p className="text-red-200 mt-2">Важно знать перед заказом</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {CONDITIONS.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-3"
              >
                <Icon name={c.icon} size={18} className="text-white" />
                <span className="text-white font-semibold text-sm">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTERS / RATINGS */}
      <section id="porters" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#D62B2B] text-sm font-bold uppercase tracking-widest">Рейтинг сотрудников</span>
            <h2 className="text-4xl font-black mt-2 tracking-tight">Наши носильщики</h2>
            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              Каждый сотрудник проходит проверку. После поездки клиенты оставляют оценку.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTERS.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-400">
                    {p.name[0]}
                  </div>
                  <span className="text-xs font-bold bg-[#D62B2B]/10 text-[#D62B2B] px-3 py-1 rounded-full">
                    {p.badge}
                  </span>
                </div>
                <h3 className="font-black text-lg mb-1">{p.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={p.rating} />
                  <span className="font-bold text-sm">{p.rating}</span>
                  <span className="text-xs text-gray-400">({p.reviews} отзывов)</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Icon name="Package" size={12} className="text-gray-400" />
                  <span>{p.orders.toLocaleString()} выполненных заказов</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Icon name="CheckCircle" size={12} />
                    <span>Доступен сегодня</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">
            Конкретного носильщика вы получите после оформления заказа
          </p>
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order-form" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#D62B2B] text-sm font-bold uppercase tracking-widest">Оформление</span>
            <h2 className="text-4xl font-black mt-2 tracking-tight">Заказать носильщика</h2>
            <p className="text-gray-500 mt-3">Заполните форму — мы свяжемся с вами для подтверждения</p>
          </div>
          <form
            className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Вокзал *
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-white"
                value={formData.station}
                onChange={(e) => setFormData({ ...formData, station: e.target.value })}
              >
                <option value="">Выберите вокзал</option>
                {STATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Дата *
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-white"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Время *
                </label>
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-white"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Количество мест багажа *
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-white"
                value={formData.bags}
                onChange={(e) => setFormData({ ...formData, bags: e.target.value })}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "место" : n < 5 ? "места" : "мест"}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-white placeholder:text-gray-300"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-white placeholder:text-gray-300"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Комментарий
              </label>
              <textarea
                rows={3}
                placeholder="Особые пожелания, описание багажа..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D62B2B] bg-white placeholder:text-gray-300 resize-none"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#D62B2B] hover:bg-[#b71c1c] text-white font-black py-4 rounded-xl text-lg transition-all hover:scale-[1.02] active:scale-100 shadow-lg"
            >
              Оформить заказ
            </button>
            <p className="text-center text-xs text-gray-400">
              Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
            </p>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#D62B2B] text-sm font-bold uppercase tracking-widest">Частые вопросы</span>
            <h2 className="text-4xl font-black mt-2 tracking-tight">FAQ</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-gray-900 hover:text-[#D62B2B] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <Icon
                    name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    className={`flex-shrink-0 transition-colors ${openFaq === i ? "text-[#D62B2B]" : "text-gray-400"}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D62B2B] rounded-lg flex items-center justify-center">
                <Icon name="Luggage" size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">
                РЖД<span className="text-[#D62B2B]">Носильщик</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm text-center">
              © 2024 РЖД Носильщик. Сервис переноски багажа на вокзалах России.
            </p>
            <button
              onClick={scrollToForm}
              className="bg-[#D62B2B] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#b71c1c] transition-all"
            >
              Заказать
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}