import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import WorkshopForm from '../components/WorkshopForm.jsx';
import {
  GET_WORKSHOPS,
  GET_WORKSHOPS_BY_CATEGORY,
  GET_WORKSHOPS_BY_REGISTRATION_RANGE,
  REMOVE_WORKSHOP
} from '../queries.js';
import { checkString, validateDateRange, toMMDDYYYY, toInputDate } from '../helpers.js';

function Workshops() {
  const [filter, setFilter] = useState(null);
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  // filter query runs while its filter is applied
  const all = useQuery(GET_WORKSHOPS);
  const byCategory = useQuery(GET_WORKSHOPS_BY_CATEGORY, { variables: filter, skip: !filter?.category });
  const byRange = useQuery(GET_WORKSHOPS_BY_REGISTRATION_RANGE, { variables: filter, skip: !filter?.start });
  const [removeWorkshop] = useMutation(REMOVE_WORKSHOP, {
    refetchQueries: 'active',
    awaitRefetchQueries: true
  });

  const result = filter?.category ? byCategory : filter?.start ? byRange : all;
  const workshops = result.data && Object.values(result.data)[0];

  function filterByCategory(e) {
    e.preventDefault();
    try {
      setFilter({ category: checkString(category, 'Category') });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  function filterByRange(e) {
    e.preventDefault();
    try {
      setFilter(validateDateRange(startDate, endDate)); 
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  function clearFilters() {
    setFilter(null);
    setCategory('');
    setStartDate('');
    setEndDate('');
    setError('');
  };

  async function handleDelete(workshop) {
    if (!window.confirm(`Delete ${workshop.title}?`)) return;
    try {
      await removeWorkshop({ variables: { _id: workshop._id } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Workshops</h1>
      <button onClick={() => setShowAdd(true)}>Add Workshop</button>

      <form onSubmit={filterByCategory}>
        <label>Category <input value={category} onChange={(e) => setCategory(e.target.value)} /></label>
        <button type="submit">Filter by Category</button>
      </form>
      <form onSubmit={filterByRange}>

        <label>Registration from{' '}
          <input type="date" value={toInputDate(startDate)}
            onChange={(e) => setStartDate(toMMDDYYYY(e.target.value))} />
        </label>

        <label> to{' '}
          <input type="date" value={toInputDate(endDate)}
            onChange={(e) => setEndDate(toMMDDYYYY(e.target.value))} />
        </label>

        <button type="submit">Filter by Registration Dates</button>
      </form>
      <button onClick={clearFilters}>Clear Filters</button>

      {error && <p className="error">{error}</p>}

      {result.loading && !workshops ? (<p>Loading workshops...</p>) : 
        result.error ? (<p className="error">{result.error.message}</p>) : 
          !workshops?.length ? (<p>No Results Found</p>) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Category</th><th>Location</th><th>Hours</th>
                  <th>Instructor</th><th>Registered Participants</th><th></th>
                </tr>
              </thead>

              <tbody>
                {workshops.map((w) => (
                  <tr key={w._id}>
                    <td><Link to={`/workshops/${w._id}`}>{w.title}</Link></td>
                    <td>{w.category}</td>
                    <td>{w.location}</td>
                    <td>{w.duration_hours}</td>
                    <td>
                      {w.instructor ? `${w.instructor.first_name} ${w.instructor.last_name}` : 'No Instructor Assigned'}
                    </td>
                    <td>{w.numOfRegisteredParticipants}</td>
                    <td>
                      <button onClick={() => setEditing(w)}>Edit</button>
                      <button onClick={() => handleDelete(w)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )
        }

      {showAdd && <WorkshopForm onClose={() => setShowAdd(false)} />}
      {editing && <WorkshopForm workshop={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

export default Workshops;