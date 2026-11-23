import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Modal from './Modal.jsx';
import { GET_WORKSHOPS, REGISTER_FOR_WORKSHOP, UNREGISTER_FROM_WORKSHOP } from '../queries.js';
import { checkString } from '../helpers.js';

// 'register' or 'unregister'
function RegistrationForm({ participant, mode, onClose }) {
  const isRegister = mode === 'register';
  const [workshopId, setWorkshopId] = useState('');
  const [error, setError] = useState('');

  const { data } = useQuery(GET_WORKSHOPS, { skip: !isRegister });
  const options = { refetchQueries: 'active', awaitRefetchQueries: true };
  const [register, { loading: registering }] = useMutation(REGISTER_FOR_WORKSHOP, options);
  const [unregister, { loading: unregistering }] = useMutation(UNREGISTER_FROM_WORKSHOP, options);

  // register every workshop the participant is not in
  // unregister only the workshops participant is in
  const registeredIds = participant.registered_workshops.map((w) => w._id);
  const workshops = isRegister ? (data?.workshops ?? []).filter((w) => !registeredIds.includes(w._id)) : participant.registered_workshops;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const variables = {
        participantId: participant._id,
        workshopId: checkString(workshopId, 'Workshop')
      };
      
      await (isRegister ? register({ variables }) : unregister({ variables }));
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal title={isRegister ? 'Register for Workshop' : 'Unregister from Workshop'}>
      <form onSubmit={handleSubmit}>

        <label>Workshop
          <select value={workshopId} onChange={(e) => setWorkshopId(e.target.value)}>
            <option value="">Select a workshop</option>
            {workshops.map((w) => (
              <option key={w._id} value={w._id}>{w.title}</option>
            ))}
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={registering || unregistering}>Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
}

export default RegistrationForm;