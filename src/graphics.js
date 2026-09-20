/**
 * CanvasEngine handles the fullscreen canvas rendering, theme-specific visual effects,
 * resize events, and interactive animation loops.
 */
export class CanvasEngine {
  /**
   * @param {HTMLCanvasElement} canvasElement
   */
  constructor(canvasElement) {
    if (!canvasElement) {
      throw new Error('Canvas element is required for CanvasEngine');
    }
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.theme = 'nature';
    this.isPaused = true;
    this.animationFrameId = null;
    this.interactions = [];

    // Background and effect particle lists for clean, modular rendering
    this.naturePollen = [];
    this.natureTrail = [];

    this.abstractNodes = [];
    this.abstractExplosions = [];
    this.abstractTrail = [];

    this.cosmicStars = [];
    this.cosmicStarbursts = [];
    this.cosmicWarps = [];
    this.cosmicTrail = [];

    this.analyser = null;
    this.mouse = { x: 0.5, y: 0.5, active: false };

    // Bind event handlers
    this.resize = this.resize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    // Initialize background particles and setup listeners
    this.initThemeAssets();

    window.addEventListener('resize', this.resize);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);

    this.resize();
  }

  /**
   * Adjusts canvas resolution to match fullscreen viewport.
   * Scales existing particle coordinates proportionally to avoid distortion or scale shifts.
   */
  resize() {
    const prevW = this.canvas.width || 1;
    const prevH = this.canvas.height || 1;
    const newW = window.innerWidth || 1;
    const newH = window.innerHeight || 1;

    this.canvas.width = newW;
    this.canvas.height = newH;

    const scaleX = newW / prevW;
    const scaleY = newH / prevH;

    // Proportionally scale positions of particles
    if (this.naturePollen) {
      this.naturePollen.forEach(p => {
        p.x *= scaleX;
        p.y *= scaleY;
      });
    }
    if (this.abstractNodes) {
      this.abstractNodes.forEach(p => {
        p.x *= scaleX;
        p.y *= scaleY;
      });
    }
    if (this.cosmicStars) {
      this.cosmicStars.forEach(p => {
        p.x *= scaleX;
        p.y *= scaleY;
      });
    }

    // Scale trail and interactive particles as well
    if (this.natureTrail) {
      this.natureTrail.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
    }
    if (this.abstractExplosions) {
      this.abstractExplosions.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
    }
    if (this.abstractTrail) {
      this.abstractTrail.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
    }
    if (this.cosmicStarbursts) {
      this.cosmicStarbursts.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
    }
    if (this.cosmicWarps) {
      this.cosmicWarps.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
    }
    if (this.cosmicTrail) {
      this.cosmicTrail.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
    }

    this.render();
  }

  /**
   * Initializes theme background assets.
   */
  initThemeAssets() {
    const w = this.canvas.width || window.innerWidth || 800;
    const h = this.canvas.height || window.innerHeight || 600;

    // Nature background particles (drift upward and sway gently)
    this.naturePollen = [];
    for (let i = 0; i < 70; i++) {
      this.naturePollen.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 3 + 1.5,
        speedY: Math.random() * 0.6 + 0.3,
        swaySpeed: Math.random() * 0.002 + 0.001,
        swayAmplitude: Math.random() * 25 + 10,
        swayOffset: Math.random() * Math.PI * 2,
        color: this.getRandomNatureColor(),
        type: Math.random() > 0.4 ? 'pollen' : 'leaf',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.03 - 0.015
      });
    }

    // Abstract background nodes (slow drifting nodes)
    this.abstractNodes = [];
    for (let i = 0; i < 35; i++) {
      this.abstractNodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        size: Math.random() * 2 + 2
      });
    }

    // Cosmic background stars (multi-layered starfield)
    this.cosmicStars = [];
    for (let i = 0; i < 130; i++) {
      const depth = Math.floor(Math.random() * 3); // 0 = far, 1 = mid, 2 = near
      let size, speedX;
      if (depth === 0) {
        size = Math.random() * 0.8 + 0.4;
        speedX = -(Math.random() * 0.12 + 0.04);
      } else if (depth === 1) {
        size = Math.random() * 0.9 + 0.8;
        speedX = -(Math.random() * 0.25 + 0.15);
      } else {
        size = Math.random() * 1.4 + 1.4;
        speedX = -(Math.random() * 0.5 + 0.4);
      }

      this.cosmicStars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        depth: depth,
        size: size,
        speedX: speedX,
        speedY: Math.random() * 0.08 - 0.04,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        color: this.getRandomCosmicStarColor()
      });
    }
  }

  /**
   * Sets the audio analyser node to allow visual synchronization.
   * @param {AnalyserNode} analyser
   */
  setAnalyser(analyser) {
    this.analyser = analyser;
  }

  /**
   * Mouse and touch event handlers to feed interaction trails
   */
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    this.mouse.x = nx;
    this.mouse.y = ny;
    this.mouse.active = true;
    this.addTrailParticle(nx, ny);
  }

  handleTouchMove(e) {
    if (e.touches && e.touches[0]) {
      const rect = this.canvas.getBoundingClientRect();
      const nx = (e.touches[0].clientX - rect.left) / rect.width;
      const ny = (e.touches[0].clientY - rect.top) / rect.height;
      this.mouse.x = nx;
      this.mouse.y = ny;
      this.mouse.active = true;
      this.addTrailParticle(nx, ny);
    }
  }

  handleMouseLeave() {
    this.mouse.active = false;
  }

  /**
   * Adds mouse movement trail particles based on active theme
   */
  addTrailParticle(nx, ny) {
    if (this.isPaused) return;
    const px = nx * this.canvas.width;
    const py = ny * this.canvas.height;

    if (this.theme === 'nature') {
      this.natureTrail.push({
        x: px,
        y: py,
        vx: Math.random() * 1.2 - 0.6,
        vy: -(Math.random() * 1.2 + 0.4),
        size: Math.random() * 3.5 + 2.5,
        color: this.getRandomNaturePetalColor(),
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.06 - 0.03
      });
    } else if (this.theme === 'abstract') {
      this.abstractTrail.push({
        x: px,
        y: py,
        vx: Math.random() * 0.3 - 0.15,
        vy: Math.random() * 0.3 - 0.15,
        life: 1.0,
        decay: 0.022
      });
    } else if (this.theme === 'cosmic') {
      this.cosmicTrail.push({
        x: px,
        y: py,
        vx: Math.random() * 0.8 - 0.4,
        vy: Math.random() * 0.8 - 0.4,
        size: Math.random() * 2.5 + 1.5,
        color: this.getRandomCosmicDustColor(),
        life: 1.0,
        decay: Math.random() * 0.035 + 0.018
      });
    }
  }

  /**
   * Updates visual parameters according to the active theme.
   * @param {string} themeName - 'nature' | 'abstract' | 'cosmic'
   */
  setTheme(themeName) {
    this.theme = themeName;
    // Clear old active animations and trails for clean theme swaps
    this.natureTrail = [];
    this.abstractExplosions = [];
    this.abstractTrail = [];
    this.cosmicStarbursts = [];
    this.cosmicWarps = [];
    this.cosmicTrail = [];
    this.render();
  }

  /**
   * Registers an interactive visual effect at normalized coordinates.
   * @param {number} x - Normalized x-coordinate (0 to 1)
   * @param {number} y - Normalized y-coordinate (0 to 1)
   */
  triggerInteraction(x, y) {
    // Clamp to boundary [0, 1]
    const cx = Math.max(0, Math.min(1, x));
    const cy = Math.max(0, Math.min(1, y));
    
    // Maintain standard interactions array for compatibility & tests
    this.interactions.push({ x: cx, y: cy, timestamp: Date.now(), radius: 30 });

    const px = cx * this.canvas.width;
    const py = cy * this.canvas.height;

    // Spawn theme-specific click particles & visual modifiers
    if (this.theme === 'nature') {
      // Custom nature click effects are rendered dynamically in the render loop using interactions
    } else if (this.theme === 'abstract') {
      // Spinning squares, triangles, polygons scaling down and exploding outward
      const count = 14 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 2.0;
        this.abstractExplosions.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 7 + 7,
          sides: Math.random() > 0.6 ? 3 : (Math.random() > 0.5 ? 4 : 5),
          angle: Math.random() * Math.PI * 2,
          spinSpeed: Math.random() * 0.12 - 0.06,
          color: this.getRandomAbstractColor(),
          life: 1.0,
          decay: Math.random() * 0.02 + 0.018
        });
      }
    } else if (this.theme === 'cosmic') {
      // Starburst explosions (tiny glowing neon particle sprays)
      const count = 28 + Math.floor(Math.random() * 10);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.5;
        this.cosmicStarbursts.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 1.8 + 1.2,
          color: this.getRandomCosmicDustColor() + '1.0)',
          life: 1.0,
          decay: Math.random() * 0.025 + 0.015
        });
      }

      // Gravitational warp lens effect
      this.cosmicWarps.push({
        x: px,
        y: py,
        radius: 0,
        strength: 1.6,
        life: 1.0,
        decay: 0.022
      });
    }

    this.renderInteraction(cx, cy);
  }

  /**
   * Alternate interaction entry point matching the PROJECT.md specs.
   * @param {number} x
   * @param {number} y
   */
  interact(x, y) {
    this.triggerInteraction(x, y);
  }

  /**
   * Triggers visual representation of interaction at normalized coordinates.
   * @param {number} x
   * @param {number} y
   */
  renderInteraction(x, y) {
    if (!this.ctx) return;
    const px = x * this.canvas.width;
    const py = y * this.canvas.height;

    // Draw temporary interaction ring/pulse
    this.ctx.beginPath();
    this.ctx.arc(px, py, 30, 0, Math.PI * 2);
    this.ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#4caf50';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }

  /**
   * Starts the animation loop.
   */
  start() {
    this.isPaused = false;
    this.loop();
  }

  /**
   * Stops the animation loop.
   */
  stop() {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Animation frame loop.
   */
  loop() {
    if (this.isPaused) return;
    this.render();
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  /**
   * Renders the current frame.
   */
  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const now = Date.now();
    // Filter out old interactions (older than 1s) to prevent memory accumulation (and pass memory tests)
    this.interactions = this.interactions.filter(i => now - i.timestamp < 1000);

    // Render theme-based background color
    const canvasBg = getComputedStyle(document.documentElement).getPropertyValue('--canvas-bg').trim() || '#dcedc8';
    this.ctx.fillStyle = canvasBg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Visual placeholder based on theme
    this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#2c3e29';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Theme: ${this.theme.toUpperCase()} (Visuals Active)`, this.canvas.width / 2, this.canvas.height / 2);

    // Render themed visual effects
    if (this.theme === 'nature') {
      this.renderNature(now);
    } else if (this.theme === 'abstract') {
      this.renderAbstract(now);
    } else if (this.theme === 'cosmic') {
      this.renderCosmic(now);
    }
  }

  /**
   * Rendering logic for the Nature Theme.
   */
  renderNature(now) {
    // 1. Draw background pollen and leaf particles
    this.naturePollen.forEach(p => {
      p.y -= p.speedY;
      if (p.y < -20) {
        p.y = this.canvas.height + 20;
        p.x = Math.random() * this.canvas.width;
      }
      p.rotation += p.rotationSpeed;
      const swayX = p.x + Math.sin(now * p.swaySpeed + p.swayOffset) * p.swayAmplitude;

      if (p.type === 'leaf') {
        this.drawLeaf(this.ctx, swayX, p.y, p.size * 1.8, p.rotation, p.color);
      } else {
        this.drawPollen(this.ctx, swayX, p.y, p.size * 1.2, p.color);
      }
    });

    // 2. Draw click expanding ripple rings (fading in opacity)
    this.interactions.forEach(i => {
      const elapsed = now - i.timestamp;
      const pct = Math.min(1, elapsed / 1000);
      const opacity = 1 - pct;
      const radius = i.radius + pct * 140;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(i.x * this.canvas.width, i.y * this.canvas.height, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(139, 195, 74, ${opacity})`;
      this.ctx.lineWidth = Math.max(0.5, 3.5 * opacity);
      this.ctx.stroke();

      // Draw secondary inner ripple ring
      if (pct > 0.15) {
        this.ctx.beginPath();
        this.ctx.arc(i.x * this.canvas.width, i.y * this.canvas.height, radius * 0.72, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(205, 220, 57, ${opacity * 0.6})`;
        this.ctx.lineWidth = Math.max(0.5, 2 * opacity);
        this.ctx.stroke();
      }
      this.ctx.restore();
    });

    // 3. Draw mouse movement leaf/petal trail
    this.natureTrail = this.natureTrail.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;
      if (p.life <= 0) return false;

      const alphaStr = p.life.toFixed(2) + ')';
      this.drawLeaf(this.ctx, p.x, p.y, p.size * p.life, p.rotation, p.color + alphaStr);
      return true;
    });
  }

  /**
   * Rendering logic for the Abstract Theme.
   */
  renderAbstract(now) {
    // 1. Draw slow-moving nodes and wireframe links
    this.abstractNodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

      node.x = Math.max(0, Math.min(this.canvas.width, node.x));
      node.y = Math.max(0, Math.min(this.canvas.height, node.y));

      this.ctx.fillStyle = 'rgba(90, 100, 110, 0.35)';
      this.ctx.fillRect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size);
    });

    // Connect close background nodes
    for (let i = 0; i < this.abstractNodes.length; i++) {
      for (let j = i + 1; j < this.abstractNodes.length; j++) {
        const n1 = this.abstractNodes[i];
        const n2 = this.abstractNodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.15;
          this.ctx.strokeStyle = `rgba(120, 130, 140, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);
          this.ctx.stroke();
        }
      }
    }

    // Draw center rotating wireframe shape (cube)
    this.drawRotatingCube(this.ctx, now);

    // 2. Draw click explosions (squares, triangles, polygons scaling down/spinning)
    this.abstractExplosions = this.abstractExplosions.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spinSpeed;
      p.life -= p.decay;
      if (p.life <= 0) return false;

      const alphaStr = p.life.toFixed(2) + ')';
      this.drawPolygon(this.ctx, p.x, p.y, p.size * p.life, p.sides, p.angle, p.color + alphaStr);
      return true;
    });

    // 3. Draw mouse movement nodes web
    this.abstractTrail = this.abstractTrail.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) return false;

      this.ctx.fillStyle = `rgba(0, 188, 212, ${p.life * 0.4})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
      this.ctx.fill();
      return true;
    });

    // Draw connecting lines between trail nodes
    for (let i = 0; i < this.abstractTrail.length; i++) {
      for (let j = i + 1; j < this.abstractTrail.length; j++) {
        const p1 = this.abstractTrail[i];
        const p2 = this.abstractTrail[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const avgLife = (p1.life + p2.life) / 2;
          const alpha = (1 - dist / 90) * avgLife * 0.35;
          this.ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          this.ctx.lineWidth = 0.9;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }

  /**
   * Rendering logic for the Cosmic Theme.
   */
  renderCosmic(now) {
    // 1. Update warp gravitational lensing shockwaves
    this.cosmicWarps = this.cosmicWarps.filter(w => {
      w.radius += 4.5;
      w.life -= w.decay;
      w.strength = 1.6 * w.life;

      // Draw faint expanding lens bubble ring
      this.ctx.beginPath();
      this.ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(186, 104, 200, ${w.life * 0.12})`;
      this.ctx.lineWidth = 2.5 * w.life;
      this.ctx.stroke();

      return w.life > 0;
    });

    // 2. Draw starfield with depth and warping
    this.cosmicStars.forEach(star => {
      star.x += star.speedX;
      star.y += star.speedY;

      if (star.x < -10) star.x = this.canvas.width + 10;
      if (star.x > this.canvas.width + 10) star.x = -10;
      if (star.y < -10) star.y = this.canvas.height + 10;
      if (star.y > this.canvas.height + 10) star.y = -10;

      // Twinkle twinkle little star
      const twinkle = Math.sin(now * star.twinkleSpeed + star.twinkleOffset) * 0.35 + 0.65;

      // Apply warps dynamically
      let drawX = star.x;
      let drawY = star.y;
      for (const w of this.cosmicWarps) {
        const dx = drawX - w.x;
        const dy = drawY - w.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < w.radius && dist > 0) {
          const factor = Math.sin((dist / w.radius) * Math.PI) * w.strength * 45;
          drawX += (dx / dist) * factor;
          drawY += (dy / dist) * factor;
        }
      }

      this.ctx.save();
      this.ctx.fillStyle = star.color;
      this.ctx.globalAlpha = twinkle;
      this.ctx.beginPath();
      this.ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw faint cross-flares for close glowing stars
      if (star.depth === 2 && star.size > 2.0) {
        this.ctx.strokeStyle = star.color;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(drawX - 4, drawY);
        this.ctx.lineTo(drawX + 4, drawY);
        this.ctx.moveTo(drawX, drawY - 4);
        this.ctx.lineTo(drawX, drawY + 4);
        this.ctx.stroke();
      }
      this.ctx.restore();
    });

    // 3. Draw click starburst explosions
    this.cosmicStarbursts = this.cosmicStarbursts.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) return false;

      this.ctx.save();
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      return true;
    });

    // 4. Draw mouse movement glowing dust trail
    this.cosmicTrail = this.cosmicTrail.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) return false;

      const alphaStr = p.life.toFixed(2) + ')';
      this.ctx.save();
      this.ctx.fillStyle = p.color + alphaStr;
      this.ctx.shadowBlur = 7;
      this.ctx.shadowColor = p.color + '1.0)';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      return true;
    });
  }

  /**
   * Helper: Leaf drawing path.
   */
  drawLeaf(ctx, x, y, size, rotation, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.5);
    ctx.quadraticCurveTo(size * 0.7, -size * 0.5, 0, size * 1.5);
    ctx.quadraticCurveTo(-size * 0.7, -size * 0.5, 0, -size * 1.5);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Helper: Pollen drawing path.
   */
  drawPollen(ctx, x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Helper: General polygon drawing path.
   */
  drawPolygon(ctx, x, y, size, sides, rotation, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i * Math.PI * 2) / sides;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Helper: Draw rotating 3D cube matching Abstract Theme.
   */
  drawRotatingCube(ctx, time) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    // React to Audio Analyser if available
    let audioFactor = 1;
    if (this.analyser && typeof this.analyser.getByteFrequencyData === 'function') {
      const data = new Uint8Array(this.analyser.frequencyBinCount || 128);
      this.analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      const avg = sum / (data.length || 1);
      audioFactor = 1.0 + (avg / 255.0) * 0.45; // Grow up to 45% larger
    }

    const cubeSize = Math.min(this.canvas.width, this.canvas.height) * 0.14 * audioFactor;

    const vertices = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 }
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back Face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front Face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
    ];

    const angleX = time * 0.00035;
    const angleY = time * 0.00045;
    const angleZ = time * 0.0002;

    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const cosZ = Math.cos(angleZ), sinZ = Math.sin(angleZ);

    const projected = vertices.map(v => {
      // Rotation X
      let y1 = v.y * cosX - v.z * sinX;
      let z1 = v.y * sinX + v.z * cosX;
      // Rotation Y
      let x2 = v.x * cosY + z1 * sinY;
      let z2 = -v.x * sinY + z1 * cosY;
      // Rotation Z
      let x3 = x2 * cosZ - y1 * sinZ;
      let y3 = x2 * sinZ + y1 * cosZ;

      // Perspective Projection
      const zoom = cubeSize;
      const fov = 350;
      const scale = fov / (fov + z2 * zoom);

      return {
        x: cx + x3 * zoom * scale,
        y: cy + y3 * zoom * scale
      };
    });

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || 'rgba(100, 100, 100, 0.45)';
    ctx.lineWidth = 1.6;
    for (const edge of edges) {
      const p1 = projected[edge[0]];
      const p2 = projected[edge[1]];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  /**
   * Color helpers
   */
  getRandomNatureColor() {
    const colors = [
      'rgba(139, 195, 74, ', // green
      'rgba(205, 220, 57, ', // light lime green
      'rgba(76, 175, 80, ',  // classic green
      'rgba(174, 213, 129, ', // soft green
      'rgba(230, 238, 156, '  // soft lime
    ];
    return colors[Math.floor(Math.random() * colors.length)] + (Math.random() * 0.4 + 0.35).toFixed(2) + ')';
  }

  getRandomNaturePetalColor() {
    const colors = [
      'rgba(244, 143, 177, ', // cherry blossom pink
      'rgba(255, 235, 59, ',  // sunny yellow
      'rgba(255, 167, 38, ',  // orange
      'rgba(240, 98, 146, '   // rose pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomAbstractColor() {
    const colors = [
      'rgba(0, 188, 212, ',   // cyan
      'rgba(233, 30, 99, ',   // pink/magenta
      'rgba(255, 235, 59, ',  // yellow
      'rgba(156, 39, 176, ',  // purple
      'rgba(255, 87, 34, '    // red/orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomCosmicStarColor() {
    const colors = [
      'rgba(255, 255, 255, ', // pure white
      'rgba(224, 247, 250, ', // neon ice blue
      'rgba(243, 229, 245, ', // faint purple glow
      'rgba(232, 234, 246, '  // deep space blue-white
    ];
    return colors[Math.floor(Math.random() * colors.length)] + (Math.random() * 0.6 + 0.4).toFixed(2) + ')';
  }

  getRandomCosmicDustColor() {
    const colors = [
      'rgba(224, 64, 251, ',  // bright magenta/purple
      'rgba(0, 229, 255, ',   // bright cyan
      'rgba(124, 77, 255, ',  // neon violet
      'rgba(0, 184, 212, '    // ocean cyan
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Cleans up the canvas engine, cancelling frames and removing window and canvas event listeners.
   */
  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resize);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}
