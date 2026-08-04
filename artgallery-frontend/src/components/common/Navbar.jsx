import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (

        <nav className="navbar">

            <div className="nav-logo">

                <Link to="/">
                    Aurelian Gallery
                </Link>

            </div>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                {/* CUSTOMER */}

                {role === "ROLE_CUSTOMER" && (

                    <>
                        <Link to="/wishlist">
                            Wishlist
                        </Link>

                        <Link to="/cart">
                            Cart
                        </Link>

                        <Link to="/orders">
                            Orders
                        </Link>
                    </>

                )}

                {/* ARTIST */}

                {role === "ROLE_ARTIST" && (

                    <>
                        <Link to="/artist/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/artist/artworks">
                            My Artworks
                        </Link>

                        <Link to="/artist/upload">
                            Upload
                        </Link>

                        <Link to="/artist/orders">
                            Orders
                        </Link>
                    </>

                )}

                {/* ADMIN */}

                {role === "ROLE_ADMIN" && (

                    <>
                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/admin/artworks">
                            Artworks
                        </Link>

                        <Link to="/admin/categories">
                            Categories
                        </Link>

                        <Link to="/admin/users">
                            Users
                        </Link>

                        <Link to="/admin/orders">
                            Orders
                        </Link>
                    </>

                )}

                {token ? (

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>

                ) : (

                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>

                )}

            </div>

        </nav>
    );
}

export default Navbar;