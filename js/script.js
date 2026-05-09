/* ============================================================
   HELLO-TAXI | script.js
============================================================ */

/* ── DARK MODE — runs instantly before DOM ready to avoid flash ── */
(function () {
  if (localStorage.getItem('hellotaxi_dark') === 'on') {
    document.body.classList.add('dark-mode');
  }
})();

$(document).ready(function () {

  /* Re-apply dark mode in case IIFE ran before body existed */
  if (localStorage.getItem('hellotaxi_dark') === 'on') {
    document.body.classList.add('dark-mode');
  }

  /* ── DARK MODE TOGGLE ── */
  var $toggle = $('#darkModeToggle');
  $toggle.on('click', function () {
    var isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('hellotaxi_dark', isDark ? 'on' : 'off');
    /* Thumb bounce feedback */
    var $thumb = $(this).find('.toggle-thumb');
    $thumb.css('transform', 'scale(0.75)');
    setTimeout(function () { $thumb.css('transform', ''); }, 180);
  });

  /* ── CUSTOM CURSOR ── */
  if (window.innerWidth > 576) {
    var $dot = $('#cursorDot'), $ring = $('#cursorOutline');
    var mx = 0, my = 0, rx = 0, ry = 0;
    $(document).on('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      $dot.css({ left: mx, top: my });
    });
    (function loop() {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      $ring.css({ left: rx, top: ry });
      requestAnimationFrame(loop);
    })();
    $('a, button, .service-card, .price-card, .review-card, .dest-item')
      .on('mouseenter', function () { $ring.addClass('hovered'); })
      .on('mouseleave', function () { $ring.removeClass('hovered'); });
  }

  /* ── NAVBAR SCROLL ── */
  var $nav = $('#mainNavbar');
  $(window).on('scroll.nav', function () {
    $nav.toggleClass('scrolled', $(this).scrollTop() > 60);
    setActiveNav();
    showScrollTop();
  });

  function setActiveNav() {
    var pos = $(window).scrollTop() + 90;
    $('section[id]').each(function () {
      var t = $(this).offset().top, id = $(this).attr('id');
      if (pos >= t && pos < t + $(this).outerHeight()) {
        $('.navbar-nav .nav-link').removeClass('active');
        $('.navbar-nav .nav-link[href="#' + id + '"]').addClass('active');
      }
    });
  }

  /* ── SMOOTH SCROLL ── */
  $(document).on('click', 'a[href^="#"]', function (e) {
    var href = $(this).attr('href');
    if (href.length > 1 && $(href).length) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: $(href).offset().top - 75 }, 700, 'easeInOutQuart');
      if ($('#navMenu').hasClass('show')) $('.navbar-toggler').trigger('click');
    }
  });

  /* ── HERO COUNTER ANIMATION ── */
  var counted = false;
  var cObs = new IntersectionObserver(function (en) {
    if (en[0].isIntersecting && !counted) {
      counted = true;
      $('.stat-num[data-target]').each(function () {
        var $el = $(this), target = +$el.data('target'), step = target / 125, cur = 0;
        var t = setInterval(function () {
          cur = Math.min(cur + step, target);
          $el.text(Math.floor(cur).toLocaleString());
          if (cur >= target) clearInterval(t);
        }, 16);
      });
    }
  }, { threshold: 0.4 });
  var heroEl = document.querySelector('#welcome');
  if (heroEl) cObs.observe(heroEl);

  /* ── SCROLL FADE-IN ── */
  var fObs = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) $(e.target).addClass('visible'); });
  }, { threshold: 0.12 });
  ['.service-card','.price-card','.review-card','.calc-card','.calc-info-panel',
   '.booking-form-card','.booking-info-panel','.feature-pill','.cf-item',
   '.overall-rating-bar','.section-header','.about-strip-text','.booking-img-wrap'
  ].forEach(function (sel) {
    $(sel).each(function (i) {
      $(this).addClass('fade-in-up').css('transition-delay', i * 0.07 + 's');
      fObs.observe(this);
    });
  });

  /* ── SWIPER: SERVICES ── */
  if ($('.services-swiper').length) {
    new Swiper('.services-swiper', {
      slidesPerView: 1, spaceBetween: 24, loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.services-pagination', clickable: true },
      navigation: { prevEl: '.services-prev', nextEl: '.services-next' },
      breakpoints: { 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }
    });
  }

  /* ── SWIPER: REVIEWS ── */
  if ($('.reviews-swiper').length) {
    new Swiper('.reviews-swiper', {
      slidesPerView: 1, spaceBetween: 28, loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.reviews-pagination', clickable: true, dynamicBullets: true },
      breakpoints: { 768: { slidesPerView: 2 } }
    });
  }

  /* ── DESTINATION SUGGESTIONS ── */
  var $di = $('#destinationInput'), $ds = $('#destSuggestions');
  $di.on('focus input', function () {
    var v = this.value.toLowerCase(), vis = 0;
    $('.dest-item').each(function () {
      var match = v === '' || $(this).text().toLowerCase().includes(v);
      $(this).toggle(match);
      if (match) vis++;
    });
    vis ? $ds.slideDown(160) : $ds.slideUp(160);
  });
  $('.dest-item').on('click', function () {
    $di.val($(this).data('val'));
    $ds.slideUp(160);
  });
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.form-group-custom').length) $ds.slideUp(160);
  }).on('keydown', function (e) { if (e.key === 'Escape') $ds.slideUp(160); });

  /* ── BOOKING FORM ── */
  $('#bookingForm').on('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $(this).find('[required]').each(function () {
      if (!$(this).val().trim()) {
        ok = false;
        $(this).css({ 'border-color': '#dc3545', 'box-shadow': '0 0 0 3px rgba(220,53,69,0.15)' });
        setTimeout(function () { }, 2500);
      }
    });
    if (ok) {
      $(this).fadeOut(350, function () { $('#bookingSuccess').fadeIn(450); });
      burst();
    } else {
      var $b = $(this).find('.btn-book-submit');
      $b.css('animation', 'htShake 0.4s ease');
      setTimeout(function () { $b.css('animation', ''); }, 450);
    }
  });
  $('.custom-input').on('input change', function () {
    $(this).css({ 'border-color': '', 'box-shadow': '' });
  });
  function burst() {
    var cols = ['#F5C518','#FFD84D','#D4A800','#fff'];
    for (var i = 0; i < 28; i++) {
      var $p = $('<div>').css({ position:'fixed', width: Math.random()*8+4+'px', height: Math.random()*8+4+'px', background: cols[i%4], borderRadius:'50%', top:'50%', left:'50%', zIndex:99999, pointerEvents:'none', opacity:1 });
      $('body').append($p);
      var a = Math.random()*360, d = Math.random()*200+80, r = a*Math.PI/180;
      $p.animate({ left: '+='+(Math.cos(r)*d), top: '+='+(Math.sin(r)*d), opacity:0 }, Math.random()*800+300, 'swing', function(){ $(this).remove(); });
    }
  }

  /* ── FARE CALCULATOR ── */
  function calcFare() {
    var $opt = $('#calcService option:selected');
    var base = parseFloat($opt.data('base')) || 15;
    var per  = parseFloat($opt.data('per'))  || 1.8;
    var dist = parseInt($('#distRange').val()) || 1;
    var pax  = parseInt($('#calcPassengers').val()) || 1;
    var tm   = parseFloat($('#calcTime').val()) || 1;
    var dc   = per > 0 ? dist * per : 0;
    var pm   = pax >= 6 ? 1.2 : 1.0;
    var tot  = (base + dc) * pm * tm;
    $('#resBaser').text('£' + base.toFixed(2));
    $('#resDistance').text('£' + (dc * pm).toFixed(2));
    $('#resTime').text('x' + tm.toFixed(2));
    $({ v: parseFloat($('#resTotal').text().replace('£','')) || 0 })
      .animate({ v: tot }, { duration:380, step: function(){ $('#resTotal').text('£'+this.v.toFixed(2)); }, complete: function(){ $('#resTotal').text('£'+tot.toFixed(2)); } });
  }
  $('#distRange').on('input', function () { $('#distVal').text(this.value); calcFare(); });
  $('#calcService, #calcPassengers, #calcTime').on('change', calcFare);
  calcFare();

  /* ── SCROLL TO TOP ── */
  function showScrollTop() { $('#scrollTopBtn').toggleClass('show', $(window).scrollTop() > 400); }
  $('#scrollTopBtn').on('click', function () { $('html,body').animate({ scrollTop: 0 }, 700, 'easeInOutQuart'); });

  /* ── RATING BARS ── */
  var rbObs = new IntersectionObserver(function (en) {
    if (en[0].isIntersecting) {
      $('.r-bar-fill').each(function () {
        var w = $(this).css('width'); $(this).css('width','0').animate({ width: w }, 1100);
      });
      rbObs.disconnect();
    }
  }, { threshold: 0.3 });
  var rSec = document.querySelector('#ratings');
  if (rSec) rbObs.observe(rSec);

  /* ── SERVICE CARD TILT ── */
  if (window.innerWidth > 768) {
    $(document).on('mousemove', '.service-card', function (e) {
      var r = this.getBoundingClientRect();
      var rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
      var ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
      $(this).css('transform', 'translateY(-10px) perspective(600px) rotateX('+rx+'deg) rotateY('+ry+'deg)');
    }).on('mouseleave', '.service-card', function () { $(this).css('transform', ''); });
  }

  /* ── DYNAMIC YEAR ── */
  document.querySelectorAll('.footer-bottom p').forEach(function (p) {
    p.innerHTML = p.innerHTML.replace('2025', new Date().getFullYear());
  });

  /* ── PAGE FADE IN ── */
  $('body').css('opacity', 0);
  $(window).on('load', function () { $('body').animate({ opacity: 1 }, 450); });
  setTimeout(function () { if (+$('body').css('opacity') === 0) $('body').css('opacity', 1); }, 2500);

  /* ── STAGGER FEATURE PILLS ── */
  $('.features-strip .feature-pill').each(function (i) { $(this).css('transition-delay', i * 0.09 + 's'); });

});

/* Inject shake keyframe once */
(function () {
  var s = document.createElement('style');
  s.textContent = '@keyframes htShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}';
  document.head.appendChild(s);
})();