// Page-specific behaviour for the PCIe Gen 5 product page.
//
// This is everything from the original product-pcie-gen5.html inline script that is
// NOT shared boilerplate (theme toggle, smooth scroll, header-on-scroll, hamburger
// menu, mega-menu, header search, search popup and IntersectionObserver reveals all
// live in the shared interactions.js / SiteShell). What remains and lives here:
//   - the PRODUCT data object + DOM population (breadcrumb, header, stats, features,
//     applications, deliverables, quick reference, brief filename/download links)
//   - the protocol-stack layer diagram + the visual diagram builder overlay (vb-*)
//   - the tab switching + the pdf.js datasheet viewer (loadPdf)
//
// The pdf.js library itself is loaded from a CDN <script> in the entry HTML's <head>,
// exposing window.pdfjsLib — we do NOT import/inline it here.
//
// Returns a cleanup function that removes the document-level keydown listeners this
// module attaches (diagram builder shortcuts, PDF page navigation), so React can tear
// it down cleanly on unmount / hot-reload.

export function initProduct() {
  const teardown = [];
  try {

    var PRODUCT = {
      name: 'PCIe Gen 5 Controller IP',
      category: 'Interface IP',
      subcategory: 'PCIe',
      vendor: 'PrimeSoc',
      description: 'High-speed, point-to-point serial interconnect with signalling rate of 32.0 GT/s per lane. Implements Transaction, Data Link, and Physical layers with PIPE interface logic for PHY communication and AXI bridge logic for high-performance system fabrics.',
      pdfPath: '/docs/pcie-gen5-brief.pdf',
      stats: [
        { value: '32 GT/s', label: 'Throughput' },
        { value: 'Gen 3–5', label: 'Compatible' },
        { value: 'x1–x16', label: 'Lanes' },
        { value: 'FEC', label: 'Data Integrity' }
      ],
      features: [
        '32 GT/s max data throughput per lane',
        'Root Port, Endpoint, Switch Port, Dual-Mode, Retimer configurations',
        'FLIT and non-FLIT virtual channel topologies',
        'Forward Error Correction (FEC) for enhanced data integrity',
        'Lane configurations: x1, x2, x4, x8, x16',
        'Backward compatible with PCIe 4.0 and 3.1/3.0',
        'RAS (Reliability, Availability, Serviceability) features',
        'Lane Orientation Polarity (LOP) for flexible board routing'
      ],
      applications: [
        'Consumer Electronics', 'Defence & Aerospace', 'Virtual Reality',
        'Augmented Reality', 'Medical', 'Biometrics',
        'Automotive Devices', 'Sensor Devices'
      ],
      deliverables: [
        'Verilog Source Code',
        'User Guide',
        'IP Integration Guide',
        'Run & Synthesis Scripts',
        'Encrypted Verification Testbench'
      ],
      layers: [
        { name: 'Transaction Layer', sub: 'TLP Generation & Processing' },
        { name: 'Data Link Layer', sub: 'DLLP, Flow Control, Retry' },
        { name: 'Physical Layer', sub: 'Digital Packet & Encoding' }
      ],
      interfaces: [
        { name: 'AXI Bridge', sub: 'System Fabric Interface' },
        { name: 'PIPE Interface', sub: 'Gen5 PHY' }
      ],
      quickRef: [
        { label: 'Standard', value: 'PCIe 5.x' },
        { label: 'Max Data Rate', value: '32 GT/s/lane' },
        { label: 'Lane Widths', value: 'x1, x2, x4, x8, x16' },
        { label: 'Topologies', value: 'Root Port, EP, Switch, Retimer' },
        { label: 'Error Protection', value: 'FEC' },
        { label: 'Compatibility', value: 'Gen 3.0 – 5.0' },
        { label: 'Availability', value: 'Production Ready' }
      ]
    };

    var breadcrumbEl = document.getElementById('breadcrumb');
    var crumbs = [
      { label: 'Home', href: 'index.html' },
      { label: 'IP Cores', href: 'index.html#products' },
      { label: PRODUCT.category, href: 'index.html#products' },
      { label: PRODUCT.subcategory, href: 'index.html#products' },
      { label: PRODUCT.name.replace(PRODUCT.subcategory + ' ', '').replace(' IP', '') }
    ];
    if (breadcrumbEl) breadcrumbEl.innerHTML = crumbs.map(function(c, i) {
      var sep = i < crumbs.length - 1 ? '<span class="sep">/</span>' : '';
      if (c.href) return '<a href="' + c.href + '">' + c.label + '</a>' + sep;
      return '<span>' + c.label + '</span>';
    }).join('');

    var catEl = document.getElementById('productCategory');
    if (catEl) catEl.textContent = PRODUCT.category + ' — ' + PRODUCT.subcategory;
    var nameEl = document.getElementById('productName');
    if (nameEl) nameEl.textContent = PRODUCT.name;
    var descEl = document.getElementById('productDesc');
    if (descEl) descEl.textContent = PRODUCT.description;

    var statsEl = document.getElementById('quickStats');
    if (statsEl) statsEl.innerHTML = PRODUCT.stats.map(function(s) {
      return '<div class="quick-stat"><div class="quick-stat-val">' + s.value + '</div><div class="quick-stat-label">' + s.label + '</div></div>';
    }).join('');

    var dlBtn = document.getElementById('downloadBriefBtn');
    if (dlBtn) {
      dlBtn.href = PRODUCT.pdfPath;
      dlBtn.setAttribute('download', '');
    }

    var ovDescEl = document.getElementById('overviewDesc');
    if (ovDescEl) ovDescEl.textContent = PRODUCT.description;

    var featureListEl = document.getElementById('featureList');
    if (featureListEl) featureListEl.innerHTML = PRODUCT.features.map(function(f) {
      return '<li><svg class="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' + f + '</li>';
    }).join('');

    var appPillsEl = document.getElementById('appPills');
    if (appPillsEl) appPillsEl.innerHTML = PRODUCT.applications.map(function(a) {
      return '<span class="app-pill">' + a + '</span>';
    }).join('');

    var delListEl = document.getElementById('deliverableList');
    if (delListEl) delListEl.innerHTML = PRODUCT.deliverables.map(function(d) {
      return '<li><svg class="del-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' + d + '</li>';
    }).join('');

    var layerEl = document.getElementById('layerDiagram');

    function renderDiagram(title, layers, interfaces) {
      if (!layerEl) return;
      var boxes = layers.map(function(l, i) {
        var connector = i < layers.length - 1 ? '<div class="layer-connector"></div>' : '';
        return '<div class="layer-box">' + l.name + '<span class="layer-sub">' + l.sub + '</span></div>' + connector;
      }).join('');
      var sides = interfaces.map(function(iface) {
        return '<div class="side-block">' + iface.name + '<span class="layer-sub">' + iface.sub + '</span></div>';
      }).join('');
      layerEl.innerHTML = '<div class="layer-diagram-title">' + title + '</div>' +
        '<div class="layer-stack">' + boxes + '</div>' +
        (sides ? '<div class="layer-sides">' + sides + '</div>' : '');
    }

    function renderVisualDiagram(state) {
      if (!layerEl) return false;
      if (!state || !state.blocks || !state.blocks.length) return false;
      var b = state.blocks;
      var a = state.arrows || [];
      var minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
      b.forEach(function(bl) {
        if (bl.x < minX) minX = bl.x;
        if (bl.y < minY) minY = bl.y;
        if (bl.x + bl.w > maxX) maxX = bl.x + bl.w;
        if (bl.y + bl.h > maxY) maxY = bl.y + bl.h;
      });
      var totalW = maxX - minX || 1;
      var totalH = maxY - minY || 1;
      var pad = 20;

      var html = '<div class="layer-diagram-title">' + PRODUCT.subcategory + ' Protocol Stack</div>';
      html += '<div class="vbr-wrap" style="padding-top:' + ((totalH + pad * 2) / (totalW + pad * 2) * 100) + '%">';
      html += '<svg class="vbr-arrows" viewBox="0 0 ' + (totalW + pad * 2) + ' ' + (totalH + pad * 2) + '">';
      html += '<defs><marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><path d="M0 0 L10 3.5 L0 7 Z" fill="rgba(116,72,151,0.5)"/></marker></defs>';
      a.forEach(function(ar) {
        var fromB = b.find(function(bl) { return bl.id === ar.from; });
        var toB = b.find(function(bl) { return bl.id === ar.to; });
        if (!fromB || !toB) return;
        function portPos(bl, p) {
          switch(p) {
            case 't': return { x: bl.x + bl.w/2, y: bl.y };
            case 'b': return { x: bl.x + bl.w/2, y: bl.y + bl.h };
            case 'l': return { x: bl.x, y: bl.y + bl.h/2 };
            case 'r': return { x: bl.x + bl.w, y: bl.y + bl.h/2 };
          }
          return { x: bl.x, y: bl.y };
        }
        var p1 = portPos(fromB, ar.fromPort);
        var p2 = portPos(toB, ar.toPort);
        html += '<line x1="' + (p1.x - minX + pad) + '" y1="' + (p1.y - minY + pad) + '" x2="' + (p2.x - minX + pad) + '" y2="' + (p2.y - minY + pad) + '" stroke="rgba(116,72,151,0.4)" stroke-width="2" marker-end="url(#ah)"/>';
      });
      html += '</svg>';

      // Map builder palette -> design-token treatments so saved diagrams keep the site's look
      var COLOR_CLASS = { '#744897': 'vbr--purple', '#FFD166': 'vbr--gold', '#3a3a3e': 'vbr--dark', 'outline': 'vbr--outline' };
      b.forEach(function(bl) {
        var left = ((bl.x - minX + pad) / (totalW + pad * 2) * 100);
        var top = ((bl.y - minY + pad) / (totalH + pad * 2) * 100);
        var w = (bl.w / (totalW + pad * 2) * 100);
        var h = (bl.h / (totalH + pad * 2) * 100);
        var isContainer = bl.type === 'container';
        var cls = (isContainer ? 'vbr-container ' : 'vbr-block ') + (COLOR_CLASS[bl.color] || 'vbr--purple');
        var fontSize = bl.fontSize || (isContainer ? 11 : 13);
        html += '<div class="' + cls + '" style="left:' + left + '%;top:' + top + '%;width:' + w + '%;height:' + h + '%;font-size:' + fontSize + 'px">' +
          bl.text + '</div>';
      });
      html += '</div>';
      layerEl.innerHTML = html;
      return true;
    }

    var VB_STORAGE_KEY = 'vb-diagram-' + (PRODUCT.name || 'default');
    var savedVB = localStorage.getItem(VB_STORAGE_KEY);
    if (savedVB) {
      try {
        if (!renderVisualDiagram(JSON.parse(savedVB))) {
          renderDiagram(PRODUCT.subcategory + ' Protocol Stack', PRODUCT.layers, PRODUCT.interfaces);
        }
      } catch(e) {
        renderDiagram(PRODUCT.subcategory + ' Protocol Stack', PRODUCT.layers, PRODUCT.interfaces);
      }
    } else {
      renderDiagram(PRODUCT.subcategory + ' Protocol Stack', PRODUCT.layers, PRODUCT.interfaces);
    }

    (function() {
      var editBtn = document.getElementById('diagramEditBtn');
      var overlay = document.getElementById('vbOverlay');
      var canvas = document.getElementById('vbCanvas');
      var svgEl = document.getElementById('vbArrowsSvg');
      var toast = document.getElementById('vbToast');
      if (!editBtn || !overlay || !canvas) return;

      var blocks = [];
      var arrows = [];
      var selected = null;
      var selectedArrow = -1;
      var idCounter = 0;
      var activeColor = '#744897';
      var arrowMode = false;
      var arrowStart = null;
      var dragState = null;
      var SNAP = 10;
      var STORAGE_KEY = 'vb-diagram-' + (PRODUCT.name || 'default');

      function snap(v) { return Math.round(v / SNAP) * SNAP; }
      function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2000);
      }

      function createBlock(opts) {
        var b = {
          id: 'b' + (++idCounter),
          x: opts.x || 100, y: opts.y || 100,
          w: opts.w || 160, h: opts.h || 50,
          text: opts.text || 'Label',
          color: opts.color || activeColor,
          type: opts.type || 'box',
          fontSize: opts.fontSize || 12
        };
        blocks.push(b);
        renderBlock(b);
        selectBlock(b.id);
        return b;
      }

      function renderBlock(b) {
        var existing = document.getElementById(b.id);
        if (existing) existing.remove();

        var el = document.createElement('div');
        el.className = 'vb-block' + (b.type === 'container' ? ' vb-container' : '');
        el.id = b.id;
        el.style.left = b.x + 'px';
        el.style.top = b.y + 'px';
        el.style.width = b.w + 'px';
        el.style.height = b.h + 'px';
        el.style.fontSize = b.fontSize + 'px';

        if (b.type === 'container') {
          el.style.background = 'transparent';
          el.style.border = '2px dashed ' + b.color;
          el.style.color = b.color;
          el.style.alignItems = 'flex-start';
          el.style.justifyContent = 'flex-start';
          el.style.zIndex = '0';
        } else {
          el.style.background = b.color === 'outline' ? 'transparent' : b.color;
          el.style.border = b.color === 'outline' ? '2px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)';
          el.style.color = (b.color === '#FFD166') ? '#222' : '#fff';
          el.style.zIndex = '2';
        }

        var label = document.createElement('div');
        label.className = 'vb-label';
        label.textContent = b.text;
        if (b.type === 'container') {
          label.style.padding = '6px 10px';
          label.style.fontSize = '10px';
          label.style.textTransform = 'uppercase';
          label.style.letterSpacing = '0.12em';
          label.style.fontWeight = '700';
        }
        el.appendChild(label);

        ['se','sw','ne','nw'].forEach(function(dir) {
          var h = document.createElement('div');
          h.className = 'vb-resize vb-resize-' + dir;
          h.setAttribute('data-dir', dir);
          el.appendChild(h);
        });

        ['t','b','l','r'].forEach(function(pos) {
          var p = document.createElement('div');
          p.className = 'vb-port vb-port-' + pos;
          p.setAttribute('data-port', pos);
          p.setAttribute('data-block', b.id);
          el.appendChild(p);
        });

        canvas.appendChild(el);

        el.addEventListener('mousedown', function(e) {
          var tgt = e.target;
          if (tgt.classList.contains('vb-port')) {
            e.stopPropagation();
            e.preventDefault();
            handlePort(b.id, tgt.getAttribute('data-port'));
            return;
          }
          if (tgt.classList.contains('vb-resize')) {
            startResize(b.id, tgt.getAttribute('data-dir'), e);
            e.stopPropagation();
            return;
          }
          selectBlock(b.id);
          startDrag(b.id, e);
          e.stopPropagation();
        });

        el.addEventListener('dblclick', function(e) {
          var lbl = el.querySelector('.vb-label');
          lbl.contentEditable = 'true';
          lbl.focus();
          var range = document.createRange();
          range.selectNodeContents(lbl);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          function finishEdit() {
            lbl.contentEditable = 'false';
            b.text = lbl.textContent.trim() || 'Label';
            lbl.textContent = b.text;
            lbl.removeEventListener('blur', finishEdit);
            lbl.removeEventListener('keydown', onKey);
          }
          function onKey(ev) { if (ev.key === 'Enter') { ev.preventDefault(); finishEdit(); } }
          lbl.addEventListener('blur', finishEdit);
          lbl.addEventListener('keydown', onKey);
          e.stopPropagation();
        });
      }

      function selectBlock(id) {
        if (selected) {
          var prev = document.getElementById(selected);
          if (prev) prev.classList.remove('selected');
        }
        selected = id;
        var el = document.getElementById(id);
        if (el) el.classList.add('selected');
      }
      function deselectAll() {
        if (selected) {
          var el = document.getElementById(selected);
          if (el) el.classList.remove('selected');
        }
        selected = null;
      }
      canvas.addEventListener('mousedown', function(e) {
        if (e.target === canvas || e.target === svgEl) {
          deselectAll();
          if (selectedArrow !== -1) { selectedArrow = -1; drawArrows(); }
          if (arrowStart) {
            var prevPortEl = document.querySelector('#' + arrowStart.blockId + ' .vb-port-' + arrowStart.port);
            if (prevPortEl) prevPortEl.style.background = '';
            arrowStart = null;
          }
        }
      });

      function startDrag(id, e) {
        var b = blocks.find(function(bl) { return bl.id === id; });
        if (!b) return;
        var startX = e.clientX, startY = e.clientY;
        var origX = b.x, origY = b.y;
        dragState = { id: id };

        function onMove(ev) {
          b.x = snap(origX + (ev.clientX - startX));
          b.y = snap(origY + (ev.clientY - startY));
          b.x = Math.max(0, Math.min(b.x, 1200 - b.w));
          b.y = Math.max(0, Math.min(b.y, 800 - b.h));
          var el = document.getElementById(id);
          el.style.left = b.x + 'px';
          el.style.top = b.y + 'px';
          drawArrows();
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          dragState = null;
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }

      function startResize(id, dir, e) {
        var b = blocks.find(function(bl) { return bl.id === id; });
        if (!b) return;
        var startX = e.clientX, startY = e.clientY;
        var origX = b.x, origY = b.y, origW = b.w, origH = b.h;

        function onMove(ev) {
          var dx = ev.clientX - startX, dy = ev.clientY - startY;
          if (dir.indexOf('e') !== -1) b.w = snap(Math.max(60, origW + dx));
          if (dir.indexOf('s') !== -1) b.h = snap(Math.max(30, origH + dy));
          if (dir.indexOf('w') !== -1) { b.w = snap(Math.max(60, origW - dx)); b.x = snap(origX + origW - b.w); }
          if (dir.indexOf('n') !== -1) { b.h = snap(Math.max(30, origH - dy)); b.y = snap(origY + origH - b.h); }
          var el = document.getElementById(id);
          el.style.left = b.x + 'px'; el.style.top = b.y + 'px';
          el.style.width = b.w + 'px'; el.style.height = b.h + 'px';
          drawArrows();
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        e.stopPropagation();
        e.preventDefault();
      }

      function getPortPos(blockId, port) {
        var b = blocks.find(function(bl) { return bl.id === blockId; });
        if (!b) return { x: 0, y: 0 };
        switch (port) {
          case 't': return { x: b.x + b.w / 2, y: b.y };
          case 'b': return { x: b.x + b.w / 2, y: b.y + b.h };
          case 'l': return { x: b.x, y: b.y + b.h / 2 };
          case 'r': return { x: b.x + b.w, y: b.y + b.h / 2 };
        }
        return { x: b.x, y: b.y };
      }

      function handlePort(blockId, port) {
        if (!arrowStart) {
          arrowStart = { blockId: blockId, port: port };
          var startPortEl = document.querySelector('#' + blockId + ' .vb-port-' + port);
          if (startPortEl) startPortEl.style.background = 'var(--gold)';
          showToast('Click another port to complete arrow');
        } else {
          var prevPortEl = document.querySelector('#' + arrowStart.blockId + ' .vb-port-' + arrowStart.port);
          if (prevPortEl) prevPortEl.style.background = '';
          if (arrowStart.blockId !== blockId) {
            arrows.push({ from: arrowStart.blockId, fromPort: arrowStart.port, to: blockId, toPort: port });
            drawArrows();
            showToast('Arrow created');
          }
          arrowStart = null;
        }
      }

      function drawArrows() {
        var children = svgEl.childNodes;
        for (var i = children.length - 1; i >= 0; i--) {
          if (children[i].nodeName === 'line') svgEl.removeChild(children[i]);
        }

        arrows.forEach(function(a, idx) {
          var fromExists = blocks.some(function(bl) { return bl.id === a.from; });
          var toExists = blocks.some(function(bl) { return bl.id === a.to; });
          if (!fromExists || !toExists) return;
          var p1 = getPortPos(a.from, a.fromPort);
          var p2 = getPortPos(a.to, a.toPort);
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
          line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
          line.setAttribute('marker-end', 'url(#vbArrowhead)');
          if (idx === selectedArrow) line.classList.add('arrow-selected');
          line.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            deselectAll();
            selectedArrow = idx;
            drawArrows();
            showToast('Arrow selected — press Delete to remove');
          });
          svgEl.appendChild(line);
        });
      }

      document.getElementById('vbAddBox').addEventListener('click', function() {
        arrowMode = false;
        document.getElementById('vbAddArrow').classList.remove('active');
        createBlock({ x: 100 + Math.random() * 200, y: 100 + Math.random() * 200, text: 'New Block', color: activeColor });
      });

      document.getElementById('vbAddContainer').addEventListener('click', function() {
        arrowMode = false;
        document.getElementById('vbAddArrow').classList.remove('active');
        createBlock({ x: 80 + Math.random() * 100, y: 80 + Math.random() * 100, w: 300, h: 200, text: 'CONTAINER', color: activeColor, type: 'container' });
      });

      document.getElementById('vbAddArrow').addEventListener('click', function() {
        arrowMode = !arrowMode;
        arrowStart = null;
        this.classList.toggle('active', arrowMode);
        showToast(arrowMode ? 'Arrow mode: click two ports' : 'Arrow mode off');
      });

      document.querySelectorAll('.vb-tool-color').forEach(function(swatch) {
        swatch.addEventListener('click', function() {
          document.querySelectorAll('.vb-tool-color').forEach(function(s) { s.classList.remove('active'); });
          this.classList.add('active');
          activeColor = this.getAttribute('data-color');
          if (selected) {
            var b = blocks.find(function(bl) { return bl.id === selected; });
            if (b) { b.color = activeColor; renderBlock(b); selectBlock(b.id); }
          }
        });
      });

      document.getElementById('vbDuplicate').addEventListener('click', function() {
        if (!selected) { showToast('Select a block first'); return; }
        var b = blocks.find(function(bl) { return bl.id === selected; });
        if (!b) return;
        createBlock({ x: b.x + 20, y: b.y + 20, w: b.w, h: b.h, text: b.text, color: b.color, type: b.type, fontSize: b.fontSize });
      });

      document.getElementById('vbDelete').addEventListener('click', function() {
        if (selectedArrow !== -1) {
          arrows.splice(selectedArrow, 1);
          selectedArrow = -1;
          drawArrows();
          showToast('Arrow deleted');
          return;
        }
        if (!selected) { showToast('Select a block or arrow first'); return; }
        var el = document.getElementById(selected);
        if (el) el.remove();
        var delId = selected;
        blocks = blocks.filter(function(b) { return b.id !== delId; });
        arrows = arrows.filter(function(a) { return a.from !== delId && a.to !== delId; });
        selected = null;
        drawArrows();
        showToast('Block deleted');
      });

      function onVbKeydown(e) {
        if (!overlay.classList.contains('open')) return;
        if (e.target.isContentEditable) return;
        if ((e.key === 'Delete' || e.key === 'Backspace') && (selected || selectedArrow !== -1)) {
          document.getElementById('vbDelete').click();
        }
        if (e.key === 'Escape') {
          if (arrowMode) { arrowMode = false; arrowStart = null; document.getElementById('vbAddArrow').classList.remove('active'); }
          else deselectAll();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selected) {
          e.preventDefault();
          document.getElementById('vbDuplicate').click();
        }
      }
      document.addEventListener('keydown', onVbKeydown);
      teardown.push(function() { document.removeEventListener('keydown', onVbKeydown); });

      function getState() {
        return { blocks: blocks, arrows: arrows, idCounter: idCounter };
      }
      function loadState(state) {
        canvas.querySelectorAll('.vb-block').forEach(function(el) { el.remove(); });
        blocks = state.blocks || [];
        arrows = state.arrows || [];
        idCounter = state.idCounter || blocks.length;
        blocks.forEach(function(b) { renderBlock(b); });
        drawArrows();
      }

      document.getElementById('vbSave').addEventListener('click', function() {
        var state = getState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        renderVisualDiagram(state);
        overlay.classList.remove('open');
        showToast('Diagram saved & applied');
      });

      document.getElementById('vbExportJSON').addEventListener('click', function() {
        var json = JSON.stringify(getState(), null, 2);
        navigator.clipboard.writeText(json).then(function() {
          showToast('JSON copied to clipboard');
        }).catch(function() { prompt('Copy this JSON:', json); });
      });

      editBtn.addEventListener('click', function() {
        overlay.classList.add('open');
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try { loadState(JSON.parse(saved)); } catch(e) { initFromProduct(); }
        } else {
          initFromProduct();
        }
      });

      document.getElementById('vbClose').addEventListener('click', function() {
        overlay.classList.remove('open');
      });

      function initFromProduct() {
        canvas.querySelectorAll('.vb-block').forEach(function(el) { el.remove(); });
        blocks = []; arrows = []; idCounter = 0;
        var startY = 60;
        var centerX = 440;

        createBlock({ x: centerX, y: startY, w: 320, h: 36, text: PRODUCT.subcategory + ' Protocol Stack', color: '#3a3a3e', type: 'box', fontSize: 11 });

        PRODUCT.layers.forEach(function(l, i) {
          var ly = createBlock({ x: centerX, y: startY + 60 + i * 80, w: 320, h: 50, text: l.name, color: '#744897' });
          if (i > 0) {
            arrows.push({ from: blocks[blocks.length - 2].id, fromPort: 'b', to: ly.id, toPort: 't' });
          }
        });

        PRODUCT.interfaces.forEach(function(iface, i) {
          createBlock({ x: centerX + i * 170 - (PRODUCT.interfaces.length > 1 ? 85 : 0), y: startY + 60 + PRODUCT.layers.length * 80 + 20, w: 150, h: 50, text: iface.name, color: '#FFD166' });
        });

        drawArrows();
        deselectAll();
      }
    })();

    var qrEl = document.getElementById('quickRef');
    if (qrEl) {
      var qrRows = PRODUCT.quickRef.map(function(r) {
        return '<div class="quick-ref-row"><span class="quick-ref-label">' + r.label + '</span><span class="quick-ref-val">' + r.value + '</span></div>';
      }).join('');
      qrEl.innerHTML = '<div class="quick-ref-title">Quick Reference</div>' + qrRows;
    }

    var docFileName = PRODUCT.pdfPath.split('/').pop();
    var docFileNameEl = document.getElementById('docFileName');
    if (docFileNameEl) docFileNameEl.textContent = docFileName;
    var docDlBtn = document.getElementById('docDownloadBtn');
    if (docDlBtn) docDlBtn.href = PRODUCT.pdfPath;

    document.title = PRODUCT.name + ' — PlurkoTech';

    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        if (btn.dataset.tab === 'tab-brief' && !window._pdfLoaded) {
          window._pdfLoaded = true;
          loadPdf();
        }
      });
    });

    var PDF_ACCESS = {
      role: 'admin',           // 'guest' | 'user' | 'customer' | 'admin'
      maxPages: { guest: 2, user: 5, customer: Infinity, admin: Infinity },
      allowDownload: { guest: false, user: false, customer: true, admin: true },
      allowPrint: { guest: false, user: false, customer: true, admin: true }
    };

    function loadPdf() {
      var container = document.getElementById('pdfContainer');
      container.innerHTML = '<div class="doc-loading"><div class="spinner"></div><span>Loading product brief...</span></div>';

      var role = PDF_ACCESS.role;
      var maxPages = PDF_ACCESS.maxPages[role] || 2;
      var canDl = PDF_ACCESS.allowDownload[role] || false;

      if (!canDl) {
        var dlBtn = document.getElementById('docDownloadBtn');
        if (dlBtn) dlBtn.style.display = 'none';
      }

      if (window.location.protocol === 'file:') {
        container.innerHTML = '<iframe src="' + PRODUCT.pdfPath + '#toolbar=1&navpanes=0" style="width:100%;min-height:800px;border:none;border-radius:4px"></iframe>';
        return;
      }

      var pdfjsLib = window.pdfjsLib;
      if (!pdfjsLib) {
        container.innerHTML = '<iframe src="' + PRODUCT.pdfPath + '#toolbar=1&navpanes=0" style="width:100%;min-height:800px;border:none;border-radius:4px"></iframe>';
        return;
      }

      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      pdfjsLib.getDocument(PRODUCT.pdfPath).promise.then(function(pdf) {
        var totalPages = pdf.numPages;
        var accessible = Math.min(maxPages, totalPages);
        var currentPage = 1;
        var rendering = false;

        container.innerHTML = '';

        var nav = document.createElement('div');
        nav.className = 'pdf-page-nav';
        var pageLabel = accessible < totalPages
          ? 'Page 1 / ' + accessible + ' (of ' + totalPages + ')'
          : 'Page 1 / ' + totalPages;
        nav.innerHTML =
          '<button id="pdfPrev" disabled><svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>' +
          '<span id="pdfPageInfo">' + pageLabel + '</span>' +
          '<button id="pdfNext"' + (accessible <= 1 ? ' disabled' : '') + '><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>';
        container.appendChild(nav);

        var canvas = document.createElement('canvas');
        canvas.id = 'pdfCanvas';
        canvas.style.cssText = 'user-select:none;-webkit-user-select:none;';
        canvas.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        container.appendChild(canvas);
        var ctx = canvas.getContext('2d');

        if (accessible < totalPages) {
          var locked = document.createElement('div');
          locked.className = 'pdf-locked-overlay';
          locked.id = 'pdfLocked';
          locked.style.display = 'none';
          locked.innerHTML =
            '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' +
            '<h4>Premium Content</h4>' +
            '<p>Preview: ' + accessible + ' of ' + totalPages + ' pages. Upgrade for full access.</p>' +
            '<a href="index.html#contact">Request Full Access</a>';
          container.appendChild(locked);
        }

        function renderPage(num) {
          if (rendering) return;
          rendering = true;

          var lockedEl = document.getElementById('pdfLocked');

          if (num > accessible) {
            canvas.style.display = 'none';
            if (lockedEl) lockedEl.style.display = 'block';
            rendering = false;
            return;
          }

          canvas.style.display = 'block';
          if (lockedEl) lockedEl.style.display = 'none';

          pdf.getPage(num).then(function(page) {
            var containerW = container.clientWidth - 40;
            var baseViewport = page.getViewport({ scale: 1 });
            var scale = Math.min(containerW / baseViewport.width, 2.5);
            var viewport = page.getViewport({ scale: scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function() {
              currentPage = num;
              var info = accessible < totalPages
                ? 'Page ' + num + ' / ' + accessible + ' (of ' + totalPages + ')'
                : 'Page ' + num + ' / ' + totalPages;
              document.getElementById('pdfPageInfo').textContent = info;
              document.getElementById('pdfPrev').disabled = (num <= 1);
              document.getElementById('pdfNext').disabled = (num >= accessible);
              rendering = false;
            });
          });
        }

        document.getElementById('pdfPrev').addEventListener('click', function() {
          if (currentPage > 1) renderPage(currentPage - 1);
        });
        document.getElementById('pdfNext').addEventListener('click', function() {
          if (currentPage < accessible) renderPage(currentPage + 1);
        });

        function onPdfKeydown(e) {
          var brief = document.getElementById('tab-brief');
          if (!brief || !brief.classList.contains('active')) return;
          if (e.key === 'ArrowLeft' && currentPage > 1) renderPage(currentPage - 1);
          if (e.key === 'ArrowRight' && currentPage < accessible) renderPage(currentPage + 1);
        }
        document.addEventListener('keydown', onPdfKeydown);
        teardown.push(function() { document.removeEventListener('keydown', onPdfKeydown); });

        renderPage(1);

      }).catch(function(err) {
        container.innerHTML = '<iframe src="' + PRODUCT.pdfPath + '#toolbar=1&navpanes=0" style="width:100%;min-height:800px;border:none;border-radius:4px"></iframe>';
      });
    }

  } catch(e) {
    console.error('PRODUCT PAGE SCRIPT ERROR:', e.message, e.stack);
  }

  return function cleanup() {
    teardown.forEach(function(fn) { try { fn(); } catch(e) {} });
    window._pdfLoaded = false;
  };
}
