import { useState } from 'react';

const getToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addWorkout = (props) => {
    const [ name, setName ] = useState('');
    const [ category, setCategory ] = useState('');
    const [ scheduledDate, setScheduledDate ] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const trimmedName = name.trim();
        const trimmedCategory = category.trim();
        const today = getToday();
    
        if (trimmedName.length < 2 || trimmedName.length > 100) {
            return;
        }
    
        if (trimmedCategory.length < 3 || trimmedCategory.length > 100) {
            return;
        }
    
        if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)) {
            return;
        }
    
        if (scheduledDate < today) {
            return;
        }
    
        const [year, month, day] = scheduledDate.split('-');
        const formattedDate = `${month}/${day}/${year}`;
    
        props.addWorkout(trimmedName, trimmedCategory, formattedDate);
    
        setName('');
        setCategory('');
        setScheduledDate('');
    }

    return (
    <form onSubmit={handleSubmit}>
        <label>
            Name:
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </label>
    
        <label>
            Category:
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
        </label>
    
        <label>
            Scheduled Date:
            <input
                type="date"
                value={scheduledDate}
                min={getToday()}
                onChange={(e) => setScheduledDate(e.target.value)}
            />
        </label>
    
        <button type="submit">Add Workout</button>
    </form>
    );
};

export default addWorkout;
