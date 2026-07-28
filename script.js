// ============================================================
// SAMWOO PRECISION — interactions
// 1) 모바일 내비게이션 토글
// 2) 스크롤 리빌 애니메이션
// 3) 통계 카운트업
// 4) 문의 폼 제출 처리(샘플: 실제 전송 없이 상태만 표시)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  markRevealTargets();
  initScrollReveal();
  initCounters();
  initContactForm();
  initHeaderScrollState();
});

/* ---------------- 모바일 내비게이션 ---------------- */
function initNavToggle(){
  const header = document.getElementById('header');
  const toggle = document.getElementById('nav-toggle');
  if (!toggle || !header) return;

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  // 메뉴 항목 클릭 시 닫기
  header.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------- 헤더 스크롤 상태(옵션 훅) ---------------- */
function initHeaderScrollState(){
  const header = document.getElementById('header');
  if (!header) return;
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.style.borderBottomColor = y > 8 ? 'rgba(27,32,36,.14)' : 'rgba(27,32,36,.08)';
    lastY = y;
  }, { passive: true });
}

/* ---------------- 스크롤 리빌 대상 지정 ---------------- */
function markRevealTargets(){
  const selectors = [
    '.section-title',
    '.section-lead',
    '.about-item',
    '.cap-card',
    '.stat-card',
    '.cert-badge',
    '.timeline-item',
    '.contact-panel'
  ];
  document.querySelectorAll(selectors.join(',')).forEach((el, i) => {
    el.classList.add('reveal');
    // 같은 그룹 내 살짝의 순차 등장(과하지 않게 60ms 간격, 최대 4단계)
    const delay = Math.min(i % 4, 3) * 70;
    el.style.transitionDelay = `${delay}ms`;
  });
}

/* ---------------- 스크롤 리빌 ---------------- */
function initScrollReveal(){
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || targets.length === 0){
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ---------------- 숫자 카운트업 ---------------- */
function initCounters(){
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const animate = (el) => {
    const isDecimal = el.hasAttribute('data-decimal');
    const target = isDecimal ? parseFloat(el.dataset.decimal) : parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(2) : Math.round(current)) + suffix;

      if (progress < 1){
        requestAnimationFrame(step);
      } else {
        el.textContent = (isDecimal ? target.toFixed(2) : target) + suffix;
      }
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)){
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}

/* ---------------- 문의 폼 ---------------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 샘플 단계: 실제 서버 전송 없이 유효성만 확인 후 상태 문구 표시.
    // 실 서비스 연동 시 이 부분을 fetch(API 엔드포인트) 호출로 교체하세요.
    if (!form.checkValidity()){
      status.textContent = '필수 항목을 모두 입력해 주세요.';
      status.style.color = '#E8963C';
      return;
    }

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';

    setTimeout(() => {
      status.textContent = '문의가 접수되었습니다. 담당자가 1영업일 내 회신드립니다.';
      submitBtn.disabled = false;
      submitBtn.textContent = '문의 보내기';
      form.reset();
    }, 700);
  });
}
