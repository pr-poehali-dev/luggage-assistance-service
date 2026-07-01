import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/8d66de6b-61b1-4865-98a8-33f30548887c";

type Order = {
  id: number;
  full_name: string;
  station: string;
  bags_count: number;
  arrival_time: string | null;
  status: string;
  payment_status: string;
  payment_amount: number | null;
  service_type: string | null;
  train_number: string | null;
  notes: string | null;
  created_at: string;
};

type Client = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  client_code: string;
  created_at: string;
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  new:        { label: "Новая",       color: "text-blue-300",  bg: "bg-blue-500/10 border-blue-500/20" },
  confirmed:  { label: "Принята",     color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20" },
  in_progress:{ label: "Выполняется", color: "text-[#C8A96E]", bg: "bg-[#C8A96E]/10 border-[#C8A96E]/20" },
  done:       { label: "Выполнена",   color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20" },
  cancelled:  { label: "Отменена",    color: "text-red-400",   bg: "bg-red-500/10 border-red-500/20" },
};

const PAYMENT_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Ожидает оплаты", color: "text-yellow-400" },
  paid:    { label: "Оплачено",       color: "text-emerald-400" },
  refunded:{ label: "Возврат",        color: "text-blue-400" },
  failed:  { label: "Не оплачено",    color: "text-red-400" },
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Введите email"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (res.ok && data.client) {
        setClient(data.client);
        setOrders(data.orders || []);
        setActiveTab("profile");
      } else {
        setError(data.error || "Клиент не найден");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const copyId = () => {
    if (client?.client_code) {
      navigator.clipboard.writeText(client.client_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#C8A96E]/50 focus:ring-1 focus:ring-[#C8A96E]/20 transition-all";

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-golos text-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 bg-[#E31E24] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-[11px]">РЖД</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#C8A96E] rounded-full flex items-center justify-center">
                <span className="text-[6px] text-white font-black">✈</span>
              </div>
            </div>
            <div>
              <div className="font-black text-white text-[15px] leading-none">PORTER</div>
              <div className="text-[10px] text-white/30 tracking-[0.15em] uppercase">Concierge Service</div>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#C8A96E]/10 border border-[#C8A96E]/20 px-3 py-1.5 rounded-lg">
              <Icon name="User" size={14} className="text-[#C8A96E]" />
              <span className="text-[#C8A96E] text-xs font-bold">Личный кабинет</span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-white/40 text-xs border border-white/8 px-3 py-1.5 rounded-lg hover:border-white/20 hover:text-white/70 transition-all"
            >
              ← Главная
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-[96px] pb-20">

        {/* ЗАГОЛОВОК */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#C8A96E]" />
            <span className="text-[#C8A96E] text-xs uppercase tracking-[0.25em] font-bold">Кабинет</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
            Личный <span className="text-[#C8A96E]">кабинет</span>
          </h1>
          <p className="text-white/35 mt-3 text-sm">Войдите по email — мы найдём вас и покажем историю заказов</p>
        </div>

        {/* ФОРМА ВХОДА */}
        {!client ? (
          <div className="max-w-md">
            <form onSubmit={handleSearch} className="bg-white/3 border border-white/8 rounded-2xl p-8">
              <div className="w-14 h-14 bg-[#C8A96E]/10 rounded-2xl flex items-center justify-center mb-6">
                <Icon name="Mail" size={24} className="text-[#C8A96E]" />
              </div>
              <h2 className="text-xl font-black mb-1">Введите ваш email</h2>
              <p className="text-white/35 text-sm mb-6">Тот же, что вы указывали при оформлении заявки</p>

              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="ivan@example.com"
                  className={inputCls}
                  required
                />
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
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Ищем...</span></>
                ) : (
                  <><Icon name="LogIn" size={16} className="text-white" /><span>Войти в кабинет</span></>
                )}
              </button>

              <p className="text-white/20 text-xs text-center mt-4">
                Если вы впервые — профиль создастся автоматически
              </p>
            </form>

            {/* Быстрые ссылки */}
            <div className="mt-6 flex gap-3">
              <button onClick={() => navigate("/railway")} className="flex-1 text-center bg-[#E31E24]/10 border border-[#E31E24]/20 text-[#E31E24] text-xs font-semibold py-3 rounded-xl hover:bg-[#E31E24]/15 transition-all">
                🚆 Заказать на вокзале
              </button>
              <button onClick={() => navigate("/airport")} className="flex-1 text-center bg-[#C8A96E]/10 border border-[#C8A96E]/20 text-[#C8A96E] text-xs font-semibold py-3 rounded-xl hover:bg-[#C8A96E]/15 transition-all">
                ✈️ Заказать в аэропорту
              </button>
            </div>
          </div>
        ) : (
          /* ══════════ КАБИНЕТ ══════════ */
          <div>
            {/* Приветствие + выход */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C8A96E]/20 to-[#E31E24]/10 border border-[#C8A96E]/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-black text-[#C8A96E]">{client.full_name[0]}</span>
                </div>
                <div>
                  <p className="font-black text-lg">{client.full_name}</p>
                  <p className="text-white/40 text-xs">{client.email}</p>
                </div>
              </div>
              <button
                onClick={() => { setClient(null); setOrders([]); setEmail(""); }}
                className="flex items-center gap-2 text-white/30 text-xs border border-white/8 px-3 py-2 rounded-lg hover:border-white/20 hover:text-white/60 transition-all"
              >
                <Icon name="LogOut" size={13} className="text-current" />
                Выйти
              </button>
            </div>

            {/* ТАБЫ */}
            <div className="flex gap-1 bg-white/3 border border-white/6 rounded-xl p-1 mb-8 w-fit">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "profile" ? "bg-[#C8A96E] text-white shadow-lg" : "text-white/40 hover:text-white/70"}`}
              >
                <Icon name="User" size={14} className="text-current" />
                Профиль
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "orders" ? "bg-[#C8A96E] text-white shadow-lg" : "text-white/40 hover:text-white/70"}`}
              >
                <Icon name="ClipboardList" size={14} className="text-current" />
                История заказов
                {orders.length > 0 && (
                  <span className="bg-white/15 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{orders.length}</span>
                )}
              </button>
            </div>

            {/* ── ТАБ ПРОФИЛЬ ── */}
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Карточка данных */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-7">
                  <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Icon name="User" size={14} className="text-[#C8A96E]" />
                    Персональные данные
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">ФИО</p>
                      <p className="text-white font-semibold">{client.full_name}</p>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Email</p>
                      <p className="text-white font-semibold">{client.email}</p>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Телефон</p>
                      <p className="text-white font-semibold">{client.phone || <span className="text-white/25 font-normal">Не указан</span>}</p>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Клиент с</p>
                      <p className="text-white font-semibold">{formatDate(client.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* ID клиента */}
                <div className="flex flex-col gap-5">
                  <div className="bg-gradient-to-br from-[#C8A96E]/10 to-[#E31E24]/5 border border-[#C8A96E]/20 rounded-2xl p-7 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96E]/5 rounded-full blur-2xl" />
                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-5 flex items-center gap-2 relative z-10">
                      <Icon name="IdCard" size={14} className="text-[#C8A96E]" />
                      ID клиента
                    </h3>
                    <div className="relative z-10">
                      <p className="text-3xl font-black text-[#C8A96E] tracking-wider mb-2">
                        {client.client_code}
                      </p>
                      <p className="text-white/25 text-xs mb-5">
                        Уникальный идентификатор вашего профиля
                      </p>
                      <button
                        onClick={copyId}
                        className="flex items-center gap-2 bg-[#C8A96E]/15 hover:bg-[#C8A96E]/25 border border-[#C8A96E]/20 text-[#C8A96E] text-xs font-bold px-4 py-2 rounded-lg transition-all"
                      >
                        <Icon name={copied ? "Check" : "Copy"} size={13} className="text-current" />
                        {copied ? "Скопировано!" : "Скопировать ID"}
                      </button>
                    </div>
                  </div>

                  {/* Быстрая статистика */}
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-7">
                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-5 flex items-center gap-2">
                      <Icon name="BarChart2" size={14} className="text-[#C8A96E]" />
                      Статистика
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-black text-white">{orders.length}</p>
                        <p className="text-white/30 text-xs">заказов</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-white">
                          {orders.filter(o => o.service_type === 'airport').length}
                        </p>
                        <p className="text-white/30 text-xs">авиа</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-white">
                          {orders.filter(o => !o.service_type || o.service_type === 'railway').length}
                        </p>
                        <p className="text-white/30 text-xs">РЖД</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-white">
                          {orders.filter(o => o.status === 'done').length}
                        </p>
                        <p className="text-white/30 text-xs">выполнено</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ТАБ ИСТОРИЯ ── */}
            {activeTab === "orders" && (
              <div>
                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-white/2 border border-white/6 rounded-2xl">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon name="PackageOpen" size={28} className="text-white/20" />
                    </div>
                    <p className="text-white/30 font-semibold mb-2">Заказов пока нет</p>
                    <p className="text-white/15 text-sm mb-6">Оформите первую заявку</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => navigate("/railway")} className="bg-[#E31E24] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#C01A1F] transition-all">🚆 РЖД</button>
                      <button onClick={() => navigate("/airport")} className="bg-[#C8A96E] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#A8893E] transition-all">✈️ Аэропорт</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const st = STATUS_MAP[order.status] || STATUS_MAP["new"];
                      const pay = PAYMENT_MAP[order.payment_status] || PAYMENT_MAP["pending"];
                      const isAir = order.service_type === "airport";

                      return (
                        <div
                          key={order.id}
                          className="bg-white/3 border border-white/6 hover:border-white/10 rounded-2xl p-6 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            {/* Левая часть */}
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              {/* Иконка типа */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isAir ? "bg-[#C8A96E]/10" : "bg-[#E31E24]/10"}`}>
                                <span className="text-lg">{isAir ? "✈️" : "🚆"}</span>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="font-bold text-white truncate">{order.station}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${st.bg} ${st.color}`}>
                                    {st.label}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/35 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Icon name="Package" size={11} className="text-white/25" />
                                    {order.bags_count} {order.bags_count === 1 ? "место" : "мест"}
                                  </span>
                                  {order.train_number && (
                                    <span className="flex items-center gap-1">
                                      <Icon name={isAir ? "Plane" : "Train"} size={11} className="text-white/25" />
                                      {order.train_number}
                                    </span>
                                  )}
                                  {order.arrival_time && (
                                    <span className="flex items-center gap-1">
                                      <Icon name="Clock" size={11} className="text-white/25" />
                                      {formatDate(order.arrival_time)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Правая часть */}
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <span className={`text-xs font-semibold ${pay.color}`}>
                                {pay.label}
                              </span>
                              {order.payment_amount && (
                                <span className="text-white/50 text-xs">
                                  {Number(order.payment_amount).toLocaleString("ru-RU")} ₽
                                </span>
                              )}
                              <span className="text-white/20 text-[10px] mt-1">
                                №{order.id} · {formatDate(order.created_at)}
                              </span>
                            </div>
                          </div>

                          {order.notes && (
                            <div className="mt-3 pt-3 border-t border-white/5 text-white/25 text-xs">
                              {order.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
