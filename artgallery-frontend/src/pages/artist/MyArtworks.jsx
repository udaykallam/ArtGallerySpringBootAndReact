import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyArtworks, deleteArtwork } from "../../services/artistService";
import { toast } from "sonner";

function MyArtworks() {

    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {

        loadArtworks();

    }, []);


    const loadArtworks = async () => {
        try {
            const data = await getMyArtworks();

            console.log("My artworks response:", data);

            setArtworks(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("Failed to load artworks:", error);

            setArtworks([]);

            toast.error(
                error.response?.data?.message ||
                "Failed to load your artworks."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this artwork?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(id);

        try {

            await deleteArtwork(id);

            toast.success(
                "Artwork deleted successfully."
            );

            await loadArtworks();

        } catch (error) {

            console.error(
                "Delete artwork error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Delete failed."
            );

        } finally {

            setDeletingId(null);

        }

    };


    if (loading) {

        return (

            <div className="loading-screen">

                <div className="load-mark">
                    ✦
                </div>

                <div className="load-text">
                    Loading your works...
                </div>

            </div>

        );

    }


    return (

        <div className="container">

            <div className="artist-page">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="list-header artist-list-header">

                    <div>

                        <div className="list-eyebrow">
                            Studio
                        </div>

                        <h1 className="list-title">
                            My Artworks
                        </h1>

                        {artworks.length > 0 && (

                            <p className="list-count">

                                {artworks.length}{" "}

                                {
                                    artworks.length === 1
                                        ? "work"
                                        : "works"
                                }{" "}

                                in your collection

                            </p>

                        )}

                    </div>


                    <Link to="/artist/upload">

                        <button
                            className="btn-primary"
                            style={{
                                width: "auto",
                                padding: "10px 24px"
                            }}
                        >
                            + Upload New Work
                        </button>

                    </Link>

                </div>


                {/* =========================
                    EMPTY STATE
                ========================= */}

                {artworks.length === 0 ? (

                    <div className="list-empty">

                        <div className="empty-mark">
                            ◈
                        </div>

                        <p className="empty-heading">
                            No artworks yet
                        </p>

                        <p className="empty-sub">
                            Begin by uploading your first
                            work to the gallery
                        </p>

                        <Link to="/artist/upload">

                            <button
                                className="btn-view"
                                style={{
                                    width: "auto",
                                    padding: "10px 28px"
                                }}
                            >
                                Upload Artwork
                            </button>

                        </Link>

                    </div>

                ) : (


                    /* =========================
                        ARTWORK GRID
                    ========================= */

                    <div className="art-grid">

                        {artworks.map((art) => (

                            <div
                                key={art.id}
                                className={
                                    `art-card${deletingId === art.id
                                        ? " art-card--deleting"
                                        : ""
                                    }`
                                }
                            >


                                {/* IMAGE */}

                                <div className="art-card-frame">

                                    {art.imageUrl ? (

                                        <img
                                            src={art.imageUrl}
                                            alt={art.title}
                                        />

                                    ) : (

                                        <div className="art-card-placeholder">
                                            ◈
                                        </div>

                                    )}

                                </div>


                                {/* CONTENT */}

                                <div className="art-card-content">

                                    <h3>
                                        {art.title}
                                    </h3>


                                    {/* CATEGORY */}

                                    {art.categoryName && (

                                        <p className="artist-name">
                                            {art.categoryName}
                                        </p>

                                    )}


                                    {/* PRICE */}

                                    <p className="art-price">

                                        ₹{" "}

                                        {Number(
                                            art.price || 0
                                        ).toLocaleString()}

                                    </p>


                                    {/* STOCK */}

                                    <div className="artwork-stock">

                                        <span className="stock-label">
                                            Stock
                                        </span>

                                        <span
                                            className={
                                                `stock-value ${art.stock === 0
                                                    ? "stock-out"
                                                    : art.stock <= 3
                                                        ? "stock-low"
                                                        : "stock-ok"
                                                }`
                                            }
                                        >

                                            {art.stock === 0
                                                ? "Out of stock"
                                                : art.stock}

                                        </span>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="art-card-actions">


                                        <Link
                                            to={`/artist/artworks/edit/${art.id}`}
                                            style={{
                                                flex: 1
                                            }}
                                        >

                                            <button
                                                className="btn-view"
                                                style={{
                                                    width: "100%"
                                                }}
                                            >
                                                Edit
                                            </button>

                                        </Link>


                                        <button
                                            className="btn-delete"
                                            onClick={() =>
                                                handleDelete(
                                                    art.id
                                                )
                                            }
                                            disabled={
                                                deletingId ===
                                                art.id
                                            }
                                        >

                                            {deletingId === art.id
                                                ? "Deleting..."
                                                : "Delete"}

                                        </button>

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

export default MyArtworks;