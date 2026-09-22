(() => {
  'use strict';

  const dialog = document.getElementById('figure-dialog');
  const dialogImage = dialog.querySelector('img');
  function showImage(src, alt) {
    dialogImage.src = src;
    dialogImage.alt = alt;
    dialog.setAttribute('aria-label', alt);
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  document.getElementById('close-figure').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  document.getElementById('open-figure').addEventListener('click', () => showImage('assets/qualitative-comparison.png', 'Paper comparison: ground truth, HST-GS, FastGS, Taming-3DGS, DashGaussian, and Speedy-Splat'));

  const trainingScenes = {
    bicycle: { name: 'Bicycle', file: 'bicycle.mp4', poster: 'bicycle-poster.png' },
    flowers: { name: 'Flowers', file: 'flowers.mp4', poster: 'flowers-poster.png' },
    garden: { name: 'Garden', file: 'garden.mp4', poster: 'garden-poster.png' },
    stump: { name: 'Stump', file: 'stump.mp4', poster: 'stump-poster.png' }
  };
  const trainingVideo = document.getElementById('training-video');
  const trainingSource = trainingVideo.querySelector('source');
  const trainingButtons = [...document.querySelectorAll('[data-training-scene]')];
  const trainingDownload = document.getElementById('training-video-download');
  const trainingFallback = document.getElementById('training-video-fallback');
  trainingButtons.forEach(button => button.addEventListener('click', () => {
    const scene = trainingScenes[button.dataset.trainingScene];
    const src = 'assets/media/' + scene.file;
    if (trainingSource.getAttribute('src') === src) return;
    const resume = !trainingVideo.paused && !trainingVideo.ended;
    trainingVideo.pause();
    trainingSource.src = src;
    trainingVideo.poster = 'assets/media/' + scene.poster;
    trainingVideo.setAttribute('aria-label', scene.name + ' training progression: HST-GS and the AbsGS backbone over time');
    document.getElementById('training-description').textContent = 'A fixed test view of ' + scene.name + ', with reconstruction quality tracked against training time.';
    trainingDownload.href = src;
    trainingDownload.download = scene.file;
    trainingDownload.textContent = 'Download ' + scene.name + ' MP4 ↓';
    trainingFallback.href = src;
    trainingButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    trainingVideo.load();
    if (resume) trainingVideo.play().catch(() => {});
  }));

  const plotData = {
    training: {
      file: 'fig_perscene.png',
      title: 'Training acceleration across all 13 scenes',
      summary: 'HST + SR speeds up training by 3.84×–6.80× across individual scenes. Reconstruction changes vary by scene; the 13-scene mean PSNR change is −0.080 dB.',
      alt: 'Per-scene training speedup and PSNR differences for SR, HST and HST-GS',
      caption: 'Per-scene 3-seed means on A800. The source figure labels HST as “HTS”. Training speedup uses the AbsGS backbone as its reference.'
    },
    refinement: {
      file: 'viz_e3_grid2x2_3seed.png',
      title: 'Where the refinement budget is spent matters',
      summary: 'Proposed SR removes 35% of the nominal full-step budget and takes 4.14 minutes. At the matched budget, its PSNR deviation is −0.065 dB versus −0.082 dB for early stopping.',
      alt: 'Three-seed Scheduled Refinement ablation comparing PSNR, SSIM, LPIPS and per-scene speedup',
      caption: '3-seed SR ablation. The reference is HST with a 24-bit depth key and no SR over the full 30K horizon. This speedup is relative to No SR, rather than the AbsGS backbone used in the training figure.'
    },
    rendering: {
      file: 'viz_e4_warm_wall_speedup.png',
      title: 'A specialized path for rendering',
      summary: 'On the same trained HST-GS models, RFR reaches 353.93 FPS against 196.39 FPS for the native renderer. Each scene is measured after warmup, using the median of three timed passes.',
      alt: 'Per-scene warmed rendering wall time and speedup for native, evaluation specialization, RFR kernels and complete RFR',
      caption: 'The source plot’s “Full-TFR” denotes the complete RFR path and “TFR kernels” denotes RFR kernels. Scene order follows the supplied plot. RFR is used for evaluation only.'
    }
  };
  const plotTabs = [...document.querySelectorAll('.plot-tab')];
  const plotImage = document.getElementById('experiment-image');
  const plotPanel = document.getElementById('plot-panel');
  const openPlot = document.getElementById('open-plot');
  let activePlot = 'training';
  let plotRequest = 0;
  async function selectPlot(key) {
    const request = ++plotRequest;
    const entry = plotData[key];
    plotPanel.setAttribute('aria-busy', 'true');
    try {
      const loaded = new Image();
      loaded.src = `assets/plots/${entry.file}`;
      await loaded.decode();
      if (request !== plotRequest) return;
      activePlot = key;
      plotImage.src = loaded.src;
      plotImage.alt = entry.alt;
      plotImage.width = loaded.naturalWidth;
      plotImage.height = loaded.naturalHeight;
      document.getElementById('plot-title').textContent = entry.title;
      document.getElementById('plot-summary').textContent = entry.summary;
      document.getElementById('plot-caption').textContent = entry.caption;
      openPlot.setAttribute('aria-label', `Enlarge chart: ${entry.title}`);
      plotPanel.setAttribute('aria-labelledby', `plot-tab-${key}`);
      plotTabs.forEach(tab => {
        const chosen = tab.dataset.plot === key;
        tab.setAttribute('aria-selected', String(chosen));
        tab.tabIndex = chosen ? 0 : -1;
      });
    } catch {
      if (request === plotRequest) document.getElementById('plot-caption').textContent = 'This figure could not be loaded. Select another experiment or reload the page.';
    } finally {
      if (request === plotRequest) plotPanel.setAttribute('aria-busy', 'false');
    }
  }
  plotTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPlot(tab.dataset.plot));
    tab.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? plotTabs.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + plotTabs.length) % plotTabs.length;
      plotTabs[next].focus();
      selectPlot(plotTabs[next].dataset.plot);
    });
  });
  openPlot.addEventListener('click', () => showImage(`assets/plots/${plotData[activePlot].file}`, plotData[activePlot].alt));

  const groups = {
    mip: { name: 'Mip-NeRF 360', scenes: ['bicycle', 'flowers', 'garden', 'stump', 'treehill', 'room', 'counter', 'kitchen', 'bonsai'] },
    tanks: { name: 'Tanks & Temples', scenes: ['Truck', 'Train'] },
    deep: { name: 'Deep Blending', scenes: ['playroom', 'drjohnson'] }
  };
  const sceneNames = { bicycle: 'Bicycle', flowers: 'Flowers', garden: 'Garden', stump: 'Stump', treehill: 'Treehill', room: 'Room', counter: 'Counter', kitchen: 'Kitchen', bonsai: 'Bonsai', Truck: 'Truck', Train: 'Train', playroom: 'Playroom', drjohnson: 'Dr. Johnson' };
  const groupButtons = [...document.querySelectorAll('[data-scene-group]')];
  const viewButtons = [...document.querySelectorAll('[data-scene-view]')];
  const choices = document.getElementById('scene-choices');
  const stage = document.getElementById('compare-stage');
  const before = document.getElementById('scene-before');
  const after = document.getElementById('scene-after');
  const range = document.getElementById('compare-range');
  const divider = document.getElementById('compare-divider');
  const status = document.getElementById('scene-status');
  const openPair = document.getElementById('open-scene-pair');
  let activeGroup = 'mip', activeScene = 'bicycle', activeView = '1';
  let renderedScene = 'bicycle', renderedView = '1', sceneRequest = 0;

  function updateSplit(value) {
    const split = Math.max(0, Math.min(100, Math.round(Number(value))));
    range.value = String(split);
    range.setAttribute('aria-valuetext', `${split} percent backbone, ${100 - split} percent HST-GS`);
    stage.style.setProperty('--split', `${split}%`);
  }
  range.addEventListener('input', () => updateSplit(range.value));
  let dragPointer = null;
  function dragTo(e) {
    const bounds = stage.getBoundingClientRect();
    updateSplit((e.clientX - bounds.left) / bounds.width * 100);
  }
  divider.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragPointer = e.pointerId;
    divider.setPointerCapture(e.pointerId);
    dragTo(e);
  });
  divider.addEventListener('pointermove', e => { if (dragPointer === e.pointerId) dragTo(e); });
  function stopDrag(e) {
    if (dragPointer !== e.pointerId) return;
    if (divider.hasPointerCapture(e.pointerId)) divider.releasePointerCapture(e.pointerId);
    dragPointer = null;
  }
  divider.addEventListener('pointerup', stopDrag);
  divider.addEventListener('pointercancel', stopDrag);

  function syncSceneButtons() {
    groupButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sceneGroup === activeGroup)));
    choices.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scene === activeScene)));
    viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sceneView === activeView)));
  }
  function buildSceneChoices() {
    choices.replaceChildren(...groups[activeGroup].scenes.map(id => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.scene = id;
      button.textContent = sceneNames[id];
      button.addEventListener('click', () => { activeScene = id; loadScene(); });
      return button;
    }));
  }
  async function loadScene() {
    const request = ++sceneRequest;
    const scene = activeScene, view = activeView, group = activeGroup;
    syncSceneButtons();
    stage.setAttribute('aria-busy', 'true');
    status.textContent = `Loading ${sceneNames[scene]} · View ${view}…`;
    openPair.disabled = true;
    try {
      const loaded = new Image();
      loaded.src = `assets/scenes/${scene}_v${view}.jpg`;
      await loaded.decode();
      if (request !== sceneRequest) return;
      renderedScene = scene;
      renderedView = view;
      before.src = after.src = loaded.src;
      before.alt = `AbsGS backbone reconstruction of ${sceneNames[scene]}, view ${view}`;
      after.alt = `HST-GS reconstruction of ${sceneNames[scene]}, view ${view}`;
      stage.style.setProperty('--aspect', String(loaded.naturalWidth / (loaded.naturalHeight / 2)));
      document.getElementById('scene-title').textContent = sceneNames[scene];
      document.getElementById('scene-subtitle').textContent = `${groups[group].name} · View ${view}`;
      status.textContent = `${sceneNames[scene]} · View ${view} ready. Drag the divider or use the slider.`;
      updateSplit(50);
    } catch {
      if (request === sceneRequest) status.textContent = 'This view could not be loaded. Select another scene or reload the page.';
    } finally {
      if (request === sceneRequest) {
        stage.setAttribute('aria-busy', 'false');
        openPair.disabled = false;
      }
    }
  }
  groupButtons.forEach(button => button.addEventListener('click', () => {
    activeGroup = button.dataset.sceneGroup;
    activeScene = groups[activeGroup].scenes[0];
    buildSceneChoices();
    loadScene();
  }));
  viewButtons.forEach(button => button.addEventListener('click', () => { activeView = button.dataset.sceneView; loadScene(); }));
  openPair.addEventListener('click', () => showImage(`assets/pairs/${renderedScene}_v${renderedView}.jpg`, `${sceneNames[renderedScene]}, view ${renderedView}: AbsGS backbone on the left, HST-GS on the right`));
  buildSceneChoices();
  loadScene();
})();
