import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadArtwork, getCategories } from "../../services/artistService";

function UploadArtwork() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: "", description: "", medium: "", dimensions: "",
        price: "", discountPrice: "", stock: "", framed: false, categoryId: ""
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => { loadCategories(); }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) { console.error(error); }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreviews(files.map(f => URL.createObjectURL(f)));
    };

    const removePreview = (index) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        const newImages = images.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await uploadArtwork(formData, images);
            alert("Artwork uploaded successfully");
        } catch (error) {
            alert(error.response?.data?.message || "Upload failed");
        }
    };

    return (
        <div className="container">
            <div className="artist-page">

                <div className="list-header">
                    <div className="list-eyebrow">Studio</div>
                    <h1 className="list-title">Upload Artwork</h1>
                    <p className="list-count">Add a new work to your collection</p>
                </div>

                <form onSubmit={handleSubmit}>
                <div className="upload-layout">

                    {/* ── LEFT: Image Upload ── */}
                    <div className="upload-preview-wrap">

                        {previews.length === 0 ? (
                            <label htmlFor="artwork-images" className="upload-dropzone">
                                <div className="upload-placeholder">
                                    <div className="upload-placeholder-icon">◈</div>
                                    <p className="upload-placeholder-text">Click to select images</p>
                                    <p className="upload-placeholder-sub">JPG · PNG · WEBP · Multiple allowed</p>
                                </div>
                            </label>
                        ) : (
                            <div className="upload-preview-grid">
                                {previews.map((url, i) => (
                                    <div key={i} className="upload-preview-item">
                                        <img src={url} alt={`Preview ${i + 1}`} />
                                        <button
                                            type="button"
                                            className="upload-preview-remove"
                                            onClick={() => removePreview(i)}
                                            aria-label="Remove image"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                {/* Add more images tile */}
                                <label htmlFor="artwork-images" className="upload-add-more">
                                    <span>+</span>
                                    <span className="upload-add-label">Add more</span>
                                </label>
                            </div>
                        )}

                        <input
                            id="artwork-images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImages}
                            style={{ display: "none" }}
                        />

                        {previews.length > 0 && (
                            <p className="upload-image-count">
                                {previews.length} {previews.length === 1 ? "image" : "images"} selected
                            </p>
                        )}
                    </div>

                    {/* ── RIGHT: Form Fields ── */}
                    <div className="upload-form">

                        {/* Title */}
                        <div className="field-wrap">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                name="title"
                                placeholder="e.g. Study of a Woman in Amber Light"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="field-wrap">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="upload-textarea"
                                placeholder="Describe the work — its inspiration, technique, and story..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>

                        {/* Category */}
                        <div className="field-wrap">
                            <label htmlFor="categoryId">Category</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                className="upload-select"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Medium + Dimensions */}
                        <div className="upload-row-2">
                            <div className="field-wrap">
                                <label htmlFor="medium">Medium</label>
                                <input
                                    id="medium"
                                    name="medium"
                                    placeholder="e.g. Oil on canvas"
                                    value={formData.medium}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="field-wrap">
                                <label htmlFor="dimensions">Dimensions</label>
                                <input
                                    id="dimensions"
                                    name="dimensions"
                                    placeholder="e.g. 60 × 80 cm"
                                    value={formData.dimensions}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Price + Discount Price */}
                        <div className="upload-row-2">
                            <div className="field-wrap">
                                <label htmlFor="price">Price (₹)</label>
                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    placeholder="0"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="field-wrap">
                                <label htmlFor="discountPrice">Discount Price (₹) <span className="field-optional">optional</span></label>
                                <input
                                    id="discountPrice"
                                    type="number"
                                    name="discountPrice"
                                    placeholder="Leave blank if none"
                                    min="0"
                                    value={formData.discountPrice}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Stock + Framed */}
                        <div className="upload-row-2">
                            <div className="field-wrap">
                                <label htmlFor="stock">Stock</label>
                                <input
                                    id="stock"
                                    type="number"
                                    name="stock"
                                    placeholder="1"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
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

                        {/* Divider */}
                        <div className="upload-form-divider" />

                        {/* Actions */}
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
                                Upload to Gallery
                            </button>
                        </div>

                    </div>
                </div>
                </form>

            </div>
        </div>
    );
}

export default UploadArtwork;