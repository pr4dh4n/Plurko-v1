import React from 'react'
import ReactDOM from 'react-dom/client'
import SiteShell from '../components/SiteShell.jsx'
import '../styles/solutions.css'
import content from '../html/solutions.html?raw'

document.body.classList.add('js-ready')
ReactDOM.createRoot(document.getElementById('root')).render(
  <SiteShell content={content} bodyClass="page-solutions" smooth={false} />
)
