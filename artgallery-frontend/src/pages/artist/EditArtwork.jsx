import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArtworkById, updateArtwork } from "../../services/artistService";

function EditArtwork() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "", description: "", medium: "", dimensions: "",
        price: "", discountPrice: "", stock: "", framed: false
    });

    useEffect(() => { loadArtwork(); }, []);

    const loadArtwork = async () => {
        try {
            const artwork = await getArtworkById(id);
            setFormData({
                title:         artwork.title         || "",
                description:   artwork.description   || "",
                medium:        artwork.medium        || "",
                dimensions:    artwork.dimensions    || "",
                price:         artwork.price         || "",
                discountPrice: artwork.discountPrice || "",
                stock:         artwork.stock         || "",
                framed:        artwork.framed        || false,
            });
        } catch (error) {
            alert("Failed to load artwork");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateArtwork(id, formData);
            alert("Artwork updated successfully");
            navigate("/artist/artworks");
        } catch (error) {
            alert(error.response?.data?.message || "Update failed");
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="load-mark">✦</div>
                <div className="load-text">Loading artwork...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="artist-page">

                <div className="list-header">
                    <div className="list-eyebrow">Studio</div>
                    <h1 className="list-title">Edit Artwork</h1>
                    <p className="list-count">Update the details of this work</p>
                </div>

                <form onSubmit={handleSubmit}>
                <div className="upload-layout">

                    {/* ── LEFT: identity panel ── */}
                    <div className="edit-identity-panel">
                        <div className="edit-identity-mark">◈</div>
                        <p className="edit-identity-label">Editing</p>
                        <p className="edit-identity-title">{formData.title || "Untitled"}</p>
                        <div className="edit-identity-divider" />
                        <div className="edit-identity-meta">
                            <div className="edit-meta-row">
                                <span className="edit-meta-key">Medium</span>
                                <span className="edit-meta-val">{formData.medium || "—"}</span>
                            </div>
                            <div className="edit-meta-row">
                                <span className="edit-meta-key">Dimensions</span>
                                <span className="edit-meta-val">{formData.dimensions || "—"}</span>
                            </div>
                            <div className="edit-meta-row">
                                <span className="edit-meta-key">Price</span>
                                <span className="edit-meta-val">
                                    {formData.price ? `₹ ${Number(formData.price).toLocaleString()}` : "—"}
                                </span>
                            </div>
                            <div className="edit-meta-row">
                                <span className="edit-meta-key">Stock</span>
                                <span className="edit-meta-val">{formData.stock || "—"}</span>
                            </div>
                        </div>
                        <p className="edit-identity-note">Values update as you type</p>
                    </div>

                    {/* ── RIGHT: form ── */}
                    <div className="upload-form">

                        <div className="field-wrap">
                            <label htmlFor="title">Title</label>
                            <input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Artwork title" required />
                        </div>

                        <div className="field-wrap">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="upload-textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the work..."
                                rows={4}
                            />
                        </div>

                        <div className="upload-row-2">
                            <div className="field-wrap">
                                <label htmlFor="medium">Medium</label>
                                <input id="medium" name="medium" value={formData.medium} onChange={handleChange} placeholder="e.g. Oil on canvas" />
                            </div>
                            <div className="field-wrap">
                                <label htmlFor="dimensions">Dimensions</label>
                                <input id="dimensions" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="e.g. 60 × 80 cm" />
                            </div>
                        </div>

                        <div className="upload-row-2">
                            <div className="field-wrap">
                                <label htmlFor="price">Price (₹)</label>
                                <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0" min="0" required />
                            </div>
                            <div className="field-wrap">
                                <label htmlFor="discountPrice">
                                    Discount Price (₹) <span className="field-optional">optional</span>
                                </label>
                                <input id="discountPrice" type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="Leave blank if none" min="0" />
                            </div>
                        </div>

                        <div className="upload-row-2">
                            <div className="field-wrap">
                                <label htmlFor="stock">Stock</label>
                                <input id="stock" type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="1" min="0" required />
                            </div>
                            <div className="field-wrap field-wrap--center">
                                <label>Presentation</label>
                                <label className="upload-checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="framed"
                                        checked={formData.framed}
                                        onChange={handleChange}
                                        className="upload-checkbox"
                                    />
                                    <span className="upload-checkbox-box" />
                                    Framed artwork
                                </label>
                            </div>
                        </div>

                        <div className="upload-form-divider" />

                        <div className="upload-actions">
                            <button
                                type="button"
                                className="btn-view"
                                style={{ flex: 1, padding: "12px" }}
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ flex: 2, padding: "12px" }}
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>
                </form>

            </div>
        </div>
    );
}

export default EditArtwork;