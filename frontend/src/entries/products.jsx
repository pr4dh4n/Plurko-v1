import React from 'react'
import ReactDOM from 'react-dom/client'
import SiteShell from '../components/SiteShell.jsx'
import '../styles/products.css'
import content from '../html/products.html?raw'
import { initProducts } from '../lib/pages/products.js'

document.body.classList.add('js-ready')
ReactDOM.createRoot(document.getElementById('root')).render(
  <SiteShell content={content} bodyClass="page-products" pageInit={initProducts} smooth={false} />
)
