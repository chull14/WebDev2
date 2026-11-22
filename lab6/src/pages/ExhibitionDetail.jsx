import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { validatePage, checkValue, stripHtml, formatDate, idToTitle } from '../utils/helpers';
import { fetchOne } from '../utils/api';
import DetailField from '../components/DetailField';
import RelatedList from '../components/RelatedList';
import Loading from '../components/Loading';
import NotFound from './NotFound';

function ExhibitionDetail() {
  const { id } = useParams();
  const numId = validatePage(id);

  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (numId === null) return;

    async function fetchData() {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetchOne('exhibitions', numId);
        if (res === null) {
          setNotFound(true);
        } else {
          setExhibition(res.data);
        }
        } catch {
          setNotFound(true);
        }
        setLoading(false);
    }
    fetchData();
  }, [numId]);

  if (numId === null) return <NotFound />;
  if (loading) return <Loading message='Loading exhibition...' />;
  if (notFound) return <NotFound />;

  let featured = null;
  if (exhibition.is_featured === true) featured = 'Yes';
  if (exhibition.is_featured === false) featured = 'No';

  const artworkPairs = idToTitle(exhibition.artwork_ids, exhibition.artwork_titles, 'Artwork');
  const agentPairs = idToTitle(exhibition.artist_ids, undefined, 'Agent');

  return (
    <article className='detail'>
      {checkValue(exhibition.image_url) && (
        <img className='detail-image' src={exhibition.image_url} alt={exhibition.title || 'Exhibition image'} />
      )}

      <h1>{exhibition.title || 'Untitled Exhibition'}</h1>
      <p>ID: {exhibition.id}</p>

      <section>
        <h2>Details</h2>
        <DetailField label='Status' value={exhibition.status} />
        <DetailField label='Featured' value={featured} />
        <DetailField label='Start Date' value={formatDate(exhibition.aic_start_at)} />
        <DetailField label='End Date' value={formatDate(exhibition.aic_end_at)} />
        <DetailField label='Gallery' value={exhibition.gallery_title} />
      </section>

      <section>
        <h2>About</h2>
        <p>{stripHtml(exhibition.short_description) || 'No description available.'}</p>
      </section>

      <RelatedList heading='Related Artworks' items={artworkPairs} path='/artworks' message='No related artworks.' />
      <RelatedList heading='Related Agents' items={agentPairs} path='/agents' message='No related agents.' />

      {checkValue(exhibition.web_url) && (
        <p>
          <a href={exhibition.web_url}>View on the Art Institute website</a>
        </p>
      )}
    </article>
  );
}

export default ExhibitionDetail;