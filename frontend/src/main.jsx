import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Mark JS-ready before first paint so reveal-on-scroll elements start hidden
document.body.classList.add('js-ready')

// No StrictMode: the ported interaction script binds listeners / rAF loops once,
// and StrictMode's double-invoke in dev would double-bind them.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
