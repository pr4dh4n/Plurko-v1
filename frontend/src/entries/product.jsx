import React from 'react'
import ReactDOM from 'react-dom/client'
import SiteShell from '../components/SiteShell.jsx'
import '../styles/product.css'
import content from '../html/product.html?raw'
import { initProduct } from '../lib/pages/product.js'

document.body.classList.add('js-ready')
ReactDOM.createRoot(document.getElementById('root')).render(
  <SiteShell content={content} bodyClass="page-product" pageInit={initProduct} smooth={false} />
)
