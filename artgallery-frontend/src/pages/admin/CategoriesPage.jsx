import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/adminService";

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => { loadCategories(); }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setSlug("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { name, slug };
            if (editingId) {
                await updateCategory(editingId, payload);
            } else {
                await createCategory(payload);
            }
            resetForm();
            loadCategories();
        } catch (error) {
            alert(error.response?.data || "Operation failed");
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setName(category.name);
        setSlug(category.slug || "");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        setDeletingId(id);
        try {
            await deleteCategory(id);
            loadCategories();
        } catch (error) {
            alert(error.response?.data || "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container">
            <div className="admin-page">

                <div className="list-header">
                    <div className="list-eyebrow">Administration</div>
                    <h1 className="list-title">Categories</h1>
                    {categories.length > 0 && (
                        <p className="list-count">{categories.length} {categories.length === 1 ? "category" : "categories"}</p>
                    )}
                </div>

                {/* ── Create / Edit form ── */}
                <div className="admin-form-card">
                    <div className="admin-form-eyebrow">
                        {editingId ? `Editing Category #${editingId}` : "New Category"}
                    </div>

                    <form onSubmit={handleSubmit} className="admin-form-row">
                        <div className="field-wrap" style={{ flex: 1 }}>
                            <label htmlFor="cat-name">Name</label>
                            <input
                                id="cat-name"
                                type="text"
                                placeholder="e.g. Romantic Era"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="field-wrap" style={{ flex: 2 }}>
                            <label htmlFor="cat-desc">Description</label>
                            <input
                                id="cat-desc"
                                type="text"
                                placeholder="Brief description"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </div>

                        <div className="admin-form-actions">
                            {editingId && (
                                <button type="button" className="btn-view" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                            <button className="btn-primary" type="submit" style={{ width: "auto", padding: "12px 24px" }}>
                                {editingId ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Table ── */}
                {loading ? (
                    <div className="loading-screen" style={{ minHeight: "200px" }}>
                        <div className="load-mark">✦</div>
                        <div className="load-text">Loading categories...</div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="list-empty">
                        <div className="empty-mark">◻</div>
                        <p className="empty-heading">No categories yet</p>
                        <p className="empty-sub">Create your first category above</p>
                    </div>
                ) : (
                    <div className="admin-table-card">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className={`${editingId === category.id ? "admin-row--editing" : ""}${deletingId === category.id ? " admin-row--deleting" : ""}`}
                                    >
                                        <td className="col-id">#{category.id}</td>
                                        <td className="col-name">{category.name}</td>
                                        <td className="col-desc">{category.slug || "—"}</td>
                                        <td className="col-actions">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(category)}
                                                disabled={deletingId === category.id}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(category.id)}
                                                disabled={deletingId === category.id}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}

export default CategoriesPage;