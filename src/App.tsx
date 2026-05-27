import { Navbar } from './components/navigation/Navbar'
import { Home } from './pages/Home'

// To preview the style guide instead of the home page, swap <Home /> for
// <StyleGuide /> below (import from './pages/StyleGuide').
function App() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  )
}

export default App
