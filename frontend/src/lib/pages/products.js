// Products page: sticky filter bar — click a pill to scroll to a category,
// and highlight the active pill while scrolling (scroll-spy). Returns a cleanup fn.
export function initProducts() {
  var pills = Array.prototype.slice.call(document.querySelectorAll('.filter-pill'))
  if (!pills.length) return
  var HEADER = 64, BAR = 56
  var sections = []
  pills.forEach(function (p) {
    var el = document.getElementById(p.getAttribute('data-target'))
    if (el) sections.push({ pill: p, el: el })
  })

  function scrollToId(id) {
    var t = document.getElementById(id)
    if (!t) return
    var y = t.getBoundingClientRect().top + window.pageYOffset - HEADER - BAR
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  var pillHandlers = []
  pills.forEach(function (p) {
    var h = function () {
      scrollToId(p.getAttribute('data-target'))
      pills.forEach(function (pp) { pp.classList.remove('active') })
      p.classList.add('active')
    }
    p.addEventListener('click', h)
    pillHandlers.push([p, h])
  })

  function updateActivePill() {
    var sy = window.pageYOffset + 140
    var active = null
    sections.forEach(function (s) { if (s.el.offsetTop <= sy) active = s })
    if (active) {
      pills.forEach(function (p) { p.classList.remove('active') })
      active.pill.classList.add('active')
    }
  }
  window.addEventListener('scroll', updateActivePill, { passive: true })
  updateActivePill()

  var heroCta = document.querySelector('.hero-cta-btn')
  var heroHandler
  if (heroCta) {
    heroHandler = function (e) { e.preventDefault(); scrollToId('categories') }
    heroCta.addEventListener('click', heroHandler)
  }

  return function cleanup() {
    pillHandlers.forEach(function (x) { x[0].removeEventListener('click', x[1]) })
    window.removeEventListener('scroll', updateActivePill)
    if (heroCta && heroHandler) heroCta.removeEventListener('click', heroHandler)
  }
}
