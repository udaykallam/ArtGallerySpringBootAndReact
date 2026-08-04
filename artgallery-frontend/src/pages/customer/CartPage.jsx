import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { getCart, removeFromCart, updateCartQuantity } from "../../services/commerceService";

function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { loadCart(); }, []);

    const loadCart = async () => {
        try {
            const data = await getCart();
            setCart(data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (artworkId) => {
        try {
            await removeFromCart(artworkId);
            await loadCart();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to remove item");
        }
    };

    const changeQuantity = async (item, delta) => {
        const stock = item.artwork?.stock || 0;
        const newQty = item.quantity + delta;
        if (newQty < 1) return;
        if (newQty > stock) { alert(`Only ${stock} item(s) available`); return; }
        setUpdatingId(item.id);
        try {
            await updateCartQuantity(item.artwork.id, newQty);
            await loadCart();
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const checkout = async () => {
        const invalidItem = cart.find(item => item.quantity > (item.artwork?.stock || 0));
        if (invalidItem) { alert(`${invalidItem.artwork.title} exceeds available stock`); return; }
        try {
            const response = await axiosClient.post("/orders/checkout");
            alert(`Order #${response.data.orderId} created successfully`);
            await loadCart();
            navigate("/orders");
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    const effectivePrice = (artwork) => artwork?.discountPrice || artwork?.price || 0;
    const total = cart.reduce((sum, item) => sum + effectivePrice(item.artwork) * item.quantity, 0);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="load-mark">✦</div>
                <div className="load-text">Preparing your cart</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="list-page">

                <div className="list-header">
                    <div className="list-eyebrow">Acquisition</div>
                    <h1 className="list-title">Cart</h1>
                    {cart.length > 0 && (
                        <p className="list-count">
                            {cart.length} {cart.length === 1 ? "work" : "works"} selected
                        </p>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="list-empty">
                        <div className="empty-mark">⊕</div>
                        <p className="empty-heading">Your cart is empty</p>
                        <p className="empty-sub">Add works from the collection to begin your acquisition</p>
                        <Link to="/">
                            <button className="btn-view" style={{ width: "auto", padding: "10px 28px" }}>
                                Browse Works
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">

                        <div className="list-items">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className={`list-row${updatingId === item.id ? " list-row--updating" : ""}`}
                                >
                                    {item.artwork?.imageUrl && (
                                        <div className="list-row-thumb">
                                            <img src={item.artwork.imageUrl} alt={item.artwork.title} />
                                        </div>
                                    )}

                                    <div className="list-row-info">
                                        <div className="list-row-title">{item.artwork?.title}</div>
                                        <div className="list-row-artist">{item.artwork?.artistName}</div>

                                        <div className="qty-stepper">
                                            <button
                                                className="qty-btn"
                                                onClick={() => changeQuantity(item, -1)}
                                                disabled={item.quantity <= 1 || updatingId === item.id}
                                                aria-label="Decrease quantity"
                                            >−</button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => changeQuantity(item, +1)}
                                                disabled={updatingId === item.id || item.quantity >= (item.artwork?.stock || 0)}
                                                aria-label="Increase quantity"
                                            >+</button>
                                        </div>

                                        {/* Stock indicator */}
                                        <div className={`stock-info${item.quantity >= (item.artwork?.stock || 0) ? " stock-info--max" : ""}`}>
                                            <span className="stock-info-dot" />
                                            {item.quantity >= (item.artwork?.stock || 0)
                                                ? "Max stock reached"
                                                : `${item.artwork?.stock ?? 0} available`
                                            }
                                        </div>
                                    </div>

                                    <div className="list-row-actions">
                                        <div>
                                            {item.artwork?.discountPrice && item.artwork?.price && (
                                                <div className="list-row-price-original">
                                                    ₹ {(item.artwork.price * item.quantity).toLocaleString()}
                                                </div>
                                            )}
                                            <div className="list-row-price">
                                                ₹ {(effectivePrice(item.artwork) * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                        <button
                                            className="btn-remove"
                                            onClick={() => removeItem(item.artwork.id)}
                                            disabled={updatingId === item.id}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-eyebrow">Order Summary</div>
                            <div className="summary-lines">
                                {cart.map((item) => (
                                    <div key={item.id} className="summary-line">
                                        <span className="summary-line-name">
                                            {item.artwork?.title}
                                            {item.quantity > 1 && (
                                                <span className="summary-line-qty"> ×{item.quantity}</span>
                                            )}
                                        </span>
                                        <span className="summary-line-val">
                                            ₹ {(effectivePrice(item.artwork) * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-total-row">
                                <span className="summary-total-label">Total</span>
                                <span className="summary-total-val">₹ {total.toLocaleString()}</span>
                            </div>
                            <button
                                className="btn-primary"
                                style={{ marginTop: "1.5rem" }}
                                onClick={checkout}
                            >
                                Proceed to Checkout
                            </button>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default CartPage;