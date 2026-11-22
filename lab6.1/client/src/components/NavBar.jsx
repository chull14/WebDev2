import { NavLink } from 'react-router-dom'

function NavBar() {
    return (
        <nav>
            <NavLink to="/">Home </NavLink>
            <NavLink to="/instructors">Instructors </NavLink>
            <NavLink to='/workshops'>Workshops </NavLink>
            <NavLink to='/participants'>Participants</NavLink>
        </nav>
    );
}

export default NavBar;
