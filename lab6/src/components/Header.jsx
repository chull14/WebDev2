import { NavLink } from 'react-router-dom'

function Header() {
    return (
        <nav className='navigation'>
            <ul>
                <li>
                    <NavLink
                    to='/'
                    className={(navData) => (navData.isActive ? 'active' : 'none')}
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                    to='/artworks/page/1'
                    className={(navData) => (navData.isActive ? 'active' : 'none')}
                    >
                        Artworks
                    </NavLink>
                </li>
                <li>
                    <NavLink
                    to='/agents/page/1'
                    className={(navData) => (navData.isActive ? 'active' : 'none')}
                    >
                        Agents
                    </NavLink>
                </li>
                <li>
                    <NavLink
                    to='/exhibitions/page/1'
                    className={(navData) => (navData.isActive ? 'active' : 'none')}
                    >
                        Exhibitions
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Header;