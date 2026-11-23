import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import InstructorForm from '../components/InstructorForm.jsx';
import {
  GET_INSTRUCTOR_BY_ID,
  GET_WORKSHOPS_BY_INSTRUCTOR_ID,
  REMOVE_INSTRUCTOR
} from '../queries.js';

function InstructorDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState('');


  const { data, loading, error: loadError } = useQuery(GET_INSTRUCTOR_BY_ID, { variables: { id } });
  const instructor = data?.getInstructorById;

  // skipped until instructor exists
  const { data: workshopData } = useQuery(GET_WORKSHOPS_BY_INSTRUCTOR_ID, {
    variables: { instructorId: id },
    skip: !instructor
  });
  const schedule = workshopData?.getWorkshopsByInstructorId ?? [];
  const [removeInstructor] = useMutation(REMOVE_INSTRUCTOR);

  async function handleDelete() {
    if (!window.confirm(`Delete ${instructor.first_name} ${instructor.last_name}?`)) return;
    try {
      await removeInstructor({ variables: { _id: id } });
      nav('/instructors');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading && !data) return <p>Loading instructor...</p>;
  if (loadError) return <p className="error">{loadError.message}</p>;
  if (!instructor) return <h1>Instructor Not Found</h1>;

  return (
    <div>
      <h1>{instructor.first_name} {instructor.last_name}</h1>
      <button onClick={() => setShowEdit(true)}>Edit Instructor</button>
      <button onClick={handleDelete}>Delete Instructor</button>
      {error && <p className="error">{error}</p>}

      <p>Specialty: {instructor.specialty}</p>
      <p>Studio: {instructor.studio_name}</p>
      <p>Email: {instructor.email}</p>
      <p>Phone: {instructor.phone}</p>
      <p>Date joined: {instructor.date_joined}</p>
      <p>Number of workshops taught: {instructor.numOfWorkshops}</p>

      <h2>Workshops Taught</h2>
      {instructor.workshops.length === 0 ? (<p>No Workshops Assigned</p>) : (
        <ul>
          {instructor.workshops.map((w) => (
            <li key={w._id}><Link to={`/workshops/${w._id}`}>{w.title}</Link></li>
          ))}
        </ul>
      )}

      <h2>Workshop Schedule</h2>
      {schedule.length === 0 ? (<p>No Workshops Assigned</p>) : (
        <table>
          <thead>
            <tr><th>Title</th><th>Category</th><th>Location</th><th>Start</th><th>End</th></tr>
          </thead>
          <tbody>
            {schedule.map((w) => (
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

      {showEdit && <InstructorForm instructor={instructor} onClose={() => setShowEdit(false)} />}
        
    </div>
  );
}

export default InstructorDetail;