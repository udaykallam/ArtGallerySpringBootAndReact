import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const response = await axiosClient.get("/orders/my-orders");
            setOrders(response.data);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="load-mark">✦</div>
                <div className="load-text">Retrieving your orders</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="list-page">

                <div className="list-header">
                    <div className="list-eyebrow">Collection History</div>
                    <h1 className="list-title">My Orders</h1>
                    {orders.length > 0 && (
                        <p className="list-count">
                            {orders.length} {orders.length === 1 ? "acquisition" : "acquisitions"}
                        </p>
                    )}
                </div>

                {orders.length === 0 ? (
                    <div className="list-empty">
                        <div className="empty-mark">◻</div>
                        <p className="empty-heading">No orders yet</p>
                        <p className="empty-sub">Your acquisitions will be recorded here</p>
                        <Link to="/">
                            <button className="btn-view" style={{ width: "auto", padding: "10px 28px" }}>
                                Browse the Collection
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {orders.map((order) => (
                            <div key={order.orderId} className="order-card">

                                <div className="order-top">
                                    <span className="order-id">№ {order.orderId}</span>
                                    <span className={`order-status status-${order.status?.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-divider" />

                                <div className="order-body">
                                    <div className="order-meta-item">
                                        <span className="order-meta-label">Date</span>
                                        <span className="order-meta-value">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                        </span>
                                    </div>
                                    <div className="order-meta-item">
                                        <span className="order-meta-label">Total</span>
                                        <span className="order-meta-value order-total">
                                            ₹ {order.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default OrdersPage;