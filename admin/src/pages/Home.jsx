import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  FiDollarSign,
  FiShoppingBag,
  FiList,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

/* ------------------------------------------------------------------ */
/* DEMO DATA: replace with your API data (orders / items)              */
/* ------------------------------------------------------------------ */
const stats = [
  {
    label: "Total Revenue",
    value: "₹1,24,580",
    change: 12.5,
    icon: FiDollarSign,
  },
  { label: "Total Orders", value: "1,284", change: 8.2, icon: FiShoppingBag },
  { label: "Menu Items", value: "86", change: 3.1, icon: FiList },
  { label: "Customers", value: "642", change: -2.4, icon: FiUsers },
];

const revenueData = [
  { day: "Mon", revenue: 12400, orders: 48 },
  { day: "Tue", revenue: 15200, orders: 61 },
  { day: "Wed", revenue: 13800, orders: 55 },
  { day: "Thu", revenue: 18900, orders: 74 },
  { day: "Fri", revenue: 24600, orders: 96 },
  { day: "Sat", revenue: 29800, orders: 118 },
  { day: "Sun", revenue: 26400, orders: 104 },
];

const categoryData = [
  { name: "Burgers", value: 34 },
  { name: "Pizza", value: 27 },
  { name: "Drinks", value: 18 },
  { name: "Desserts", value: 12 },
  { name: "Others", value: 9 },
];

const topItems = [
  { name: "Cheese Burger", sold: 240 },
  { name: "Margherita Pizza", sold: 198 },
  { name: "French Fries", sold: 176 },
  { name: "Cold Coffee", sold: 142 },
  { name: "Choco Lava Cake", sold: 109 },
];

const recentOrders = [
  {
    id: "#1284",
    customer: "Rahul Sharma",
    items: "Cheese Burger x2, Fries",
    total: "₹540",
    status: "Delivered",
  },
  {
    id: "#1283",
    customer: "Priya Patel",
    items: "Margherita Pizza",
    total: "₹349",
    status: "Preparing",
  },
  {
    id: "#1282",
    customer: "Amit Verma",
    items: "Cold Coffee x3",
    total: "₹420",
    status: "Pending",
  },
  {
    id: "#1281",
    customer: "Sneha Rao",
    items: "Choco Lava Cake x2",
    total: "₹260",
    status: "Delivered",
  },
  {
    id: "#1280",
    customer: "Karan Singh",
    items: "Veg Pizza, Fries",
    total: "₹610",
    status: "Cancelled",
  },
];
/* ------------------------------------------------------------------ */

// Chart colors (SVG needs hex). Swap these to match your tailwind primary/accent.
const COLORS = ["#f97316", "#fb923c", "#facc15", "#38bdf8", "#a78bfa"];
const PRIMARY = "#f97316";
const ACCENT = "#facc15";

const statusStyles = {
  Delivered: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  Preparing: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  Pending: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  Cancelled: "bg-red-500/10 text-red-400 ring-red-500/20",
};

const ChartTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-dark-lighter/95 backdrop-blur px-3 py-2 shadow-xl shadow-black/40">
      {label && (
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
          {label}
        </p>
      )}
      {payload.map((p) => (
        <p
          key={p.dataKey || p.name}
          className="text-sm font-semibold text-white"
        >
          {prefix}
          {p.value.toLocaleString()}
          {suffix}
        </p>
      ))}
    </div>
  );
};

const Card = ({ title, subtitle, children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-dark-lighter p-5 ${className}`}
  >
    <div className="mb-5">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const Home = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="pl-12 md:pl-0">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your food orders and sales this week
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon }) => {
          const up = change >= 0;
          return (
            <div
              key={label}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-dark-lighter p-5 hover:border-primary/30 transition-colors duration-300"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                </div>
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 text-primary ring-1 ring-primary/20">
                  <Icon size={20} />
                </span>
              </div>
              <div className="relative mt-4 flex items-center gap-2 text-xs">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                    up
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {up ? (
                    <FiTrendingUp size={12} />
                  ) : (
                    <FiTrendingDown size={12} />
                  )}
                  {Math.abs(change)}%
                </span>
                <span className="text-gray-500">vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue + Category */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card
          title="Revenue Overview"
          subtitle="Daily revenue for the last 7 days"
          className="xl:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  content={<ChartTooltip prefix="₹" />}
                  cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={PRIMARY}
                  strokeWidth={2.5}
                  fill="url(#revGradient)"
                  activeDot={{
                    r: 5,
                    fill: ACCENT,
                    stroke: PRIMARY,
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Orders by Category" subtitle="Share of total orders">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  stroke="none"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip suffix="%" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-2">
            {categoryData.map((c, i) => (
              <li
                key={c.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-gray-400">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {c.name}
                </span>
                <span className="font-medium text-white">{c.value}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Orders per day + Top items */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Orders per Day" subtitle="Number of orders received">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<ChartTooltip suffix=" orders" />}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar
                  dataKey="orders"
                  fill={PRIMARY}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Top Selling Items" subtitle="Most ordered this week">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topItems}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  content={<ChartTooltip suffix=" sold" />}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar
                  dataKey="sold"
                  fill={ACCENT}
                  radius={[0, 8, 8, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent orders */}
      <Card title="Recent Orders" subtitle="Latest orders from your customers">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  <td className="py-3.5 font-semibold text-white">{o.id}</td>
                  <td className="py-3.5 text-gray-300">{o.customer}</td>
                  <td className="py-3.5 text-gray-500">{o.items}</td>
                  <td className="py-3.5 font-medium text-white">{o.total}</td>
                  <td className="py-3.5 text-right">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Home;
