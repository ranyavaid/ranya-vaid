import { Navbar } from './components/navigation/Navbar'
import { Home } from './pages/Home'
import { AdnetDesignSystemCasePage } from './pages/AdnetDesignSystemCasePage'

// To preview the style guide instead of the home page, swap <Home /> for
// <StyleGuide /> below (import from './pages/StyleGuide').
function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isAdnetDesignSystemPage = pathname === '/works/adnet-design-system'

  return (
    <>
      <Navbar />
      {isAdnetDesignSystemPage ? <AdnetDesignSystemCasePage /> : <Home />}
    </>
  )
}

export default App
