import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import Modal from './Modal.jsx';
import { ADD_PARTICIPANT, EDIT_PARTICIPANT } from '../queries.js';

import {
  checkString,
  validateEmail,
  validateDOB,
  validateChanges,
  toMMDDYYYY,
  toInputDate
} from '../helpers.js';

// 'participant' param mutates participant
// add participant otherwise
function ParticipantForm({ participant, onClose }) {
  const original = {
    first_name: participant?.first_name ?? '',
    last_name: participant?.last_name ?? '',
    email: participant?.email ?? '',
    date_of_birth: participant?.date_of_birth ?? '',
    membership_level: participant?.membership_level ?? ''
  };
  const [form, setForm] = useState(original);
  const [error, setError] = useState('');

  const options = { refetchQueries: 'active', awaitRefetchQueries: true };
  const [addParticipant, { loading: adding }] = useMutation(ADD_PARTICIPANT, options);
  const [editParticipant, { loading: editing }] = useMutation(EDIT_PARTICIPANT, options);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });


  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const values = {
        first_name: checkString(form.first_name, 'First name'),
        last_name: checkString(form.last_name, 'Last name'),
        email: validateEmail(form.email, 'Email'),
        date_of_birth: validateDOB(form.date_of_birth, 'Date of birth'),
        membership_level: checkString(form.membership_level, 'Membership level')
      };

      if (participant) {
        const changes = validateChanges(original, values);
        await editParticipant({ variables: { _id: participant._id, ...changes } });
      } else {
        await addParticipant({ variables: values });
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal title={participant ? 'Edit Participant' : 'Add Participant'}>
      <form onSubmit={handleSubmit}>
        <label>First name
          <input name="first_name" value={form.first_name} onChange={handleChange} />
        </label>
        <label>Last name
          <input name="last_name" value={form.last_name} onChange={handleChange} />
        </label>
        <label>Email
          <input name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>Date of birth
          <input
            type="date"
            value={toInputDate(form.date_of_birth)}
            onChange={(e) => setForm({ ...form, date_of_birth: toMMDDYYYY(e.target.value) })}
          />
        </label>
        <label>Membership level
          <select name="membership_level" value={form.membership_level} onChange={handleChange}>
            <option value="">Select a level</option>
            <option value="STANDARD">STANDARD</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
        </label>



        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={adding || editing}>Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
}

export default ParticipantForm;