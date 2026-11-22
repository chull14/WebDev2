import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import Instructors from './pages/Instructors.jsx'
import InstructorDetail from './pages/InstructorDetail.jsx'
import Workshops from './pages/Workshops.jsx'
import WorkshopDetail from './pages/WorkshopDetail.jsx'
import Participants from './pages/Participants.jsx'
import ParticipantDetail from './pages/ParticipantDetail.jsx'
import './App.css'

function App() {
  return (
    <>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/instructors/:id" element={<InstructorDetail />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops/:id" element={<WorkshopDetail />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/participants/:id" element={<ParticipantDetail />} />
        </Routes>
    </>
  );
}

export default App;