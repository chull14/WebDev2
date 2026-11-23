import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import WorkshopForm from '../components/WorkshopForm.jsx';
import ReassignInstructorForm from '../components/ReassignInstructorForm.jsx';

import {
  GET_WORKSHOP_BY_ID,
  GET_PARTICIPANTS_BY_WORKSHOP_ID,
  REMOVE_WORKSHOP
} from '../queries.js';

 
function WorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [error, setError] = useState('');
 
  const { data, loading, error: loadError } = useQuery(GET_WORKSHOP_BY_ID, { variables: { id } });
  const workshop = data?.getWorkshopById;
 
  // skipped until workshop exists
  const { data: participantData } = useQuery(GET_PARTICIPANTS_BY_WORKSHOP_ID, {
    variables: { workshopId: id },
    skip: !workshop
  });
  const roster = participantData?.getParticipantsByWorkshopId ?? [];
  const [removeWorkshop] = useMutation(REMOVE_WORKSHOP);
 
  async function handleDelete() {
    if (!window.confirm(`Delete ${workshop.title}?`)) return;

    try {
      await removeWorkshop({ variables: { _id: id } });
      navigate('/workshops');
    } catch (err) {
      setError(err.message);
    }
  }
 
  if (loading && !data) return <p>Loading workshop...</p>;
  if (loadError) return <p className="error">{loadError.message}</p>;
  if (!workshop) return <h1>Workshop Not Found</h1>;
 
  const instructor = workshop.instructor;
 
  return (
    <div>
      <h1>{workshop.title}</h1>
      <button onClick={() => setShowEdit(true)}>Edit Workshop</button>
      <button onClick={handleDelete}>Delete Workshop</button>
      <button onClick={() => setShowReassign(true)}>Reassign Instructor</button>
      {error && <p className="error">{error}</p>}
 
      <p>Category: {workshop.category}</p>
      <p>Location: {workshop.location}</p>
      <p>Duration: {workshop.duration_hours} hours</p>
      <p>Workshop dates: {workshop.workshop_start} - {workshop.workshop_end}</p>
      <p>Registration: {workshop.registration_open} - {workshop.registration_close}</p>
 
      <h2>Instructor</h2>
      {instructor ? (
        <p>
          <Link to={`/instructors/${instructor._id}`}>
            {instructor.first_name} {instructor.last_name}
          </Link>{' '}
          — {instructor.specialty}, {instructor.studio_name}
        </p>
      ) : (<p>No Instructor Assigned</p>)}
 
      <h2>Registered Participants ({workshop.numOfRegisteredParticipants})</h2>
      {workshop.registeredParticipants.length === 0 ? (<p>No Registered Participants</p>) : (
        <ul>
          {workshop.registeredParticipants.map((p) => (
            <li key={p._id}>
              <Link to={`/participants/${p._id}`}>{p.first_name} {p.last_name}</Link>
            </li>
          ))}
        </ul>
      )}
 
      <h2>Participant Roster</h2>
      {roster.length === 0 ? (<p>No Registered Participants</p>) : (
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Membership</th></tr>
          </thead>

          <tbody>
            {roster.map((p) => (
              <tr key={p._id}>
                <td><Link to={`/participants/${p._id}`}>{p.first_name} {p.last_name}</Link></td>
                <td>{p.email}</td>
                <td>{p.membership_level}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
 
      {showEdit && <WorkshopForm workshop={workshop} onClose={() => setShowEdit(false)} />}
      {showReassign && (<ReassignInstructorForm workshop={workshop} onClose={() => setShowReassign(false)} />)}
    </div>
  );
}
 
export default WorkshopDetail;