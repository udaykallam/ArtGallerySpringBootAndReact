import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import {
    addToWishlist,
    addToCart
} from "../../services/commerceService";
import { toast } from "sonner";

import {
    getReviews,
    getReviewSummary,
    addReview,
    deleteReview,
    updateReview
} from "../../services/reviewService";


/* =====================================================
   SAFE ERROR MESSAGE
===================================================== */

const getErrorMessage = (error, fallback) => {

    const data = error?.response?.data;

    /*
     * Backend returned:
     *
     * "You have already reviewed this artwork."
     */
    if (typeof data === "string") {

        return data;

    }

    /*
     * Backend returned:
     *
     * {
     *     message: "You have already reviewed this artwork."
     * }
     */
    if (
        data &&
        typeof data.message === "string"
    ) {

        return data.message;

    }

    /*
     * Axios / JavaScript error
     */
    if (
        typeof error?.message === "string"
    ) {

        return error.message;

    }

    return fallback;
};


/* =====================================================
   COMPONENT
===================================================== */

function ArtworkDetailsPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const reviewFormRef = useRef(null);


    /* =================================================
       STATE
    ================================================= */

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


    const role =
        localStorage.getItem("role");

    const userId =
        localStorage.getItem("userId");


    /* =================================================
       LOAD DATA
    ================================================= */

    useEffect(() => {

        loadArtwork();

        loadReviews();

        loadSummary();

    }, [id]);


    /* =================================================
       LOAD REVIEWS
    ================================================= */

    const loadReviews = async () => {

        try {

            const data =
                await getReviews(id);

            setReviews(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load reviews:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "Unable to load reviews."
                )
            );

        }

    };


    /* =================================================
       LOAD REVIEW SUMMARY
    ================================================= */

    const loadSummary = async () => {

        try {

            const data =
                await getReviewSummary(id);

            setSummary(data);

        } catch (error) {

            console.error(
                "Unable to load review summary:",
                error
            );

        }

    };


    /* =================================================
       SUBMIT / UPDATE REVIEW
    ================================================= */

    const submitReview = async () => {

        if (rating === 0) {

            toast.error(
                "Please select a rating."
            );

            return;
        }


        if (!comment.trim()) {

            toast.error(
                "Please write a comment."
            );

            return;
        }


        try {

            /* ===============================
               UPDATE EXISTING REVIEW
            =============================== */

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

            /* ===============================
               CREATE NEW REVIEW
            =============================== */

            else {

                await addReview(

                    Number(id),

                    {
                        rating,
                        comment: comment.trim()
                    }

                );

                toast.success(
                    "Review submitted successfully."
                );

            }


            /* ===============================
               RESET FORM
            =============================== */

            setRating(0);

            setComment("");

            setEditingReviewId(null);


            /* ===============================
               REFRESH REVIEWS
            =============================== */

            await loadReviews();

            await loadSummary();

        } catch (error) {

            console.error(
                "Review submission error:",
                error
            );

            const message =
                getErrorMessage(
                    error,
                    "Unable to submit review."
                );

            /*
             * IMPORTANT:
             * message is guaranteed to be
             * a string.
             */

            toast.error(message);

        }

    };


    /* =================================================
       DELETE REVIEW
    ================================================= */

    const removeReview = async (
        reviewId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete your review?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await deleteReview(
                reviewId
            );


            toast.success(
                "Review deleted successfully."
            );


            /* ===============================
               RESET EDIT FORM
            =============================== */

            setRating(0);

            setComment("");

            setEditingReviewId(null);


            /* ===============================
               REFRESH
            =============================== */

            await loadReviews();

            await loadSummary();

        } catch (error) {

            console.error(
                "Delete review error:",
                error
            );


            toast.error(
                getErrorMessage(
                    error,
                    "Unable to delete review."
                )
            );

        }

    };


    /* =================================================
       START EDITING REVIEW
    ================================================= */

    const startEditingReview = (
        review
    ) => {

        setRating(
            review.rating
        );

        setComment(
            review.comment || ""
        );

        setEditingReviewId(
            review.reviewId
        );


        /*
         * Scroll to review form
         */

        setTimeout(() => {

            reviewFormRef.current?.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

        }, 100);

    };


    /* =================================================
       CANCEL EDIT
    ================================================= */

    const cancelEdit = () => {

        setRating(0);

        setComment("");

        setEditingReviewId(null);

    };


    /* =================================================
       LOAD ARTWORK
    ================================================= */

    const loadArtwork = async () => {

        try {

            const response =
                await axiosClient.get(
                    `/artworks/${id}`
                );

            setArtwork(
                response.data
            );

        } catch (error) {

            console.error(
                "Unable to load artwork:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "Failed to load artwork."
                )
            );

        }

    };


    /* =================================================
       WISHLIST
    ================================================= */

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
                "Added to Wishlist"
            );

        } catch (error) {

            toast.error(
                getErrorMessage(
                    error,
                    "Failed to add to wishlist."
                )
            );

        }

    };


    /* =================================================
       CART
    ================================================= */

    const handleCart = async () => {

        if (
            !localStorage.getItem("token")
        ) {

            navigate("/login");

            return;

        }


        try {

            await addToCart(
                Number(id),
                1
            );

            toast.success(
                "Added to Cart"
            );

        } catch (error) {

            toast.error(
                getErrorMessage(
                    error,
                    "Failed to add to cart."
                )
            );

        }

    };


    /* =================================================
       LOADING
    ================================================= */

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


    /* =================================================
       PRICE
    ================================================= */

    const hasDiscount =

        artwork.discountedPrice &&

        artwork.discountedPrice <
            artwork.price;


    const displayPrice =

        hasDiscount

            ? artwork.discountedPrice

            : artwork.price || 0;


    /* =================================================
       RENDER
    ================================================= */

    return (

        <div className="container">

            <div className="details-page">


                {/* =====================================
                    BACK BUTTON
                ===================================== */}

                <button

                    className="details-back"

                    onClick={() =>
                        navigate(-1)
                    }

                >

                    Back to Collection

                </button>


                {/* =====================================
                    MAIN ARTWORK CARD
                ===================================== */}

                <div className="details-card">


                    {/* =================================
                        IMAGE
                    ================================= */}

                    <div className="details-image-wrap">

                        <img

                            src={
                                artwork.imageUrl ||
                                "https://via.placeholder.com/500x500?text=No+Image"
                            }

                            alt={
                                artwork.title
                            }

                            className="details-image"

                        />

                    </div>


                    {/* =================================
                        CONTENT
                    ================================= */}

                    <div className="details-content">


                        {/* =============================
                            ARTWORK INFORMATION
                        ============================= */}

                        <div className="detail-eyebrow">

                            Original Artwork

                        </div>


                        <h1>

                            {artwork.title}

                        </h1>


                        <div className="detail-artist">

                            By {artwork.artistName}

                        </div>


                        {/* =============================
                            META
                        ============================= */}

                        <div className="detail-meta">


                            <div className="detail-meta-item">

                                <div className="meta-label">

                                    Category

                                </div>

                                <div className="meta-value">

                                    {artwork.categoryName}

                                </div>

                            </div>


                            <div className="detail-meta-item">

                                <div className="meta-label">

                                    Availability

                                </div>

                                <div className="meta-value">

                                    {
                                        artwork.stock > 0

                                            ? "Available"

                                            : "Out of Stock"
                                    }

                                </div>

                            </div>


                        </div>


                        {/* =============================
                            DESCRIPTION
                        ============================= */}

                        <p className="details-description">

                            {artwork.description}

                        </p>


                        {/* =============================
                            PRICE
                        ============================= */}

                        <div className="details-price-row">

                            <span className="details-price-label">

                                Price

                            </span>


                            <div className="details-price-group">


                                {
                                    hasDiscount && (

                                        <span className="details-price-original">

                                            ₹{" "}

                                            {Number(
                                                artwork.price
                                            ).toLocaleString()}

                                        </span>

                                    )
                                }


                                <span className="details-price">

                                    ₹{" "}

                                    {Number(
                                        displayPrice
                                    ).toLocaleString()}

                                </span>


                                {
                                    hasDiscount && (

                                        <span className="details-price-saving">

                                            Save ₹{" "}

                                            {Number(
                                                artwork.price -
                                                artwork.discountedPrice
                                            ).toLocaleString()}

                                        </span>

                                    )
                                }


                            </div>

                        </div>


                        {/* =============================
                            ACTIONS
                        ============================= */}

                        <div className="details-actions">


                            <button

                                className="btn-wishlist"

                                onClick={
                                    handleWishlist
                                }

                            >

                                Add to Wishlist

                            </button>


                            <button

                                className="btn-cart"

                                onClick={
                                    handleCart
                                }

                                disabled={
                                    artwork.stock <= 0
                                }

                            >

                                {
                                    artwork.stock > 0

                                        ? "Add to Cart"

                                        : "Out of Stock"
                                }

                            </button>


                        </div>


                        {/* =================================
                            REVIEWS
                        ================================= */}


                        <div className="review-summary">


                            <h2>

                                Reviews & Ratings

                            </h2>


                            {
                                summary && (

                                    <>


                                        {/* =====================
                                            AVERAGE
                                        ===================== */}

                                        <div className="avg-rating">


                                            <div className="avg-rating-score">

                                                {
                                                    Number(
                                                        summary.averageRating || 0
                                                    ).toFixed(1)
                                                }

                                            </div>


                                            <div>


                                                <div className="review-stars">

                                                    {
                                                        "★".repeat(
                                                            Math.round(
                                                                summary.averageRating || 0
                                                            )
                                                        )
                                                    }

                                                    {
                                                        "☆".repeat(
                                                            5 -
                                                            Math.round(
                                                                summary.averageRating || 0
                                                            )
                                                        )
                                                    }

                                                </div>


                                                <div className="review-count">

                                                    {
                                                        summary.reviewCount || 0
                                                    }{" "}

                                                    Reviews

                                                </div>


                                            </div>


                                        </div>


                                        {/* =====================
                                            RATING DISTRIBUTION
                                        ===================== */}

                                        {
                                            [
                                                {
                                                    label: "5 ★",
                                                    count: summary.fiveStar || 0
                                                },
                                                {
                                                    label: "4 ★",
                                                    count: summary.fourStar || 0
                                                },
                                                {
                                                    label: "3 ★",
                                                    count: summary.threeStar || 0
                                                },
                                                {
                                                    label: "2 ★",
                                                    count: summary.twoStar || 0
                                                },
                                                {
                                                    label: "1 ★",
                                                    count: summary.oneStar || 0
                                                }
                                            ].map(item => {


                                                const total =
                                                    summary.reviewCount || 0;


                                                const percent =

                                                    total === 0

                                                        ? 0

                                                        : (
                                                            Number(item.count) /
                                                            Number(total)
                                                        ) * 100;


                                                return (

                                                    <div

                                                        key={
                                                            item.label
                                                        }

                                                        className="rating-bar"

                                                    >


                                                        <span>

                                                            {item.label}

                                                        </span>


                                                        <div className="rating-track">

                                                            <div

                                                                className="rating-fill"

                                                                style={{
                                                                    width:
                                                                        `${percent}%`
                                                                }}

                                                            />

                                                        </div>


                                                        <strong>

                                                            {
                                                                item.count
                                                            }

                                                        </strong>


                                                    </div>

                                                );

                                            })
                                        }


                                    </>

                                )
                            }


                        </div>


                        {/* =================================
                            REVIEW FORM
                        ================================= */}

                        {
                            role === "ROLE_CUSTOMER" && (

                                <div

                                    className="review-form"

                                    ref={
                                        reviewFormRef
                                    }

                                >


                                    <h3>

                                        {
                                            editingReviewId

                                                ? "Edit your review"

                                                : "Share your experience"
                                        }

                                    </h3>


                                    <p className="review-subtitle">

                                        {
                                            editingReviewId

                                                ? "Update your rating and comment."

                                                : "How would you rate this artwork?"
                                        }

                                    </p>


                                    {/* =====================
                                        STAR PICKER
                                    ===================== */}

                                    <div className="star-picker">


                                        {
                                            [1, 2, 3, 4, 5].map(
                                                star => (

                                                    <span

                                                        key={
                                                            star
                                                        }

                                                        onClick={() =>
                                                            setRating(
                                                                star
                                                            )
                                                        }

                                                        style={{

                                                            color:

                                                                star <=
                                                                rating

                                                                    ? "#D4B483"

                                                                    : "#555"

                                                        }}

                                                        role="button"

                                                        tabIndex={0}

                                                        aria-label={`${star} star rating`}

                                                    >

                                                        ★

                                                    </span>

                                                )
                                            )
                                        }


                                    </div>


                                    {/* =====================
                                        COMMENT
                                    ===================== */}

                                    <textarea

                                        rows="5"

                                        placeholder="Share your experience with this artwork..."

                                        value={
                                            comment
                                        }

                                        onChange={
                                            e =>
                                                setComment(
                                                    e.target.value
                                                )
                                        }

                                    />


                                    {/* =====================
                                        FORM BUTTONS
                                    ===================== */}

                                    <div className="review-form-actions">


                                        <button

                                            type="button"

                                            className="btn-primary"

                                            onClick={
                                                submitReview
                                            }

                                        >

                                            {
                                                editingReviewId

                                                    ? "Update Review"

                                                    : "Submit Review"
                                            }

                                        </button>


                                        {
                                            editingReviewId && (

                                                <button

                                                    type="button"

                                                    className="btn-secondary"

                                                    onClick={
                                                        cancelEdit
                                                    }

                                                >

                                                    Cancel

                                                </button>

                                            )
                                        }


                                    </div>


                                </div>

                            )
                        }


                        {/* =================================
                            REVIEW LIST
                        ================================= */}

                        <div className="review-list">


                            {
                                reviews.length === 0 ? (

                                    <div className="no-reviews">

                                        <div
                                            style={{
                                                fontSize: "40px"
                                            }}
                                        >

                                            ☆

                                        </div>


                                        <strong>

                                            No reviews yet.

                                        </strong>


                                        <br />


                                        Be the first to review
                                        this artwork.

                                    </div>

                                ) : (

                                    reviews.map(
                                        review => {


                                            const isOwnReview =

                                                userId &&
                                                Number(userId) ===
                                                Number(
                                                    review.userId
                                                );


                                            return (

                                                <div

                                                    className="review-card"

                                                    key={
                                                        review.reviewId
                                                    }

                                                >


                                                    {/* =================
                                                        REVIEW HEADER
                                                    ================= */}

                                                    <div className="review-header">


                                                        <div className="review-user">


                                                            <div className="review-avatar">

                                                                {
                                                                    review.customerName
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase() ||
                                                                    "U"
                                                                }

                                                            </div>


                                                            <div>


                                                                <div className="review-name">

                                                                    {
                                                                        review.customerName
                                                                    }

                                                                </div>


                                                                <div className="review-date">

                                                                    {
                                                                        review.createdAt

                                                                            ? new Date(
                                                                                review.createdAt
                                                                            ).toLocaleDateString(
                                                                                undefined,
                                                                                {
                                                                                    year: "numeric",
                                                                                    month: "long",
                                                                                    day: "numeric"
                                                                                }
                                                                            )

                                                                            : ""
                                                                    }

                                                                </div>


                                                            </div>


                                                        </div>


                                                    </div>


                                                    {/* =================
                                                        STARS
                                                    ================= */}

                                                    <div className="review-stars">

                                                        {
                                                            "★".repeat(
                                                                Number(
                                                                    review.rating
                                                                ) || 0
                                                            )
                                                        }

                                                        {
                                                            "☆".repeat(
                                                                Math.max(
                                                                    0,
                                                                    5 -
                                                                    (
                                                                        Number(
                                                                            review.rating
                                                                        ) || 0
                                                                    )
                                                                )
                                                            )
                                                        }

                                                    </div>


                                                    {/* =================
                                                        COMMENT
                                                    ================= */}

                                                    <div className="review-comment">

                                                        {
                                                            review.comment
                                                        }

                                                    </div>


                                                    {/* =================
                                                        OWN REVIEW ACTIONS
                                                    ================= */}

                                                    {
                                                        isOwnReview && (

                                                            <div className="review-actions">


                                                                <button

                                                                    type="button"

                                                                    className="review-btn"

                                                                    onClick={() =>
                                                                        startEditingReview(
                                                                            review
                                                                        )
                                                                    }

                                                                >

                                                                    Edit

                                                                </button>


                                                                <button

                                                                    type="button"

                                                                    className="review-btn delete"

                                                                    onClick={() =>
                                                                        removeReview(
                                                                            review.reviewId
                                                                        )
                                                                    }

                                                                >

                                                                    Delete

                                                                </button>


                                                            </div>

                                                        )
                                                    }


                                                </div>

                                            );

                                        }
                                    )

                                )
                            }


                        </div>


                    </div>

                </div>

            </div>

        </div>

    );

}

export default ArtworkDetailsPage;