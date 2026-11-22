import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Community Workshop Registration System</h1>
      <p>
        This system manages community workshops. Instructors teach workshops,
        and participants can register for workshops and manage their
        workshop registrations.
      </p>
      <ul>
        <li><Link to="/instructors">Instructors</Link></li>
        <li><Link to="/workshops">Workshops</Link></li>
        <li><Link to="/participants">Participants</Link></li>
      </ul>
    </div>
  );
}

export default Home;