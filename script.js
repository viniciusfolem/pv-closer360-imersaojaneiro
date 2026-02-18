/* ===== QUIZ APPLICATION ===== */
(function() {
  'use strict';

  /* ===== DATA ===== */
  var questions = [
    {title: "Qual é a sua situação profissional hoje?", options: [{t: "Trabalho com carteira assinada (CLT)", i: "💼", p: 10}, {t: "Sou autônomo/freelancer", i: "💻", p: 10}, {t: "Estou desempregado(a)", i: "🔍", p: 10}, {t: "Tenho um negócio próprio", i: "🏢", p: 10}, {t: "Sou estudante", i: "📚", p: 10}]},
    {title: "Quanto você ganha por mês atualmente?", options: [{t: "Menos de R$ 2.000", i: "💰", p: 10}, {t: "De R$ 2.000 a R$ 4.000", i: "💰", p: 10}, {t: "De R$ 4.000 a R$ 6.000", i: "💰", p: 10}, {t: "De R$ 6.000 a R$ 10.000", i: "💰", p: 10}, {t: "Mais de R$ 10.000", i: "💰", p: 10}]},
    {title: "Quanto tempo por dia você poderia dedicar a uma nova atividade?", options: [{t: "Menos de 1 hora", i: "⏰", p: 5}, {t: "De 1 a 2 horas", i: "⏰", p: 10}, {t: "De 2 a 4 horas", i: "⏰", p: 15}, {t: "De 4 a 6 horas", i: "⏰", p: 15}, {t: "Mais de 6 horas (dedicação total)", i: "⏰", p: 15}]},
    {title: "Você já ouviu falar sobre a profissão de Closer Digital?", options: [{t: "Nunca ouvi falar", i: "🤔", p: 10}, {t: "Já ouvi, mas não sei direito o que é", i: "💡", p: 10}, {t: "Sei o que é, mas nunca tentei", i: "📖", p: 15}, {t: "Já tentei, mas sem sucesso", i: "🔄", p: 15}, {t: "Já trabalho como closer", i: "🎯", p: 15}]},
    {title: "Como você se sente ao falar com pessoas desconhecidas?", options: [{t: "Muito desconfortável, evito ao máximo", i: "😰", p: 5}, {t: "Um pouco nervoso(a), mas consigo", i: "😊", p: 10}, {t: "Normal, não tenho dificuldade", i: "🤝", p: 15}, {t: "Adoro conversar com pessoas novas", i: "⭐", p: 15}]},
    {title: "Quanto você estaria disposto(a) a investir em sua formação profissional?", options: [{t: "Não posso investir nada agora", i: "🚫", p: 0, d: 1}, {t: "Até R$ 100", i: "💵", p: 10}, {t: "De R$ 100 a R$ 500", i: "💵", p: 15}, {t: "De R$ 500 a R$ 1.000", i: "💵", p: 15}, {t: "Mais de R$ 1.000 se valer a pena", i: "💵", p: 15}]},
    {title: "Qual frase mais te representa?", options: [{t: "Quero uma renda extra sem sair de casa", i: "🏠", p: 10}, {t: "Quero trocar meu emprego por algo melhor", i: "🔀", p: 15}, {t: "Quero uma profissão com ganhos ilimitados", i: "🚀", p: 15}, {t: "Quero ajudar pessoas enquanto ganho bem", i: "❤️", p: 15}, {t: "Só estou curioso(a) mesmo", i: "👀", p: 5}]}
  ];

  var milestones = {
    3: {msg: "🔥 Metade concluída! Seu perfil está ficando interessante..."},
    5: {msg: "⚡ Quase lá! Faltam apenas 2 perguntas..."},
    6: {msg: "🎯 Última pergunta! Seu resultado está quase pronto..."}
  };

  var cq = 0, tp = 0, maxPts = 0, hd = false, isTr = false;

  /* ===== SUPABASE ANALYTICS ===== */
  var _sb = null, _sid = null;
  var _SBURL = 'https://torigmjljedghnvtitvs.supabase.co';
  var _SBKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcmlnbWpsamVkZ2hudnRpdHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMzAwMjIsImV4cCI6MjA4NTkwNjAyMn0._02AKqv85F8IEt5A3LTlqHyxRGikuQxeSnJC29F_z6E';
  var _sbLoading = false, _sbQueue = [];
  function _uuid() {
    var d = Date.now();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  function _device() {
    var ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
  }
  function _utms() {
    var p = new URLSearchParams(location.search);
    return {source: p.get('utm_source'), medium: p.get('utm_medium'), campaign: p.get('utm_campaign')};
  }
  function _loadSB(cb) {
    if (_sb) { cb(); return; }
    _sbQueue.push(cb);
    if (_sbLoading) return;
    _sbLoading = true;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = function() {
      _sb = window.supabase.createClient(_SBURL, _SBKEY);
      var q = _sbQueue.slice(); _sbQueue = [];
      q.forEach(function(f) { try { f(); } catch(e) {} });
    };
    s.onerror = function() { _sbLoading = false; };
    document.head.appendChild(s);
  }
  function _track(fn) { _loadSB(function() { try { fn(); } catch(e) {} }); }

  // Calculate max possible points
  questions.forEach(function(q) {
    var mx = 0;
    q.options.forEach(function(o) {
      if (o.p > mx) mx = o.p;
    });
    maxPts += mx;
  });

  var g = function(id) { return document.getElementById(id); };
  var qC = g('questionCounter'), qT = g('questionTitle'), oL = g('optionsList');
  var lT = g('loadingText'), lB = g('loadingBarFill'), lP = g('loadingPct');
  var gF = g('gaugeFill'), gP = g('gaugePct'), fP = g('floatPts');
  var tst = g('toast'), sB = g('stepsBar');

  // Build step dots
  for (var i = 0; i < questions.length; i++) {
    var d = document.createElement('div');
    d.className = 'step-dot';
    sB.appendChild(d);
  }
  var dots = sB.querySelectorAll('.step-dot');

  // Gauge constants
  var gaugeCirc = 2 * Math.PI * 52; // ~326.73

  /* ===== SOCIAL PROOF COUNTER ===== */
  var spCount = 347;
  var spEl = g('socialCount');
  setInterval(function() {
    spCount += Math.floor(Math.random() * 3) + 1;
    spEl.textContent = spCount + ' pessoas fizeram esse quiz hoje';
  }, 4000 + Math.random() * 3000);

  /* ===== SECTION TRANSITION ===== */
  function tt(tid) {
    return new Promise(function(res) {
      var c = document.querySelector('.section.active');
      var t = g(tid);
      if (c) {
        c.classList.add('leaving');
        c.addEventListener('animationend', function() {
          c.classList.remove('active', 'leaving');
          t.classList.add('active');
          window.scrollTo({top: 0, behavior: 'instant'});
          t.addEventListener('animationend', function() {
            res();
          }, {once: true});
        }, {once: true});
      } else {
        t.classList.add('active');
        res();
      }
    });
  }

  /* ===== GAUGE UPDATE ===== */
  function updateGauge() {
    var pct = Math.round((tp / maxPts) * 100);
    if (pct > 100) pct = 100;
    var offset = gaugeCirc - (gaugeCirc * (pct / 100));
    gF.style.strokeDashoffset = offset;
    gP.textContent = pct + '%';
    // Color transitions: red→orange→yellow→green
    var color;
    if (pct < 25) color = '#EF4444';
    else if (pct < 50) color = '#F59E0B';
    else if (pct < 75) color = '#FBBF24';
    else color = '#10B981';
    gF.style.stroke = color;
    gP.style.color = color;
  }

  /* ===== FLOATING POINTS ===== */
  function showFloatPts(pts) {
    var el = document.createElement('div');
    el.className = 'float-pt';
    el.textContent = '+' + pts + ' pts';
    el.style.left = (Math.random() * 40 - 20) + 'px';
    fP.appendChild(el);
    setTimeout(function() { el.remove(); }, 900);
  }

  /* ===== TOAST ===== */
  function showToast(msg) {
    tst.textContent = msg;
    tst.classList.add('show');
    setTimeout(function() { tst.classList.remove('show'); }, 2500);
  }

  /* ===== STEP DOTS UPDATE ===== */
  function updateSteps() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].className = 'step-dot';
      if (i < cq) dots[i].classList.add('done');
      else if (i === cq) dots[i].classList.add('current');
    }
  }

  /* ===== RENDER QUESTION ===== */
  function rq() {
    var q = questions[cq];
    qC.textContent = 'Pergunta ' + (cq + 1) + ' de ' + questions.length + (cq >= 1 ? ' 🔥' : '');
    qT.textContent = q.title;
    qT.classList.remove('animate');
    void qT.offsetHeight;
    qT.classList.add('animate');
    oL.innerHTML = '';
    var frag = document.createDocumentFragment();
    q.options.forEach(function(o, i) {
      var li = document.createElement('li');
      li.className = 'option-card';
      li.setAttribute('role', 'option');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-label', o.t);
      li.innerHTML = '<span class="option-text">' + o.t + '</span><span class="option-icon" aria-hidden="true">' + o.i + '</span>';
      li.addEventListener('click', function() { so(i); }, {passive: true});
      li.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          so(i);
        }
      });
      frag.appendChild(li);
      requestAnimationFrame(function() {
        li.style.transition = 'opacity .25s ease,transform .25s ease';
        li.style.transitionDelay = i * 40 + 'ms';
        li.classList.add('show');
      });
    });
    oL.appendChild(frag);
    updateSteps();
    g('quiz').scrollTop = 0;
  }

  /* ===== SELECT OPTION ===== */
  function so(idx) {
    if (isTr) return;
    isTr = true;
    var capturedCq = cq;
    var o = questions[cq].options[idx];
    tp += o.p;
    if (o.d) hd = true;
    (function(qIdx, opt, optIdx) {
      _track(function() {
        _sb.from('question_answers').insert({
          session_id: _sid, question_index: qIdx,
          question_text: questions[qIdx].title,
          option_index: optIdx, option_text: opt.t,
          points_awarded: opt.p, is_disqualifier: !!opt.d,
          answered_at: new Date().toISOString()
        }).then(null, null);
        _sb.from('quiz_sessions').update({questions_answered: qIdx + 1})
          .eq('session_id', _sid).then(null, null);
      });
    })(capturedCq, o, idx);

    // Visual feedback
    var cards = oL.querySelectorAll('.option-card');
    cards[idx].classList.add('selected');
    showFloatPts(o.p || 5);
    updateGauge();

    setTimeout(function() {
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.transitionDelay = i * 25 + 'ms';
        cards[i].classList.add('fade-out');
      }
      setTimeout(function() {
        cq++;
        // Check milestone
        if (milestones[cq]) {
          showToast(milestones[cq].msg);
        }
        if (cq < questions.length) {
          rq();
          isTr = false;
        } else {
          sl();
        }
      }, cards.length * 25 + 120);
    }, 250);
  }

  /* ===== START QUIZ ===== */
  function sq() {
    _sid = _uuid();
    try { sessionStorage.setItem('quiz_sid', _sid); } catch(e) {}
    var _u = _utms();
    _track(function() {
      _sb.from('quiz_sessions').insert({
        session_id: _sid, started_at: new Date().toISOString(),
        device_type: _device(), referrer: document.referrer || null,
        utm_source: _u.source, utm_medium: _u.medium, utm_campaign: _u.campaign,
        user_agent: navigator.userAgent.slice(0, 200),
        created_date: new Date().toISOString().slice(0, 10),
        questions_answered: 0
      }).then(null, null);
    });
    tt('quiz').then(function() { rq(); });
  }

  /* ===== SHOW LOADING ===== */
  function sl() {
    tt('loading').then(function() {
      var txts = [
        "Analisando perfil comportamental...",
        "Comparando com 12.847 perfis de closers...",
        "Calculando compatibilidade...",
        "Gerando seu relatório personalizado..."
      ];
      var durs = [1400, 1400, 1200, 1000];
      var td = 5000;
      var el = 0;
      txts.forEach(function(txt, i) {
        setTimeout(function() {
          lT.style.opacity = '0';
          setTimeout(function() {
            lT.textContent = txt;
            lT.style.opacity = '1';
          }, 120);
        }, el);
        el += durs[i];
      });
      var st = null;
      function ab(ts) {
        if (!st) st = ts;
        var pr = Math.min((ts - st) / td, 1);
        var pctVal = Math.round(pr * 100);
        lB.style.width = pctVal + '%';
        lP.textContent = pctVal + '%';
        if (pr < 1) requestAnimationFrame(ab);
      }
      requestAnimationFrame(ab);
      setTimeout(sr, td);
    });
  }

  /* ===== CONFETTI ===== */
  function launchConfetti() {
    var container = g('confettiContainer');
    var colors = ['#10B981', '#059669', '#FBBF24', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];
    for (var i = 0; i < 50; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (Math.random() * 8 + 6) + 'px';
      piece.style.height = (Math.random() * 8 + 6) + 'px';
      piece.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
      piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
      piece.style.animationDelay = (Math.random() * 1.5) + 's';
      container.appendChild(piece);
    }
    setTimeout(function() { container.innerHTML = ''; }, 5000);
  }

  /* ===== SHOW RESULT ===== */
  function sr() {
    var pf;
    if (hd || tp < 50) pf = 'disqualified';
    else if (tp < 80) pf = 'partial';
    else pf = 'qualified';

    var pctScore = Math.round((tp / maxPts) * 100);

    _track(function() {
      _sb.from('quiz_sessions').update({
        completed_at: new Date().toISOString(),
        result_type: pf, final_score: tp,
        score_pct: pctScore, had_disqualifier: hd
      }).eq('session_id', _sid).then(null, null);
    });

    var d = {
      qualified: {ic: '✓', h: 'PARABÉNS! Você tem o perfil IDEAL para ser Closer no Digital', s: 'Assista o vídeo abaixo e descubra como dar seu primeiro passo <span style="color:#10B981;font-size:1.15em;text-transform:uppercase">HOJE</span>'},
      partial: {ic: '⚠', h: 'Você TEM potencial para ser Closer no Digital!', s: 'Muitos closers de sucesso começaram exatamente no seu ponto. Assista o vídeo e veja como <span style="color:#10B981;font-size:1.15em;text-transform:uppercase">ACELERAR</span> esse processo'},
      disqualified: {ic: '✕', h: 'Você ainda não está no perfil ideal... mas isso pode mudar', s: 'Veja no vídeo abaixo por que pessoas com seu perfil atual conseguiram <span style="color:#10B981;font-size:1.15em;text-transform:uppercase">VIRAR O JOGO</span>'}
    };

    var r = d[pf];
    g('resultBadge').className = 'result-badge ' + pf;
    g('resultBadge').textContent = r.ic;
    g('resultHeadline').className = 'result-headline ' + pf;
    g('resultHeadline').textContent = r.h;
    g('resultSubheadline').innerHTML = r.s;

    // Stats pills
    var statsHTML = '<div class="stat-pill"><span class="stat-icon">📊</span> Compatibilidade: ' + pctScore + '%</div>';
    statsHTML += '<div class="stat-pill"><span class="stat-icon">⚡</span> ' + questions.length + '/' + questions.length + ' respondidas</div>';
    if (pf === 'qualified') statsHTML += '<div class="stat-pill"><span class="stat-icon">🏆</span> Top 5%</div>';
    g('resultStats').innerHTML = statsHTML;

    // Urgency — consistent per session
    var vagas;
    try {
      vagas = parseInt(sessionStorage.getItem('quiz_vagas'));
      if (!vagas || vagas < 1) { vagas = Math.floor(Math.random() * 4) + 3; sessionStorage.setItem('quiz_vagas', vagas); }
    } catch(e) { vagas = 5; }
    g('urgencyText').innerHTML = '🔴 Restam apenas <strong>' + vagas + ' vagas</strong> com esse valor';

    tt('result').then(function() {
      // Load Vturb player script after section is visible
      var vs = document.createElement('script');
      vs.src = 'https://scripts.converteai.net/0b616c7b-0c7a-4208-96b8-c19a003dfbbf/players/69661328da723d6f868bab31/v4/player.js';
      vs.async = true;
      document.head.appendChild(vs);
      
      if (pf === 'qualified') launchConfetti();
      
      // Reveal CTA after 2:30 (aparece antes do pitch final do vídeo)
      setTimeout(function() {
        var cta = g('btnCta'), urg = g('urgencyText'), guar = g('guaranteeText');
        cta.classList.remove('hidden');
        cta.classList.add('reveal');
        setTimeout(function() {
          urg.classList.remove('hidden');
          urg.classList.add('reveal');
        }, 200);
        setTimeout(function() {
          guar.classList.remove('hidden');
          guar.classList.add('reveal');
          // Scroll suave até o CTA para garantir que o usuário veja
          setTimeout(function() {
            cta.scrollIntoView({behavior: 'smooth', block: 'center'});
          }, 300);
        }, 400);
        // Tracking GTM
        if (window.dataLayer) {
          window.dataLayer.push({event: 'cta_revealed', result_type: pf, score: pctScore});
        }
        _track(function() {
          _sb.from('quiz_sessions').update({cta_revealed_at: new Date().toISOString()})
            .eq('session_id', _sid).then(null, null);
        });
      }, 125000);

      // Tracking no clique do CTA
      g('btnCta').addEventListener('click', function() {
        _track(function() {
          _sb.from('quiz_sessions').update({cta_clicked_at: new Date().toISOString()})
            .eq('session_id', _sid).then(null, null);
        });
        if (window.dataLayer) {
          window.dataLayer.push({event: 'cta_click', result_type: pf, score: pctScore});
        }
      }, {once: true, passive: true});
    });
  }

  /* ===== INIT ===== */
  g('btnStart').addEventListener('click', sq, {passive: true});

  // Load font async
  if ('requestIdleCallback' in window) {
    requestIdleCallback(function() { loadFont(); });
  } else {
    requestAnimationFrame(function() { setTimeout(loadFont, 50); });
  }
  
  function loadFont() {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    l.media = 'print';
    l.onload = function() {
      l.media = 'all';
      document.body.classList.add('fonts-loaded');
    };
    document.head.appendChild(l);
  }
})();
