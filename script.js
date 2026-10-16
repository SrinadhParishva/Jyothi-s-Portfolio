(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('js');

  if (reduce) return;

  // 1. Observe sections for smooth atmospheric entrance
  var secIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('sec-in');
        secIo.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

  document.querySelectorAll('.ch, .question, footer').forEach(function (sec) {
    secIo.observe(sec);
  });

  // 2. Flame + sunrise scroll tracker with cached dimensions
  var thread = document.querySelector('.thread');
  var sun = document.querySelector('.sunrise');
  var ticking = false;
  var sunVisible = false;
  var maxScroll = 1;
  var winHeight = window.innerHeight || 800;

  function measure() {
    winHeight = window.innerHeight || 800;
    maxScroll = Math.max(document.documentElement.scrollHeight - winHeight, 1);
  }

  if (sun) {
    var sunIo = new IntersectionObserver(function (entries) {
      sunVisible = entries[0].isIntersecting;
    }, { rootMargin: '100px 0px 100px 0px' });
    sunIo.observe(sun);
  }

  function update() {
    ticking = false;
    var sy = window.scrollY || window.pageYOffset || 0;
    var p = Math.min(Math.max(sy / maxScroll, 0), 1);
    if (thread) {
      thread.style.setProperty('--p', p.toFixed(4));
      thread.classList.toggle('on', sy > winHeight * 0.35);
    }
    if (sun && sunVisible) {
      var r = sun.getBoundingClientRect();
      var sp = 1 - (r.top + r.height * 0.4) / winHeight;
      sun.style.setProperty('--sp', Math.min(Math.max(sp * 1.6, 0), 1).toFixed(3));
    }
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    measure();
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  });

  // Initial measurement deferred
  if ('requestIdleCallback' in window) {
    requestIdleCallback(measure);
  } else {
    setTimeout(measure, 50);
  }
})();
