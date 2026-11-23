import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Modal from './Modal.jsx';
import { GET_INSTRUCTORS, REASSIGN_WORKSHOP_INSTRUCTOR } from '../queries.js';
import { checkString } from '../helpers.js';

function ReassignInstructorForm({ workshop, onClose }) {
  const [instructorId, setInstructorId] = useState('');
  const [error, setError] = useState('');
  const { data } = useQuery(GET_INSTRUCTORS);
  const [reassign, { loading }] = useMutation(REASSIGN_WORKSHOP_INSTRUCTOR, {
    refetchQueries: 'active',
    awaitRefetchQueries: true
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await reassign({
        variables: { workshopId: workshop._id, instructorId: checkString(instructorId, 'Instructor') }
      });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }


  return (
    <Modal title="Reassign Instructor">
      <form onSubmit={handleSubmit}>
        <label>New instructor
          <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)}>
            <option value="">Select an instructor</option>
            {data?.instructors.map((i) => (
              <option key={i._id} value={i._id}>{i.first_name} {i.last_name}</option>
            ))}
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
}

export default ReassignInstructorForm;