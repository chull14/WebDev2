import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className='not-found'>
        <h1>404: Page Not Found</h1>
        <p>
            The page, artwork, or exhibition you are looking for does not exist.
        </p>
        <Link to='/'>Return to the Home page</Link>
    </section>
  );
};

export default NotFound;