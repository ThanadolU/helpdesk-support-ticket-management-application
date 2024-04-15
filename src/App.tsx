import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Ticket from './pages/Ticket'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Ticket/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
