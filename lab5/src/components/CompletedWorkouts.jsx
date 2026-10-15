const CompletedWorkouts = (props) => {
    const completeWorkouts = props.workouts.filter((w) => w.completed);
    
    return (
    <div>
        {completeWorkouts.map((workout) => (
            <div key={workout.id}>
                <h1>{workout.name}</h1>
                <p>Category: {workout.category}</p>
                <p>Scheduled Date: {workout.scheduledDate}</p>
                <p>Completed: Yes</p>
                <button onClick={() => props.toggleCompleted(workout)}>Mark Not Completed</button>
            </div>
        ))}
    </div>
    );
};

export default CompletedWorkouts;