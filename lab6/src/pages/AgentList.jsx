import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { validatePage } from "../utils/helpers";
import { fetchList } from '../utils/api';
import AgentCard from '../components/AgentCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import NotFound from './NotFound';
import SearchBar from '../components/SearchBar';

const allFields = 'id,title,agent_type_title,is_artist,birth_date,death_date';

function AgentList() {
  const { page } = useParams();
  const numPage = validatePage(page);
  const [agents, setAgents] = useState([]);
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
        const res = await fetchList('agents', numPage, allFields);
        if (res === null) {
          setNotFound(true);
        } else {
          setAgents(res.data);
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
  if (loading) return <Loading message='Loading agents...' />;
  if (notFound) return <NotFound/>;

  const filtered = agents.filter((agent) => {
    const text = (agent.title || '').toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <section>
      <h1>Agents</h1>
      <SearchBar value={search} onChange={setSearch} />
      {filtered.length === 0 && <p>No agents match "{search}".</p>}

      <div className='card-grid'>
        {filtered.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
      <Pagination currentPage={numPage} totalPages={totalPages} basePath={'/agents/page'} />
    </section>
  )
}

export default AgentList;