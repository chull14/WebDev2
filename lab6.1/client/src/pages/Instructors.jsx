import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import InstructorForm from '../components/InstructorForm.jsx';

import {
  GET_INSTRUCTORS,
  GET_INSTRUCTORS_BY_STUDIO,
  GET_INSTRUCTORS_JOINED_BETWEEN,
  REMOVE_INSTRUCTOR
} from '../queries.js';

import { checkString, validateDateRange, toMMDDYYYY, toInputDate } from '../helpers.js';

function Instructors() {
  const [filter, setFilter] = useState(null);
  const [studio, setStudio] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [error, setError] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  // filter queries only run when filter applied
  const all = useQuery(GET_INSTRUCTORS);
  const byStudio = useQuery(GET_INSTRUCTORS_BY_STUDIO, { variables: filter, skip: !filter?.studio });
  const byDate = useQuery(GET_INSTRUCTORS_JOINED_BETWEEN, { variables: filter, skip: !filter?.start });

  const [removeInstructor] = useMutation(REMOVE_INSTRUCTOR, {
    refetchQueries: 'active',
    awaitRefetchQueries: true
  });

  const result = filter?.studio ? byStudio : filter?.start ? byDate : all;
  const instructors = result.data && Object.values(result.data)[0];

  function filterByStudio(e) {
    e.preventDefault();
    try {
      setFilter({ studio: checkString(studio, 'Studio name') });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  function filterByDate(e) {
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
    setStudio('');
    setStartDate('');
    setEndDate('');
    setError('');
  }

  async function handleDelete(instructor) {
    if (!window.confirm(`Delete ${instructor.first_name} ${instructor.last_name}?`)) return;
    try {
      await removeInstructor({ variables: { _id: instructor._id } });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Instructors</h1>
      <button onClick={() => setShowAdd(true)}>Add Instructor</button>

      <form onSubmit={filterByStudio}>
        <label>Studio name <input value={studio} onChange={(e) => setStudio(e.target.value)} /></label>
        <button type="submit">Filter by Studio</button>
      </form>
      <form onSubmit={filterByDate}>

        <label>Joined from{' '}
          <input type="date" value={toInputDate(startDate)}
            onChange={(e) => setStartDate(toMMDDYYYY(e.target.value))} />
        </label>

        <label> to{' '}
          <input type="date" value={toInputDate(endDate)}
            onChange={(e) => setEndDate(toMMDDYYYY(e.target.value))} />
        </label>

        <button type="submit">Filter by Date Joined</button>
      </form>
      <button onClick={clearFilters}>Clear Filters</button>

      {error && <p className="error">{error}</p>}

      {result.loading && !instructors ? (<p>Loading instructors...</p>) : 
        result.error ? (<p className="error">{result.error.message}</p>) : 
          !instructors?.length ? (<p>No Results Found</p>) : (
            <table>
              <thead>
                <tr><th>Name</th><th>Specialty</th><th>Studio</th><th>Workshops Taught</th><th></th></tr>
              </thead>

              <tbody>
                {instructors.map((i) => (
                  <tr key={i._id}>
                    <td><Link to={`/instructors/${i._id}`}>{i.first_name} {i.last_name}</Link></td>
                    <td>{i.specialty}</td>
                    <td>{i.studio_name}</td>
                    <td>{i.numOfWorkshops}</td>
                    <td>
                      <button onClick={() => setEditing(i)}>Edit</button>
                      <button onClick={() => handleDelete(i)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )
      }

      {showAdd && <InstructorForm onClose={() => setShowAdd(false)} />}
      {editing && <InstructorForm instructor={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

export default Instructors;