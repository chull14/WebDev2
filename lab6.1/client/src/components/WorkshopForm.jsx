import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import Modal from './Modal.jsx';
import { ADD_WORKSHOP, EDIT_WORKSHOP, GET_INSTRUCTORS } from '../queries.js';


import {
  checkString,
  validateDuration,
  validateWorkshopDates,
  validateChanges,
  toMMDDYYYY,
  toInputDate
} from '../helpers.js';

const DATE_FIELDS = [
  ['registration_open', 'Registration open date'],
  ['registration_close', 'Registration close date'],
  ['workshop_start', 'Workshop start date'],
  ['workshop_end', 'Workshop end date']
];

// 'workshop' param mutates workshop
// add workshop otherwise
function WorkshopForm({ workshop, onClose }) {
  const original = {
    title: workshop?.title ?? '',
    category: workshop?.category ?? '',
    location: workshop?.location ?? '',
    duration_hours: workshop?.duration_hours ?? '',
    instructor: workshop?.instructor?._id ?? '',
    registration_open: workshop?.registration_open ?? '',
    registration_close: workshop?.registration_close ?? '',
    workshop_start: workshop?.workshop_start ?? '',
    workshop_end: workshop?.workshop_end ?? ''
  };
  const [form, setForm] = useState(original);
  const [error, setError] = useState('');

  const { data: instructorData } = useQuery(GET_INSTRUCTORS);

  const options = { refetchQueries: 'active', awaitRefetchQueries: true };
  const [addWorkshop, { loading: adding }] = useMutation(ADD_WORKSHOP, options);
  const [editWorkshop, { loading: editing }] = useMutation(EDIT_WORKSHOP, options);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      // checks all dates
      const dates = validateWorkshopDates(
        form.registration_open,
        form.registration_close,
        form.workshop_start,
        form.workshop_end
      );

      const values = {
        title: checkString(form.title, 'Title'),
        category: checkString(form.category, 'Category'),

        location: checkString(form.location, 'Location'),
        duration_hours: validateDuration(form.duration_hours),

        registration_open: dates.registrationOpen,
        registration_close: dates.registrationClose,

        workshop_start: dates.workshopStart,
        workshop_end: dates.workshopEnd
      };

      // for edits with no instructor
      if (!workshop || form.instructor) {
        values.instructor = checkString(form.instructor, 'Instructor');
      }

      if (workshop) {
        const changes = validateChanges(original, values);
        await editWorkshop({ variables: { _id: workshop._id, ...changes } });
      } else {
        await addWorkshop({ variables: values });
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal title={workshop ? 'Edit Workshop' : 'Add Workshop'}>
      <form onSubmit={handleSubmit}>
        <label>Title
          <input name="title" value={form.title} onChange={handleChange} />
        </label>
        <label>Category
          <input name="category" value={form.category} onChange={handleChange} />
        </label>
        <label>Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>
        <label>Duration (hours)
          <input
            type="number"
            name="duration_hours"
            value={form.duration_hours}
            onChange={handleChange}
          />
        </label>
        <label>Instructor
          <select name="instructor" value={form.instructor} onChange={handleChange}>
            <option value="">
              {workshop && !workshop.instructor ? 'No Instructor Assigned' : 'Select an instructor'}
            </option>
            {instructorData?.instructors.map((i) => (
              <option key={i._id} value={i._id}>
                {i.first_name} {i.last_name}
              </option>
            ))}
          </select>

        </label>
        {DATE_FIELDS.map(([name, label]) => (
          <label key={name}>{label}
            <input
              type="date"
              value={toInputDate(form[name])}
              onChange={(e) => setForm({ ...form, [name]: toMMDDYYYY(e.target.value) })}
            />
          </label>
        ))}

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={adding || editing}>Save</button>

        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
}

export default WorkshopForm;