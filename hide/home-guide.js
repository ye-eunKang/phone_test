/* 홈 안내: 로고/버튼 → GIF + 사진 → 3초 후 다음 사진.
 * GIF의 src와 DOM은 사진 전환 때 변경하지 않습니다.
 * FishApp의 화면은 계속 home이므로 물 배경도 유지됩니다.
 */
(() => {
  'use strict';

  // 실제 사진 파일명으로 바꾸세요. 사진이 더 있으면 배열에 추가합니다.
  const GUIDE_SETTINGS = {
    photos: ['assets/Web page_intro-ment1.png', 'assets/Web page_intro-ment2.png','assets/Web page_intro-ment3.png'],
    changeAfterMs: 3000,
  };

  const PHOTO_WIDTHS = [70,83,72];
  const stage = document.getElementById('stage');
  const button = document.getElementById('homeStart');
  const logo = document.querySelector('#homeContent .home-logo');
  const panel = document.getElementById('homeGuide');
  const photo = document.getElementById('homeGuidePhoto');
  const gif = document.getElementById('homeGuideGif');
  if (!stage || !button || !logo || !panel || !photo || !gif) {
    console.error('홈 안내: homeStart, home-logo, homeGuide, homeGuidePhoto, homeGuideGif를 확인해주세요.');
    return;
  }
  if (!GUIDE_SETTINGS.photos.length) return;

  let photoIndex = 0;
  let opened = false;
  let timer = null;
  const preloads = GUIDE_SETTINGS.photos.map((src) => {
    const image = new Image();
    image.src = src;
    return image;
  });

  function clearTimer() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  }
  function setPhoto(index) {
    photoIndex = index;
    photo.src = GUIDE_SETTINGS.photos[index];
    photo.alt = `안내 ${index + 1}`;
    photo.style.width = `${PHOTO_WIDTHS[index] ?? 80}%`;
    // 여기에 gif.src 변경이나 GIF 새 요소 생성을 넣지 마세요.
  }
  function scheduleNextPhoto() {
    clearTimer();
    if (!opened || document.hidden || stage.dataset.screen !== 'home') return;
    if (photoIndex >= GUIDE_SETTINGS.photos.length - 1) return;
    timer = setTimeout(() => {
      timer = null;
      if (!opened || stage.dataset.screen !== 'home') return;
      setPhoto(photoIndex + 1);
      scheduleNextPhoto();
    }, GUIDE_SETTINGS.changeAfterMs);
  }
  function resetGuide() {
    clearTimer();
    opened = false;
    photoIndex = 0;
    panel.hidden = true;
    logo.hidden = false;
    button.hidden = false;
  }
  function openGuide() {
    if (stage.dataset.screen !== 'home' || opened) return;
    opened = true;
    logo.hidden = true;
    button.hidden = true;
    setPhoto(0);
    panel.hidden = false;
    scheduleNextPhoto();
  }

  button.addEventListener('click', openGuide);
  window.addEventListener('fishhome:show', resetGuide);

  // NFC/QR 또는 개발 패널로 게임이 시작되면 이전 안내 타이머를 취소합니다.
  const observer = new MutationObserver(() => {
    if (stage.dataset.screen !== 'home') resetGuide();
  });
  observer.observe(stage, { attributes: true, attributeFilter: ['data-screen'] });

  // 다른 앱/탭으로 나간 동안에는 사진을 넘기지 않습니다.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimer();
    else if (opened) scheduleNextPhoto();
  });

  resetGuide();
})();
