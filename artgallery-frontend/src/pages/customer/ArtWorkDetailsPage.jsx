import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axiosClient from "../../api/axiosClient";

import {
    addToWishlist,
    addToCart
} from "../../services/commerceService";

import {
    getReviews,
    getReviewSummary,
    addReview,
    deleteReview,
    updateReview
} from "../../services/reviewService";

import { toast } from "sonner";


function ArtworkDetailsPage() {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [artwork, setArtwork] =
        useState(null);

    const [reviews, setReviews] =
        useState([]);

    const [summary, setSummary] =
        useState(null);

    const [rating, setRating] =
        useState(0);

    const [comment, setComment] =
        useState("");

    const [editingReviewId, setEditingReviewId] =
        useState(null);

    const [myReview, setMyReview] =
        useState(null);

    const [reviewLoading, setReviewLoading] =
        useState(false);

    const [reviewToDelete, setReviewToDelete] = useState(null); // holds reviewId or null
    const [deletingReview, setDeletingReview] = useState(false);


    // =====================================================
    // CURRENT USER
    // =====================================================

    const role =
        localStorage.getItem("role");

    const currentUserEmail =
        localStorage
            .getItem("email")
            ?.trim()
            .toLowerCase() || null;

    const currentUserId =
        localStorage.getItem("userId");


    // =====================================================
    // LOAD PAGE DATA
    // =====================================================

    useEffect(() => {

        loadArtwork();

        loadReviews();

        loadSummary();

    }, [id]);



    // =====================================================
    // LOAD ARTWORK
    // =====================================================

    const loadArtwork = async () => {

        try {

            const response =
                await axiosClient.get(
                    `/artworks/${id}`
                );

            setArtwork(response.data);

        } catch (error) {

            console.error(
                "Failed to load artwork:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load artwork."
            );
        }
    };


    // =====================================================
    // FIND CURRENT USER'S REVIEW
    // =====================================================

    const findMyReview = (reviewList) => {

        if (!reviewList || reviewList.length === 0) {

            return null;
        }


        // -------------------------------------------------
        // CURRENT USER EMAIL
        // -------------------------------------------------

        const storedEmail =
            localStorage
                .getItem("email")
                ?.trim()
                .toLowerCase() || null;


        // -------------------------------------------------
        // CURRENT USER ID
        // -------------------------------------------------

        const storedUserId =
            localStorage.getItem("userId");


        // -------------------------------------------------
        // FIND REVIEW
        // -------------------------------------------------

        const foundReview =
            reviewList.find(review => {

                // -----------------------------------------
                // REVIEW EMAIL
                // -----------------------------------------

                const reviewEmail =
                    review.customerEmail
                        ?.trim()
                        .toLowerCase() || null;


                // -----------------------------------------
                // REVIEW USER ID
                //
                // Support different possible backend names.
                // -----------------------------------------

                const reviewUserId =
                    review.customerId ??
                    review.userId ??
                    review.customer?.id ??
                    review.user?.id ??
                    null;


                // -----------------------------------------
                // MATCH BY USER ID
                // -----------------------------------------

                if (
                    storedUserId &&
                    reviewUserId &&
                    String(storedUserId) ===
                    String(reviewUserId)
                ) {

                    return true;
                }


                // -----------------------------------------
                // MATCH BY EMAIL
                // -----------------------------------------

                if (
                    storedEmail &&
                    reviewEmail &&
                    storedEmail === reviewEmail
                ) {

                    return true;
                }


                return false;

            }) || null;


        return foundReview;
    };


    // =====================================================
    // LOAD REVIEWS
    // =====================================================

    const loadReviews = async () => {

        try {

            const data =
                await getReviews(id);

            const reviewList =
                Array.isArray(data)
                    ? data
                    : [];


            setReviews(
                reviewList
            );


            // -------------------------------------------------
            // FIND CURRENT USER'S REVIEW
            // -------------------------------------------------

            const currentReview =
                findMyReview(
                    reviewList
                );


            setMyReview(
                currentReview
            );


        } catch (error) {

            console.error(
                "Failed to load reviews:",
                error
            );

        }
    };


    // =====================================================
    // LOAD REVIEW SUMMARY
    // =====================================================

    const loadSummary = async () => {

        try {

            const data =
                await getReviewSummary(id);

            setSummary(data);

        } catch (error) {

            console.error(
                "Failed to load review summary:",
                error
            );
        }
    };


    // =====================================================
    // SUBMIT / UPDATE REVIEW
    // =====================================================

    const submitReview = async () => {

        // -------------------------------------------------
        // CHECK RATING
        // -------------------------------------------------

        if (rating === 0) {

            toast.error(
                "Please select a rating."
            );

            return;
        }


        // -------------------------------------------------
        // CHECK ONE REVIEW RULE
        // -------------------------------------------------

        if (
            !editingReviewId &&
            myReview
        ) {

            toast.error(
                "You have already reviewed this artwork."
            );

            return;
        }


        // -------------------------------------------------
        // CHECK COMMENT
        // -------------------------------------------------

        if (
            !comment.trim()
        ) {

            toast.error(
                "Please write a comment."
            );

            return;
        }


        setReviewLoading(true);


        try {

            // =================================================
            // UPDATE EXISTING REVIEW
            // =================================================

            if (editingReviewId) {

                await updateReview(
                    editingReviewId,
                    {
                        rating,
                        comment: comment.trim()
                    }
                );


                toast.success(
                    "Review updated successfully."
                );

            }


            // =================================================
            // CREATE NEW REVIEW
            // =================================================

            else {

                await addReview(
                    id,
                    {
                        rating,
                        comment: comment.trim()
                    }
                );


                toast.success(
                    "Review submitted successfully."
                );
            }


            // =================================================
            // RESET FORM
            // =================================================

            setRating(0);

            setComment("");

            setEditingReviewId(null);


            // =================================================
            // REFRESH REVIEWS
            // =================================================

            await loadReviews();

            await loadSummary();


        } catch (error) {

            console.error(
                "Review submission error:",
                error
            );


            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to submit review.";


            toast.error(
                typeof message === "string"
                    ? message
                    : "Unable to submit review."
            );


        } finally {

            setReviewLoading(false);

        }
    };


    // =====================================================
    // DELETE REVIEW
    // =====================================================

    const removeReview = async (reviewId) => {

        if (!reviewId) {
            toast.error("Invalid review.");
            return;
        }

        setDeletingReview(true);

        try {

            await deleteReview(reviewId);

            toast.success("Review deleted successfully.");

            setMyReview(null);
            setEditingReviewId(null);
            setRating(0);
            setComment("");

            await loadReviews();
            await loadSummary();

        } catch (error) {

            console.error("Delete review error:", error);

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to delete review.";

            toast.error(typeof message === "string" ? message : "Unable to delete review.");

        } finally {
            setDeletingReview(false);
            setReviewToDelete(null);
        }
    };


    // =====================================================
    // EDIT REVIEW
    // =====================================================

    const editReview = (review) => {

        if (!review) {

            return;
        }


        setEditingReviewId(
            review.reviewId
        );


        setRating(
            Number(review.rating)
        );


        setComment(
            review.comment || ""
        );


        // -------------------------------------------------
        // Scroll to form
        // -------------------------------------------------

        setTimeout(() => {

            document
                .getElementById(
                    "review-form"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

        }, 100);
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const cancelEdit = () => {

        setEditingReviewId(null);

        setRating(0);

        setComment("");
    };


    // =====================================================
    // WISHLIST
    // =====================================================

    const handleWishlist = async () => {

        if (
            !localStorage.getItem("token")
        ) {

            navigate("/login");

            return;
        }


        try {

            await addToWishlist(
                Number(id)
            );


            toast.success(
                "Added to Wishlist."
            );

        } catch (error) {

            console.error(
                "Wishlist error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to add to wishlist."
            );
        }
    };


    // =====================================================
    // CART
    // =====================================================

    const handleCart = async () => {

        if (
            !localStorage.getItem("token")
        ) {

            navigate("/login");

            return;
        }


        if (
            Number(artwork.stock) <= 0
        ) {

            toast.error(
                "This artwork is currently out of stock."
            );

            return;
        }


        try {

            await addToCart(
                Number(id),
                1
            );


            toast.success(
                "Added to Cart."
            );

        } catch (error) {

            console.error(
                "Cart error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to add to cart."
            );
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (!artwork) {

        return (

            <div className="loading-screen">

                <div className="load-mark">
                    ✦
                </div>

                <div className="load-text">
                    Retrieving artwork...
                </div>

            </div>
        );
    }


    // =====================================================
    // PRICE
    // =====================================================

    const originalPrice =
        Number(
            artwork.price || 0
        );


    const discountedPrice =
        Number(
            artwork.discountedPrice || 0
        );


    const hasDiscount =
        discountedPrice > 0 &&
        discountedPrice < originalPrice;


    const displayPrice =
        hasDiscount
            ? discountedPrice
            : originalPrice;


    const savingAmount =
        originalPrice -
        discountedPrice;


    // =====================================================
    // RATING
    // =====================================================

    const averageRating =
        Number(
            summary?.averageRating || 0
        );


    const reviewCount =
        Number(
            summary?.reviewCount || 0
        );


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="container">

            <div className="details-page">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    className="details-back"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    Back to Collection
                </button>


                {/* =================================================
                    MAIN ARTWORK SECTION
                ================================================= */}

                <div className="details-card">


                    {/* =================================================
                        LEFT — IMAGE
                    ================================================= */}

                    <div className="details-image-wrap">

                        <img
                            src={
                                artwork.imageUrl ||
                                "https://via.placeholder.com/700x700?text=No+Image"
                            }

                            alt={
                                artwork.title ||
                                "Artwork"
                            }

                            className="details-image"
                        />

                    </div>


                    {/* =================================================
                        RIGHT — DETAILS
                    ================================================= */}

                    <div className="details-content">


                        <div className="detail-eyebrow">
                            Original Artwork
                        </div>


                        <h1>
                            {artwork.title}
                        </h1>


                        <div className="detail-artist">

                            By{" "}

                            {artwork.artistName ||
                                "Unknown Artist"}

                        </div>


                        <div className="detail-meta">


                            <div className="detail-meta-item">

                                <div className="meta-label">
                                    Category
                                </div>

                                <div className="meta-value">

                                    {artwork.categoryName ||
                                        "Uncategorized"}

                                </div>

                            </div>


                            <div className="detail-meta-item">

                                <div className="meta-label">
                                    Availability
                                </div>

                                <div
                                    className={
                                        `meta-value ${Number(artwork.stock) > 0
                                            ? "availability-available"
                                            : "availability-unavailable"
                                        }`
                                    }
                                >

                                    {Number(artwork.stock) > 0
                                        ? "Available"
                                        : "Out of Stock"}

                                </div>

                            </div>

                        </div>


                        <p className="details-description">

                            {artwork.description ||
                                "No description available for this artwork."}

                        </p>


                        <div className="details-price-row">

                            <span className="details-price-label">
                                Price
                            </span>


                            <div className="details-price-group">


                                {hasDiscount && (

                                    <span className="details-price-original">

                                        ₹{" "}

                                        {originalPrice.toLocaleString(
                                            "en-IN"
                                        )}

                                    </span>

                                )}


                                <span className="details-price">

                                    ₹{" "}

                                    {displayPrice.toLocaleString(
                                        "en-IN"
                                    )}

                                </span>


                                {hasDiscount && (

                                    <span className="details-price-saving">

                                        Save ₹{" "}

                                        {savingAmount.toLocaleString(
                                            "en-IN"
                                        )}

                                    </span>

                                )}

                            </div>

                        </div>


                        <div className="details-actions">


                            <button
                                className="btn-wishlist"
                                onClick={
                                    handleWishlist
                                }
                            >
                                ♡ Add to Wishlist
                            </button>


                            <button
                                className="btn-cart"
                                onClick={
                                    handleCart
                                }
                                disabled={
                                    Number(
                                        artwork.stock
                                    ) <= 0
                                }
                            >

                                {Number(artwork.stock) > 0
                                    ? "⊕ Add to Cart"
                                    : "Out of Stock"}

                            </button>

                        </div>


                    </div>

                </div>


                {/* =================================================
                    REVIEWS
                ================================================= */}

                <section className="review-summary">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="review-section-header">

                        <div>

                            <div className="review-section-eyebrow">
                                Customer Experience
                            </div>

                            <h2>
                                Reviews & Ratings
                            </h2>

                        </div>

                    </div>


                    {/* =================================================
                        RATING OVERVIEW
                    ================================================= */}

                    <div className="review-overview">


                        {/* SCORE */}

                        <div className="review-score-box">

                            <div className="avg-rating-score">

                                {averageRating.toFixed(1)}

                            </div>


                            <div className="review-score-details">

                                <div className="review-stars">

                                    {"★".repeat(
                                        Math.round(
                                            averageRating
                                        )
                                    )}

                                    <span className="empty-stars">

                                        {"★".repeat(
                                            Math.max(
                                                0,
                                                5 -
                                                Math.round(
                                                    averageRating
                                                )
                                            )
                                        )}

                                    </span>

                                </div>


                                <div className="review-count">

                                    {reviewCount}{" "}

                                    {reviewCount === 1
                                        ? "Review"
                                        : "Reviews"}

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            RATING DISTRIBUTION
                        ================================================= */}

                        <div className="rating-distribution">

                            {[5, 4, 3, 2, 1].map(
                                star => (

                                    <div
                                        className="rating-row"
                                        key={star}
                                    >

                                        <span className="rating-label">
                                            {star} ★
                                        </span>


                                        <div className="rating-bar">

                                            <div
                                                className="rating-bar-fill"
                                                style={{
                                                    width: "0%"
                                                }}
                                            />

                                        </div>


                                        <span className="rating-count">
                                            0
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        WRITE / EDIT REVIEW
                    ================================================= */}

                    {role === "ROLE_CUSTOMER" &&
                        (
                            !myReview ||
                            editingReviewId
                        ) && (

                            <div
                                className="review-form"
                                id="review-form"
                            >


                                <div className="review-form-header">

                                    <div>

                                        <div className="review-form-eyebrow">

                                            {editingReviewId
                                                ? "Edit Your Review"
                                                : "Customer Review"}

                                        </div>


                                        <h3>

                                            {editingReviewId
                                                ? "Update your experience"
                                                : "Share your experience"}

                                        </h3>


                                        <p className="review-subtitle">

                                            How would you rate this artwork?

                                        </p>

                                    </div>

                                </div>


                                {/* =================================================
                                    STAR PICKER
                                ================================================= */}

                                <div className="star-picker">

                                    {[1, 2, 3, 4, 5].map(
                                        star => (

                                            <button
                                                type="button"
                                                key={star}
                                                className={
                                                    star <= rating
                                                        ? "review-star selected"
                                                        : "review-star"
                                                }
                                                onClick={() =>
                                                    setRating(
                                                        star
                                                    )
                                                }
                                                aria-label={
                                                    `${star} star`
                                                }
                                            >
                                                ★
                                            </button>

                                        )
                                    )}

                                </div>


                                {/* =================================================
                                    COMMENT
                                ================================================= */}

                                <textarea
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Share your thoughts about this artwork..."
                                    rows={5}
                                    disabled={
                                        reviewLoading
                                    }
                                />


                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <div className="review-form-actions">


                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={
                                            submitReview
                                        }
                                        disabled={
                                            reviewLoading
                                        }
                                    >

                                        {reviewLoading
                                            ? "Saving..."
                                            : editingReviewId
                                                ? "Update Review"
                                                : "Submit Review"}

                                    </button>


                                    {editingReviewId && (

                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={
                                                cancelEdit
                                            }
                                            disabled={
                                                reviewLoading
                                            }
                                        >
                                            Cancel
                                        </button>

                                    )}

                                </div>


                            </div>

                        )}


                    {/* =================================================
                        ALREADY REVIEWED MESSAGE
                    ================================================= */}

                    {role === "ROLE_CUSTOMER" &&
                        myReview &&
                        !editingReviewId && (

                            <div className="review-already-submitted">

                                <div className="review-already-mark">
                                    ✓
                                </div>

                                <div>

                                    <strong>
                                        You have already reviewed this artwork.
                                    </strong>

                                    <p>
                                        You can edit or delete your review below.
                                    </p>

                                </div>

                            </div>

                        )}


                    {/* =================================================
                        REVIEW LIST
                    ================================================= */}

                    <div className="review-list">


                        {reviews.length === 0 ? (

                            <div className="no-reviews">

                                <div className="no-reviews-mark">
                                    ✦
                                </div>


                                <h3>
                                    No reviews yet
                                </h3>


                                <p>
                                    Be the first to share
                                    your experience with
                                    this artwork.
                                </p>

                            </div>

                        ) : (

                            reviews.map(
                                review => {

                                    const isMyReview =
                                        myReview?.reviewId ===
                                        review.reviewId;


                                    return (

                                        <div
                                            key={
                                                review.reviewId
                                            }
                                            className={
                                                isMyReview
                                                    ? "review-card review-card-own"
                                                    : "review-card"
                                            }
                                        >


                                            {/* =================================================
                                                REVIEW HEADER
                                            ================================================= */}

                                            <div className="review-header">


                                                <div className="review-user">


                                                    <div className="review-avatar">

                                                        {(
                                                            review.customerName ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>


                                                    <div>

                                                        <div className="review-name">

                                                            {review.customerName ||
                                                                "Customer"}

                                                            {isMyReview && (

                                                                <span className="your-review-label">
                                                                    Your Review
                                                                </span>

                                                            )}

                                                        </div>


                                                        <div className="review-date">

                                                            {review.createdAt
                                                                ? new Date(
                                                                    review.createdAt
                                                                ).toLocaleDateString(
                                                                    "en-IN",
                                                                    {
                                                                        day:
                                                                            "numeric",
                                                                        month:
                                                                            "long",
                                                                        year:
                                                                            "numeric"
                                                                    }
                                                                )
                                                                : ""}

                                                        </div>

                                                    </div>


                                                </div>


                                                {/* =================================================
                                                    REVIEW STARS
                                                ================================================= */}

                                                <div className="review-card-stars">

                                                    {"★".repeat(
                                                        Number(
                                                            review.rating
                                                        )
                                                    )}

                                                    <span>

                                                        {"★".repeat(
                                                            Math.max(
                                                                0,
                                                                5 -
                                                                Number(
                                                                    review.rating
                                                                )
                                                            )
                                                        )}

                                                    </span>

                                                </div>


                                            </div>


                                            {/* =================================================
                                                COMMENT
                                            ================================================= */}

                                            <p className="review-card-comment">

                                                {review.comment}

                                            </p>


                                            {/* =================================================
                                                EDIT / DELETE
                                            ================================================= */}

                                            {isMyReview && (

                                                <div className="review-card-actions">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            editReview(
                                                                review
                                                            )
                                                        }
                                                        disabled={reviewLoading || deletingReview}
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() => setReviewToDelete(review.reviewId)}
                                                        disabled={reviewLoading}
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            )}


                                        </div>

                                    );

                                }

                            )

                        )}

                    </div>


                </section>
                {reviewToDelete && (

                <div className="confirm-overlay">

                    <div className="confirm-modal">

                        <div className="confirm-icon confirm-icon--danger">
                            🗑
                        </div>

                        <h2 className="confirm-title">
                            Delete Review
                        </h2>

                        <p className="confirm-message">
                            Are you sure you want to delete your review? This action cannot be undone.
                        </p>

                        <div className="confirm-divider" />

                        <div className="confirm-actions">

                            <button
                                className="confirm-btn-danger"
                                onClick={() => removeReview(reviewToDelete)}
                                disabled={deletingReview}
                            >
                                {deletingReview ? (
                                    <span className="btn-spinner-wrap">
                                        <span className="btn-spinner" /> Deleting...
                                    </span>
                                ) : (
                                    "Yes, Delete Review"
                                )}
                            </button>

                            <button
                                className="confirm-btn-cancel"
                                onClick={() => setReviewToDelete(null)}
                                disabled={deletingReview}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>
            )}

            </div>
            

        </div>
    );
}


export default ArtworkDetailsPage;