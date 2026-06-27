import { useEffect } from 'react'
import chromeHtml from '../html/chrome.html?raw'
import footerHtml from '../html/footer.html?raw'
import { initInteractions } from '../lib/interactions.js'
import '../styles/global.css'

/*
 * Shared site shell used by every page.
 *
 * Renders the fixed chrome (header, slide-in menu + fly-outs, search, floating CTA),
 * the smooth-scroll wrapper, the page's own content, and the shared footer — then runs
 * the shared interaction script once (theme, smooth scroll, header fade, menu, mega-menu,
 * search, scroll reveals). Page-specific behaviour (e.g. the datasheet PDF viewer) is passed
 * in via `pageInit`, which runs after the shared init and may return a cleanup function.
 *
 * `content` is the page's section markup (everything between the header and the footer).
 * `bodyClass` optionally scopes the page's CSS (e.g. "page-solutions").
 */
export default function SiteShell({ content, bodyClass = '', pageInit, smooth = true }) {
  useEffect(() => {
    initInteractions()
    let cleanup
    if (typeof pageInit === 'function') cleanup = pageInit()
    return () => { if (typeof cleanup === 'function') cleanup() }
  }, [pageInit])

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: chromeHtml }} />
      <div id="smooth-wrapper" className={smooth ? undefined : 'no-smooth'}>
        <div id="smooth-content">
          <div className={bodyClass} dangerouslySetInnerHTML={{ __html: content }} />
          <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
        </div>
      </div>
    </>
  )
}
