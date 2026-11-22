
function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className='search-bar'>
            <label htmlFor='search'>Search: </label>
            <input id='search' type='search' value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        </div>
    );
}

export default SearchBar;