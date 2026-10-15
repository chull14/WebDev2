const lateWorkout = (date) => {
    const [month, day, year] = date.split('/');
    const workoutDate = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0,0,0,0);
    return workoutDate < today;
}; 

const WorkoutList = (props) => {
    const incompleteWorkouts = props.workouts.filter((w) => !w.completed);
    
    return (
    <div>
        {incompleteWorkouts.map((workout) => {
            let overdueClass = '';
            
            if (lateWorkout(workout.scheduledDate)) {
                overdueClass = 'overdue';
            }
            
            return (
            <div key={workout.id}>
                <h1 className={overdueClass}>{workout.name}</h1>
                <p>Category: {workout.category}</p>
                <p className={overdueClass}>Scheduled Date: {workout.scheduledDate}</p>
                <p>Completed: No</p>
                <button onClick={() => props.removeWorkout(workout.id)}>Remove</button>
                <button onClick={() => props.toggleCompleted(workout)}>Mark Completed</button>
            </div>
            );
        })}
    </div>
    );
};

export default WorkoutList;
