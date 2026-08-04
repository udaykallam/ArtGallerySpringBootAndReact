import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../../services/adminService";

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const data = await getAdminOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, status) => {
        setUpdatingId(orderId);
        try {
            await updateOrderStatus(orderId, status);
            loadOrders();
        } catch (error) {
            alert("Failed to update order");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = orders.filter((order) =>
        order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        order.orderId?.toString().includes(search)
    );

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="load-mark">✦</div>
                <div className="load-text">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="admin-page">

                <div className="list-header">
                    <div className="list-eyebrow">Administration</div>
                    <h1 className="list-title">Order Management</h1>
                    <p className="list-count">
                        {filteredOrders.length} of {orders.length} {orders.length === 1 ? "order" : "orders"}
                    </p>
                </div>

                {/* ── Search ── */}
                <div className="admin-form-card">
                    <div className="field-wrap">
                        <label htmlFor="order-search">Search</label>
                        <input
                            id="order-search"
                            type="text"
                            placeholder="Search by customer or order ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="admin-table-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr
                                    key={order.orderId}
                                    className={updatingId === order.orderId ? "admin-row--deleting" : ""}
                                >
                                    <td className="col-order-id">№ {order.orderId}</td>
                                    <td className="col-name">{order.customerName}</td>
                                    <td className="col-price">₹ {order.totalAmount?.toLocaleString()}</td>
                                    <td>
                                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="col-customer">
                                        {new Date(order.createdAt).toLocaleString("en-IN", {
                                            day: "numeric", month: "short", year: "numeric",
                                            hour: "2-digit", minute: "2-digit"
                                        })}
                                    </td>
                                    <td>
                                        <select
                                            className="upload-select admin-status-select"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                            disabled={updatingId === order.orderId}
                                        >
                                            <option value="PLACED">Placed</option>
                                            <option value="PACKED">Packed</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}

                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="6">
                                        <div className="admin-table-empty">
                                            <div className="empty-mark">◻</div>
                                            <p className="empty-heading" style={{ fontSize: "18px" }}>No orders found</p>
                                            <p className="empty-sub" style={{ marginBottom: 0 }}>Try a different search term</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default AdminOrdersPage;