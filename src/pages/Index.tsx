import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE =
  "https://cdn.poehali.dev/projects/6038a985-0abf-4169-a538-8b944a6b2559/files/b577e154-54d0-4adb-b86d-1aa620e5bff3.jpg";

const STEPS = [
  {
    num: "01",
    title: "Оформление заявки",
    desc: "Вы указываете только необходимую информацию",
  },
  {
    num: "02",
    title: "Оплата онлайн",
    desc: "Простой и безопасный процесс",
  },
  {
    num: "03",
    title: "Назначение специалиста",
    desc: "Без дополнительных подтверждений",
  },
  {
    num: "04",
    title: "Персональная встреча",
    desc: "Сотрудник встречает вас у вагона",
  },
  {
    num: "05",
    title: "Сопровождение багажа",
    desc: "До автомобиля, зала ожидания или выхода",
  },
];

const BENEFITS = [
  {
    icon: "Infinity",
    title: "Любой объем багажа",
    desc: "Без ограничений по весу и количеству мест",
  },
  {
    icon: "Zap",
    title: "Оформление в последний момент",
    desc: "Доступно даже за 15 минут до прибытия",
  },
  {
    icon: "CheckCircle",
    title: "Без подтверждений",
    desc: "Никаких лишних действий и согласований",
  },
  {
    icon: "RotateCcw",
    title: "Гарантированный возврат",
    desc: "В течение 15 минут при отмене",
  },
];

const AUDIENCES = [
  { icon: "Briefcase", label: "Для деловых поездок" },
  { icon: "Users", label: "Для путешествий с семьей" },
  { icon: "Star", label: "Для тех, кто ценит комфорт" },
  { icon: "Crown", label: "Для сервиса без компромиссов" },
];

const FAQS = [
  {
    q: "Что если мой поезд опаздывает?",
    a: "Специалист отслеживает актуальное расписание и автоматически корректирует время прибытия.",
  },
  {
    q: "Как происходит встреча?",
    a: "После оплаты вы получите имя и фото специалиста. Он встретит вас непосредственно у вагона.",
  },
  {
    q: "Можно отменить заказ?",
    a: "Гарантированный возврат средств в течение 15 минут после отмены. Без вопросов и формальностей.",
  },
  {
    q: "Какие вокзалы обслуживаются?",
    a: "Все крупные вокзалы Москвы и Санкт-Петербурга. Список расширяется.",
  },
];

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToForm = () => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] font-golos text-[#1A1A1A]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F6F3]/95 backdrop-blur-md border-b border-[#E8E4DF]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#D62B2B] rounded flex items-center justify-center">
              <Icon name="Luggage" size={14} className="text-white" />
            </div>
            <span className="font-semibold text-base tracking-tight text-[#1A1A1A]">
              РЖД<span className="text-[#D62B2B]"> Сопровождение</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#666]">
            <a href="#how" className="hover:text-[#D62B2B] transition-colors">Как работает</a>
            <a href="#benefits" className="hover:text-[#D62B2B] transition-colors">Преимущества</a>
            <a href="#faq" className="hover:text-[#D62B2B] transition-colors">Вопросы</a>
          </div>
          <button
            onClick={scrollToForm}
            className="text-sm font-medium text-[#D62B2B] border border-[#D62B2B] px-4 py-2 rounded-lg hover:bg-[#D62B2B] hover:text-white transition-all duration-200"
          >
            Заказать
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
        {/* Фоновое изображение — тихое, затемнённое */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/75 via-[#1A1A1A]/60 to-[#1A1A1A]/80" />

        {/* Тонкая текстура поверх */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 w-full">
          {/* Верхний лейбл */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-12 bg-[#D62B2B]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#D62B2B] font-medium">
              Персональный сервис
            </span>
          </div>

          {/* Главный заголовок */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.0] tracking-tight mb-6 max-w-3xl">
            Персональный<br />
            <span className="text-[#D62B2B]">сервис</span><br />
            сопровождения<br />
            багажа
          </h1>

          <p className="text-xl md:text-2xl text-white/70 font-light mb-4 max-w-xl leading-relaxed">
            Вы путешествуете —<br />мы заботимся об остальном
          </p>

          <p className="text-base text-white/50 mb-12 max-w-lg leading-relaxed">
            Встреча у вагона и бережная доставка багажа без ограничений по весу
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <button
              onClick={scrollToForm}
              className="bg-[#D62B2B] hover:bg-[#b71c1c] text-white font-bold px-10 py-4 rounded-xl text-base tracking-wide transition-all duration-300 hover:scale-[1.03] shadow-[0_8px_32px_rgba(214,43,43,0.4)]"
            >
              Заказать сервис
            </button>
            <p className="text-white/40 text-sm">
              Доступно даже за 15 минут до прибытия
            </p>
          </div>
        </div>

        {/* Якорная стрелка вниз */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-30">
          <div className="w-px h-12 bg-white" />
          <Icon name="ChevronDown" size={16} className="text-white" />
        </div>
      </section>

      {/* КЛЮЧЕВОЕ ОЩУЩЕНИЕ */}
      <section className="bg-[#1A1A1A] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {[
              { title: "Без суеты", sub: "Всё под контролем с первой секунды" },
              { title: "Без ожиданий", sub: "Специалист уже на месте к вашему прибытию" },
              { title: "Без лишних контактов", sub: "Один звонок — и всё организовано" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1A1A1A] px-10 py-12 flex flex-col gap-3 group hover:bg-[#222] transition-colors"
              >
                <div className="w-1 h-8 bg-[#D62B2B] mb-2" />
                <h3 className="text-2xl font-black text-white">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-white/30 text-xs uppercase tracking-[0.3em]">
              Всё уже организовано к вашему прибытию
            </p>
          </div>
        </div>
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section id="how" className="py-28 bg-[#F8F6F3]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#D62B2B]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#D62B2B]">Процесс</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Как это работает</h2>
          </div>

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="group flex items-start gap-8 py-8 border-b border-[#E8E4DF] last:border-0 hover:pl-2 transition-all duration-300"
              >
                <span className="text-4xl font-black text-[#E8E4DF] group-hover:text-[#D62B2B]/20 transition-colors min-w-[56px]">
                  {step.num}
                </span>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{step.title}</h3>
                  <p className="text-[#999] text-sm leading-relaxed">{step.desc}</p>
                </div>
                <Icon
                  name="ArrowRight"
                  size={16}
                  className="text-[#E8E4DF] group-hover:text-[#D62B2B] mt-2 transition-colors flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕМИАЛЬНЫЕ ПРЕИМУЩЕСТВА */}
      <section id="benefits" className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#D62B2B]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#D62B2B]">Стандарт</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Премиальные<br />преимущества</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="group p-8 border border-[#E8E4DF] rounded-2xl hover:border-[#D62B2B]/30 hover:shadow-lg transition-all duration-300 bg-[#F8F6F3]"
              >
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E4DF] flex items-center justify-center flex-shrink-0 group-hover:border-[#D62B2B]/30 group-hover:bg-[#D62B2B]/5 transition-all">
                    <Icon name={b.icon} size={18} className="text-[#D62B2B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-1.5">{b.title}</h3>
                    <p className="text-sm text-[#888] leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ДЛЯ КОГО */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#D62B2B]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#D62B2B]">Аудитория</span>
            </div>
            <h2 className="text-3xl font-black text-white">Для кого этот сервис</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AUDIENCES.map((a, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-3 py-8 px-4 border border-white/10 rounded-2xl hover:border-[#D62B2B]/40 hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-[#D62B2B]/10 flex items-center justify-center">
                  <Icon name={a.icon} size={18} className="text-[#D62B2B]" />
                </div>
                <p className="text-white/70 text-sm font-medium leading-snug">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ДОВЕРИЕ */}
      <section className="py-20 bg-[#F8F6F3] border-y border-[#E8E4DF]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#D62B2B]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#D62B2B]">Гарантии</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-4">Доверие и статус</h2>
              <p className="text-[#666] leading-relaxed text-sm">
                Сервис реализован с учётом стандартов РЖД. Сотрудники проходят профессиональную подготовку и работают по утверждённому регламенту.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-w-[260px]">
              {[
                { icon: "ShieldCheck", text: "Надёжность и безопасность" },
                { icon: "Lock", text: "Полная конфиденциальность" },
                { icon: "Award", text: "Стандарты РЖД" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E8E4DF] flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={14} className="text-[#D62B2B]" />
                  </div>
                  <span className="text-sm text-[#555] font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#D62B2B]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#D62B2B]">Вопросы</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight">Ответы на<br />частые вопросы</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="border border-[#E8E4DF] rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left text-[#1A1A1A] hover:bg-[#F8F6F3] transition-colors group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm pr-4">{faq.q}</span>
                  <Icon
                    name={openFaq === i ? "Minus" : "Plus"}
                    size={16}
                    className={`flex-shrink-0 transition-colors ${openFaq === i ? "text-[#D62B2B]" : "text-[#CCC]"}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-0 text-[#777] text-sm leading-relaxed bg-[#F8F6F3] border-t border-[#E8E4DF]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ФИНАЛЬНЫЙ БЛОК */}
      <section id="order-form" className="py-32 bg-[#1A1A1A] relative overflow-hidden">
        {/* Декоративный красный акцент */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D62B2B] to-transparent opacity-60" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D62B2B]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8 bg-[#D62B2B]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#D62B2B]">Начало</span>
            <div className="h-px w-8 bg-[#D62B2B]" />
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
            Комфорт начинается<br />
            <span className="text-[#D62B2B]">с деталей</span>
          </h2>

          <p className="text-white/50 text-lg mb-4 leading-relaxed">
            Доверьте багаж профессионалам
          </p>
          <p className="text-white/30 text-base mb-12">
            И сосредоточьтесь на поездке
          </p>

          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-3 bg-[#D62B2B] hover:bg-[#b71c1c] text-white font-bold px-12 py-5 rounded-xl text-base tracking-wide transition-all duration-300 hover:scale-[1.03] shadow-[0_8px_40px_rgba(214,43,43,0.35)] mb-6"
          >
            <span>Оформить сервис</span>
            <Icon name="ArrowRight" size={18} className="text-white" />
          </button>

          <p className="text-white/25 text-xs tracking-[0.15em] uppercase">
            Быстро · Конфиденциально · Без лишних действий
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111] py-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#D62B2B] rounded flex items-center justify-center">
              <Icon name="Luggage" size={12} className="text-white" />
            </div>
            <span className="text-white/60 text-sm font-medium">
              РЖД<span className="text-[#D62B2B]"> Сопровождение</span>
            </span>
          </div>
          <p className="text-white/20 text-xs text-center">
            © 2024 · Сервис персонального сопровождения багажа
          </p>
          <button
            onClick={scrollToForm}
            className="text-[#D62B2B] text-xs font-medium border border-[#D62B2B]/30 px-4 py-2 rounded-lg hover:border-[#D62B2B] transition-all"
          >
            Заказать сервис
          </button>
        </div>
      </footer>
    </div>
  );
}
