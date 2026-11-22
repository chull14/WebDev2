import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { checkValue, stripHtml, validatePage } from "../utils/helpers";
import { fetchOne } from "../utils/api";
import NotFound from "./NotFound";
import Loading from "../components/Loading";
import ArtworkImage from "../components/ArtworkImage";
import DetailField from "../components/DetailField";


function ArtworkDetail() {
  const { id } = useParams();
  const valId = validatePage(id);
  const [artwork, setArtwork] = useState(null);
  const [iiifUrl, setIiifUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (valId === null) return;

    async function fetchData() {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetchOne('artworks', valId);
        if (res === null) {
          setNotFound(true);
        } else {
          setArtwork(res.data);
          setIiifUrl(res.config.iiif_url);
        }
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [valId]);

  if (valId === null) return <NotFound />;
  if (loading) return <Loading message='Loading artwork...' />;
  if (notFound) return <NotFound />;

  let artist = <p>Artist Information Unavailable.</p>;
  if (checkValue(artwork.artist_id)) {
    artist = (
      <p>
        <strong>Artist:</strong>{' '}
        <Link to={`/agents/${artwork.artist_id}`}>
        {artwork.artist_title || `Agent ${artwork.artist_id}`}
        </Link>
      </p>
    );
  } else if (checkValue.artist_title) {
    artist = <p><strong>Artist:</strong> {artwork.artist_title}</p>;
  }
  
  let onView = null;
  if (artwork.is_on_view === true) onView = 'Yes';
  if (artwork.is_on_view === false) onView = 'No';

  return (
    <article className="detail">
      <ArtworkImage iiifUrl={iiifUrl} imageId={artwork.image_id} title={artwork.title} width={843} />
      <h1>{artwork.title || 'Untitled'}</h1>
      <p>ID: {artwork.id}</p>

      {artist}
      <DetailField label='Artist Display' value={artwork.artist_display} />
      <DetailField label='Date' value={artwork.date_display} />
      <DetailField label='Place of Origin' value={artwork.place_of_origin} />

      <section>
        <h2>Description</h2>
        <p>
          {stripHtml(artwork.short_description) || 'No description available'}
        </p>
      </section>

      <section>
        <h2>Details</h2>
        <DetailField label='Artwork Type' value={artwork.artwork_type_title} />
        <DetailField label='Medium' value={artwork.medium_display} />
        <DetailField label='Dimensions' value={artwork.dimensions} />
        <DetailField label='Department' value={artwork.department_title} />
        <DetailField label='Gallery' value={artwork.gallery_title} />
        <DetailField label='Currently On View' value={onView} />
        <DetailField label='Credit Line' value={artwork.credit_line} />
        <DetailField label='Copyright' value={artwork.copyright_notice} />
      </section>

      <section>
        <h2>Classification</h2>
        <DetailField label='Categories' value={artwork.category_titles} />
        <DetailField label='Styles' value={artwork.style_titles} />
        <DetailField label='Themes' value={artwork.theme_titles} />
        <DetailField label='Subjects' value={artwork.subject_titles} />
        <DetailField label='Materials' value={artwork.material_titles} />
        <DetailField label='Techniques' value={artwork.technique_titles} />
      </section>
    </article>
  )
}

export default ArtworkDetail;