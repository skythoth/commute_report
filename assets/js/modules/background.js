
// Background module

import { applyThemeFromImageAnalysis } from './theme.js';
import { showError, clearError } from './utils.js';

export function initBackground() {
  initBackgroundFromStorage();
  initBackgroundButtons();
  initDragAndDrop();
}

export function initBackgroundFromStorage() {
  const saved = localStorage.getItem('userBackgroundImage');
  if (saved) {
    applyBackground(saved);
    analyzeBrightness(saved);
  }
}

export function applyBackground(base64) {
  document.body.classList.add('custom-bg');
  document.documentElement.style.setProperty('--user-bg', `url('${base64}')`);
}

export function analyzeBrightness(base64) {
  const img = new Image();
  img.src = base64;
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 100, 100);
    const data = ctx.getImageData(0, 0, 100, 100).data;

    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    }

    const isDark = sum / (data.length / 4) < 128;
    applyThemeFromImageAnalysis(isDark);
  };
}

export function initBackgroundButtons() {
  const confirm = document.getElementById('confirmBackgroundBtn');
  const reset = document.getElementById('resetBackground');

  confirm?.addEventListener('click', () => {
    const file = document.getElementById('bgFileInput').files[0];
    if (!file) return showError('이미지를 업로드해주세요.');
    if (file.size > 5 * 1024 * 1024) return showError('이미지 파일은 5MB 이하만 업로드 가능합니다.');
    clearError();

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/webp', 0.8);
      applyBackground(base64);
      analyzeBrightness(base64);
      localStorage.setItem('userBackgroundImage', base64);
      bootstrap.Modal.getInstance(document.getElementById('settingModal'))?.hide();
      URL.revokeObjectURL(img.src);
    };
  });

  reset?.addEventListener('click', () => {
    localStorage.removeItem('userBackgroundImage');
    document.body.classList.remove('custom-bg');
    document.documentElement.style.setProperty('--user-bg', 'none');
    document.getElementById('bgFileInput').value = "";
    clearError();
  });
}

export function initDragAndDrop() {
  const dropZone = document.getElementById('dropZone');
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => dropZone?.addEventListener(evt, e => e.preventDefault()));
  dropZone?.addEventListener('dragover', () => dropZone.classList.add('drag-over'));
  dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone?.addEventListener('drop', e => {
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      document.getElementById('bgFileInput').files = e.dataTransfer.files;
      document.getElementById('confirmBackgroundBtn').click();
    }
  });
}
