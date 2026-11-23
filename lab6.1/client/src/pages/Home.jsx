import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Community Workshop Registration System</h1>
      <p>
        This system manages community workshops. Workshops are taught by Instructors
        while Participants are those who register for the workshops. They can manage their 
        registration as well.
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