import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArtistDashboard, getArtistOrders } from "../../services/artistService";
import {
    ResponsiveContainer, BarChart, Bar,
    XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

function ArtistDashboard() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => { loadDashboard(); loadOrders(); }, []);

    const loadDashboard = async () => {
        try { setStats(await getArtistDashboard()); }
        catch (e) { console.error(e); }
    };

    const loadOrders = async () => {
        try { const data = await getArtistOrders(); setOrders(data.slice(0, 5)); }
        catch (e) { console.error(e); }
    };

    const chartData = [
        { name: "Total Revenue",   value: stats?.totalRevenue   || 0 },
        { name: "Monthly Revenue", value: stats?.monthlyRevenue || 0 },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="chart-tooltip">
                <div className="chart-tooltip-label">{label}</div>
                <div className="chart-tooltip-val">₹ {payload[0].value?.toLocaleString()}</div>
            </div>
        );
    };

    if (!stats) {
        return (
            <div className="loading-screen">
                <div className="load-mark">✦</div>
                <div className="load-text">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="artist-page">

                <div className="list-header">
                    <div className="list-eyebrow">Studio</div>
                    <h1 className="list-title">Artist Dashboard</h1>
                </div>

                {/* ── Stats grid ── */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Artworks</div>
                        <div className="stat-value">{stats.totalArtworks}</div>
                        <div className="stat-icon">◈</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Orders</div>
                        <div className="stat-value">{stats.totalOrders}</div>
                        <div className="stat-icon">◻</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Sales</div>
                        <div className="stat-value">{stats.totalSales}</div>
                        <div className="stat-icon">◇</div>
                    </div>
                    <div className="stat-card stat-card--gold">
                        <div className="stat-label">Total Revenue</div>
                        <div className="stat-value stat-value--revenue">₹ {stats.totalRevenue?.toLocaleString()}</div>
                        <div className="stat-icon">✦</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Monthly Orders</div>
                        <div className="stat-value">{stats.monthlyOrders}</div>
                        <div className="stat-icon">◌</div>
                    </div>
                    <div className="stat-card stat-card--gold">
                        <div className="stat-label">Monthly Revenue</div>
                        <div className="stat-value stat-value--revenue">₹ {stats.monthlyRevenue?.toLocaleString()}</div>
                        <div className="stat-icon">✦</div>
                    </div>
                    <div className="stat-card stat-card--wide">
                        <div className="stat-label">Top Selling Artwork</div>
                        <div className="stat-value stat-value--top">{stats.topSellingArtwork}</div>
                        <div className="stat-icon">★</div>
                    </div>
                </div>

                {/* ── Chart ── */}
                <div className="dashboard-section">
                    <div className="dashboard-section-header">
                        <div className="list-eyebrow" style={{ marginBottom: 0 }}>Analytics</div>
                        <h2 className="dashboard-section-title">Revenue Overview</h2>
                    </div>
                    <div className="chart-card">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} barCategoryGap="40%">
                                <CartesianGrid
                                    strokeDasharray="0"
                                    vertical={false}
                                    stroke="#2c2925"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "#6a5e52", fontSize: 10, letterSpacing: "0.1em" }}
                                    axisLine={{ stroke: "#2c2925" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#4a4038", fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
                                    width={52}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,180,131,0.06)" }} />
                                <Bar dataKey="value" fill="#d4b483" radius={[0, 0, 0, 0]} maxBarSize={80} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── Recent Orders ── */}
                <div className="dashboard-section">
                    <div className="dashboard-section-header">
                        <div className="list-eyebrow" style={{ marginBottom: 0 }}>Latest Activity</div>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                            <h2 className="dashboard-section-title">Recent Orders</h2>
                            <Link to="/artist/orders" className="dashboard-section-link">View all →</Link>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="list-empty" style={{ padding: "3rem 0" }}>
                            <div className="empty-mark">◻</div>
                            <p className="empty-heading">No orders yet</p>
                        </div>
                    ) : (
                        <div className="recent-orders">
                            {orders.map((order) => (
                                <div key={order.orderId} className="recent-order-row">

                                    <div className="recent-order-id">№ {order.orderId}</div>

                                    <div className="recent-order-info">
                                        <div className="recent-order-title">{order.artworkTitle}</div>
                                        <div className="recent-order-customer">{order.customerName}</div>
                                    </div>

                                    <div className="recent-order-qty">
                                        <span className="qty-label">Qty</span>
                                        <span className="recent-order-qty-val">{order.quantity}</span>
                                    </div>

                                    <div className="recent-order-price">₹ {order.price?.toLocaleString()}</div>

                                    <span className={`order-status status-${order.status?.toLowerCase()}`}>
                                        {order.status}
                                    </span>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ArtistDashboard;