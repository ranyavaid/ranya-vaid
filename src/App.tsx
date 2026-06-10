import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/navigation/Navbar'
import { Home } from './pages/Home'
import { AdnetDesignSystemCasePage } from './pages/AdnetDesignSystemCasePage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/works/adnet-design-system"
          element={<AdnetDesignSystemCasePage />}
        />
      </Routes>
    </>
  )
}

export default App
