import { Link } from 'react-router-dom'

function Pagination({ currentPage, totalPages, basePath }) {
    const showPrev = currentPage > 1;
    const showNxt = currentPage < totalPages;

    if (!showPrev && !showNxt) return null;

    let prevLink = null;
    let nextLink = null;

    if (showPrev) {
        prevLink = (
            <Link className='page-button' to={`${basePath}/${currentPage - 1}`}>
                Previous Page 
            </Link>
        );
    }

    if (showNxt) {
        nextLink = (
            <Link className='page-button' to={`${basePath}/${currentPage + 1}`}>
                Next Page
            </Link>
        );
    }

    return (
        <nav className='pagination'>
            {prevLink}
            <span className='page-info'>
                Page {currentPage} of {totalPages}
            </span>
            {nextLink}
        </nav>
    );
}

export default Pagination;