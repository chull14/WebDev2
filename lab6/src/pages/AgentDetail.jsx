import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { checkValue, stripHtml, validatePage } from "../utils/helpers";
import { fetchOne } from "../utils/api";
import NotFound from "./NotFound";
import Loading from "../components/Loading";
import DetailField from "../components/DetailField";


function AgentDetail() {
  const { id } = useParams();
  const valId = validatePage(id);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (valId === null) return;

    async function fetchData() {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetchOne('agents', valId);
        if (res === null) {
          setNotFound(true);
        } else {
          setAgent(res.data);
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
  
  let isArtist = null;
  if (agent.is_artist === true) isArtist = 'Yes';
  if (agent.is_artist === false) isArtist = 'No';

  return (
    <article className="detail">
      <h1>{agent.title || 'Unknown'}</h1>
      <p>ID: {agent.id}</p>

      <section>
        <h2>Details</h2>
        <DetailField label='Sort Title' value={agent.sort_title} />
        <DetailField label='Agent Type' value={agent.agent_type_title} />
        <DetailField label='Artist' value={isArtist} />
        <DetailField label='Birth Year' value={agent.birth_date} />
        <DetailField label='Death Year' value={agent.death_date} />
        <DetailField label='ULAN ID' value={agent.ulan_id} />
        <DetailField label='Wikidata ID' value={agent.wikidata_id} />
      </section>

      {checkValue(agent.alt_titles) && (
        <section>
          <h2>Alternate Names</h2>
          <ul>
            {agent.alt_titles.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>Description</h2>
        <p> {stripHtml(agent.description) || 'No description available'}</p>
      </section>

    </article>
  )
}

export default AgentDetail;