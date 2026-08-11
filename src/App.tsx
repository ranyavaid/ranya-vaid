import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/navigation/Navbar'
import { ScrollToTop } from './components/navigation/ScrollToTop'
import { Home } from './pages/Home'
import { AdnetDesignSystemCasePage } from './pages/AdnetDesignSystemCasePage'
import { OrganizationalHierarchyCasePage } from './pages/OrganizationalHierarchyCasePage'

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/works/adnet-design-system"
          element={<AdnetDesignSystemCasePage />}
        />
        <Route
          path="/works/improving-organizational-hierarchy"
          element={<OrganizationalHierarchyCasePage />}
        />
      </Routes>
    </>
  )
}

export default App
