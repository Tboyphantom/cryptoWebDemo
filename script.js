    // ── DATA ──
    const coins = [
      { name: 'Bitcoin', sym: 'BTC', price: 67842, change: 2.41, mcap: '$1.34T', vol: '$38.2B', color: '#F7931A', icon: '₿' },
      { name: 'Ethereum', sym: 'ETH', price: 3512, change: -0.87, mcap: '$422B', vol: '$19.1B', color: '#627EEA', icon: 'Ξ' },
      { name: 'Solana', sym: 'SOL', price: 182, change: 5.32, mcap: '$85B', vol: '$7.4B', color: '#9945FF', icon: '◎' },
      { name: 'BNB', sym: 'BNB', price: 594, change: 1.14, mcap: '$88B', vol: '$2.1B', color: '#F3BA2F', icon: 'B' },
      { name: 'XRP', sym: 'XRP', price: 0.624, change: -1.23, mcap: '$35B', vol: '$1.8B', color: '#00AAE4', icon: '✕' },
      { name: 'Cardano', sym: 'ADA', price: 0.521, change: 3.07, mcap: '$18B', vol: '$0.9B', color: '#0D1E2F', icon: 'A' },
      { name: 'Avalanche', sym: 'AVAX', price: 38.4, change: -2.15, mcap: '$16B', vol: '$0.7B', color: '#E84142', icon: '▲' },
      { name: 'Polkadot', sym: 'DOT', price: 9.12, change: 0.88, mcap: '$12B', vol: '$0.5B', color: '#E6007A', icon: '●' },
    ];

    const allocations = [
      { name: 'Bitcoin', pct: 48, val: '$40,460', color: '#F7931A' },
      { name: 'Ethereum', pct: 29, val: '$24,444', color: '#627EEA' },
      { name: 'Solana', pct: 13, val: '$10,958', color: '#9945FF' },
      { name: 'Others', pct: 10, val: '$8,429', color: '#7A8BA0' },
    ];

    // ── TICKER ──
    function buildTicker() {
      const track = document.getElementById('tickerTrack');
      const items = [...coins, ...coins].map(c =>
        `<div class="ticker-item">
      <span class="ticker-sym">${c.sym}</span>
      <span class="ticker-price">$${c.price.toLocaleString()}</span>
      <span class="ticker-change ${c.change >= 0 ? 'up' : 'dn'}">${c.change >= 0 ? '▲' : '▼'} ${Math.abs(c.change)}%</span>
    </div>`
      ).join('');
      track.innerHTML = items;
    }

    // ── MARKET TABLE ──
    function buildMarket() {
      const body = document.getElementById('marketBody');
      body.innerHTML = coins.map((c, i) => {
        const sparkPts = Array.from({ length: 8 }, () => Math.random() * 20 + 10);
        const sparkStr = sparkPts.map((p, x) => `${x * 11 + 1},${30 - p}`).join(' ');
        const sparkColor = c.change >= 0 ? '#22D898' : '#FF5C5C';
        return `<tr onclick="showToast('${c.icon}','${c.name} (${c.sym})','Price: $${c.price.toLocaleString()}')">
      <td style="color:var(--muted)">${i + 1}</td>
      <td><div class="coin-cell">
        <div class="coin-icon" style="background:${c.color}22;color:${c.color}">${c.icon}</div>
        <div class="coin-name-wrap"><div class="name">${c.name}</div><div class="sym">${c.sym}</div></div>
      </div></td>
      <td style="font-weight:600;font-family:'Syne',sans-serif">$${c.price.toLocaleString()}</td>
      <td class="${c.change >= 0 ? 'price-up' : 'price-dn'}">${c.change >= 0 ? '+' : ''}${c.change}%</td>
      <td style="color:var(--muted)">${c.mcap}</td>
      <td style="color:var(--muted)">${c.vol}</td>
      <td><svg class="sparkline" viewBox="0 0 89 30"><polyline points="${sparkStr}" fill="none" stroke="${sparkColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
    </tr>`;
      }).join('');
    }

    function refreshMarkets() {
      coins.forEach(c => { c.price = c.price * (1 + (Math.random() - 0.5) * 0.01); c.change = +(Math.random() * 10 - 5).toFixed(2); });
      buildMarket();
      showToast('🔄', 'Markets Refreshed', 'Prices updated (demo data).');
    }

    // ── PORTFOLIO CHART ──
    function buildPortChart() {
      const canvas = document.getElementById('portChart');
      const ctx = canvas.getContext('2d');
      canvas.width = 500; canvas.height = 180;
      const pts = [42000, 44100, 43200, 45800, 47200, 46100, 48900, 51200, 49800, 52400, 54100, 55800, 53200, 57000, 58400, 56100, 59200, 61800, 60100, 63400, 65200, 64000, 67800, 68900, 67200, 70100, 72400, 71000, 73800, 76200, 74800, 77100, 79400, 81200, 80100, 82400, 84291];
      const w = 500, h = 180, pad = 20;
      const minV = Math.min(...pts), maxV = Math.max(...pts);
      const xs = i => (i / (pts.length - 1)) * (w - pad * 2) + pad;
      const ys = v => h - pad - (v - minV) / (maxV - minV) * (h - pad * 2);

      // gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(245,166,35,0.25)');
      grad.addColorStop(1, 'rgba(245,166,35,0.00)');
      ctx.beginPath();
      ctx.moveTo(xs(0), ys(pts[0]));
      pts.forEach((p, i) => ctx.lineTo(xs(i), ys(p)));
      ctx.lineTo(xs(pts.length - 1), h); ctx.lineTo(xs(0), h); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();

      // line
      ctx.beginPath();
      ctx.moveTo(xs(0), ys(pts[0]));
      pts.forEach((p, i) => ctx.lineTo(xs(i), ys(p)));
      ctx.strokeStyle = '#F5A623'; ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round'; ctx.stroke();

      // end dot
      ctx.beginPath();
      ctx.arc(xs(pts.length - 1), ys(pts[pts.length - 1]), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#F5A623'; ctx.fill();
      ctx.strokeStyle = '#090C10'; ctx.lineWidth = 2; ctx.stroke();

      // alloc list
      const list = document.getElementById('allocList');
      list.innerHTML = allocations.map(a => `
    <div class="alloc-item">
      <div class="alloc-dot" style="background:${a.color}"></div>
      <span class="alloc-name">${a.name}</span>
      <span class="alloc-pct">${a.pct}%</span>
      <span class="alloc-val">${a.val}</span>
    </div>`).join('');
    }

    // ── TRADE WIDGET ──
    let tradeMode = 'buy';
    let btcPrice = 67842;

    function setTradeMode(mode) {
      tradeMode = mode;
      document.getElementById('buyTab').className = 'trade-tab' + (mode === 'buy' ? ' active buy' : '');
      document.getElementById('sellTab').className = 'trade-tab' + (mode === 'sell' ? ' active sell' : '');
      const btn = document.getElementById('tradeBtn');
      btn.textContent = mode === 'buy' ? 'Buy BTC' : 'Sell BTC';
      btn.className = mode === 'buy' ? 'trade-btn' : 'trade-btn sell-mode';
      updateTrade();
    }

    function updateTrade() {
      const amt = parseFloat(document.getElementById('tradeAmount').value) || 0;
      const rate = btcPrice;
      const fee = amt * 0.001;
      const receive = (amt - fee) / rate;
      document.getElementById('receiveAmt').value = receive > 0 ? receive.toFixed(8) : '';
      document.getElementById('tradeRate').textContent = `1 BTC = $${rate.toLocaleString()}`;
      document.getElementById('tradeFee').textContent = `$${fee.toFixed(2)}`;
      document.getElementById('tradeTotal').textContent = `$${(amt).toFixed(2)}`;
    }

    function setAmount(v) {
      document.getElementById('tradeAmount').value = v;
      updateTrade();
    }

    // ── FLOATING COINS ──
    function buildFloatingCoins() {
      const wrap = document.getElementById('floatCoins');
      const syms = ['₿', 'Ξ', '◎', 'B', '✕', '▲'];
      const colors = ['#F7931A', '#627EEA', '#9945FF', '#F3BA2F', '#00AAE4', '#E84142'];
      for (let i = 0; i < 12; i++) {
        const d = document.createElement('div');
        d.className = 'fcoin';
        const idx = i % syms.length;
        d.style.cssText = `background:${colors[idx]}22;color:${colors[idx]};left:${Math.random() * 90}%;animation-duration:${8 + Math.random() * 12}s;animation-delay:${Math.random() * 10}s`;
        d.textContent = syms[idx];
        wrap.appendChild(d);
      }
    }

    // ── VOL COUNTER ──
    function animateVol() {
      const target = 3842000000;
      let current = 0;
      const step = target / 80;
      const el = document.getElementById('vol');
      const int = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = '$' + (current / 1e9).toFixed(1) + 'B';
        if (current >= target) clearInterval(int);
      }, 20);
    }

    // ── GIFT CODE FORMAT ──
    function formatGiftCode(el) {
      let v = el.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      let out = '';
      for (let i = 0; i < v.length && i < 16; i++) {
        if (i > 0 && i % 4 === 0) out += '-';
        out += v[i];
      }
      el.value = out;
    }

    function redeemCard() {
      const code = document.getElementById('giftInput').value;
      if (code.length < 4) { showToast('❌', 'Invalid Code', 'Please enter a valid gift card code.'); return; }
      showToast('🎁', 'Demo Redemption!', `Code "${code}" accepted! (Demo — no real funds loaded)`);
      document.getElementById('giftInput').value = '';
    }

    // ── TOAST ──
    let toastTimer;
    function showToast(icon, title, msg) {
      document.getElementById('toastIcon').textContent = icon;
      document.getElementById('toastTitle').textContent = title;
      document.getElementById('toastMsg').textContent = msg;
      const t = document.getElementById('toast');
      t.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
    }

    // ── SCROLL REVEAL ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ── PRICE FLICKER ──
    setInterval(() => {
      btcPrice = +(btcPrice * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2);
      updateTrade();
      // update ticker slightly
      coins.forEach(c => c.price = +(c.price * (1 + (Math.random() - 0.5) * 0.001)).toFixed(c.price < 10 ? 4 : 2));
      buildTicker();
    }, 3000);

    // ── INIT ──
    buildFloatingCoins();
    buildTicker();
    buildMarket();
    buildPortChart();
    updateTrade();
    animateVol();
  