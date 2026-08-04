import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { addToWishlist, addToCart } from "../../services/commerceService";

function ArtworkDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState(null);

    useEffect(() => { loadArtwork(); }, [id]);

    const loadArtwork = async () => {
        try {
            const response = await axiosClient.get(`/artworks/${id}`);
            setArtwork(response.data);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load artwork");
        }
    };

    const handleWishlist = async () => {
        if (!localStorage.getItem("token")) { navigate("/login"); return; }
        try {
            await addToWishlist(Number(id));
            toast.success("Added to Wishlist");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to wishlist");
        }
    };

    const handleCart = async () => {
        if (!localStorage.getItem("token")) { navigate("/login"); return; }
        try {
            await addToCart(Number(id), 1);
            toast.success("Added to Cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    if (!artwork) {
        return (
            <div className="loading-screen">
                <div className="load-mark">✦</div>
                <div className="load-text">Retrieving artwork...</div>
            </div>
        );
    }

    const hasDiscount = artwork.discountedPrice && artwork.discountedPrice < artwork.price;

    return (
        <div className="container">
            <div className="details-page">

                <button className="details-back" onClick={() => navigate(-1)}>
                    Back to Collection
                </button>

                <div className="details-card">

                    {/* IMAGE */}
                    <div className="details-image-wrap">
                        <img
                            src={artwork.imageUrl || "https://via.placeholder.com/500x500?text=No+Image"}
                            alt={artwork.title}
                            className="details-image"
                        />
                    </div>

                    {/* CONTENT */}
                    <div className="details-content">

                        <div className="detail-eyebrow">Original Artwork</div>
                        <h1>{artwork.title}</h1>
                        <div className="detail-artist">By {artwork.artistName}</div>

                        <div className="detail-meta">
                            <div className="detail-meta-item">
                                <div className="meta-label">Category</div>
                                <div className="meta-value">{artwork.categoryName}</div>
                            </div>
                            <div className="detail-meta-item">
                                <div className="meta-label">Availability</div>
                                <div className="meta-value">
                                    {artwork.stock > 0
                                        ? "Available"
                                        : "Out of Stock"}
                                </div>
                            </div>
                        </div>

                        <p className="details-description">{artwork.description}</p>

                        {/* PRICE */}
                        <div className="details-price-row">
                            <span className="details-price-label">Price</span>
                            <div className="details-price-group">
                                {hasDiscount && (
                                    <span className="details-price-original">
                                        ₹ {artwork.price.toLocaleString()}
                                    </span>
                                )}
                                <span className="details-price">
                                    ₹ {(hasDiscount ? artwork.discountedPrice : artwork.price || 0).toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className="details-price-saving">
                                        Save ₹ {(artwork.price - artwork.discountedPrice).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="details-actions">
                            <button className="btn-wishlist" onClick={handleWishlist}>
                                Add to Wishlist
                            </button>
                            <button
                                className="btn-cart"
                                onClick={handleCart}
                                disabled={artwork.stock <= 0}
                            >
                                {artwork.stock > 0
                                    ? "Add to Cart"
                                    : "Out of Stock"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArtworkDetailsPage;