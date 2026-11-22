import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { validatePage } from "../utils/helpers";
import { fetchList } from '../utils/api';
import ExhibitionCard from '../components/ExhibitionCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import NotFound from './NotFound';
import SearchBar from '../components/SearchBar';

const allFields = 'id,title,status,aic_start_at,aic_end_at,gallery_title,image_url';

function ExhibitionList() {
  const { page } = useParams();
  const numPage = validatePage(page);
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');


  useEffect(() => {
    if (numPage === null) return;

    async function fetchData() {
      setLoading(true);
      setNotFound(false);
      setSearch('');

      try {
        const res = await fetchList('exhibitions', numPage, allFields);
        if (res === null) {
          setNotFound(true);
        } else {
          setExhibitions(res.data);
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
  if (loading) return <Loading message='Loading Exhibitions...' />;
  if (notFound) return <NotFound/>;

  const filtered = exhibitions.filter((exhibition) => {
    const text = `${exhibition.title || ''} ${exhibition.gallery_title || ''} ${exhibition.status || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <section>
      <h1>Exhibitions</h1>
      <SearchBar value={search} onChange={setSearch} />
      {filtered.length === 0 && <p>No exhibitions found "{search}".</p>}

      <div className='card-grid'>
        {filtered.map((exhibition) => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>
      <Pagination currentPage={numPage} totalPages={totalPages} basePath={'/exhibitions/page'} />
    </section>
  )
}

export default ExhibitionList;