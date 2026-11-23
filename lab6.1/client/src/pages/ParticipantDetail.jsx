import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import ParticipantForm from '../components/ParticipantForm.jsx';
import RegistrationForm from '../components/RegistrationForm.jsx';
import { GET_PARTICIPANT_BY_ID, REMOVE_PARTICIPANT } from '../queries.js';

function ParticipantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [registrationMode, setRegistrationMode] = useState(null); 
  const [error, setError] = useState('');

  const { data, loading, error: loadError } = useQuery(GET_PARTICIPANT_BY_ID, { variables: { id } });
  const participant = data?.getParticipantById;

  const [removeParticipant] = useMutation(REMOVE_PARTICIPANT);

  async function handleDelete() {
    if (!window.confirm(`Delete ${participant.first_name} ${participant.last_name}?`)) return;
    try {
      await removeParticipant({ variables: { _id: id } });
      navigate('/participants');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading && !data) return <p>Loading participant...</p>;
  if (loadError) return <p className="error">{loadError.message}</p>;
  if (!participant) return <h1>Participant Not Found</h1>;

  return (
    <div>
      <h1>{participant.first_name} {participant.last_name}</h1>
      <button onClick={() => setShowEdit(true)}>Edit Participant</button>
      <button onClick={handleDelete}>Delete Participant</button>
      <button onClick={() => setRegistrationMode('register')}>Register for Workshop</button>
      <button onClick={() => setRegistrationMode('unregister')}>Unregister from Workshop</button>
      {error && <p className="error">{error}</p>}

      <p>Email: {participant.email}</p>
      <p>Date of birth: {participant.date_of_birth}</p>
      <p>Membership level: {participant.membership_level}</p>

      <h2>Registered Workshops ({participant.numOfRegisteredWorkshops})</h2>
      {participant.registered_workshops.length === 0 ? (<p>No Registered Workshops</p>) : (
        <table>
          <thead>
            <tr><th>Title</th><th>Category</th><th>Location</th><th>Start</th><th>End</th></tr>
          </thead>
          <tbody>
            {participant.registered_workshops.map((w) => (
              <tr key={w._id}>
                <td><Link to={`/workshops/${w._id}`}>{w.title}</Link></td>
                <td>{w.category}</td>
                <td>{w.location}</td>
                <td>{w.workshop_start}</td>
                <td>{w.workshop_end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showEdit && <ParticipantForm participant={participant} onClose={() => setShowEdit(false)} />}
      {registrationMode && (
        <RegistrationForm
          participant={participant}
          mode={registrationMode}
          onClose={() => setRegistrationMode(null)}
        />
      )}
    </div>
  );
}

export default ParticipantDetail;