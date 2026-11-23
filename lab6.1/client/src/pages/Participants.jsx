import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import ParticipantForm from '../components/ParticipantForm.jsx';
import {
  GET_PARTICIPANTS,
  GET_PARTICIPANTS_BY_MEMBERSHIP,
  SEARCH_PARTICIPANTS_BY_LAST_NAME,
  REMOVE_PARTICIPANT
} from '../queries.js';
import { checkString } from '../helpers.js';

function Participants() {
  // The applied filter: null (show all), { level }, or { searchTerm }
  const [filter, setFilter] = useState(null);
  const [level, setLevel] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  // Each filter query only runs while its filter is applied
  const all = useQuery(GET_PARTICIPANTS);
  const byLevel = useQuery(GET_PARTICIPANTS_BY_MEMBERSHIP, { variables: filter, skip: !filter?.level });
  const byName = useQuery(SEARCH_PARTICIPANTS_BY_LAST_NAME, { variables: filter, skip: !filter?.searchTerm });
  const [removeParticipant] = useMutation(REMOVE_PARTICIPANT, {
    refetchQueries: 'active',
    awaitRefetchQueries: true
  });

  const result = filter?.level ? byLevel : filter?.searchTerm ? byName : all;
  // Each query returns one list, e.g. data.participants or data.getParticipantsByMembership
  const participants = result.data && Object.values(result.data)[0];

  function filterByLevel(e) {
    e.preventDefault();
    try {
      setFilter({ level: checkString(level, 'Membership level') });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  function searchByLastName(e) {
    e.preventDefault();
    try {
      setFilter({ searchTerm: checkString(lastName, 'Last name') });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  function clearFilters() {
    setFilter(null);
    setLevel('');
    setLastName('');
    setError('');
  }

  async function handleDelete(participant) {
    if (!window.confirm(`Delete ${participant.first_name} ${participant.last_name}?`)) return;
    try {
      await removeParticipant({ variables: { _id: participant._id } });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Participants</h1>
      <button onClick={() => setShowAdd(true)}>Add Participant</button>

      <form onSubmit={filterByLevel}>
        <label>Membership level{' '}
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Select a level</option>
            <option value="STANDARD">STANDARD</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
        </label>
        <button type="submit">Filter by Membership</button>
      </form>
      <form onSubmit={searchByLastName}>
        <label>Last name <input value={lastName} onChange={(e) => setLastName(e.target.value)} /></label>
        <button type="submit">Search</button>
      </form>
      <button onClick={clearFilters}>Clear Filters</button>

      {error && <p className="error">{error}</p>}

      {result.loading && !participants ? (<p>Loading participants...</p>) : 
        result.error ? (<p className="error">{result.error.message}</p>) : 
        !participants?.length ? (<p>No Results Found</p>) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Membership</th><th>Registered Workshops</th><th></th></tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p._id}>
                  <td><Link to={`/participants/${p._id}`}>{p.first_name} {p.last_name}</Link></td>
                  <td>{p.email}</td>
                  <td>{p.membership_level}</td>
                  <td>{p.numOfRegisteredWorkshops}</td>
                  <td>
                    <button onClick={() => setEditing(p)}>Edit</button>
                    <button onClick={() => handleDelete(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }

      {showAdd && <ParticipantForm onClose={() => setShowAdd(false)} />}
      {editing && <ParticipantForm participant={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

export default Participants;