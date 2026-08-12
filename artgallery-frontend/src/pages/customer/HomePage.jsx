import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArtworks } from "../../services/artworkService";

function HomePage() {

    const [artworks, setArtworks] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        loadArtworks();

    }, []);


    const loadArtworks = async () => {

        try {

            const data = await getArtworks();

            setArtworks(
                data.content || []
            );

        } catch (error) {

            console.error(error);

        }

    };


    // =========================
    // SEARCH
    // =========================

    const filteredArtworks =
        artworks.filter((art) => {

            const searchTerm =
                search.toLowerCase().trim();

            if (!searchTerm) {
                return true;
            }

            const title =
                art.title?.toLowerCase() || "";

            const artist =
                art.artistName?.toLowerCase() || "";

            const category =
                art.categoryName?.toLowerCase() || "";

            return (
                title.includes(searchTerm) ||
                artist.includes(searchTerm) ||
                category.includes(searchTerm)
            );

        });


    return (

        <div>

            {/* =========================
                HERO
            ========================= */}

            <div className="container">

                <div className="home-hero">

                    <div className="hero-eyebrow">
                        The Permanent Collection
                    </div>

                    <h1>
                        Art Gallery
                    </h1>

                    <p className="hero-sub">
                        European masters, rare acquisitions,
                        and works available for private sale
                    </p>

                </div>

            </div>


            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="container">

                <div className="collection-bar">

                    <div>

                        <span className="bar-label">
                            All Works
                        </span>

                        <span className="bar-count">

                            {filteredArtworks.length}{" "}
                            {filteredArtworks.length === 1
                                ? "piece"
                                : "pieces"}{" "}
                            on view

                        </span>

                    </div>


                    {/* SEARCH */}

                    <div className="artwork-search">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search artworks..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (

                            <button
                                type="button"
                                className="search-clear"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =========================
                GRID
            ========================= */}

            <div className="container">

                {filteredArtworks.length > 0 ? (

                    <div className="art-grid">

                        {filteredArtworks.map((art) => (

                            <div
                                key={art.id}
                                className="art-card"
                            >

                                <div className="art-card-frame">

                                    <img
                                        src={art.imageUrl}
                                        alt={art.title}
                                    />

                                </div>


                                <div className="art-card-content">

                                    <h3>
                                        {art.title}
                                    </h3>

                                    <p className="artist-name">
                                        {art.artistName}
                                    </p>

                                    <p className="art-price">

                                        ₹{" "}

                                        {(
                                            art.discountedPrice ??
                                            art.price ??
                                            0
                                        ).toLocaleString()}

                                    </p>


                                    <Link
                                        to={`/artworks/${art.id}`}
                                    >

                                        <button
                                            className="btn-view"
                                        >
                                            View Details
                                        </button>

                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    /* =========================
                       NO RESULTS
                    ========================= */

                    <div className="no-search-results">

                        <div className="no-results-icon">
                            ⌕
                        </div>

                        <h2>
                            No artworks found
                        </h2>

                        <p>
                            We couldn't find any artwork
                            matching "{search}".
                        </p>

                        <button
                            className="btn-secondary"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            View All Artworks
                        </button>

                    </div>

                )}

            </div>

        </div>

    );

}

export default HomePage;