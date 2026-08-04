import { useEffect, useState } from "react";
import { getUsers, blockUser, activateUser, deleteUser } from "../../services/adminService";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState(null);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async (id) => {
        setActingId(id);
        try {
            await blockUser(id);
            loadUsers();
        } catch (error) {
            alert("Operation failed");
        } finally {
            setActingId(null);
        }
    };

    const handleActivate = async (id) => {
        setActingId(id);
        try {
            await activateUser(id);
            loadUsers();
        } catch (error) {
            alert("Operation failed");
        } finally {
            setActingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        setActingId(id);
        try {
            await deleteUser(id);
            loadUsers();
        } catch (error) {
            alert("Delete failed");
        } finally {
            setActingId(null);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="load-mark">✦</div>
                <div className="load-text">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="admin-page">

                <div className="list-header">
                    <div className="list-eyebrow">Administration</div>
                    <h1 className="list-title">User Management</h1>
                    <p className="list-count">
                        {filteredUsers.length} of {users.length} {users.length === 1 ? "user" : "users"}
                    </p>
                </div>

                {/* ── Search & filter ── */}
                <div className="admin-form-card">
                    <div className="filter-row">
                        <div className="field-wrap" style={{ flex: 2 }}>
                            <label htmlFor="user-search">Search</label>
                            <input
                                id="user-search"
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="field-wrap" style={{ flex: 1 }}>
                            <label htmlFor="role-filter">Role</label>
                            <select
                                id="role-filter"
                                className="upload-select"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="ROLE_ADMIN">Admins</option>
                                <option value="ROLE_ARTIST">Artists</option>
                                <option value="ROLE_CUSTOMER">Customers</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="admin-table-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className={actingId === user.id ? "admin-row--deleting" : ""}
                                >
                                    <td className="col-id">#{user.id}</td>
                                    <td className="col-name">{user.name}</td>
                                    <td className="col-email">{user.email}</td>
                                    <td className="col-phone">{user.phone || "—"}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role?.replace("ROLE_", "").toLowerCase()}`}>
                                            {user.role?.replace("ROLE_", "")}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={user.enabled ? "user-status-active" : "user-status-blocked"}>
                                            <span className="user-status-dot" />
                                            {user.enabled ? "Active" : "Blocked"}
                                        </span>
                                    </td>
                                    <td className="col-actions">
                                        {user.enabled ? (
                                            <button
                                                className="btn-warning"
                                                onClick={() => handleBlock(user.id)}
                                                disabled={actingId === user.id}
                                            >
                                                Block
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-success"
                                                onClick={() => handleActivate(user.id)}
                                                disabled={actingId === user.id}
                                            >
                                                Activate
                                            </button>
                                        )}
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(user.id)}
                                            disabled={actingId === user.id}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="7">
                                        <div className="admin-table-empty">
                                            <div className="empty-mark">◌</div>
                                            <p className="empty-heading" style={{ fontSize: "18px" }}>No users found</p>
                                            <p className="empty-sub" style={{ marginBottom: 0 }}>Try adjusting your search or filter</p>
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

export default UsersPage;