import { useEffect, useState } from "react";
import { getArtistOrders } from "../../services/artistService";

function ArtistOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const data = await getArtistOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
            <div className="artist-page">

                <div className="list-header">
                    <div className="list-eyebrow">Studio</div>
                    <h1 className="list-title">Artist Orders</h1>
                    {orders.length > 0 && (
                        <p className="list-count">{orders.length} {orders.length === 1 ? "order" : "orders"} received</p>
                    )}
                </div>

                {orders.length === 0 ? (
                    <div className="list-empty">
                        <div className="empty-mark">◻</div>
                        <p className="empty-heading">No orders yet</p>
                        <p className="empty-sub">Orders for your works will appear here</p>
                    </div>
                ) : (
                    <div className="orders-table-wrap">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Artwork</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td className="col-order-id">№ {order.orderId}</td>
                                        <td className="col-customer">{order.customerName}</td>
                                        <td className="col-artwork">
                                            <span className="artwork-title-cell">{order.artworkTitle}</span>
                                        </td>
                                        <td className="col-qty">{order.quantity}</td>
                                        <td className="col-price">₹ {order.price?.toLocaleString()}</td>
                                        <td className="col-status">
                                            <span className={`order-status status-${order.status?.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ArtistOrders;