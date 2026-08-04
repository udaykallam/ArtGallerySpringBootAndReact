import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../services/adminService";

function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        try {
            const data = await getAdminDashboard();
            setStats(data);
        } catch (error) {
            console.error(error);
        }
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
                    <div className="list-eyebrow">Administration</div>
                    <h1 className="list-title">Admin Dashboard</h1>
                </div>

                {/* People */}
                <div className="dashboard-group-label">People</div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Users</div>
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-icon">◌</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Artists</div>
                        <div className="stat-value">{stats.totalArtists}</div>
                        <div className="stat-icon">◈</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Customers</div>
                        <div className="stat-value">{stats.totalCustomers}</div>
                        <div className="stat-icon">◇</div>
                    </div>
                </div>

                {/* Commerce */}
                <div className="dashboard-group-label">Commerce</div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Artworks</div>
                        <div className="stat-value">{stats.totalArtworks}</div>
                        <div className="stat-icon">◻</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Orders</div>
                        <div className="stat-value">{stats.totalOrders}</div>
                        <div className="stat-icon">◫</div>
                    </div>
                    <div className="stat-card stat-card--gold">
                        <div className="stat-label">Revenue</div>
                        <div className="stat-value stat-value--revenue">₹ {stats.totalRevenue?.toLocaleString()}</div>
                        <div className="stat-icon">✦</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;