import { useEffect, useState } from "react";
import {
    getAdminArtworks,
    featureArtwork,
    unfeatureArtwork,
    overridePrice,
    removeArtwork
} from "../../services/adminService";

function ArtworksPage() {
    const [artworks, setArtworks] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState(null);

    useEffect(() => { loadArtworks(); }, []);

    const loadArtworks = async () => {
        try {
            const data = await getAdminArtworks();
            setArtworks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeature = async (artwork) => {
        setActingId(artwork.id);
        try {
            if (artwork.featured) await unfeatureArtwork(artwork.id);
            else await featureArtwork(artwork.id);
            loadArtworks();
        } catch (error) {
            alert("Operation failed");
        } finally {
            setActingId(null);
        }
    };

    const handleOverridePrice = async (artwork) => {
        const price = prompt("Enter override price", artwork.adminOverridePrice || artwork.price);
        if (!price) return;
        setActingId(artwork.id);
        try {
            await overridePrice(artwork.id, Number(price));
            loadArtworks();
        } catch (error) {
            alert("Failed");
        } finally {
            setActingId(null);
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm("Remove artwork?")) return;
        setActingId(id);
        try {
            await removeArtwork(id);
            loadArtworks();
        } catch (error) {
            alert("Delete failed");
        } finally {
            setActingId(null);
        }
    };

    const filtered = artworks.filter((art) =>
        art.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="load-mark">✦</div>
                <div className="load-text">Loading artworks...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="admin-page">

                <div className="list-header">
                    <div className="list-eyebrow">Administration</div>
                    <h1 className="list-title">Artwork Management</h1>
                    <p className="list-count">
                        {filtered.length} of {artworks.length} {artworks.length === 1 ? "work" : "works"}
                    </p>
                </div>

                {/* ── Search ── */}
                <div className="admin-form-card">
                    <div className="field-wrap">
                        <label htmlFor="art-search">Search</label>
                        <input
                            id="art-search"
                            type="text"
                            placeholder="Search by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="admin-table-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Work</th>
                                <th>Artist</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Sales</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((art) => {
                                const hasOverride = art.adminOverridePrice && art.adminOverridePrice !== art.price;
                                return (
                                    <tr
                                        key={art.id}
                                        className={actingId === art.id ? "admin-row--deleting" : ""}
                                    >
                                        {/* Work = thumbnail + title combined */}
                                        <td>
                                            <div className="artwork-cell">
                                                <div className="artwork-cell-thumb">
                                                    {art.imageUrl
                                                        ? <img src={art.imageUrl} alt={art.title} />
                                                        : <span className="artwork-cell-placeholder">◈</span>
                                                    }
                                                </div>
                                                <span className="artwork-cell-title">{art.title}</span>
                                            </div>
                                        </td>

                                        <td className="col-customer">{art.artistName}</td>
                                        <td className="col-customer">{art.categoryName}</td>

                                        <td>
                                            <div className="admin-price-cell">
                                                <span className={hasOverride ? "admin-price-override" : "admin-price-normal"}>
                                                    ₹ {(art.adminOverridePrice || art.price)?.toLocaleString()}
                                                </span>
                                                {hasOverride && <span className="admin-price-tag">Override</span>}
                                            </div>
                                        </td>

                                        <td>
                                            <span className={`stock-value ${art.stock === 0 ? "stock-out" : art.stock <= 3 ? "stock-low" : "stock-ok"}`}>
                                                {art.stock === 0 ? "Out" : art.stock}
                                            </span>
                                        </td>

                                        <td className="col-qty">{art.totalSales}</td>

                                        <td>
                                            {art.featured
                                                ? <span className="featured-badge">★ Featured</span>
                                                : <span className="not-featured-dash">—</span>
                                            }
                                        </td>

                                        <td className="col-actions">
                                            <button
                                                className={art.featured ? "btn-warning" : "btn-success"}
                                                onClick={() => handleFeature(art)}
                                                disabled={actingId === art.id}
                                            >
                                                {art.featured ? "Unfeature" : "Feature"}
                                            </button>
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleOverridePrice(art)}
                                                disabled={actingId === art.id}
                                            >
                                                Price
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleRemove(art.id)}
                                                disabled={actingId === art.id}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="8">
                                        <div className="admin-table-empty">
                                            <div className="empty-mark">◻</div>
                                            <p className="empty-heading" style={{ fontSize: "18px" }}>No artworks found</p>
                                            <p className="empty-sub" style={{ marginBottom: 0 }}>Try a different search term</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default ArtworksPage;