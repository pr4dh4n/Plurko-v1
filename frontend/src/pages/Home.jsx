import { useEffect } from 'react'
import chromeHtml from '../html/chrome.html?raw'
import contentHtml from '../html/content.html?raw'
import { initInteractions } from '../lib/interactions.js'
import '../styles/global.css'

/*
 * Home page.
 *
 * Migration note: the markup is injected verbatim from the original static site
 * (chrome.html = fixed header/menu/search/floating-CTA; content.html = the page
 * sections inside the smooth-scroll wrapper). All behaviour (theme, smooth scroll,
 * GSAP intro, mega-menu, insights coverflow, multi-step inquiry form, search) lives
 * in initInteractions() and runs once after mount.
 *
 * These sections will be split into data-driven React components as the CMS-backed
 * catalog/press/inquiry features come online.
 */
export default function Home() {
  useEffect(() => {
    initInteractions()
  }, [])

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: chromeHtml }} />
      <div id="smooth-wrapper">
        <div id="smooth-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    </>
  )
}
