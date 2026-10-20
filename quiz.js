/**
 * FUNIL DE QUIZ: PROTOCOLE DU SILENCE (VINCENT MERCIER)
 * Framework 100% Linear dos 9 Blocos de Venda (Guilherme Azas / "Nutra em Info")
 * Design System Dark Navy Inspirado no MyPattern (https://www.mypattern.app/onboarding/icp4/q/1)
 * Somente Francês nas telas/textos lidos pelo lead.
 * Código, arquitetura, comentários e documentação em Português.
 * Web Audio API nativa (sem dependências externas, sem vazamentos de memória).
 */

(function () {
  'use strict';

  // =========================================================================
  // GESTÃO DE UTMs E RASTREAMENTO DO PIXEL DA META / CHECKOUT
  // =========================================================================
  const utmParamKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'];
  const storedUtms = {};

  function initUtms() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      utmParamKeys.forEach(param => {
        const val = urlParams.get(param);
        if (val) {
          storedUtms[param] = val;
          try { sessionStorage.setItem('ps_' + param, val); } catch (e) {}
        } else {
          try {
            const cached = sessionStorage.getItem('ps_' + param);
            if (cached) storedUtms[param] = cached;
          } catch (e) {}
        }
      });
    } catch (e) {
      console.warn('Erro ao processar UTMs:', e);
    }
  }

  function attachUtmsToUrl(rawUrl) {
    if (!rawUrl) return rawUrl;
    try {
      const url = new URL(rawUrl, window.location.origin);
      Object.keys(storedUtms).forEach(k => {
        if (storedUtms[k] && !url.searchParams.has(k)) {
          url.searchParams.set(k, storedUtms[k]);
        }
      });
      return url.toString();
    } catch (e) {
      return rawUrl;
    }
  }

  function trackPixelEvent(eventName, params = {}, isCustom = true) {
    try {
      if (typeof window.fbq === 'function') {
        if (isCustom) {
          window.fbq('trackCustom', eventName, params);
        } else {
          window.fbq('track', eventName, params);
        }
      }
    } catch (e) {
      console.warn('Erro no envio do evento Pixel:', eventName, e);
    }
  }

  initUtms();

  // =========================================================================
  // 1. FLUXO 100% LINEAR DOS 9 BLOCOS DE VENDA (21 TELAS - ZERO RETORNOS)
  // =========================================================================
  const screensOrder = [
    'screen-hero',              // 0: Bloco 1 - Attention & Promesse Hybride
    'screen-sound-type',        // 1: Bloco 1/2 - Identification du Son (Avec bouton continuer)
    'screen-ear-side',          // 2: Bloco 2 - Visualisation (Latéralisation)
    'screen-duration',          // 3: Bloco 2 - Visualisation (Durée & Empathie)
    'screen-peak-time',         // 4: Bloco 2 - Visualisation (Pic Nocturne 3h du Matin)
    'screen-severity',          // 5: Bloco 2 - Visualisation (Réglette 1-10 avec bouton continuer)
    'screen-prev-treatments',   // 6: Bloco 2 - Frustration Médicale & Traitements (Checkboxes)
    'screen-vincent-story',     // 7: Bloco 3 - Histoire & Crédibilité de Vincent Mercier
    'screen-chat-vicente',      // 8: Bloco 3 - Consultation WhatsApp avec Note Vocale
    'screen-overload-alert',    // 9: Bloco 4 - Alerte Surcharge Neuronale & Myéline
    'screen-freq-intro',        // 10: Bloco 4 - Mecanismo do Cabo Dénudé (Vidéo plein cadre)
    'screen-freq-ab',           // 11: Calibration A vs B en 3 Étapes (MyPattern)
    'screen-notch-visualizer',  // 12: Bloco 5 - Filtre Notch Avant/Après
    'screen-science-backing',   // 13: Bloco 5 - Harvard & Münster (Plein cadre sans rognage)
    'screen-trajectory',        // 14: Bloco 5 - Trajectoire Animée (Courbes dessinées)
    'screen-commitment',        // 15: Bloco 5 - Micro-engagement (10 min/jour)
    'screen-bifurcation',       // 16: Bloco 5 - Les 2 Chemins (Inaction vs Protocole)
    'screen-loading',           // 17: Bloco 5 - Cascade en 5 étapes AVANT la VSL
    'screen-vsl-presentation',  // 18: Bloco 6 - Diagnostic & Dossier TSL avec Voucher Intégré
    'screen-result'             // 19: Bloco 7/8/9 - Page de Vente Officielle MyPattern
  ];

  // Mapa de Progresso para a Barra Superior Fina
  const progressMap = {
    'screen-hero': { showProgress: false, percent: 0 },
    'screen-sound-type': { showProgress: true, percent: 7 },
    'screen-ear-side': { showProgress: true, percent: 14 },
    'screen-duration': { showProgress: true, percent: 21 },
    'screen-peak-time': { showProgress: true, percent: 28 },
    'screen-severity': { showProgress: true, percent: 35 },
    'screen-prev-treatments': { showProgress: true, percent: 42 },
    'screen-vincent-story': { showProgress: true, percent: 50 },
    'screen-chat-vicente': { showProgress: true, percent: 58 },
    'screen-overload-alert': { showProgress: true, percent: 66 },
    'screen-freq-intro': { showProgress: true, percent: 73 },
    'screen-freq-ab': { showProgress: true, percent: 80 },
    'screen-notch-visualizer': { showProgress: true, percent: 86 },
    'screen-science-backing': { showProgress: true, percent: 90 },
    'screen-trajectory': { showProgress: true, percent: 93 },
    'screen-commitment': { showProgress: true, percent: 96 },
    'screen-bifurcation': { showProgress: true, percent: 98 },
    'screen-loading': { showProgress: true, percent: 99 },
    'screen-vsl-presentation': { showProgress: false, percent: 100 },
    'screen-result': { showProgress: false, percent: 100 }
  };

  // Dicionário de Nomes dos Sons (Português do Brasil)
  const soundNameDictionary = {
    'ringing': 'Apito contínuo agudo',
    'buzzing': 'Chiado elétrico ou zumbido',
    'static': 'Estática de rádio ou TV fora do ar',
    'roaring': 'Zumbido grave constante',
    'kettle': 'Som de panela de pressão ou chaleira',
    'electric': 'Ruído elétrico com mau contato',
    'screeching': 'Cigarras ou grilos cantando',
    'multiple': 'Sons múltiplos ou variáveis'
  };

  // Estado Central da Aplicação
  let currentScreenIndex = 0;
  const historyStack = [];
  const userAnswers = {
    soundType: 'ringing',
    earSide: 'ambos',
    duration: '1-a-3-anos',
    severity: 7,
    peakTime: 'noite',
    frequencyHz: 4000,
    voucherClaimed: false
  };

  // Elementos Globais de Cabeçalho
  const siteHeader = document.getElementById('site-header');
  const btnGlobalBack = document.getElementById('btn-global-back');
  const progressBarWrap = document.getElementById('progress-bar-wrap');
  const progressBarFill = document.getElementById('progress-bar-fill');

  // =========================================================================
  // 2. MOTOR DE ÁUDIO WEB AUDIO API (NATIVO, SINTETIZADO, SEM ARQUIVOS EXTERNOS)
  // =========================================================================
  let audioCtx = null;
  let activeSoundNodes = [];
  let activeGainNode = null;
  let activeAbPlaying = null;
  let activePlayingType = null;
  let audioAutoStopTimer = null;
  let activeAcousticOsc = null;
  let activeAcousticGain = null;

  function stopAcousticTone() {
    if (activeAcousticOsc) {
      try { activeAcousticOsc.stop(); } catch (e) {}
      try { activeAcousticOsc.disconnect(); } catch (e) {}
      activeAcousticOsc = null;
    }
    if (activeAcousticGain) {
      try { activeAcousticGain.disconnect(); } catch (e) {}
      activeAcousticGain = null;
    }
    const toggleBtn = document.getElementById('btn-toggle-tone');
    if (toggleBtn) {
      const toggleText = document.getElementById('tone-toggle-text');
      if (toggleText) toggleText.textContent = 'Ouvir o tom';
    }
  }

  function resetAutoStopTimer(durationMs = 4000) {
    if (audioAutoStopTimer) {
      clearTimeout(audioAutoStopTimer);
      audioAutoStopTimer = null;
    }
    audioAutoStopTimer = setTimeout(() => {
      stopCurrentAudio();
      stopAcousticTone();
    }, durationMs);
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function stopCurrentAudio() {
    if (audioAutoStopTimer) {
      clearTimeout(audioAutoStopTimer);
      audioAutoStopTimer = null;
    }

    if (activeSoundNodes && activeSoundNodes.length > 0) {
      activeSoundNodes.forEach(node => {
        try { node.stop(); } catch (e) {}
        try { node.disconnect(); } catch (e) {}
      });
      activeSoundNodes = [];
    }

    if (activeGainNode) {
      try {
        if (audioCtx) {
          activeGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        }
        activeGainNode.disconnect();
      } catch (e) {}
      activeGainNode = null;
    }

    activePlayingType = null;
    activeAbPlaying = null;

    document.querySelectorAll('.btn-play-sound').forEach(btn => btn.classList.remove('playing'));
    document.querySelectorAll('.sound-card-item').forEach(card => card.classList.remove('playing'));
    const btnA = document.getElementById('btn-play-sound-a');
    const btnB = document.getElementById('btn-play-sound-b');
    if (btnA) btnA.classList.remove('playing');
    if (btnB) btnB.classList.remove('playing');
  }

  // Sintetizador Unificado dos 8 Sons do MyPattern (Usado tanto na seleção inicial quanto no Teste A/B)
  const defaultSoundFreqMap = {
    'ringing': 4000,
    'buzzing': 160,
    'static': 2500,
    'roaring': 140,
    'kettle': 6200,
    'electric': 4500,
    'screeching': 4600,
    'multiple': 3600
  };

  function playSynthesizedSound(type) {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (activePlayingType === type) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();
    stopAcousticTone();

    activePlayingType = type;
    const defaultHz = defaultSoundFreqMap[type] || 4000;
    playSynthesizedSoundAtHz(type, defaultHz, false);

    const targetBtn = document.querySelector(`.sound-card-item[data-value="${type}"] .btn-play-sound`);
    const targetCard = document.querySelector(`.sound-card-item[data-value="${type}"]`);
    if (targetBtn) targetBtn.classList.add('playing');
    if (targetCard) targetCard.classList.add('playing');
  }

  function playSynthesizedSoundAtHz(type, hz, isAb = false) {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (isAb) {
      stopCurrentAudio();
      stopAcousticTone();
    }

    activeGainNode = ctx.createGain();
    activeGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    activeGainNode.connect(ctx.destination);

    resetAutoStopTimer(5000);

    const safeHz = Math.max(50, Math.min(14000, Math.round(hz)));

    if (type === 'ringing') {
      // 1. Apito contínuo e agudo (onda senoidal pura na frequência alvo)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(safeHz, ctx.currentTime);
      osc.connect(activeGainNode);
      osc.start();
      activeSoundNodes.push(osc);
      activeGainNode.gain.exponentialRampToValueAtTime(0.10, ctx.currentTime + 0.08);

    } else if (type === 'buzzing') {
      // 2. Chiado constante / zumbido elétrico (dente de serra em safeHz + senoidal safeHz*2 + filtro passa-baixa)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(safeHz, ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(safeHz * 2, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.max(450, safeHz * 2.6), ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(activeGainNode);

      osc1.start();
      osc2.start();
      activeSoundNodes.push(osc1, osc2, filter);
      activeGainNode.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.08);

    } else if (type === 'static') {
      // 3. Vapor constante / cachoeira / estática (ruído branco com filtro passa-banda sintonizado em safeHz)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(safeHz, ctx.currentTime);
      bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

      whiteNoise.connect(bandpass);
      bandpass.connect(activeGainNode);
      whiteNoise.start();
      activeSoundNodes.push(whiteNoise, bandpass);
      activeGainNode.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.08);

    } else if (type === 'roaring') {
      // 4. Estalo pulsátil ou motor de geladeira (onda triangular em safeHz com modulação lenta LFO)
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(safeHz, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.85, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(Math.min(28, Math.max(8, safeHz * 0.15)), ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      osc.connect(activeGainNode);
      osc.start();
      activeSoundNodes.push(osc, lfo, lfoGain);
      activeGainNode.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.08);

    } else if (type === 'kettle') {
      // 5. Broca fina ou metal agudo / chaleira (onda senoidal estridente com vibrato rápido a 8.5 Hz)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(safeHz, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(8.5, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(25, ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      osc.connect(activeGainNode);
      osc.start();
      activeSoundNodes.push(osc, lfo, lfoGain);
      activeGainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.08);

    } else if (type === 'electric') {
      // 6. Ruído elétrico contínuo / faísca (impulsos estocásticos de ruído com filtro passa-banda em safeHz)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() > 0.88) ? (Math.random() * 2 - 1) : 0;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(safeHz, ctx.currentTime);
      bp.Q.setValueAtTime(2.2, ctx.currentTime);

      noise.connect(bp);
      bp.connect(activeGainNode);
      noise.start();
      activeSoundNodes.push(noise, bp);
      activeGainNode.gain.exponentialRampToValueAtTime(0.10, ctx.currentTime + 0.08);

    } else if (type === 'screeching') {
      // 7. Cigarras ou grilos cantando (duas frequências portadoras em safeHz + modulação AM a 28 Hz + atrito de asas)
      const carrier1 = ctx.createOscillator();
      const carrier2 = ctx.createOscillator();
      carrier1.type = 'triangle';
      carrier1.frequency.setValueAtTime(safeHz, ctx.currentTime);
      carrier2.type = 'sine';
      carrier2.frequency.setValueAtTime(Math.round(safeHz * 1.076), ctx.currentTime);

      const amGain = ctx.createGain();
      amGain.gain.setValueAtTime(0.001, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = 'square';
      lfo.frequency.setValueAtTime(28, ctx.currentTime);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.85, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(amGain.gain);

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.35;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(safeHz, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(3.0, ctx.currentTime);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(amGain);

      carrier1.connect(amGain);
      carrier2.connect(amGain);
      amGain.connect(activeGainNode);

      carrier1.start();
      carrier2.start();
      lfo.start();
      noiseSource.start();

      activeSoundNodes.push(carrier1, carrier2, lfo, lfoGain, amGain, noiseSource, noiseFilter);
      activeGainNode.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.08);

    } else if (type === 'multiple') {
      // 8. Mistura de múltiplos tons (duas frequências dissonantes simultâneas em safeHz e safeHz*1.62)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(safeHz, ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(Math.round(safeHz * 1.62), ctx.currentTime);

      osc1.connect(activeGainNode);
      osc2.connect(activeGainNode);
      osc1.start();
      osc2.start();
      activeSoundNodes.push(osc1, osc2);
      activeGainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.08);

    } else {
      // Fallback
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(safeHz, ctx.currentTime);
      osc.connect(activeGainNode);
      osc.start();
      activeSoundNodes.push(osc);
      activeGainNode.gain.exponentialRampToValueAtTime(0.10, ctx.currentTime + 0.08);
    }
  }

  // Acorde suave de confirmação (Dó-Mi-Sol harmônico a 432 Hz)
    function playHarmonicChord() {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const chordGain = ctx.createGain();
    chordGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    chordGain.connect(ctx.destination);

    // Acorde tríade maior harmônica brilhante (C5, E5, G5, C6) com ataque estéreo acolhedor
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      osc.connect(chordGain);
      osc.start(ctx.currentTime + idx * 0.04);
      osc.stop(ctx.currentTime + 1.3);
    });

    chordGain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.08);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.25);
  }

  // =========================================================================
  // 3. NAVEGAÇÃO E GERENCIAMENTO DE TELAS
  // =========================================================================
  function updateHeaderAndProgress(screenId) {
    const config = progressMap[screenId] || { showProgress: false, percent: 0 };
    if (progressBarWrap) {
      if (config.showProgress) {
        progressBarWrap.style.display = 'block';
        if (progressBarFill) {
          progressBarFill.style.width = config.percent + '%';
        }
      } else {
        progressBarWrap.style.display = 'none';
      }
    }
  }

  function pauseAllVideos() {
    const vslPlayer = document.getElementById('vsl-video-player');
    if (vslPlayer && typeof vslPlayer.pause === 'function' && !vslPlayer.paused) {
      try { vslPlayer.pause(); } catch (e) {}
    }
  }

  window.navigateTo = navigateTo;
  window.userAnswers = userAnswers;

  function navigateTo(index, isBack = false) {
    if (index < 0 || index >= screensOrder.length) return;

    stopCurrentAudio();
    stopAcousticTone();
    pauseAllVideos();

    if (!isBack) {
      historyStack.push(currentScreenIndex);
    }

    const currentScreenEl = document.getElementById(screensOrder[currentScreenIndex]);
    const nextScreenEl = document.getElementById(screensOrder[index]);

    if (currentScreenEl) {
      currentScreenEl.classList.remove('active');
      currentScreenEl.style.display = 'none';
    }

    currentScreenIndex = index;

    if (nextScreenEl) {
      nextScreenEl.style.display = '';
      nextScreenEl.classList.add('active');
      window.scrollTo(0, 0);
    }

    const nextScreenId = screensOrder[index];
    updateHeaderAndProgress(nextScreenId);

    // Rastreamento de avanço do funil por etapa chave
    const screenEventMap = {
      'screen-hero': 'Quiz_Step_0_Hero',
      'screen-sound-type': 'Quiz_Step_1_SoundType',
      'screen-vincent-story': 'Quiz_Step_7_Story',
      'screen-chat-vicente': 'Quiz_Step_8_WhatsApp',
      'screen-freq-ab': 'Quiz_Step_11_AB_Calibration',
      'screen-trajectory': 'Quiz_Step_14_Trajectory',
      'screen-vsl-presentation': 'Quiz_Step_18_VSL_Presentation',
      'screen-result': 'Quiz_Step_19_Sales_Page'
    };

    if (screenEventMap[nextScreenId]) {
      trackPixelEvent(screenEventMap[nextScreenId], {
        screen_index: index,
        screen_id: nextScreenId,
        sound_type: userAnswers.soundType || 'unknown'
      });
    }

    // Disparos contextuais de telas específicas
    if (nextScreenId === 'screen-chat-vicente') {
      startWhatsAppConversation();
    } else if (nextScreenId === 'screen-freq-ab') {
      initAbScreen();
    } else if (nextScreenId === 'screen-loading') {
      runLoadingSequence();
    } else if (nextScreenId === 'screen-diag-profile') {
      renderDiagnosticProfileScreen();
    } else if (nextScreenId === 'screen-vsl-presentation') {
      updateVslDiagnosticCard();
    } else if (nextScreenId === 'screen-trajectory') {
      updateTrajectoryScreen();
    } else if (nextScreenId === 'screen-result') {
      renderSalesPageScreen();
    }
  }

  function handleGoBack() {
    clearWaTimers();
    if (historyStack.length > 0) {
      const prevIndex = historyStack.pop();
      navigateTo(prevIndex, true);
    }
  }

  if (btnGlobalBack) {
    btnGlobalBack.addEventListener('click', handleGoBack);
  }

  // TELA 0: BOTÃO INICIAR AVALIAÇÃO
  const btnStart = document.getElementById('btn-start-quiz');
  if (btnStart) {
    btnStart.addEventListener('click', function () {
      getAudioContext();
      navigateTo(1);
    });
  }

  // =========================================================================
  // 4. TELA 1: SELETOR DE SONS (MYPATTERN 8 SONS - AUTO-AVANÇO 400MS)
  // =========================================================================
  const soundCardItems = document.querySelectorAll('.sound-card-item');
  const btnNextSoundType = document.getElementById('btn-next-sound-type');

  soundCardItems.forEach(card => {
    card.addEventListener('click', function () {
      soundCardItems.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const val = card.getAttribute('data-value');
      userAnswers.soundType = val;

      playSynthesizedSound(val);

      if (btnNextSoundType) {
        btnNextSoundType.classList.add('ready');
      }
    });
  });

  const soundPlayButtons = document.querySelectorAll('.btn-play-sound');
  soundPlayButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const card = btn.closest('.sound-card-item');
      if (card) {
        card.click();
      }
    });
  });

  if (btnNextSoundType) {
    btnNextSoundType.addEventListener('click', function () {
      stopCurrentAudio();
      navigateTo(currentScreenIndex + 1); // Vai para screen-ear-side
    });
  }

  // =========================================================================
  // 5. TELAS 2, 3, 4: PERGUNTAS DE TEXTO ESPECÍFICAS (AUTO-AVANÇO 250MS)
  // =========================================================================
  function setupChoiceStack(stackSelector, questionKey) {
    const stack = document.querySelector(stackSelector);
    if (!stack) return;

    const tiles = stack.querySelectorAll('.choice-tile-btn');
    tiles.forEach(tile => {
      tile.addEventListener('click', function () {
        tiles.forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        const val = tile.getAttribute('data-value');
        userAnswers[questionKey] = val;

        // Auto-avanço com micro-delay de 250ms
        setTimeout(() => {
          navigateTo(currentScreenIndex + 1);
        }, 250);
      });
    });
  }

  setupChoiceStack('[data-question="earSide"]', 'earSide');
  setupChoiceStack('[data-question="duration"]', 'duration');
  setupChoiceStack('[data-question="peakTime"]', 'peakTime');

  // =========================================================================
  // 6. TELA 5: HISTOGRAMA DE SÉVÉRITÉ & RÉGUE NUMÉRIQUE 1 À 10 (AVEC BOUTON)
  // =========================================================================
  const severityCols = document.querySelectorAll('.severity-bar-col');
  const severityNumBtns = document.querySelectorAll('.severity-num-btn');
  const severityBadge = document.getElementById('severity-badge-text');
  const severityTitle = document.getElementById('severity-title-text');
  const severityDesc = document.getElementById('severity-desc-text');
  const btnNextSeverity = document.getElementById('btn-next-severity');
  const severityFeedbackData = {
    1: { badge: 'Nível leve (1 de 10)', color: '#16A34A', title: 'Leve e discreto', desc: 'O som raramente incomoda e você consegue esquecer a maior parte do dia.' },
    2: { badge: 'Nível leve (2 de 10)', color: '#16A34A', title: 'Percebido no silêncio calmo', desc: 'Você nota ao se deitar, mas pega no sono sem grande dificuldade.' },
    3: { badge: 'Nível leve (3 de 10)', color: '#16A34A', title: 'Início de incômodo', desc: 'Começa a chamar a sua atenção quando você tenta ler ou descansar.' },
    4: { badge: 'Nível moderado (4 de 10)', color: '#D97706', title: 'Interfere na concentração', desc: 'Você nota o apito com frequência durante as atividades do dia a dia.' },
    5: { badge: 'Nível moderado (5 de 10)', color: '#D97706', title: 'Incomoda no fim da tarde', desc: 'Com o cansaço acumulado, o som parece subir de volume e exige mais esforço mental.' },
    6: { badge: 'Nível moderado (6 de 10)', color: '#D97706', title: 'Atrapalha o sono', desc: 'Atrasa o sono várias noites na semana por causa do chiado contínuo no travesseiro.' },
    7: { badge: 'Nível severo (7 de 10)', color: '#DC2626', title: 'Tira a paciência e rouba o descanso', desc: 'O apito domina a sua atenção, estraga momentos de descanso e transforma a hora de dormir numa tortura mental.' },
    8: { badge: 'Nível severo (8 de 10)', color: '#DC2626', title: 'Esgotamento mental constante', desc: 'O barulho lateja na cabeça, prejudica o sono profundo e afeta o humor e a disposição.' },
    9: { badge: 'Nível muito severo (9 de 10)', color: '#DC2626', title: 'Desespero auditivo agudo', desc: 'Sensação de pressão na cabeça, ansiedade permanente e despertares assustados no meio da madrugada.' },
    10: { badge: 'Nível crítico (10 de 10)', color: '#DC2626', title: 'Urgência de recalibração neural', desc: 'Insuportável 24 horas por dia. O cérebro está travado no volume máximo o tempo todo.' }
  };

  function selectSeverityLevel(val) {
    userAnswers.severity = val;

    // Met à jour les boutons numérotés
    severityNumBtns.forEach(b => {
      const bVal = parseInt(b.getAttribute('data-val'), 10);
      if (bVal === val) {
        b.classList.add('selected');
      } else {
        b.classList.remove('selected');
      }
    });

    // Met à jour la carte d'empathie avec couleur SOLIDE et forte (sans pastels)
    if (severityFeedbackData[val]) {
      const info = severityFeedbackData[val];
      if (severityBadge) {
        severityBadge.textContent = info.badge;
        severityBadge.style.backgroundColor = info.color;
        severityBadge.style.color = '#FFFFFF';
        severityBadge.style.borderRadius = '4px';
        severityBadge.style.padding = '6px 14px';
        severityBadge.style.fontWeight = '800';
        severityBadge.style.display = 'inline-block';
        severityBadge.style.letterSpacing = '0.04em';
      }
      if (severityTitle) severityTitle.textContent = info.title;
      if (severityDesc) severityDesc.textContent = info.desc;
    }
  }

  severityCols.forEach(col => {
    col.addEventListener('click', function () {
      const val = parseInt(col.getAttribute('data-val'), 10);
      selectSeverityLevel(val);
    });
  });

  severityNumBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const val = parseInt(btn.getAttribute('data-val'), 10);
      selectSeverityLevel(val);
    });
  });

  // Pré-seleciona nível 7 com estilo vermelho sólido de destaque (após inicialização completa)
  selectSeverityLevel(7);

  if (btnNextSeverity) {
    btnNextSeverity.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-prev-treatments
    });
  }

  // =========================================================================
  // 7. TELA 6: MULTI-SELEÇÃO COM CHECKBOXES (SOLUÇÕES JÁ TESTADAS + BOTÃO)
  // =========================================================================
  const prevTreatmentsStack = document.querySelector('[data-question="prevTreatments"]');
  const btnNextPrevTreatments = document.getElementById('btn-next-prev-treatments');
  userAnswers.prevTreatments = [];

  if (prevTreatmentsStack) {
    const checkTiles = prevTreatmentsStack.querySelectorAll('.choice-tile-btn');
    checkTiles.forEach(tile => {
      tile.addEventListener('click', function () {
        tile.classList.toggle('selected');
        const val = tile.getAttribute('data-val');
        if (tile.classList.contains('selected')) {
          if (!userAnswers.prevTreatments.includes(val)) {
            userAnswers.prevTreatments.push(val);
          }
        } else {
          userAnswers.prevTreatments = userAnswers.prevTreatments.filter(v => v !== val);
        }
      });
    });
  }

  if (btnNextPrevTreatments) {
    btnNextPrevTreatments.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-vincent-story
    });
  }

  // =========================================================================
  // 7. TELA 7: HISTOIRE DE VINCENT MERCIER
  // =========================================================================
  const btnNextVincentStory = document.getElementById('btn-next-vincent-story');
  if (btnNextVincentStory) {
    btnNextVincentStory.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-chat-vicente
    });
  }

  // =========================================================================
  // 8. TELA 8: CONSULTATION WHATSAPP AVEC NOTE VOCALE DE VINCENT MERCIER
  // =========================================================================
  let waTimers = [];
  function clearWaTimers() {
    waTimers.forEach(t => clearTimeout(t));
    waTimers = [];
    const typingBubble = document.getElementById('wa-typing-bubble');
    if (typingBubble) typingBubble.style.display = 'none';
    const waStatus = document.getElementById('wa-status-text');
    if (waStatus) waStatus.textContent = 'online';
  }

  // =========================================================================
  // GESTIONNAIRES AUDIO WHATSAPP : 1. VINCENT (WAVEFORM) & 2. ÉLODIE (TRANSFÉRÉ)
  // =========================================================================
  let waAudioInstance = null;
  let voiceIsPlaying = false;
  let voiceProgressInterval = null;
  const waVoicePlayBtn = document.getElementById('wa-voice-play-btn');
  const waVoiceTime = document.getElementById('wa-voice-time');

  let waElodieAudioInstance = null;
  let elodieVoiceIsPlaying = false;
  let elodieVoiceProgressInterval = null;
  const waVoiceElodieBtn = document.getElementById('wa-voice-elodie-btn');
  const waVoiceElodieBar = document.getElementById('wa-voice-elodie-bar');
  const waVoiceElodieThumb = document.getElementById('wa-voice-elodie-thumb');
  const waVoiceElodieTime = document.getElementById('wa-voice-elodie-time');

  function updateVincentWaveform(pct) {
    const bars = document.querySelectorAll('#wa-waveform-vincent .wa-wave-bar');
    if (!bars || bars.length === 0) return;
    const activeCount = Math.floor((pct / 100) * bars.length);
    bars.forEach((bar, idx) => {
      bar.classList.toggle('active', idx <= activeCount);
    });
  }

  function pauseVincentVoiceNote() {
    if (waAudioInstance) {
      try { waAudioInstance.pause(); } catch (e) {}
    }
    if (voiceProgressInterval) {
      clearInterval(voiceProgressInterval);
      voiceProgressInterval = null;
    }
    voiceIsPlaying = false;
    if (waVoicePlayBtn) {
      waVoicePlayBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
    }
  }

  function stopVincentVoiceNote() {
    pauseVincentVoiceNote();
    if (waAudioInstance) {
      try { waAudioInstance.currentTime = 0; } catch (e) {}
    }
    updateVincentWaveform(0);
    if (waVoiceTime) waVoiceTime.textContent = '0:20';
  }

  function playVincentVoiceNote() {
    pauseElodieVoiceNote(); // Met en pause l'audio d'Élodie si en cours

    if (voiceIsPlaying) {
      pauseVincentVoiceNote();
      return;
    }

    voiceIsPlaying = true;
    if (waVoicePlayBtn) {
      waVoicePlayBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    }

    initVincentAudio();

    const playPromise = waAudioInstance.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        runSimulatedVincentWaveform();
      });
    } else {
      runSimulatedVincentWaveform();
    }
  }

  function initVincentAudio() {
    if (!waAudioInstance) {
      waAudioInstance = new Audio('assets/vicente_whatsapp_note.mp3');
      waAudioInstance.preload = 'auto';
      waAudioInstance.addEventListener('timeupdate', () => {
        if (waAudioInstance.duration && !isNaN(waAudioInstance.duration)) {
          const pct = (waAudioInstance.currentTime / waAudioInstance.duration) * 100;
          updateVincentWaveform(pct);
          const rem = Math.max(0, Math.ceil(waAudioInstance.duration - waAudioInstance.currentTime));
          if (waVoiceTime) waVoiceTime.textContent = `0:${rem < 10 ? '0' + rem : rem}`;
        }
      });
      waAudioInstance.addEventListener('loadedmetadata', () => {
        if (waAudioInstance.duration && !isNaN(waAudioInstance.duration) && !voiceIsPlaying) {
          const totalSec = Math.round(waAudioInstance.duration);
          const s = totalSec % 60;
          if (waVoiceTime) waVoiceTime.textContent = `0:${s < 10 ? '0' + s : s}`;
        }
      });
      waAudioInstance.addEventListener('ended', () => {
        stopVincentVoiceNote();
      });
      waAudioInstance.addEventListener('error', () => {
        if (waAudioInstance.src.includes('vicente_whatsapp_note.mp3')) {
          waAudioInstance.src = 'assets/vincent_whatsapp_note.mp3';
          waAudioInstance.play().catch(() => runSimulatedVincentWaveform());
        } else if (waAudioInstance.src.includes('vincent_whatsapp_note.mp3')) {
          waAudioInstance.src = 'assets/whatsapp_audio.mp3';
          waAudioInstance.play().catch(() => runSimulatedVincentWaveform());
        } else {
          runSimulatedVincentWaveform();
        }
      });
    }
  }

  function runSimulatedVincentWaveform() {
    const durationSec = 20;
    let elapsed = waAudioInstance ? (waAudioInstance.currentTime || 0) : 0;
    updateVincentWaveform((elapsed / durationSec) * 100);

    if (voiceProgressInterval) clearInterval(voiceProgressInterval);
    voiceProgressInterval = setInterval(() => {
      elapsed += 0.25;
      const pct = Math.min(100, (elapsed / durationSec) * 100);
      updateVincentWaveform(pct);

      const rem = Math.max(0, Math.ceil(durationSec - elapsed));
      if (waVoiceTime) waVoiceTime.textContent = `0:${rem < 10 ? '0' + rem : rem}`;

      if (elapsed >= durationSec) {
        stopVincentVoiceNote();
      }
    }, 250);
  }

  if (waVoicePlayBtn) {
    waVoicePlayBtn.addEventListener('click', playVincentVoiceNote);
  }
  const waWaveformEl = document.getElementById('wa-waveform-vincent');
  if (waWaveformEl) {
    waWaveformEl.style.cursor = 'pointer';
    waWaveformEl.addEventListener('click', playVincentVoiceNote);
  }

  // --- AUDIO 2 : ÉLODIE (TRANSFÉRÉ) ---
  function pauseElodieVoiceNote() {
    if (waElodieAudioInstance) {
      try { waElodieAudioInstance.pause(); } catch (e) {}
    }
    if (elodieVoiceProgressInterval) {
      clearInterval(elodieVoiceProgressInterval);
      elodieVoiceProgressInterval = null;
    }
    elodieVoiceIsPlaying = false;
    if (waVoiceElodieBtn) {
      waVoiceElodieBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
    }
  }

  function stopElodieVoiceNote() {
    pauseElodieVoiceNote();
    if (waElodieAudioInstance) {
      try { waElodieAudioInstance.currentTime = 0; } catch (e) {}
    }
    if (waVoiceElodieBar) waVoiceElodieBar.style.width = '0%';
    if (waVoiceElodieThumb) waVoiceElodieThumb.style.left = '0%';
    if (waVoiceElodieTime) waVoiceElodieTime.textContent = '0:26';
  }

  function playElodieVoiceNote() {
    pauseVincentVoiceNote(); // Met en pause l'audio de Vincent si en cours

    if (elodieVoiceIsPlaying) {
      pauseElodieVoiceNote();
      return;
    }

    elodieVoiceIsPlaying = true;
    if (waVoiceElodieBtn) {
      waVoiceElodieBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    }

    initElodieAudio();

    const playPromise = waElodieAudioInstance.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        runSimulatedElodieProgress();
      });
    } else {
      runSimulatedElodieProgress();
    }
  }

  function initElodieAudio() {
    if (!waElodieAudioInstance) {
      waElodieAudioInstance = new Audio('assets/elodie_whatsapp_note.mp3');
      waElodieAudioInstance.preload = 'auto';
      waElodieAudioInstance.addEventListener('timeupdate', () => {
        if (waElodieAudioInstance.duration && !isNaN(waElodieAudioInstance.duration)) {
          const pct = (waElodieAudioInstance.currentTime / waElodieAudioInstance.duration) * 100;
          if (waVoiceElodieBar) waVoiceElodieBar.style.width = `${pct}%`;
          if (waVoiceElodieThumb) waVoiceElodieThumb.style.left = `${pct}%`;
          const rem = Math.max(0, Math.ceil(waElodieAudioInstance.duration - waElodieAudioInstance.currentTime));
          if (waVoiceElodieTime) waVoiceElodieTime.textContent = `0:${rem < 10 ? '0' + rem : rem}`;
        }
      });
      waElodieAudioInstance.addEventListener('loadedmetadata', () => {
        if (waElodieAudioInstance.duration && !isNaN(waElodieAudioInstance.duration) && !elodieVoiceIsPlaying) {
          const totalSec = Math.round(waElodieAudioInstance.duration);
          const s = totalSec % 60;
          if (waVoiceElodieTime) waVoiceElodieTime.textContent = `0:${s < 10 ? '0' + s : s}`;
        }
      });
      waElodieAudioInstance.addEventListener('ended', () => {
        stopElodieVoiceNote();
      });
      waElodieAudioInstance.addEventListener('error', () => {
        runSimulatedElodieProgress();
      });
    }
  }

  function runSimulatedElodieProgress() {
    const durationSec = 26;
    let elapsed = waElodieAudioInstance ? (waElodieAudioInstance.currentTime || 0) : 0;
    const initialPct = Math.min(100, (elapsed / durationSec) * 100);
    if (waVoiceElodieBar) waVoiceElodieBar.style.width = `${initialPct}%`;
    if (waVoiceElodieThumb) waVoiceElodieThumb.style.left = `${initialPct}%`;

    if (elodieVoiceProgressInterval) clearInterval(elodieVoiceProgressInterval);
    elodieVoiceProgressInterval = setInterval(() => {
      elapsed += 0.25;
      const pct = Math.min(100, (elapsed / durationSec) * 100);
      if (waVoiceElodieBar) waVoiceElodieBar.style.width = `${pct}%`;
      if (waVoiceElodieThumb) waVoiceElodieThumb.style.left = `${pct}%`;

      const rem = Math.max(0, Math.ceil(durationSec - elapsed));
      if (waVoiceElodieTime) waVoiceElodieTime.textContent = `0:${rem < 10 ? '0' + rem : rem}`;

      if (elapsed >= durationSec) {
        stopElodieVoiceNote();
      }
    }, 250);
  }

  if (waVoiceElodieBtn) {
    waVoiceElodieBtn.addEventListener('click', playElodieVoiceNote);
  }
  const waVoiceElodieTrack = document.getElementById('wa-voice-elodie-track') || document.querySelector('#wa-msg-audio-elodie .wa-voice-track');
  if (waVoiceElodieTrack) {
    waVoiceElodieTrack.style.cursor = 'pointer';
    waVoiceElodieTrack.addEventListener('click', (e) => {
      initElodieAudio();
      const rect = waVoiceElodieTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      const pct100 = pct * 100;
      if (waVoiceElodieBar) waVoiceElodieBar.style.width = `${pct100}%`;
      if (waVoiceElodieThumb) waVoiceElodieThumb.style.left = `${pct100}%`;
      if (waElodieAudioInstance && waElodieAudioInstance.duration && !isNaN(waElodieAudioInstance.duration)) {
        waElodieAudioInstance.currentTime = pct * waElodieAudioInstance.duration;
      }
      if (!elodieVoiceIsPlaying) {
        playElodieVoiceNote();
      }
    });
  }

  // Pre-carregar instâncias de áudio suavemente em background
  try {
    initVincentAudio();
    initElodieAudio();
  } catch (e) {}

  function startWhatsAppConversation() {
    clearWaTimers();
    stopVincentVoiceNote();
    stopElodieVoiceNote();

    const chatBody = document.getElementById('wa-chat-body');
    const msg1 = document.getElementById('wa-msg-1');
    const msg2 = document.getElementById('wa-msg-2');
    const msgUser1 = document.getElementById('wa-msg-user-1');
    const msgAudio = document.getElementById('wa-msg-audio');
    const msg3 = document.getElementById('wa-msg-3');
    const msgPhoto = document.getElementById('wa-msg-photo');
    const msgAudioElodie = document.getElementById('wa-msg-audio-elodie');
    const msg4 = document.getElementById('wa-msg-4');
    const msg4b = document.getElementById('wa-msg-4b');
    const msgUser2 = document.getElementById('wa-msg-user-2');
    const msg5 = document.getElementById('wa-msg-5');
    const msg6 = document.getElementById('wa-msg-6');
    const msgUser3 = document.getElementById('wa-msg-user-3');

    const typingBubble = document.getElementById('wa-typing-bubble');
    const waStatus = document.getElementById('wa-status-text');
    const defaultInputBar = document.getElementById('wa-default-input-bar');
    const optionsContainer = document.getElementById('wa-options-input-container');

    function getLiveTimeStr(offsetMinutes = 0) {
      const d = new Date(Date.now() + offsetMinutes * 60000);
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    }

    function setBubbleTime(bubbleEl, isUser = false, offsetMinutes = 0) {
      if (!bubbleEl) return;
      const tag = bubbleEl.querySelector('.wa-time-tag');
      if (tag) {
        const timeStr = getLiveTimeStr(offsetMinutes);
        if (isUser) {
          tag.innerHTML = `${timeStr} <span class="wa-blue-ticks">✓✓</span>`;
        } else {
          tag.textContent = timeStr;
        }
      }
    }

    // Reset initial visibility
    [msg2, msgUser1, msgAudio, msg3, msgPhoto, msgAudioElodie, msg4, msg4b, msgUser2, msg5, msg6, msgUser3, typingBubble].forEach(el => {
      if (el) el.style.display = 'none';
    });
    if (msg1) msg1.style.display = 'block';
    setBubbleTime(msg1, false, 0);

    function setTyping(state) {
      if (state === 'text') {
        if (waStatus) waStatus.textContent = 'digitando...';
        if (typingBubble) typingBubble.style.display = 'inline-flex';
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
      } else if (state === 'audio') {
        if (waStatus) waStatus.textContent = 'gravando áudio...';
        if (typingBubble) typingBubble.style.display = 'none';
      } else {
        if (waStatus) waStatus.textContent = 'online';
        if (typingBubble) typingBubble.style.display = 'none';
      }
    }

    function setUserBubbleText(bubbleEl, text, offsetMinutes = 0) {
      if (!bubbleEl) return;
      const timeStr = getLiveTimeStr(offsetMinutes);
      bubbleEl.innerHTML = `${text} <span class="wa-time-tag">${timeStr} <span class="wa-blue-ticks">✓✓</span></span>`;
      bubbleEl.style.display = 'block';
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showWhatsAppInputOptions(options, onSelect) {
      if (!optionsContainer) return;
      optionsContainer.innerHTML = '';

      options.forEach(optText => {
        const row = document.createElement('div');
        row.className = 'wa-input-option-row';
        row.innerHTML = `
          <div class="wa-input-option-box">
            <span>${optText}</span>
          </div>
          <button type="button" class="wa-input-option-send-btn" aria-label="Enviar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        `;
        row.addEventListener('click', (e) => {
          e.preventDefault();
          hideWhatsAppInputOptions();
          onSelect(optText);
        });
        optionsContainer.appendChild(row);
      });

      if (defaultInputBar) defaultInputBar.style.display = 'none';
      optionsContainer.style.display = 'flex';
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    }

    function hideWhatsAppInputOptions() {
      if (optionsContainer) optionsContainer.style.display = 'none';
      if (defaultInputBar) defaultInputBar.style.display = 'flex';
    }

    hideWhatsAppInputOptions();

    // Etapa 1: Seu Vicente escreve msg 2
    waTimers.push(setTimeout(() => {
      setTyping('text');

      waTimers.push(setTimeout(() => {
        setTyping(false);
        setBubbleTime(msg2, false, 0);
        if (msg2) msg2.style.display = 'block';
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

        // INTERACAO 1 DO LEAD
        waTimers.push(setTimeout(() => {
          const opts1 = [
            'O senhor conseguiu se livrar disso completamente?',
            'É realmente possível desligar esse som sem remédios?'
          ];
          showWhatsAppInputOptions(opts1, (chosenText) => {
            handleStep1Send(chosenText);
          });
        }, 600));
      }, 1600));
    }, 500));

        function handleStep1Send(chosenText) {
      hideWhatsAppInputOptions();
      setUserBubbleText(msgUser1, chosenText, 1);

      // Distância de 1.8s antes de Seu Vicente começar a gravar áudio
      waTimers.push(setTimeout(() => {
        setTyping('audio');

        // Gravação do áudio com duração de 6.5s
        waTimers.push(setTimeout(() => {
          setTyping(false);
          setBubbleTime(msgAudio, false, 1);
          if (msgAudio) {
            msgAudio.style.display = 'block';
            if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
          }

          // Delay de 20 segundos após o envio do áudio para acompanhar o ritmo do lead ouvindo a nota de voz
          waTimers.push(setTimeout(() => {
            setTyping('text');

            // Digitando por 2.0s
            waTimers.push(setTimeout(() => {
              setTyping(false);
              setBubbleTime(msg3, false, 2);
              if (msg3) msg3.style.display = 'block';
              if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

              // Envio da foto da Camila com intervalo de 1.8s
              waTimers.push(setTimeout(() => {
                setBubbleTime(msgPhoto, false, 2);
                if (msgPhoto) {
                  msgPhoto.style.display = 'block';
                  setTimeout(() => {
                    msgPhoto.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }, 50);
                }

                // Envio do áudio encaminhado da Camila com intervalo de 1.8s
                waTimers.push(setTimeout(() => {
                  setBubbleTime(msgAudioElodie, false, 2);
                  if (msgAudioElodie) msgAudioElodie.style.display = 'block';
                  if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

                  // Distância de 2.0s antes de Seu Vicente começar a digitar msg 4
                  waTimers.push(setTimeout(() => {
                    setTyping('text');

                    // Digitando por 2.0s
                    waTimers.push(setTimeout(() => {
                      setTyping(false);
                      setBubbleTime(msg4, false, 3);
                      if (msg4) msg4.style.display = 'block';
                      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

                      // Opções de resposta do lead liberadas após 1.6s
                      waTimers.push(setTimeout(() => {
                        const opts2 = [
                          'Sim, quero ver como desligar esse curto-circuito!',
                          'Como funciona essa desativação do som?'
                        ];
                        showWhatsAppInputOptions(opts2, (chosenText2) => {
                          handleStep2Send(chosenText2);
                        });
                      }, 1600));
                    }, 2000));
                  }, 2000));
                }, 1800));
              }, 1800));
            }, 2000));
          }, 20000)); // <-- 20 SEGUNDOS EXATOS DE ESPERA APÓS O ÁUDIO DO SEU VICENTE
        }, 6500));
      }, 1800));
    }

    

    function handleStep2Send(chosenText2) {
      hideWhatsAppInputOptions();
      setUserBubbleText(msgUser2, chosenText2, 3);

      // Vicente responde com a explicacao neural
      waTimers.push(setTimeout(() => {
        setTyping('text');

        waTimers.push(setTimeout(() => {
          setTyping(false);
          setBubbleTime(msg5, false, 4);
          if (msg5) msg5.style.display = 'block';
          if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

          waTimers.push(setTimeout(() => {
            setTyping('text');

            waTimers.push(setTimeout(() => {
              setTyping(false);
              setBubbleTime(msg6, false, 4);
              if (msg6) msg6.style.display = 'block';
              if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

              // INTERACAO 3 DO LEAD (sem caracter de seta no texto)
              waTimers.push(setTimeout(() => {
                const opts3 = [
                  'Entender o diagnóstico do Seu Vicente'
                ];
                showWhatsAppInputOptions(opts3, (chosenText3) => {
                  handleStep3Send(chosenText3);
                });
              }, 700));
            }, 1800));
          }, 900));
        }, 1800));
      }, 600));
    }

    function handleStep3Send(chosenText3) {
      hideWhatsAppInputOptions();
      setUserBubbleText(msgUser3, chosenText3, 4);

      stopVincentVoiceNote();
      stopElodieVoiceNote();

      setTimeout(() => {
        navigateTo(currentScreenIndex + 1);
      }, 800);
    }
  }

  // =========================================================================
  // 9. TELA 9: ALERTE DE SURCHARGE NEURONALE & NEUROPLASTICITÉ
  // =========================================================================
  const btnNextOverloadAlert = document.getElementById('btn-next-overload-alert');
  if (btnNextOverloadAlert) {
    btnNextOverloadAlert.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-freq-intro
    });
  }

  // =========================================================================
  // 10. TELA 10: FREQ INTRO (COMPETITOR 2 ILLUSTRATIONS + 3 BULLETS + VIDÉO)
  // =========================================================================
  const btnNextFreqIntro = document.getElementById('btn-next-freq-intro');
  if (btnNextFreqIntro) {
    btnNextFreqIntro.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-freq-ab (index 11)
    });
  }

  // =========================================================================
  // 10.B. TELA 11: TESTE COMPARATIF A vs B EN 3 ÉTAPES (MYPATTERN STYLE)
  // =========================================================================
  let abRound = 1;
  let abFreqA = 3200;
  let abFreqB = 6400;
  let abChosenFreq = 4000;

  const btnPlaySoundA = document.getElementById('btn-play-sound-a');
  const btnPlaySoundB = document.getElementById('btn-play-sound-b');
  const btnChooseA = document.getElementById('btn-choose-a');
  const btnChooseB = document.getElementById('btn-choose-b');
  const btnChooseSame = document.getElementById('btn-choose-same');
  const abStepIndicator = document.getElementById('ab-step-indicator');

  function initAbScreen() {
    abRound = 1;
    activeAbPlaying = null;
    stopAcousticTone();
    stopCurrentAudio();

    const soundType = userAnswers.soundType || 'ringing';
    if (soundType === 'buzzing') {
      abFreqA = 120;
      abFreqB = 320;
    } else if (soundType === 'roaring') {
      abFreqA = 85;
      abFreqB = 210;
    } else if (soundType === 'static') {
      abFreqA = 2200;
      abFreqB = 5200;
    } else if (soundType === 'electric') {
      abFreqA = 2800;
      abFreqB = 5600;
    } else if (soundType === 'kettle') {
      abFreqA = 5200;
      abFreqB = 8400;
    } else if (soundType === 'screeching') {
      abFreqA = 3800;
      abFreqB = 6200;
    } else if (soundType === 'multiple') {
      abFreqA = 3200;
      abFreqB = 5800;
    } else {
      abFreqA = 3400;
      abFreqB = 6600;
    }

    updateAbUI();
  }

  function updateAbUI() {
    if (abStepIndicator) {
      abStepIndicator.textContent = 'ETAPA ' + abRound + ' DE 3';
      abStepIndicator.style.background = '';
      abStepIndicator.style.color = '';
    }
    if (btnPlaySoundA) btnPlaySoundA.classList.remove('playing');
    if (btnPlaySoundB) btnPlaySoundB.classList.remove('playing');
  }

  function playAbTone(letter) {
    const targetHz = (letter === 'A') ? abFreqA : abFreqB;
    
    if (activeAbPlaying === letter) {
      stopCurrentAudio();
      stopAcousticTone();
      activeAbPlaying = null;
      if (btnPlaySoundA) btnPlaySoundA.classList.remove('playing');
      if (btnPlaySoundB) btnPlaySoundB.classList.remove('playing');
      return;
    }

    stopCurrentAudio();
    stopAcousticTone();
    activeAbPlaying = letter;

    if (btnPlaySoundA) btnPlaySoundA.classList.toggle('playing', letter === 'A');
    if (btnPlaySoundB) btnPlaySoundB.classList.toggle('playing', letter === 'B');

    const chosenSoundType = userAnswers.soundType || 'ringing';
    playSynthesizedSoundAtHz(chosenSoundType, targetHz, true);
  }

  if (btnPlaySoundA) {
    btnPlaySoundA.addEventListener('click', function () {
      playAbTone('A');
    });
  }

  if (btnPlaySoundB) {
    btnPlaySoundB.addEventListener('click', function () {
      playAbTone('B');
    });
  }

  function handleAbSelection(choice) {
    stopCurrentAudio();
    stopAcousticTone();
    activeAbPlaying = null;
    if (btnPlaySoundA) btnPlaySoundA.classList.remove('playing');
    if (btnPlaySoundB) btnPlaySoundB.classList.remove('playing');

    if (choice === 'A') {
      abChosenFreq = abFreqA;
    } else if (choice === 'B') {
      abChosenFreq = abFreqB;
    } else {
      abChosenFreq = Math.round((abFreqA + abFreqB) / 2);
    }

    if (abRound < 3) {
      abRound++;
      if (abRound === 2) {
        if (choice === 'A') {
          abFreqA = Math.max(50, Math.round(abChosenFreq * 0.82));
          abFreqB = Math.round(abChosenFreq * 1.22);
        } else if (choice === 'B') {
          abFreqA = Math.round(abChosenFreq * 0.85);
          abFreqB = Math.min(14000, Math.round(abChosenFreq * 1.25));
        } else {
          abFreqA = Math.round(abChosenFreq * 0.88);
          abFreqB = Math.round(abChosenFreq * 1.15);
        }
      } else if (abRound === 3) {
        if (choice === 'A') {
          abFreqA = Math.max(50, Math.round(abChosenFreq * 0.94));
          abFreqB = Math.round(abChosenFreq * 1.08);
        } else if (choice === 'B') {
          abFreqA = Math.round(abChosenFreq * 0.93);
          abFreqB = Math.min(14000, Math.round(abChosenFreq * 1.09));
        } else {
          abFreqA = Math.round(abChosenFreq * 0.96);
          abFreqB = Math.round(abChosenFreq * 1.05);
        }
      }
      updateAbUI();
    } else {
      userAnswers.frequencyHz = abChosenFreq;
      navigateTo(currentScreenIndex + 1); // Passa para screen-notch-visualizer
    }
  }

  if (btnChooseA) {
    btnChooseA.addEventListener('click', function () {
      handleAbSelection('A');
    });
  }

  if (btnChooseB) {
    btnChooseB.addEventListener('click', function () {
      handleAbSelection('B');
    });
  }

  if (btnChooseSame) {
    btnChooseSame.addEventListener('click', function () {
      handleAbSelection('same');
    });
  }

  // Diagnostic Clinique de Surcharge pour la VSL (Données Personnalisées Approfondies)
  function updateVslDiagnosticCard() {
    const hz = userAnswers.frequencyHz || 4250;
    const vslFreqCallout = document.getElementById('vsl-freq-callout');
    if (vslFreqCallout) {
      vslFreqCallout.textContent = hz.toLocaleString('pt-BR') + ' Hz';
    }

    const soundName = soundNameDictionary[userAnswers.soundType] || 'Sifflement continu aigu';
    const vslSoundDisplay = document.getElementById('vsl-sound-display');
    if (vslSoundDisplay) {
      vslSoundDisplay.textContent = soundName;
    }

    const sev = parseInt(userAnswers.severity) || 7;
    const vslSevCallout = document.getElementById('vsl-severity-callout');
    if (vslSevCallout) {
      vslSevCallout.textContent = 'Sobrecarga ' + sev + ' de 10';
      vslSevCallout.style.color = (sev >= 7) ? '#DC2626' : (sev >= 4 ? '#D97706' : '#16A34A');
    }

    const diagSevPill = document.getElementById('diag-severity-pill');
    if (diagSevPill) {
      diagSevPill.style.color = '#FFFFFF';
      if (sev >= 7) {
        diagSevPill.textContent = 'Sobrecarga Severa (' + sev + '/10)';
        diagSevPill.style.background = '#DC2626';
        diagSevPill.style.borderColor = '#B91C1C';
      } else if (sev >= 4) {
        diagSevPill.textContent = 'Incômodo Moderado (' + sev + '/10)';
        diagSevPill.style.background = '#D97706';
        diagSevPill.style.borderColor = '#B45309';
      } else {
        diagSevPill.textContent = 'Incômodo Leve (' + sev + '/10)';
        diagSevPill.style.background = '#16A34A';
        diagSevPill.style.borderColor = '#15803D';
      }
    }

    // Récapitulatif personnalisé des données patient (Audio 3 & 4)
    const diagSound = document.getElementById('diag-summary-sound');
    if (diagSound) {
      diagSound.textContent = soundName + ' · ' + hz.toLocaleString('pt-BR') + ' Hz';
    }

    const earSideDictionary = {
      'gauche': 'Apenas no ouvido esquerdo',
      'droite': 'Apenas no ouvido direito',
      'ambos': 'Em ambos os ouvidos (ou na cabeça toda)'
    };
    const diagEar = document.getElementById('diag-summary-ear');
    if (diagEar) {
      diagEar.textContent = earSideDictionary[userAnswers.earSide] || 'Oreille gauche & bilatérale';
    }

    const durationDictionary = {
      'menos-3-meses': 'Menos de 3 meses (fase inicial recente)',
      '3-a-12-meses': 'Entre 3 e 12 meses de duração',
      '1-a-3-anos': 'Entre 1 e 3 anos (circuito neural instalado)',
      'mais-3-anos': 'Mais de 3 anos de sobrecarga contínua'
    };
    const diagDuration = document.getElementById('diag-summary-duration');
    if (diagDuration) {
      diagDuration.textContent = durationDictionary[userAnswers.duration] || 'Mais de 2 anos de duração';
    }

    const peakDictionary = {
      'noite': 'Ao deitar e no silêncio da noite (especialmente às 3h da manhã)',
      'manha': 'Logo nos primeiros segundos ao acordar',
      'dia': 'Durante o dia todo, trabalho e cansaço mental',
      'constante': 'Contínuo 24 horas por dia, sem nenhum alívio'
    };
    const diagPeak = document.getElementById('diag-summary-peak');
    if (diagPeak) {
      diagPeak.textContent = peakDictionary[userAnswers.peakTime] || 'Ao deitar e no silêncio da noite';
    }

    const treatmentsDictionary = {
      'appareils': 'Aparelhos auditivos caros (R$ 10.000 a R$ 15.000)',
      'bruits-blancs': 'Ventilador ligado / ruído branco no celular',
      'complements': 'Ginkgo Biloba / magnésio / vitaminas',
      'gouttes': 'Gotas para ouvido / lavagem de cera no posto',
      'orl': 'Consultas e exames ("aprenda a conviver com isso")',
      'somniferes': 'Calmantes / remédios para labirintite',
      'rien': 'Primeira tentativa de tratamento real'
    };
    const diagTreatments = document.getElementById('diag-summary-treatments');
    if (diagTreatments) {
      if (userAnswers.prevTreatments && userAnswers.prevTreatments.length > 0) {
        const readable = userAnswers.prevTreatments.map(t => treatmentsDictionary[t] || t).join(', ');
        diagTreatments.textContent = readable;
      } else {
        diagTreatments.textContent = 'Ventilador ligado, remédios de farmácia e tentativas caseiras';
      }
    }

    const diagOverloadDesc = document.getElementById('diag-overload-desc');
    if (diagOverloadDesc) {
      diagOverloadDesc.textContent = 'Capa de mielina desgastada ao longo do nervo auditivo. Sem isolar a sua frequência exata (' + hz.toLocaleString('pt-BR') + ' Hz), o cérebro interpreta as microdescargas elétricas como um alarme contínuo de emergência e amplifica o chiado 24 horas por dia.';
    }

    checkVslButtonVisibility();
    initVslVideoPlayback();
  }

  // =========================================================================
  // 10. TELA 9: GRILLE GROSSIÈRE DE FRÉQUENCES (COARSE)
  // =========================================================================
  // (activeAcousticOsc & stopAcousticTone declarados no topo do motor de áudio)

  function playToneAtHz(hz, continuous = false) {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopCurrentAudio();
    stopAcousticTone();

    activeAcousticGain = ctx.createGain();
    activeAcousticGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    activeAcousticGain.connect(ctx.destination);

    activeAcousticOsc = ctx.createOscillator();
    activeAcousticOsc.type = 'sine';
    activeAcousticOsc.frequency.setValueAtTime(hz, ctx.currentTime);
    activeAcousticOsc.connect(activeAcousticGain);

    activeAcousticOsc.start();
    activeAcousticGain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.05);

    if (!continuous) {
      resetAutoStopTimer(3500);
    }
  }

  // =========================================================================
  // 11. TELA 17: ALGORITHME EN CASCADE (LOADING 5 ÉTAPES SÉQUENTIELLES)
  // =========================================================================
  function runLoadingSequence() {
    const steps = [
      document.getElementById('load-step-1'),
      document.getElementById('load-step-2'),
      document.getElementById('load-step-3'),
      document.getElementById('load-step-4'),
      document.getElementById('load-step-5')
    ];

    const phraseEl = document.getElementById('loading-phrase');
    const phrases = [
      "Isolando a frequência sonora do seu zumbido...",
      "Analisando o aumento de volume no córtex auditivo...",
      "Montando seu Protocolo Personalizado de Recalibração Sonora...",
      "Calibrando os sons compensatórios para o seu caso...",
      "Seu Plano Personalizado para silenciar o zumbido está pronto!"
    ];

    // Réinitialisation : tous les pas cachés au départ
    steps.forEach((step) => {
      if (!step) return;
      step.style.display = 'none';
      step.classList.remove('cascade-done');
      const existingSvg = step.querySelector('svg');
      if (existingSvg) {
        existingSvg.outerHTML = '<div class="load-spinner"></div>';
      }
    });

    let currentStepIndex = 0;

    function activateStep(idx) {
      if (idx >= steps.length) {
        // Tous les pas sont terminés avec succès
        setTimeout(() => {
          navigateTo(screensOrder.indexOf('screen-vsl-presentation'));
        }, 700);
        return;
      }

      const stepEl = steps[idx];
      if (stepEl) {
        stepEl.style.display = 'flex';
      }

      if (phraseEl && phrases[idx]) {
        phraseEl.textContent = phrases[idx];
      }

      // Temps de traitement de chaque étape (800ms)
      setTimeout(() => {
        if (stepEl) {
          stepEl.classList.add('cascade-done');
          const spinner = stepEl.querySelector('.load-spinner');
          if (spinner) {
            spinner.outerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M20 6L9 17l-5-5"/></svg>';
          }
        }
        // Passer au pas suivant qui apparaît seulement maintenant
        currentStepIndex++;
        activateStep(currentStepIndex);
      }, idx === (steps.length - 1) ? 900 : 800);
    }

    // Démarre avec le premier pas
    setTimeout(() => {
      activateStep(0);
    }, 300);
  }

  // =========================================================================
  // 14. TELA 13: PROFIL NEUROACOUSTIQUE & TOOLKIT DE VINCENT (NOUVEAU)
  // =========================================================================
  function renderDiagnosticProfileScreen() {
    const hz = userAnswers.frequencyHz || 4000;
    const formattedKHz = (hz >= 1000) ? (hz / 1000).toFixed(1) + ' kHz' : hz + ' Hz';

    const diagFreqDisplay = document.getElementById('diag-freq-display');
    const diagSoundDisplay = document.getElementById('diag-sound-display');

    if (diagFreqDisplay) {
      diagFreqDisplay.textContent = formattedKHz;
    }
    if (diagSoundDisplay) {
      diagSoundDisplay.textContent = soundNameDictionary[userAnswers.soundType] || 'Apito contínuo agudo';
    }
  }

  const btnNextDiagProfile = document.getElementById('btn-next-diag-profile');
  if (btnNextDiagProfile) {
    btnNextDiagProfile.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-notch-visualizer
    });
  }

  // =========================================================================
  // 15. TELA 14: FILTRE NOTCH VISUALIZER
  // =========================================================================
  const btnNextNotch = document.getElementById('btn-next-notch');
  if (btnNextNotch) {
    btnNextNotch.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-science-backing
    });
  }

  // =========================================================================
  // 16. TELA 15: PREUVE SCIENTIFIQUE (HARVARD / MÜNSTER)
  // =========================================================================
  const btnNextScience = document.getElementById('btn-next-science');
  if (btnNextScience) {
    btnNextScience.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-trajectory
    });
  }

  // =========================================================================
  // 17. TELA 16: TRAJECTOIRE DE RÉCUPÉRATION (COURBES CROISÉES)
  // =========================================================================
  function updateTrajectoryScreen() {
    const score = userAnswers.severity || 7;
    const scoreLabel = document.getElementById('traj-score-label');
    if (scoreLabel) {
      scoreLabel.textContent = score;
    }
  }

  const btnNextTrajectory = document.getElementById('btn-next-trajectory');
  if (btnNextTrajectory) {
    btnNextTrajectory.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-commitment
    });
  }

  // =========================================================================
  // 18. TELA 17: MICRO-ENGAGEMENT (10 MINUTES PAR JOUR)
  // =========================================================================
  const btnNextCommitment = document.getElementById('btn-next-commitment');
  if (btnNextCommitment) {
    btnNextCommitment.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-bifurcation
    });
  }

  // =========================================================================
  // 19. TELA 18: BIFURCATION (LES DEUX CHEMINS)
  // =========================================================================
  const btnNextBifurcation = document.getElementById('btn-next-bifurcation');
  if (btnNextBifurcation) {
    btnNextBifurcation.addEventListener('click', function () {
      navigateTo(currentScreenIndex + 1); // Vai para screen-vsl-presentation
    });
  }

  // =========================================================================
  // 21. TELA 21: MASTER VSL CINÉMA (VIDEO 1)
  // =========================================================================
  // Configuração de Delay do Botão na VSL (Pitch Reveal)
  // Altere enabled para true e ajuste delaySeconds quando for rodar anúncios em escala
  const VSL_DELAY_CONFIG = {
    enabled: false,           // true = botão surge apenas no pitch; false = visível imediatamente
    delaySeconds: 1050,       // 17m30s (momento exato do pitch na VSL de Vincent Mercier)
    storageKey: 'vsl_pitch_unlocked'
  };

  const btnGotoVoucher = document.getElementById('btn-goto-voucher');
  const vslPlayer = document.getElementById('vsl-video-player');
  const vslUnmuteOverlay = document.getElementById('vsl-unmute-overlay');

  function initVslVideoPlayback() {
    if (!vslPlayer) return;
    vslPlayer.muted = true;
    const playPromise = vslPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
    if (vslUnmuteOverlay) {
      vslUnmuteOverlay.style.display = 'flex';
    }
  }

  function unmuteAndRestartVsl() {
    if (!vslPlayer) return;
    vslPlayer.muted = false;
    vslPlayer.currentTime = 0;
    vslPlayer.play().catch(() => {});
    if (vslUnmuteOverlay) {
      vslUnmuteOverlay.style.display = 'none';
    }
    vslPlayer.setAttribute('controls', 'true');
  }

  if (vslUnmuteOverlay) {
    vslUnmuteOverlay.addEventListener('click', unmuteAndRestartVsl);
  }

  if (vslPlayer) {
    vslPlayer.addEventListener('click', function () {
      if (vslPlayer.muted) {
        unmuteAndRestartVsl();
      }
    });
  }

  function checkVslButtonVisibility() {
    if (!btnGotoVoucher) return;
    const urlParams = new URLSearchParams(window.location.search);
    const bypassDelay = urlParams.has('nodecay') || urlParams.has('test') || urlParams.has('preview');

    if (!VSL_DELAY_CONFIG.enabled || bypassDelay || localStorage.getItem(VSL_DELAY_CONFIG.storageKey) === 'true') {
      btnGotoVoucher.style.display = 'inline-flex';
      return;
    }

    btnGotoVoucher.style.display = 'none';

    if (vslPlayer) {
      vslPlayer.addEventListener('timeupdate', function () {
        if (vslPlayer.currentTime >= VSL_DELAY_CONFIG.delaySeconds) {
          btnGotoVoucher.style.display = 'inline-flex';
          try { localStorage.setItem(VSL_DELAY_CONFIG.storageKey, 'true'); } catch (e) {}
        }
      });
    }
  }

  if (btnGotoVoucher) {
    btnGotoVoucher.addEventListener('click', function () {
      navigateTo(screensOrder.indexOf('screen-result'));
    });
  }

  // =========================================================================
  // 22. TELA 22: BON D'ACCÈS EXCLUSIF (VALIDATION AVEC CARIMBO & ACCÈS DIRECT)
  // =========================================================================
      // Navegacao oficial dos botoes da TSL direto para a Pagina de Vendas (#screen-result)
  const btnTsl1 = document.getElementById('btn-tsl-checkout-1');
  const btnTsl2 = document.getElementById('btn-tsl-checkout-2');

  function handleGoToSalesPage(e) {
    if (e) e.preventDefault();
    navigateTo(screensOrder.indexOf('screen-result'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (btnTsl1) {
    btnTsl1.addEventListener('click', handleGoToSalesPage);
  }
  if (btnTsl2) {
    btnTsl2.addEventListener('click', handleGoToSalesPage);
  }

      // =========================================================================
  // BOTAO DE RESGATE DO VOUCHER DE 80% (COM SOM DE ATIVACAO E CARIMBO POP)
  // =========================================================================
  const btnClaimVoucher = document.getElementById('btn-claim-voucher');
  const voucherUnlockedStamp = document.getElementById('voucher-unlocked-stamp');

  if (btnClaimVoucher) {
    btnClaimVoucher.addEventListener('click', function () {
      userAnswers.voucherClaimed = true;

      // Rastreamento: NÃO é InitiateCheckout! É apenas o evento customizado de ativação do voucher
      trackPixelEvent('Quiz_Voucher_Claimed', {
        discount: '80%',
        sound_type: userAnswers.soundType || 'ringing',
        frequency: userAnswers.frequencyHz || 4000
      });

      // 1. Toca som harmônico de ativação
      try {
        const ctx = getAudioContext();
        if (ctx) {
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
          playHarmonicChord();
        }
      } catch (e) {
        console.error('Audio chord error:', e);
      }

      // 2. Animação de carimbo (Stamp Pop)
      if (voucherUnlockedStamp) {
        voucherUnlockedStamp.style.display = 'inline-block';
        voucherUnlockedStamp.classList.remove('animate-stamp');
        void voucherUnlockedStamp.offsetWidth; // Force reflow
        voucherUnlockedStamp.classList.add('animate-stamp');
      }

      // 3. Atualiza estado visual do botão
      btnClaimVoucher.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>✓ Voucher Aplicado! Abrindo sua condição especial...</span>
      `;
      btnClaimVoucher.style.backgroundColor = '#16A34A';
      btnClaimVoucher.style.borderColor = '#16A34A';
      btnClaimVoucher.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.35)';

      // 4. Delay realista de 1.4s para o lead ver o carimbo e ouvir o som antes de ir para a Pagina de Vendas
      setTimeout(() => {
        navigateTo(screensOrder.indexOf('screen-result'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1400);
    });
  }







  // =========================================================================
  // 21. TELA 23: PAGE DE VENTE OFFICIELLE V5 (STYLE ÉPURÉ APPLE & TARIF PIZZA)
  // =========================================================================
  let timerInterval = null;

  function startSalesCountdown() {
    if (timerInterval) clearInterval(timerInterval);
    let totalSeconds = 14 * 60 + 51; // 14 min 51 s
    const timerDisplay = document.getElementById('sales-timer-clock') || document.getElementById('sales-timer-countdown');

    timerInterval = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        if (timerDisplay) timerDisplay.textContent = '00:00';
        return;
      }
      totalSeconds--;
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      if (timerDisplay) {
        timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  function setupFaqAccordion() {
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', function () {
        const card = trigger.closest('.faq-card');
        if (!card) return;
        const isOpen = card.classList.contains('open');

        // Fermer les autres cartes FAQ pour une clarté maximale
        document.querySelectorAll('.faq-card').forEach(c => {
          c.classList.remove('open');
          const t = c.querySelector('.faq-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          card.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function renderSalesPageScreen() {
    startSalesCountdown();
    setupFaqAccordion();

    const hz = userAnswers.frequencyHz || 4000;
    const formattedHz = hz.toLocaleString('pt-BR') + ' Hz';

    const salesHzDisplay = document.getElementById('sales-hz-display');
    const salesSoundDisplay = document.getElementById('sales-sound-display');

    if (salesHzDisplay) salesHzDisplay.textContent = formattedHz;
    if (salesSoundDisplay) salesSoundDisplay.textContent = soundNameDictionary[userAnswers.soundType] || 'Apito contínuo agudo';

    // Configuração oficial de checkout: propagação de UTMs e disparo de InitiateCheckout
    const checkoutButtons = [
      document.getElementById('btn-pizza-complete'),
      document.getElementById('btn-pizza-basic'),
      document.getElementById('btn-main-unlock'),
      document.getElementById('btn-sales-checkout')
    ];

    checkoutButtons.forEach(btn => {
      if (!btn) return;

      // Anexa todas as UTMs capturadas do Instagram (Bio / DM)
      const originalHref = btn.getAttribute('data-original-href') || btn.getAttribute('href');
      if (originalHref) {
        if (!btn.getAttribute('data-original-href')) {
          btn.setAttribute('data-original-href', originalHref);
        }
        btn.href = attachUtmsToUrl(originalHref);
      }

      // O InitiateCheckout é disparado ESTRITAMENTE aqui, nos botões que levam à Greenn
      if (!btn.getAttribute('data-track-initiate-checkout')) {
        btn.setAttribute('data-track-initiate-checkout', 'true');
        btn.addEventListener('click', function () {
          const isBasic = btn.id === 'btn-pizza-basic' || (btn.href && btn.href.includes('basico'));
          const price = isBasic ? 67.00 : 97.00;
          const planName = isBasic ? 'Protocolo do Silêncio - Essencial' : 'Protocolo do Silêncio - Completo';

          trackPixelEvent('InitiateCheckout', {
            content_name: planName,
            content_category: 'Infoproduto / Terapia Neuroacústica',
            currency: 'BRL',
            value: price
          }, false); // false = evento oficial padrão da Meta
        });
      }
    });

    // Géolocalisation dynamique sécurisée des preuves sociales
    initGeoLocationSocialProof();
  }

  // Tabela de cidades vizinhas/regionais por Estado Brasileiro
  
  const brazilianStateNames = {
    'AC': 'no Acre', 'AL': 'em Alagoas', 'AP': 'no Amapá', 'AM': 'no Amazonas',
    'BA': 'na Bahia', 'CE': 'no Ceará', 'DF': 'no Distrito Federal', 'ES': 'no Espírito Santo',
    'GO': 'em Goiás', 'MA': 'no Maranhão', 'MT': 'no Mato Grosso', 'MS': 'no Mato Grosso do Sul',
    'MG': 'em Minas Gerais', 'PA': 'no Pará', 'PB': 'na Paraíba', 'PR': 'no Paraná',
    'PE': 'em Pernambuco', 'PI': 'no Piauí', 'RJ': 'no Rio de Janeiro', 'RN': 'no Rio Grande do Norte',
    'RS': 'no Rio Grande do Sul', 'RO': 'em Rondônia', 'RR': 'em Roraima', 'SC': 'em Santa Catarina',
    'SP': 'em São Paulo', 'SE': 'em Sergipe', 'TO': 'no Tocantins'
  };

  const brazilianRegionClusters = {
    'SP': ['São Paulo/SP', 'Campinas/SP', 'Ribeirão Preto/SP', 'São José dos Campos/SP', 'Araraquara/SP', 'São Carlos/SP', 'Santos/SP', 'Sorocaba/SP', 'Bauru/SP', 'Presidente Prudente/SP'],
    'MG': ['Belo Horizonte/MG', 'Uberlândia/MG', 'Juiz de Fora/MG', 'Betim/MG', 'Montes Claros/MG', 'Contagem/MG', 'Divinópolis/MG', 'Poços de Caldas/MG'],
    'RJ': ['Rio de Janeiro/RJ', 'Niterói/RJ', 'Duque de Caxias/RJ', 'Nova Iguaçu/RJ', 'Petrópolis/RJ', 'Campos dos Goytacazes/RJ', 'Volta Redonda/RJ'],
    'PR': ['Curitiba/PR', 'Londrina/PR', 'Maringá/PR', 'Ponta Grossa/PR', 'Cascavel/PR', 'Foz do Iguaçu/PR'],
    'RS': ['Porto Alegre/RS', 'Caxias do Sul/RS', 'Canoas/RS', 'Pelotas/RS', 'Santa Maria/RS', 'Passo Fundo/RS'],
    'SC': ['Florianópolis/SC', 'Joinville/SC', 'Blumenau/SC', 'Chapecó/SC', 'Itajaí/SC', 'Criciúma/SC'],
    'BA': ['Salvador/BA', 'Feira de Santana/BA', 'Vitória da Conquista/BA', 'Camaçari/BA', 'Itabuna/BA', 'Juazeiro/BA'],
    'PE': ['Recife/PE', 'Jaboatão dos Guararapes/PE', 'Olinda/PE', 'Caruaru/PE', 'Petrolina/PE'],
    'CE': ['Fortaleza/CE', 'Caucaia/CE', 'Juazeiro do Norte/CE', 'Maracanaú/CE', 'Sobral/CE'],
    'GO': ['Goiânia/GO', 'Aparecida de Goiânia/GO', 'Anápolis/GO', 'Rio Verde/GO', 'Luziânia/GO'],
    'DF': ['Brasília/DF', 'Taguatinga/DF', 'Ceilândia/DF', 'Águas Claras/DF', 'Guará/DF'],
    'PA': ['Belém/PA', 'Ananindeua/PA', 'Santarém/PA', 'Marabá/PA', 'Castanhal/PA'],
    'ES': ['Vitória/ES', 'Vila Velha/ES', 'Serra/ES', 'Cariacica/ES', 'Cachoeiro de Itapemirim/ES'],
    'MT': ['Cuiabá/MT', 'Várzea Grande/MT', 'Rondonópolis/MT', 'Sinop/MT', 'Tangará da Serra/MT'],
    'MS': ['Campo Grande/MS', 'Dourados/MS', 'Três Lagoas/MS', 'Corumbá/MS'],
    'AM': ['Manaus/AM', 'Parintins/AM', 'Itacoatiara/AM', 'Manacapuru/AM'],
    'MA': ['São Luís/MA', 'Imperatriz/MA', 'São José de Ribamar/MA', 'Timon/MA', 'Caxias/MA'],
    'RN': ['Natal/RN', 'Mossoró/RN', 'Parnamirim/RN', 'São Gonçalo do Amarante/RN'],
    'PB': ['João Pessoa/PB', 'Campina Grande/PB', 'Santa Rita/PB', 'Patos/PB'],
    'AL': ['Maceió/AL', 'Arapiraca/AL', 'Rio Largo/AL', 'Palmeira dos Índios/AL'],
    'PI': ['Teresina/PI', 'Parnaíba/PI', 'Picos/PI', 'Floriano/PI'],
    'SE': ['Aracaju/SE', 'Nossa Senhora do Socorro/SE', 'Lagarto/SE', 'Itabaiana/SE'],
    'RO': ['Porto Velho/RO', 'Ji-Paraná/RO', 'Ariquemes/RO', 'Vilhena/RO'],
    'TO': ['Palmas/TO', 'Araguaína/TO', 'Gurupi/TO', 'Porto Nacional/TO'],
    'default': ['Belo Horizonte/MG', 'Curitiba/PR', 'Campinas/SP', 'São Paulo/SP']
  };

  function updateReviewLocations(city, state) {
    const locElements = document.querySelectorAll('.review-geo-loc');
    if (!locElements || locElements.length === 0) return;

    let cluster = brazilianRegionClusters[state] || brazilianRegionClusters['default'];
    // Filtra para não duplicar a cidade principal
    let nearby = cluster.filter(c => !c.toLowerCase().includes(city.toLowerCase()));
    if (nearby.length < 3) nearby = brazilianRegionClusters['default'];

    locElements.forEach((el, idx) => {
      if (idx === 0) {
        el.textContent = city + '/' + (state || 'SP');
      } else {
        el.textContent = nearby[(idx - 1) % nearby.length];
      }
    });
  }

  function initGeoLocationSocialProof() {
    let locationStr = 'no Brasil';
    let heroCountStr = '14.000';
    let socialCountStr = '14.200';

    // 1. Tenta detecção em tempo real via IP rápido (com timeout de 1.8s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    fetch('https://freeipapi.com/api/json', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeoutId);
        if (data && data.cityName) {
          const userCity = data.cityName;
          const userState = data.regionCode || 'SP';
          // Para o número geral de 14.200 pessoas, usa o ESTADO para credibilidade perfeita (Audio 10)
          locationStr = brazilianStateNames[userState] || 'no Brasil';
          
          const heroLoc = document.getElementById('hero-trust-location');
          const socLoc = document.getElementById('social-proof-location');
          if (heroLoc) heroLoc.textContent = locationStr;
          if (socLoc) socLoc.textContent = locationStr;

          // Atualiza as cidades das avaliações para cidades próximas
          updateReviewLocations(userCity, userState);
        }
      })
      .catch(() => {
        // Fallback por Fuso Horário local se a requisição falhar
        try {
          const tz = (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone || '' : '';
          const tzLower = tz.toLowerCase();
          if (tzLower.includes('sao_paulo')) {
            locationStr = 'em São Paulo';
            updateReviewLocations('São Paulo', 'SP');
          } else if (tzLower.includes('belem') || tzLower.includes('manaus')) {
            locationStr = 'no Norte do Brasil';
            updateReviewLocations('Belém', 'PA');
          } else if (tzLower.includes('fortaleza') || tzLower.includes('recife') || tzLower.includes('salvador')) {
            locationStr = 'no Nordeste';
            updateReviewLocations('Salvador', 'BA');
          } else if (tzLower.includes('cuiaba')) {
            locationStr = 'no Centro-Oeste';
            updateReviewLocations('Cuiabá', 'MT');
          } else {
            locationStr = 'no Brasil';
            updateReviewLocations('Belo Horizonte', 'MG');
          }
        } catch (e) {
          locationStr = 'no Brasil';
        }
        const heroLoc = document.getElementById('hero-trust-location');
        const socLoc = document.getElementById('social-proof-location');
        if (heroLoc) heroLoc.textContent = locationStr;
        if (socLoc) socLoc.textContent = locationStr;

      });

  }

  // Initialisation à l'ouverture
  updateHeaderAndProgress(screensOrder[0]);
  initGeoLocationSocialProof();

  // Expose helpers for direct screen navigation / QA
  window.navigateTo = navigateTo;
  window.screensOrder = screensOrder;
  window.goToScreen = function (id) {
    const idx = screensOrder.indexOf(id);
    if (idx !== -1) navigateTo(idx);
  };

  const initialUrlParams = new URLSearchParams(window.location.search);
  const requestedScreen = initialUrlParams.get('screen');
  const hashScreen = window.location.hash ? window.location.hash.replace('#', '') : null;
  const hashIdx = hashScreen ? screensOrder.indexOf(hashScreen) : -1;

  if (hashIdx !== -1) {
    setTimeout(() => navigateTo(hashIdx), 20);
  } else if (requestedScreen) {
    const screenIdx = isNaN(requestedScreen) ? screensOrder.indexOf(requestedScreen) : parseInt(requestedScreen, 10);
    if (screenIdx >= 0 && screenIdx < screensOrder.length) {
      setTimeout(() => navigateTo(screenIdx), 20);
    }
  }

})();
