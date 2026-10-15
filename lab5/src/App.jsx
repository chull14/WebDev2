import { useState } from 'react'
import './App.css'
import WorkoutList from './components/WorkoutList.jsx';
import CompletedWorkouts from './components/CompletedWorkouts.jsx';
import AddWorkout from './components/AddWorkout.jsx';

const initWorkouts = [
  { id: 1, name: 'Upper Body', category: 'Strength', scheduledDate: '10/02/2026', completed: false },
  { id: 2, name: 'Lower Body', category: 'Strength', scheduledDate: '10/06/2026', completed: false },
  { id: 3, name: 'Shoulders', category: 'Strength', scheduledDate: '10/09/2026', completed: false },
  { id: 4, name: 'Calisthenics', category: 'Strength', scheduledDate: '10/12/2026', completed: false },
  { id: 5, name: '5K Run', category: 'Cardio', scheduledDate: '10/14/2026', completed: false },
  { id: 6, name: 'Swimming', category: 'Cardio', scheduledDate: '10/17/2026', completed: false },
  { id: 7, name: 'Speedwalk', category: 'Cardio', scheduledDate: '10/20/2026', completed: false },
  { id: 8, name: 'Stretching', category: 'Flexibility', scheduledDate: '10/23/2026', completed: false },
  { id: 9, name: 'Yoga', category: 'Flexibility', scheduledDate: '10/27/2026', completed: false },
  { id: 10, name: 'Plyometrics', category: 'Strength', scheduledDate: '11/02/2026', completed: false }
];

function App() {
  const [workouts, setWorkouts] = useState(initWorkouts);

  const removeWorkout = (id) => {
    const filterWorkouts = workouts.filter((w) => w.id !== id);
    setWorkouts(filterWorkouts);
  };

  const toggleCompleted = (workout) => {
    const newWorkouts = workouts.map((w) => 
      w.id === workout.id ? { ...w, completed: !w.completed } : w 
    );
    setWorkouts(newWorkouts);
  };

  const addWorkout = (name, category, scheduledDate) => {
    const newId = workouts.length > 0 
    ? Math.max(...workouts.map((w) => w.id)) + 1 
    : 1;
    
    const newWorkout = {
      id: newId,
      name: name,
      category: category,
      scheduledDate: scheduledDate,
      completed: false
    };

    setWorkouts([...workouts, newWorkout]);
  };

  return (
    <div>
      <h2>Workouts To-do</h2>
      <WorkoutList
        workouts={workouts}
        toggleCompleted={toggleCompleted}
        removeWorkout={removeWorkout}
      />

      <h2>Completed Workouts</h2>
      <CompletedWorkouts
        workouts={workouts}
        toggleCompleted={toggleCompleted}
      />

      <h2>Add a Workout</h2>
      <AddWorkout 
        addWorkout={addWorkout} 
      />
    </div>
  )
}

export default App
