import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyArtworks, deleteArtwork } from "../../services/artistService";

function MyArtworks() {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => { loadArtworks(); }, []);

    const loadArtworks = async () => {
        try {
            const data = await getMyArtworks();
            setArtworks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this artwork?")) return;
        setDeletingId(id);
        try {
            await deleteArtwork(id);
            loadArtworks();
        } catch (error) {
            alert("Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="load-mark">✦</div>
                <div className="load-text">Loading your works...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="artist-page">

                <div className="list-header artist-list-header">
                    <div>
                        <div className="list-eyebrow">Studio</div>
                        <h1 className="list-title">My Artworks</h1>
                        {artworks.length > 0 && (
                            <p className="list-count">
                                {artworks.length} {artworks.length === 1 ? "work" : "works"} in your collection
                            </p>
                        )}
                    </div>
                    <Link to="/artist/upload">
                        <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }}>
                            + Upload New Work
                        </button>
                    </Link>
                </div>

                {artworks.length === 0 ? (
                    <div className="list-empty">
                        <div className="empty-mark">◈</div>
                        <p className="empty-heading">No artworks yet</p>
                        <p className="empty-sub">Begin by uploading your first work to the gallery</p>
                        <Link to="/artist/upload">
                            <button className="btn-view" style={{ width: "auto", padding: "10px 28px" }}>
                                Upload Artwork
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="art-grid">
                        {artworks.map((art) => (
                            <div key={art.id} className={`art-card${deletingId === art.id ? " art-card--deleting" : ""}`}>

                                <div className="art-card-frame">
                                    {art.imageUrl
                                        ? <img src={art.imageUrl} alt={art.title} />
                                        : <div className="art-card-placeholder">◈</div>
                                    }
                                </div>

                                <div className="art-card-content">
                                    <h3>{art.title}</h3>
                                    <p className="art-price">₹ {art.price?.toLocaleString()}</p>

                                    <div className="artwork-stock">
                                        <span className="stock-label">Stock</span>
                                        <span className={`stock-value ${art.stock === 0 ? "stock-out" : art.stock <= 3 ? "stock-low" : "stock-ok"}`}>
                                            {art.stock === 0 ? "Out of stock" : art.stock}
                                        </span>
                                    </div>

                                    <div className="art-card-actions">
                                        <Link to={`/artist/artworks/edit/${art.id}`} style={{ flex: 1 }}>
                                            <button className="btn-view" style={{ width: "100%" }}>Edit</button>
                                        </Link>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(art.id)}
                                            disabled={deletingId === art.id}
                                        >
                                            Delete
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