import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { validatePage } from "../utils/helpers";
import { fetchList } from '../utils/api';
import ArtworkCard from '../components/ArtworkCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import NotFound from './NotFound';
import SearchBar from '../components/SearchBar';

const allFields = 'id,title,artist_title,date_display,image_id';

function ArtworkList() {
  const { page } = useParams();
  const numPage = validatePage(page);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [iiifUrl, setIiifUrl] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (numPage === null) return;

    async function fetchData() {
      setLoading(true);
      setNotFound(false);
      setSearch('');

      try {
        const res = await fetchList('artworks', numPage, allFields);
        if (res === null) {
          setNotFound(true);
        } else {
          setArtworks(res.data);
          setIiifUrl(res.config.iiif_url);
          setTotalPages(res.pagination.total_pages);
        }
      } catch {
          setNotFound(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [numPage]);

  if (numPage === null) return <NotFound/>;
  if (loading) return <Loading message='Loading artworks...' />;
  if (notFound) return <NotFound/>;

  const filtered = artworks.filter((artwork) => {
    const text = `${artwork.title || ''} ${artwork.artist_title || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <section>
      <h1>Artworks</h1>
      <SearchBar value={search} onChange={setSearch} />
      {filtered.length === 0 && <p>No artworks found "{search}".</p>}

      <div className='card-grid'>
        {filtered.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} iiifUrl={iiifUrl} />
        ))}
      </div>
      <Pagination currentPage={numPage} totalPages={totalPages} basePath={'/artworks/page'} />
    </section>
  )
}

export default ArtworkList;