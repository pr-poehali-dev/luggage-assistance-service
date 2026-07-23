import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/87503926-d030-4509-b7ce-7d101b58eb0c";
const CLIENTS_URL = "https://functions.poehali.dev/a73a96d9-c4ca-4190-8250-adccc6ea3721";
const ORDERS_URL = "https://functions.poehali.dev/b7d0c948-8c42-495c-a2ca-e18cc7ea02cb";

type PartnerUser = {
  id: number;
  full_name: string;
  email: string;
  role: "operator" | "admin";
  partner_id: number;
  partner_name: string;
  partner_type: string;
};

type Client = {
  id: number;
  full_name: string;
  surname: string | null;
  email: string;
  phone: string;
  client_code: string;
  balance_money: number | null;
  balance_services: number | null;
  loyalty_level_id: number | null;
  loyalty_level_name: string | null;
  limit_type: string | null;
};

type LoyaltyLevel = {
  id: number;
  name: string;
  limit_type: string;
  limit_month: number | null;
  limit_year: number | null;
  is_unlimited: boolean;
};

type Order = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  station: string;
  destination: string | null;
  pickup_address: string | null;
  bags_count: number;
  arrival_time: string | null;
  status: string;
  payment_status: string;
  payment_amount: number | null;
  service_type: string;
  service_kind: string;
  payer: string;
  train_number: string | null;
  notes: string | null;
  created_at: string;
};

const SERVICE_KIND_LABELS: Record<string, string> = {
  meet: "Встретить",
  see_off: "Проводить",
  territory: "По территории",
  delivery: "Доставка багажа",
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "Новая", color: "text-blue-300", bg: "bg-blue-500/10 border-blue-500/20" },
  confirmed: { label: "Принята", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20" },
  in_progress: { label: "Выполняется", color: "text-[#C8A96E]", bg: "bg-[#C8A96E]/10 border-[#C8A96E]/20" },
  done: { label: "Выполнена", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20" },
  cancelled: { label: "Отменена", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<PartnerUser | null>(null);
  const [tab, setTab] = useState<"clients" | "orders" | "history">("clients");

  // Clients state
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [loyaltyLevels, setLoyaltyLevels] = useState<LoyaltyLevel[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientForm, setClientForm] = useState({ full_name: "", surname: "", phone: "", email: "", loyalty_level_id: "" });
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ created: number; updated: number; errors: string[] } | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [orderKindFilter, setOrderKindFilter] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    client_id: "", service_kind: "meet", service_type: "railway", station: "", destination: "",
    pickup_address: "", arrival_time: "", bags_count: "1", full_name: "", phone: "", email: "",
    train_number: "", notes: "", payer: "client",
  });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<number | null>(null);

  // History state
  const [historyPeriod, setHistoryPeriod] = useState("month");
  const [historyLocation, setHistoryLocation] = useState("");
  const [historyDirection, setHistoryDirection] = useState("");
  const [historyStats, setHistoryStats] = useState<{ total_orders: number; total_done: number; by_service_kind: Record<string, number> } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("partner_auth");
    if (!saved) { navigate("/partner/login"); return; }
    try {
      const parsed = JSON.parse(saved);
      setUser(parsed.user);
    } catch {
      navigate("/partner/login");
    }
  }, [navigate]);

  const loadClients = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const url = `${CLIENTS_URL}?partner_id=${user.partner_id}${clientSearch ? `&search=${encodeURIComponent(clientSearch)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setClients(data.clients || []);
    } finally {
      setLoading(false);
    }
  }, [user, clientSearch]);

  const loadLoyaltyLevels = useCallback(async () => {
    if (!user) return;
    const res = await fetch(`${CLIENTS_URL}?resource=levels&partner_id=${user.partner_id}`);
    const data = await res.json();
    setLoyaltyLevels(data.levels || []);
  }, [user]);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ partner_id: String(user.partner_id) });
      if (orderSearch) qs.set("search", orderSearch);
      if (orderStatusFilter) qs.set("status", orderStatusFilter);
      if (orderKindFilter) qs.set("service_kind", orderKindFilter);
      const res = await fetch(`${ORDERS_URL}?${qs.toString()}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }, [user, orderSearch, orderStatusFilter, orderKindFilter]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ partner_id: String(user.partner_id), resource: "stats", period: historyPeriod });
      if (historyLocation) qs.set("location", historyLocation);
      if (historyDirection) qs.set("direction", historyDirection);
      const res = await fetch(`${ORDERS_URL}?${qs.toString()}`);
      const data = await res.json();
      setHistoryStats(data);
    } finally {
      setLoading(false);
    }
  }, [user, historyPeriod, historyLocation, historyDirection]);

  useEffect(() => {
    if (!user) return;
    if (tab === "clients") { loadClients(); loadLoyaltyLevels(); }
    if (tab === "orders") { loadClients(); loadOrders(); }
    if (tab === "history") loadHistory();
  }, [user, tab, loadClients, loadLoyaltyLevels, loadOrders, loadHistory]);

  const handleLogout = () => {
    localStorage.removeItem("partner_auth");
    navigate("/partner/login");
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    if (!clientForm.full_name || !clientForm.phone) {
      setError("Заполните ФИО и телефон");
      return;
    }
    try {
      const res = await fetch(CLIENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_client",
          partner_id: user.partner_id,
          full_name: clientForm.full_name,
          surname: clientForm.surname,
          phone: clientForm.phone,
          email: clientForm.email,
          loyalty_level_id: clientForm.loyalty_level_id || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowClientForm(false);
        setClientForm({ full_name: "", surname: "", phone: "", email: "", loyalty_level_id: "" });
        loadClients();
      } else {
        setError(data.error || "Ошибка создания клиента");
      }
    } catch {
      setError("Ошибка сети");
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingExcel(true);
    setUploadResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch(CLIENTS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "upload_excel", partner_id: user.partner_id, file_base64: base64 }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setUploadResult(data);
          loadClients();
        } else {
          setError(data.error || "Ошибка загрузки файла");
        }
        setUploadingExcel(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingExcel(false);
      setError("Ошибка чтения файла");
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    if (!orderForm.client_id || !orderForm.station || !orderForm.full_name || !orderForm.phone || !orderForm.email) {
      setError("Заполните обязательные поля, включая клиента и email");
      return;
    }
    setOrderSubmitting(true);
    try {
      const res = await fetch(ORDERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: user.partner_id,
          client_id: Number(orderForm.client_id),
          created_by_user_id: user.id,
          service_kind: orderForm.service_kind,
          service_type: orderForm.service_type,
          station: orderForm.station,
          destination: orderForm.destination,
          pickup_address: orderForm.pickup_address,
          arrival_time: orderForm.arrival_time,
          bags_count: orderForm.bags_count,
          full_name: orderForm.full_name,
          phone: orderForm.phone,
          email: orderForm.email,
          train_number: orderForm.train_number,
          notes: orderForm.notes,
          payer: orderForm.payer,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrderSuccess(data.order_id);
        loadOrders();
      } else {
        setError(data.error || "Ошибка создания заказа");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setOrderSubmitting(false);
    }
  };

  const selectClientForOrder = (client: Client) => {
    setOrderForm((prev) => ({
      ...prev,
      client_id: String(client.id),
      full_name: client.full_name,
      phone: client.phone,
      email: client.email !== "" && !client.email.includes("@noemail.local") ? client.email : "",
    }));
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#C8A96E]/50 focus:ring-1 focus:ring-[#C8A96E]/20 transition-all";
  const labelCls = "block text-[10px] font-semibold text-white/40 mb-1 uppercase tracking-wider";

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-golos text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
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
              <div className="text-[10px] text-white/30 tracking-[0.15em] uppercase">Кабинет партнёра</div>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#C8A96E]/10 border border-[#C8A96E]/20 px-3 py-1.5 rounded-lg">
              <Icon name="Building2" size={14} className="text-[#C8A96E]" />
              <span className="text-[#C8A96E] text-xs font-bold">{user.partner_name}</span>
              <span className="text-[9px] bg-[#C8A96E]/20 text-[#C8A96E] px-1.5 py-0.5 rounded font-bold uppercase">
                {user.role === "admin" ? "Администратор" : "Оператор"}
              </span>
            </div>
            <button onClick={handleLogout} className="text-white/30 text-xs border border-white/8 px-3 py-1.5 rounded-lg hover:border-white/20 hover:text-white/60 transition-all">
              Выйти
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-[96px] pb-20">
        {/* ЗАГОЛОВОК */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#C8A96E]" />
            <span className="text-[#C8A96E] text-xs uppercase tracking-[0.25em] font-bold">Партнёрский доступ</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Личный кабинет партнёра</h1>
        </div>

        {/* ТАБЫ */}
        <div className="flex gap-1 bg-white/3 border border-white/6 rounded-xl p-1 mb-8 w-fit">
          <button onClick={() => setTab("clients")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "clients" ? "bg-[#C8A96E] text-white" : "text-white/40 hover:text-white/70"}`}>
            <Icon name="Users" size={14} className="text-current" /> Клиенты
          </button>
          <button onClick={() => setTab("orders")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "orders" ? "bg-[#C8A96E] text-white" : "text-white/40 hover:text-white/70"}`}>
            <Icon name="ClipboardList" size={14} className="text-current" /> Заказы
          </button>
          <button onClick={() => setTab("history")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "history" ? "bg-[#C8A96E] text-white" : "text-white/40 hover:text-white/70"}`}>
            <Icon name="BarChart2" size={14} className="text-current" /> История
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-400 bg-red-500/8 border border-red-500/15 rounded-lg px-4 py-3 text-sm max-w-xl">
            <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-400/50 hover:text-red-400"><Icon name="X" size={14} className="text-current" /></button>
          </div>
        )}

        {/* ══════ ВКЛАДКА КЛИЕНТЫ ══════ */}
        {tab === "clients" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadClients()}
                  placeholder="Поиск по ФИО или телефону"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder-white/25 focus:outline-none focus:border-[#C8A96E]/50 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 text-white/70 text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-all">
                  <Icon name={uploadingExcel ? "Loader2" : "Upload"} size={15} className={`text-current ${uploadingExcel ? "animate-spin" : ""}`} />
                  Загрузить файл
                  <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" disabled={uploadingExcel} />
                </label>
                <button onClick={() => setShowClientForm(true)} className="flex items-center gap-2 bg-[#C8A96E] hover:bg-[#A8893E] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all">
                  <Icon name="UserPlus" size={15} className="text-current" /> Создать клиента
                </button>
              </div>
            </div>

            {uploadResult && (
              <div className="mb-6 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-5 py-4 text-sm text-emerald-300">
                Загружено: создано {uploadResult.created}, обновлено {uploadResult.updated}
                {uploadResult.errors.length > 0 && (
                  <div className="text-red-400 mt-2 text-xs">{uploadResult.errors.join("; ")}</div>
                )}
              </div>
            )}

            {/* Форма создания клиента */}
            {showClientForm && (
              <div className="mb-6 bg-white/3 border border-white/8 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold">Новый клиент</h3>
                  <button onClick={() => setShowClientForm(false)} className="text-white/30 hover:text-white/60"><Icon name="X" size={18} className="text-current" /></button>
                </div>
                <form onSubmit={handleCreateClient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Имя *</label>
                    <input value={clientForm.full_name} onChange={(e) => setClientForm({ ...clientForm, full_name: e.target.value })} className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Фамилия</label>
                    <input value={clientForm.surname} onChange={(e) => setClientForm({ ...clientForm, surname: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Телефон *</label>
                    <input value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} placeholder="+7 900 000 00 00" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Уровень лояльности</label>
                    <select value={clientForm.loyalty_level_id} onChange={(e) => setClientForm({ ...clientForm, loyalty_level_id: e.target.value })} className={inputCls}>
                      <option value="">Без уровня</option>
                      {loyaltyLevels.map((l) => (
                        <option key={l.id} value={l.id}>{l.name} ({l.is_unlimited ? "безлимит" : l.limit_type === "money" ? `${l.limit_month}₽/мес` : `${l.limit_month} услуг/мес`})</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-[#C8A96E] hover:bg-[#A8893E] text-white font-bold py-3 rounded-xl transition-all">Создать клиента</button>
                  </div>
                </form>
              </div>
            )}

            {/* Таблица клиентов */}
            <div className="bg-white/3 border border-white/6 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6 text-white/30 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-semibold">ФИО</th>
                    <th className="text-left px-5 py-3 font-semibold">Телефон</th>
                    <th className="text-left px-5 py-3 font-semibold">ID клиента</th>
                    <th className="text-left px-5 py-3 font-semibold">Уровень лояльности</th>
                    <th className="text-left px-5 py-3 font-semibold">Остаток лимита</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 && !loading && (
                    <tr><td colSpan={5} className="text-center py-12 text-white/25">Клиентов пока нет</td></tr>
                  )}
                  {clients.map((c) => (
                    <tr key={c.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3.5 font-semibold">{c.full_name} {c.surname}</td>
                      <td className="px-5 py-3.5 text-white/60">{c.phone}</td>
                      <td className="px-5 py-3.5 text-white/40 font-mono text-xs">{c.client_code}</td>
                      <td className="px-5 py-3.5">
                        {c.loyalty_level_name ? (
                          <span className="bg-[#C8A96E]/10 text-[#C8A96E] text-xs font-bold px-2 py-1 rounded">{c.loyalty_level_name}</span>
                        ) : <span className="text-white/20 text-xs">Не назначен</span>}
                      </td>
                      <td className="px-5 py-3.5 text-white/60">
                        {c.balance_money != null ? `${Number(c.balance_money).toLocaleString("ru-RU")} ₽` : c.balance_services != null ? `${c.balance_services} услуг` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════ ВКЛАДКА ЗАКАЗЫ ══════ */}
        {tab === "orders" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadOrders()}
                    placeholder="№ заказа, ФИО, локация"
                    className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder-white/25 focus:outline-none focus:border-[#C8A96E]/50 transition-all w-64"
                  />
                </div>
                <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70">
                  <option value="">Все статусы</option>
                  {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select value={orderKindFilter} onChange={(e) => setOrderKindFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70">
                  <option value="">Все услуги</option>
                  {Object.entries(SERVICE_KIND_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <button onClick={() => { setShowOrderForm(true); setOrderSuccess(null); }} className="flex items-center gap-2 bg-[#C8A96E] hover:bg-[#A8893E] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all">
                <Icon name="Plus" size={15} className="text-current" /> Создать заказ
              </button>
            </div>

            {/* Форма создания заказа */}
            {showOrderForm && (
              <div className="mb-6 bg-white/3 border border-white/8 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold">Новый заказ</h3>
                  <button onClick={() => { setShowOrderForm(false); setOrderSuccess(null); }} className="text-white/30 hover:text-white/60"><Icon name="X" size={18} className="text-current" /></button>
                </div>

                {orderSuccess ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="CheckCircle" size={30} className="text-emerald-400" />
                    </div>
                    <p className="font-bold text-lg mb-1">Заказ №{orderSuccess} создан</p>
                    <p className="text-white/40 text-sm mb-5">Заказ добавлен в список заказов клиента</p>
                    <button onClick={() => { setShowOrderForm(false); setOrderSuccess(null); }} className="bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-6 py-2.5 rounded-xl">Закрыть</button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateOrder} className="space-y-5">
                    {/* Шаг 1: клиент */}
                    <div>
                      <label className={labelCls}>1. Клиент *</label>
                      <select value={orderForm.client_id} onChange={(e) => { const c = clients.find(cl => cl.id === Number(e.target.value)); if (c) selectClientForOrder(c); else setOrderForm({ ...orderForm, client_id: "" }); }} className={inputCls} required>
                        <option value="">Выберите клиента</option>
                        {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name} {c.surname} — {c.phone}</option>)}
                      </select>
                    </div>

                    {/* Шаг 2: услуга */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(SERVICE_KIND_LABELS).map(([k, v]) => (
                        <button
                          type="button"
                          key={k}
                          onClick={() => setOrderForm({ ...orderForm, service_kind: k })}
                          className={`text-sm font-semibold px-3 py-2.5 rounded-lg border transition-all ${orderForm.service_kind === k ? "bg-[#C8A96E] border-[#C8A96E] text-white" : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Тип локации</label>
                        <select value={orderForm.service_type} onChange={(e) => setOrderForm({ ...orderForm, service_type: e.target.value })} className={inputCls}>
                          <option value="railway">Вокзал / РЖД</option>
                          <option value="airport">Аэропорт</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Город / вокзал / аэропорт *</label>
                        <input value={orderForm.station} onChange={(e) => setOrderForm({ ...orderForm, station: e.target.value })} className={inputCls} required />
                      </div>

                      {(orderForm.service_kind === "territory" || orderForm.service_kind === "delivery") && (
                        <div>
                          <label className={labelCls}>{orderForm.service_kind === "delivery" ? "Откуда забрать" : "Точка подачи"}</label>
                          <input value={orderForm.pickup_address} onChange={(e) => setOrderForm({ ...orderForm, pickup_address: e.target.value })} className={inputCls} />
                        </div>
                      )}
                      {(orderForm.service_kind === "territory" || orderForm.service_kind === "delivery") && (
                        <div>
                          <label className={labelCls}>{orderForm.service_kind === "delivery" ? "Куда доставить" : "Конечная точка"}</label>
                          <input value={orderForm.destination} onChange={(e) => setOrderForm({ ...orderForm, destination: e.target.value })} className={inputCls} />
                        </div>
                      )}

                      <div>
                        <label className={labelCls}>Дата / время</label>
                        <input type="datetime-local" value={orderForm.arrival_time} onChange={(e) => setOrderForm({ ...orderForm, arrival_time: e.target.value })} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Количество мест багажа</label>
                        <select value={orderForm.bags_count} onChange={(e) => setOrderForm({ ...orderForm, bags_count: e.target.value })} className={inputCls}>
                          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Номер поезда / рейса</label>
                        <input value={orderForm.train_number} onChange={(e) => setOrderForm({ ...orderForm, train_number: e.target.value })} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Плательщик</label>
                        <select value={orderForm.payer} onChange={(e) => setOrderForm({ ...orderForm, payer: e.target.value })} className={inputCls}>
                          <option value="client">Клиент</option>
                          <option value="partner">Партнёр (лимит лояльности)</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelCls}>ФИО пассажира *</label>
                        <input value={orderForm.full_name} onChange={(e) => setOrderForm({ ...orderForm, full_name: e.target.value })} className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>Телефон *</label>
                        <input value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} className={inputCls} required />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelCls}>Email (обязателен для чека) *</label>
                        <input type="email" value={orderForm.email} onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })} className={inputCls} required />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelCls}>Примечания</label>
                        <input value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} className={inputCls} />
                      </div>
                    </div>

                    <button type="submit" disabled={orderSubmitting} className="w-full bg-[#C8A96E] hover:bg-[#A8893E] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
                      {orderSubmitting ? "Создаём..." : "Создать заказ"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Список заказов */}
            <div className="space-y-3">
              {orders.length === 0 && !loading && (
                <div className="text-center py-16 bg-white/2 border border-white/6 rounded-2xl text-white/25">Заказов пока нет</div>
              )}
              {orders.map((o) => {
                const st = STATUS_MAP[o.status] || STATUS_MAP.new;
                const isAir = o.service_type === "airport";
                return (
                  <div key={o.id} className="bg-white/3 border border-white/6 hover:border-white/10 rounded-2xl p-5 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isAir ? "bg-[#C8A96E]/10" : "bg-[#E31E24]/10"}`}>
                          <span className="text-lg">{isAir ? "✈️" : "🚆"}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold truncate">{o.full_name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${st.bg} ${st.color}`}>{st.label}</span>
                            <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded">{SERVICE_KIND_LABELS[o.service_kind] || o.service_kind}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/35">
                            <span>{o.station}</span>
                            <span className="flex items-center gap-1"><Icon name="Package" size={11} className="text-white/25" />{o.bags_count} мест</span>
                            {o.arrival_time && <span className="flex items-center gap-1"><Icon name="Clock" size={11} className="text-white/25" />{formatDate(o.arrival_time)}</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-white/20 text-[10px] flex-shrink-0">№{o.id} · {formatDate(o.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════ ВКЛАДКА ИСТОРИЯ ══════ */}
        {tab === "history" && (
          <div>
            <div className="flex flex-wrap gap-3 mb-8">
              <select value={historyPeriod} onChange={(e) => setHistoryPeriod(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70">
                <option value="today">Сегодня</option>
                <option value="yesterday">Вчера</option>
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="prev_month">Предыдущий месяц</option>
                <option value="year">Год</option>
              </select>
              <input
                value={historyLocation}
                onChange={(e) => setHistoryLocation(e.target.value)}
                placeholder="Локация (напр. Шереметьево)"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-white/25 w-56"
              />
              <select value={historyDirection} onChange={(e) => setHistoryDirection(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70">
                <option value="">Все направления</option>
                <option value="airport">Аэропорт</option>
                <option value="railway">ЖД вокзал</option>
              </select>
            </div>

            {historyStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                  <p className="text-3xl font-black text-[#C8A96E] mb-1">{historyStats.total_orders}</p>
                  <p className="text-white/30 text-xs uppercase tracking-wider">Всего заказов</p>
                </div>
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                  <p className="text-3xl font-black text-emerald-400 mb-1">{historyStats.total_done}</p>
                  <p className="text-white/30 text-xs uppercase tracking-wider">Выполнено</p>
                </div>
                {Object.entries(SERVICE_KIND_LABELS).map(([k, v]) => (
                  <div key={k} className="bg-white/3 border border-white/8 rounded-2xl p-6">
                    <p className="text-3xl font-black text-white mb-1">{historyStats.by_service_kind[k] || 0}</p>
                    <p className="text-white/30 text-xs uppercase tracking-wider">{v}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
