import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import Modal from './Modal.jsx';
import { ADD_INSTRUCTOR, EDIT_INSTRUCTOR } from '../queries.js';
import {
  checkString,
  validateEmail,
  validatePhone,
  validateDateJoined,
  validateChanges,
  toMMDDYYYY,
  toInputDate
} from '../helpers.js';

// 'instructor' param mutates instructor
// add instructor otherwise
function InstructorForm({ instructor, onClose }) {
  const original = {
    first_name: instructor?.first_name ?? '',
    last_name: instructor?.last_name ?? '',
    specialty: instructor?.specialty ?? '',
    studio_name: instructor?.studio_name ?? '',
    email: instructor?.email ?? '',
    phone: instructor?.phone ?? '',
    date_joined: instructor?.date_joined ?? ''
  };
  const [form, setForm] = useState(original);
  const [error, setError] = useState('');

  const options = { refetchQueries: 'active', awaitRefetchQueries: true };
  const [addInstructor, { loading: adding }] = useMutation(ADD_INSTRUCTOR, options);
  const [editInstructor, { loading: editing }] = useMutation(EDIT_INSTRUCTOR, options);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const values = {
        first_name: checkString(form.first_name, 'First name'),
        last_name: checkString(form.last_name, 'Last name'),
        specialty: checkString(form.specialty, 'Specialty'),
        studio_name: checkString(form.studio_name, 'Studio name'),
        email: validateEmail(form.email, 'Email'),
        phone: validatePhone(form.phone, 'Phone'),
        date_joined: validateDateJoined(form.date_joined, 'Date joined')
      };

      if (instructor) {
        const changes = validateChanges(original, values);
        await editInstructor({ variables: { _id: instructor._id, ...changes } });
      } else {
        await addInstructor({ variables: values });
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal title={instructor ? 'Edit Instructor' : 'Add Instructor'}>
      <form onSubmit={handleSubmit}>
        <label>First name
          <input name="first_name" value={form.first_name} onChange={handleChange} />
        </label>
        <label>Last name
          <input name="last_name" value={form.last_name} onChange={handleChange} />
        </label>
        <label>Specialty
          <input name="specialty" value={form.specialty} onChange={handleChange} />
        </label>
        <label>Studio name
          <input name="studio_name" value={form.studio_name} onChange={handleChange} />
        </label>
        <label>Email
          <input name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>Phone (###-###-####)
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>

        <label>Date joined
          <input
            type="date"
            value={toInputDate(form.date_joined)}
            onChange={(e) => setForm({ ...form, date_joined: toMMDDYYYY(e.target.value) })}
          />
        </label>

        {error && <p className="error">{error}</p>}


        <button type="submit" disabled={adding || editing}>Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
}

export default InstructorForm;