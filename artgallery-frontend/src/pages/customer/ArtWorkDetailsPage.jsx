import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { addToWishlist, addToCart } from "../../services/commerceService";
import { toast } from "sonner";
import {

    getReviews,

    getReviewSummary,

    addReview,

    deleteReview,

    updateReview

} from "../../services/reviewService";

function ArtworkDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [summary, setSummary] = useState(null);

    const [rating, setRating] = useState(0);

    const [comment, setComment] = useState("");

    const [editingReviewId, setEditingReviewId] =
        useState(null);

    const role = localStorage.getItem("role");

    useEffect(() => {

        loadArtwork();

        loadReviews();

        loadSummary();

    }, [id]);

    const loadReviews = async () => {

        try {

            const data = await getReviews(id);

            setReviews(data);

        } catch (error) {

            console.error(error);

        }

    };

    const loadSummary = async () => {

        try {

            const data =
                await getReviewSummary(id);

            setSummary(data);

        } catch (error) {

            console.error(error);

        }

    };

    const submitReview = async () => {

        if (rating === 0) {

            toast.error(
                "Please select a rating."
            );

            return;

        }

        try {

            if (editingReviewId) {

                await updateReview(

                    editingReviewId,

                    {

                        rating,

                        comment

                    }

                );

                toast.success(
                    "Review updated."
                );

            }

            else {

                await addReview(

                    id,

                    {

                        rating,

                        comment

                    }

                );

                toast.success(
                    "Review submitted."
                );

            }

            setRating(0);

            setComment("");

            setEditingReviewId(null);

            loadReviews();

            loadSummary();

        }

        catch (error) {

            toast.error(

                error.response?.data ||

                "Unable to submit review."

            );

        }

    };

    const removeReview = async (reviewId) => {

        try {

            await deleteReview(reviewId);

            toast.success(
                "Review deleted."
            );

            loadReviews();

            loadSummary();

        }

        catch (error) {

            toast.error(
                "Unable to delete review."
            );

        }

    };

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


                        {/* ===================== Reviews ===================== */}

                        <div className="review-summary">

                            <h2>
                                Reviews & Ratings
                            </h2>

                            {
                                summary &&

                                <>

                                    <div className="avg-rating">

                                        <div className="avg-rating-score">

                                            {summary.averageRating}

                                        </div>

                                        <div>

                                            <div className="review-stars">

                                                {"★".repeat(Math.round(summary.averageRating))}
                                                {"☆".repeat(
                                                    5 - Math.round(summary.averageRating)
                                                )}

                                            </div>

                                            <div className="review-count">

                                                {summary.reviewCount} Reviews

                                            </div>

                                        </div>

                                    </div>

                                    {
                                        [

                                            { label: "5 ★", count: summary.fiveStar },
                                            { label: "4 ★", count: summary.fourStar },
                                            { label: "3 ★", count: summary.threeStar },
                                            { label: "2 ★", count: summary.twoStar },
                                            { label: "1 ★", count: summary.oneStar }

                                        ].map(item => {

                                            const percent =

                                                summary.reviewCount === 0

                                                    ? 0

                                                    : (item.count / summary.reviewCount) * 100;

                                            return (

                                                <div
                                                    key={item.label}
                                                    className="rating-bar"
                                                >

                                                    <span>

                                                        {item.label}

                                                    </span>

                                                    <div className="rating-track">

                                                        <div

                                                            className="rating-fill"

                                                            style={{

                                                                width: `${percent}%`

                                                            }}

                                                        />

                                                    </div>

                                                    <strong>

                                                        {item.count}

                                                    </strong>

                                                </div>

                                            );

                                        })
                                    }

                                </>

                            }

                        </div>

                        {
                            role === "ROLE_CUSTOMER" &&

                            <div className="review-form">

                                <h3>

                                    Share your experience

                                </h3>

                                <p className="review-subtitle">

                                    How would you rate this artwork?

                                </p>

                                <div className="star-picker">

                                    {[1, 2, 3, 4, 5].map(star => (

                                        <span

                                            key={star}

                                            onClick={() => setRating(star)}

                                            style={{

                                                color:

                                                    star <= rating

                                                        ? "#D4B483"

                                                        : "#555"

                                            }}

                                        >

                                            ★

                                        </span>

                                    ))}

                                </div>

                                <textarea

                                    rows="5"

                                    placeholder="Share your experience with this artwork..."

                                    value={comment}

                                    onChange={(e) => setComment(e.target.value)}

                                />

                                <button

                                    className="btn-primary"

                                    onClick={submitReview}

                                >

                                    {

                                        editingReviewId

                                            ?

                                            "Update Review"

                                            :

                                            "Submit Review"

                                    }

                                </button>

                            </div>

                        }

                        <div className="review-list">

                            {

                                reviews.length === 0 ?

                                    (

                                        <div className="no-reviews">

                                            No reviews yet.

                                            <br />

                                            Be the first to review this artwork.

                                        </div>

                                    )

                                    :

                                    reviews.map(review => (

                                        <div
                                            className="review-card"
                                            key={review.reviewId}
                                        >

                                            <div className="review-header">

                                                <div className="review-user">

                                                    <div className="review-avatar">

                                                        {

                                                            review.customerName
                                                                .charAt(0)
                                                                .toUpperCase()

                                                        }

                                                    </div>

                                                    <div>

                                                        <div className="review-name">

                                                            {review.customerName}

                                                        </div>

                                                        <div className="review-date">

                                                            {

                                                                new Date(
                                                                    review.createdAt
                                                                ).toLocaleDateString()

                                                            }

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="review-stars">

                                                {"★".repeat(review.rating)}
                                                {"☆".repeat(5 - review.rating)}

                                            </div>

                                            <div className="review-comment">

                                                {review.comment}

                                            </div>

                                        </div>

                                    ))

                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArtworkDetailsPage;