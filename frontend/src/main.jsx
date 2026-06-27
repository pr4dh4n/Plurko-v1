import React from 'react'
import ReactDOM from 'react-dom/client'
import SiteShell from './components/SiteShell.jsx'
import homeContent from './html/content.html?raw'

// Home page. Mark js-ready before first paint so reveal-on-scroll elements start hidden.
// No StrictMode: the ported interaction script binds listeners / rAF loops once.
document.body.classList.add('js-ready')
ReactDOM.createRoot(document.getElementById('root')).render(
  <SiteShell content={homeContent} />
)
