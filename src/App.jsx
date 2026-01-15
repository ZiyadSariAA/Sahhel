import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import Lenis from 'lenis'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Browse = lazy(() => import('./pages/Browse'))
const Institution = lazy(() => import('./pages/Institution'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetails = lazy(() => import('./pages/CourseDetails'))
const FocusHub = lazy(() => import('./pages/FocusHub'))
const Account = lazy(() => import('./pages/Account'))

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  
  return null
}

// Lenis smooth scroll setup
function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      smoothTouch: false,
      touchMultiplier: 1.5,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])
  
  return null
}

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#1A1A1A]">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#7AA598] border-t-transparent"></div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <SmoothScroll />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/browse/:institutionId" element={<Institution />} />
          <Route path="/browse/:institutionId/:categoryId" element={<Courses />} />
          <Route path="/browse/:institutionId/:categoryId/course/:courseId" element={<CourseDetails />} />
          <Route path="/browse/:institutionId/course/:courseId" element={<CourseDetails />} />
          <Route path="/focus-hub" element={<FocusHub />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
