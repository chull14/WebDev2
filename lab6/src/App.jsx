import { Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import Home from './pages/Home'
import ArtworkList from './pages/ArtworkList'
import ArtworkDetail from './pages/ArtworkDetail'
import AgentList from './pages/AgentList'
import AgentDetail from './pages/AgentDetail'
import ExhibitionList from './pages/ExhibitionList'
import ExhibitionDetail from './pages/ExhibitionDetail'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Header /> 
      </header>
      <main>
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/artworks/page/:page' element={<ArtworkList />} />
          <Route path='/artworks/:id' element={<ArtworkDetail />} />

          <Route path='/agents/page/:page' element={<AgentList />} />
          <Route path='/agents/:id' element={<AgentDetail />} />

          <Route path='/exhibitions/page/:page' element={<ExhibitionList />} />
          <Route path='/exhibitions/:id' element={<ExhibitionDetail />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
