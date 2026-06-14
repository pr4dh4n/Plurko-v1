import { lazy, Suspense } from 'react'
import Skeleton from './components/Skeleton.jsx'

// Pages are code-split and lazy-loaded. While a page chunk is loading
// (slow network, first visit), the Skeleton fallback is shown instead of a blank screen.
const Home = lazy(() => import('./pages/Home.jsx'))

export default function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Home />
    </Suspense>
  )
}
