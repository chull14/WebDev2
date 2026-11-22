import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className='home'>
      <h1>Art Institute Explorer</h1>
      <p>
        Explore artworks, artists, and exhibitions 
        from the Art Institute of Chicago collection.
      </p>

      <ul className='home-links'>
        <li><Link to='/artworks/page/1'>Browse Artworks</Link></li>
        <li><Link to='/agents/page/1'>Browse Agents</Link></li>
        <li><Link to='/exhibitions/page/1'>Browse Exhibitions</Link></li>
      </ul>
    </section>
  );
}

export default Home;