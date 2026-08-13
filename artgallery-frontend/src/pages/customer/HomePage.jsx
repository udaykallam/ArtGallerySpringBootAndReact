import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getArtworks } from "../../services/artworkService";

function HomePage() {

    const [artworks, setArtworks] = useState([]);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("ALL");

    const [sortBy, setSortBy] = useState("NEWEST");

    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 8;


    // =========================
    // LOAD ARTWORKS
    // =========================

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

            console.error(
                "Failed to load artworks:",
                error
            );

        }

    };


    // =========================
    // CATEGORIES
    // =========================

    const categories = useMemo(() => {

        const categorySet =
            new Set();

        artworks.forEach((art) => {

            if (art.categoryName) {

                categorySet.add(
                    art.categoryName
                );

            }

        });

        return Array.from(
            categorySet
        ).sort();

    }, [artworks]);


    // =========================
    // FILTER + SORT
    // =========================

    const filteredArtworks = useMemo(() => {

        let result = [...artworks];


        // SEARCH

        const searchTerm =
            search
                .trim()
                .toLowerCase();


        if (searchTerm) {

            result = result.filter(
                (art) => {

                    const title =
                        art.title
                            ?.toLowerCase() || "";

                    const artist =
                        art.artistName
                            ?.toLowerCase() || "";

                    const categoryName =
                        art.categoryName
                            ?.toLowerCase() || "";


                    return (

                        title.includes(
                            searchTerm
                        ) ||

                        artist.includes(
                            searchTerm
                        ) ||

                        categoryName.includes(
                            searchTerm
                        )

                    );

                }
            );

        }


        // CATEGORY

        if (category !== "ALL") {

            result =
                result.filter(
                    (art) =>
                        art.categoryName ===
                        category
                );

        }


        // SORT

        result.sort((a, b) => {

            switch (sortBy) {

                case "PRICE_LOW":

                    return (
                        getArtworkPrice(a) -
                        getArtworkPrice(b)
                    );


                case "PRICE_HIGH":

                    return (
                        getArtworkPrice(b) -
                        getArtworkPrice(a)
                    );


                case "NAME_ASC":

                    return (
                        a.title || ""
                    ).localeCompare(
                        b.title || ""
                    );


                case "NAME_DESC":

                    return (
                        b.title || ""
                    ).localeCompare(
                        a.title || ""
                    );


                case "OLDEST":

                    return (
                        getArtworkDate(a) -
                        getArtworkDate(b)
                    );


                case "NEWEST":

                default:

                    return (
                        getArtworkDate(b) -
                        getArtworkDate(a)
                    );

            }

        });


        return result;

    }, [
        artworks,
        search,
        category,
        sortBy
    ]);


    // =========================
    // PAGINATION
    // =========================

    const totalPages =
        Math.ceil(
            filteredArtworks.length /
            ITEMS_PER_PAGE
        );


    const paginatedArtworks =
        filteredArtworks.slice(

            (currentPage - 1) *
                ITEMS_PER_PAGE,

            currentPage *
                ITEMS_PER_PAGE

        );


    // =========================
    // RESET PAGE WHEN FILTER CHANGES
    // =========================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        category,
        sortBy
    ]);


    // =========================
    // RESET FILTERS
    // =========================

    const resetFilters = () => {

        setSearch("");

        setCategory("ALL");

        setSortBy("NEWEST");

        setCurrentPage(1);

    };


    // =========================
    // PRICE HELPER
    // =========================

    function getArtworkPrice(art) {

        if (
            art.discountedPrice != null &&
            art.discountedPrice <
                art.price
        ) {

            return Number(
                art.discountedPrice
            );

        }

        return Number(
            art.price || 0
        );

    }


    // =========================
    // DATE HELPER
    // =========================

    function getArtworkDate(art) {

        const date =
            art.createdAt ||
            art.createdDate ||
            art.updatedAt;


        if (!date) {

            return 0;

        }


        return new Date(
            date
        ).getTime();

    }


    // =========================
    // PAGE CHANGE
    // =========================

    const goToPage = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {

            return;

        }

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // =========================
    // PAGE NUMBERS
    // =========================

    const pageNumbers =
        Array.from(
            {
                length: totalPages
            },
            (_, index) =>
                index + 1
        );


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
                        European masters, rare
                        acquisitions, and works
                        available for private sale
                    </p>

                </div>

            </div>


            {/* =========================
                FILTER TOOLBAR
            ========================= */}

            <div className="container">

                <div className="collection-toolbar">


                    {/* TOP ROW */}

                    <div className="collection-toolbar-top">


                        <div className="collection-info">

                            <span className="bar-label">
                                All Works
                            </span>

                            <span className="bar-count">

                                {filteredArtworks.length}{" "}

                                {
                                    filteredArtworks.length ===
                                    1
                                        ? "piece"
                                        : "pieces"
                                }{" "}

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
                                    setSearch(
                                        e.target.value
                                    )
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


                    {/* FILTER ROW */}

                    <div className="collection-filters">


                        {/* CATEGORY */}

                        <div className="filter-group">

                            <label>
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    All Categories
                                </option>

                                {categories.map(
                                    (cat) => (

                                        <option
                                            key={cat}
                                            value={cat}
                                        >
                                            {cat}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* SORT */}

                        <div className="filter-group">

                            <label>
                                Sort By
                            </label>

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="NEWEST">
                                    Newest
                                </option>

                                <option value="OLDEST">
                                    Oldest
                                </option>

                                <option value="PRICE_LOW">
                                    Price: Low to High
                                </option>

                                <option value="PRICE_HIGH">
                                    Price: High to Low
                                </option>

                                <option value="NAME_ASC">
                                    Name: A to Z
                                </option>

                                <option value="NAME_DESC">
                                    Name: Z to A
                                </option>

                            </select>

                        </div>


                        {/* RESET */}

                        {(search ||
                            category !== "ALL" ||
                            sortBy !== "NEWEST") && (

                            <button
                                type="button"
                                className="reset-filters"
                                onClick={
                                    resetFilters
                                }
                            >
                                Reset Filters
                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =========================
                ARTWORK GRID
            ========================= */}

            <div className="container">

                {paginatedArtworks.length > 0 ? (

                    <div className="art-grid">

                        {paginatedArtworks.map(
                            (art) => {

                                const price =
                                    getArtworkPrice(
                                        art
                                    );

                                const hasDiscount =
                                    art.discountedPrice != null &&
                                    art.discountedPrice <
                                        art.price;


                                return (

                                    <div
                                        key={art.id}
                                        className="art-card"
                                    >

                                        <div className="art-card-frame">

                                            <img
                                                src={
                                                    art.imageUrl
                                                }
                                                alt={
                                                    art.title
                                                }
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

                                                {hasDiscount && (

                                                    <span className="art-original-price">

                                                        ₹{" "}

                                                        {Number(
                                                            art.price
                                                        ).toLocaleString()}

                                                    </span>

                                                )}

                                                ₹{" "}

                                                {price.toLocaleString()}

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

                                );

                            }
                        )}

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

                            We couldn't find any
                            artwork matching your
                            current filters.

                        </p>

                        <button
                            className="btn-secondary"
                            onClick={
                                resetFilters
                            }
                        >
                            View All Artworks
                        </button>

                    </div>

                )}

            </div>


            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 1 && (

                <div className="container">

                    <div className="pagination">


                        <button
                            className="pagination-btn"
                            disabled={
                                currentPage === 1
                            }
                            onClick={() =>
                                goToPage(
                                    currentPage - 1
                                )
                            }
                        >
                            ←
                        </button>


                        {pageNumbers.map(
                            (page) => (

                                <button
                                    key={page}
                                    className={
                                        `pagination-number ${
                                            currentPage ===
                                            page
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        goToPage(
                                            page
                                        )
                                    }
                                >
                                    {page}
                                </button>

                            )
                        )}


                        <button
                            className="pagination-btn"
                            disabled={
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                goToPage(
                                    currentPage + 1
                                )
                            }
                        >
                            →
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}

export default HomePage;