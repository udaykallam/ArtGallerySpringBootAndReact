import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../../services/commerceService";

function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => { loadWishlist(); }, []);

    const loadWishlist = async () => {
        const data = await getWishlist();
        setWishlist(data);
    };

    const removeItem = async (id) => {
        await removeFromWishlist(id);
        loadWishlist();
    };

    return (
        <div className="container">
            <div className="list-page">

                <div className="list-header">
                    <div className="list-eyebrow">Private Collection</div>
                    <h1 className="list-title">My Wishlist</h1>
                    {wishlist.length > 0 && (
                        <p className="list-count">{wishlist.length} {wishlist.length === 1 ? "work" : "works"} saved</p>
                    )}
                </div>

                {wishlist.length === 0 ? (
                    <div className="list-empty">
                        <div className="empty-mark">♡</div>
                        <p className="empty-heading">Your wishlist is empty</p>
                        <p className="empty-sub">Browse the collection and save works that speak to you</p>
                        <Link to="/">
                            <button className="btn-view" style={{ width: "auto", padding: "10px 28px" }}>
                                Explore the Collection
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="list-items">
                        {wishlist.map((item) => (
                            <div key={item.id} className="list-row">

                                {item.artwork.imageUrl && (
                                    <div className="list-row-thumb">
                                        <img src={item.artwork.imageUrl} alt={item.artwork.title} />
                                    </div>
                                )}

                                <div className="list-row-info">
                                    <div className="list-row-title">{item.artwork.title}</div>
                                    {item.artwork.artistName && (
                                        <div className="list-row-artist">{item.artwork.artistName}</div>
                                    )}
                                    {item.artwork.price && (
                                        <div className="list-row-price">₹ {item.artwork.price.toLocaleString()}</div>
                                    )}
                                </div>

                                <div className="list-row-actions">
                                    <Link to={`/artworks/${item.artwork.id}`}>
                                        <button className="btn-view" style={{ padding: "8px 20px", fontSize: "10px" }}>
                                            View
                                        </button>
                                    </Link>
                                    <button
                                        className="btn-remove"
                                        onClick={() => removeItem(item.artwork.id)}
                                    >
                                        Remove
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default WishlistPage;