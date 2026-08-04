import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArtworks } from "../../services/artworkService";

function HomePage() {
    const [artworks, setArtworks] = useState([]);

    useEffect(() => { loadArtworks(); }, []);

    const loadArtworks = async () => {
        try {
            const data = await getArtworks();
            setArtworks(data.content);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {/* Hero */}
            <div className="container">
                <div className="home-hero">
                    <div className="hero-eyebrow">The Permanent Collection</div>
                    <h1>Art Gallery</h1>
                    <p className="hero-sub">
                        European masters, rare acquisitions, and works available for private sale
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="container">
                <div className="collection-bar">
                    <span className="bar-label">All Works</span>
                    <span className="bar-count">{artworks.length} pieces on view</span>
                </div>
            </div>

            {/* Grid */}
            <div className="container">
                <div className="art-grid">
                    {artworks.map((art) => (
                        <div key={art.id} className="art-card">

                            <div className="art-card-frame">
                                <img src={art.imageUrl} alt={art.title} />
                            </div>

                            <div className="art-card-content">
                                <h3>{art.title}</h3>
                                <p className="artist-name">{art.artistName}</p>
                                <p className="art-price">₹ {art.price.toLocaleString()}</p>
                                <Link to={`/artworks/${art.id}`}>
                                    <button className="btn-view">View Details</button>
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;