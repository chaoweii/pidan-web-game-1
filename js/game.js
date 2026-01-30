// Main game class
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.effects = new EffectsManager();
        
        this.ball = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.mode = 'drag'; // 'drag' or 'roam'
        
        this.detectiOS();
        this.setupCanvas();
        this.setupControls();
        this.setupModes();
        this.setupInput();
        this.init();
    }

    detectiOS() {
        // Detect iOS/iPadOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        if (isIOS) {
            document.body.classList.add('ios');
            
            // Show install prompt if not in standalone mode
            const isStandalone = window.navigator.standalone || 
                                window.matchMedia('(display-mode: standalone)').matches;
            
            if (!isStandalone) {
                const prompt = document.getElementById('ios-install-prompt');
                // Show prompt after 3 seconds
                setTimeout(() => {
                    prompt.classList.add('show');
                }, 3000);
                
                // Dismiss button
                document.getElementById('dismiss-prompt').addEventListener('click', () => {
                    prompt.classList.remove('show');
                    localStorage.setItem('ios-prompt-dismissed', 'true');
                });
                
                // Don't show again if previously dismissed
                if (localStorage.getItem('ios-prompt-dismissed')) {
                    prompt.classList.remove('show');
                }
            }
        }
    }

    showToast(emoji, label) {
        const toast = document.getElementById('mode-toast');
        toast.innerHTML = `${emoji}${label ? '<span class="toast-label">' + label + '</span>' : ''}`;
        toast.classList.remove('show');
        
        // Trigger reflow to restart animation
        void toast.offsetWidth;
        
        toast.classList.add('show');
        
        // Remove class after animation
        setTimeout(() => {
            toast.classList.remove('show');
        }, 1000);
    }

    setupCanvas() {
        // Set canvas size to window size
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
    }

    setupControls() {
        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        fullscreenBtn.addEventListener('click', () => {
            const container = document.getElementById('game-container');
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => {
                    console.log('Fullscreen request failed:', err);
                });
            } else {
                document.exitFullscreen();
            }
        });

        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        soundToggle.addEventListener('click', () => {
            const enabled = this.effects.toggleSound();
            soundToggle.textContent = enabled ? '🔊 Sound ON' : '🔇 Sound OFF';
        });
    }
    
    setupModes() {
        const dragBtn = document.getElementById('mode-drag');
        const roamBtn = document.getElementById('mode-roam');
        const preyBtn = document.getElementById('mode-prey');
        
        dragBtn.addEventListener('click', () => {
            this.mode = 'drag';
            dragBtn.classList.add('active');
            roamBtn.classList.remove('active');
            preyBtn.classList.remove('active');
            if (this.ball) {
                this.ball.stopped = false;
                this.ball.preyMode = false;
                this.ball.roamMode = false;
                this.ball.changeColor();
            }
            this.showToast('✋', 'Drag Mode');
        });
        
        roamBtn.addEventListener('click', () => {
            this.mode = 'roam';
            roamBtn.classList.add('active');
            dragBtn.classList.remove('active');
            preyBtn.classList.remove('active');
            if (this.ball) {
                this.ball.enableRandomRoam();
                this.ball.changeColor();
            }
            this.showToast('🎲', 'Roam Mode');
        });
        
        preyBtn.addEventListener('click', () => {
            this.mode = 'prey';
            preyBtn.classList.add('active');
            dragBtn.classList.remove('active');
            roamBtn.classList.remove('active');
            if (this.ball) {
                this.ball.enablePreyMode();
                this.ball.changeColor();
            }
            this.showToast('🐁', 'Prey Mode');
        });
        
        // Sprite selection
        const ballBtn = document.getElementById('sprite-ball');
        const spiderBtn = document.getElementById('sprite-spider');
        const mouseBtn = document.getElementById('sprite-mouse');
        
        ballBtn.addEventListener('click', () => {
            ballBtn.classList.add('active');
            spiderBtn.classList.remove('active');
            mouseBtn.classList.remove('active');
            if (this.ball) {
                this.ball.changeSprite('ball');
            }
            this.showToast('🔴', 'Ball');
        });
        
        spiderBtn.addEventListener('click', () => {
            spiderBtn.classList.add('active');
            ballBtn.classList.remove('active');
            mouseBtn.classList.remove('active');
            if (this.ball) {
                this.ball.changeSprite('spider');
            }
            this.showToast('🕷️', 'Spider');
        });
        
        mouseBtn.addEventListener('click', () => {
            mouseBtn.classList.add('active');
            ballBtn.classList.remove('active');
            spiderBtn.classList.remove('active');
            if (this.ball) {
                this.ball.changeSprite('mouse');
            }
            this.showToast('🐭', 'Mouse');
        });
    }

    setupInput() {
        let lastX = 0, lastY = 0;
        let lastTime = 0;
        
        // Mouse input
        this.canvas.addEventListener('mousedown', (e) => {
            if (!this.ball) return;
            
            if (this.mode === 'drag' && this.ball.containsPoint(e.clientX, e.clientY)) {
                this.ball.startDrag(e.clientX, e.clientY);
                this.effects.playPickupSound(); // Pickup sound
                lastX = e.clientX;
                lastY = e.clientY;
                lastTime = Date.now();
            } else if (this.mode === 'roam' && this.ball.containsPoint(e.clientX, e.clientY)) {
                this.ball.stopRoam();
                this.effects.playKillSqueak(); // Reward: caught!
            } else if (this.mode === 'prey') {
                // In prey mode, ball flees from any touch
                this.ball.fleeFrom(e.clientX, e.clientY);
                // Rotate reward sounds for variety
                const soundType = Math.random();
                if (soundType < 0.4) {
                    this.effects.playKillSqueak();
                } else if (soundType < 0.7) {
                    this.effects.playCrunchSound();
                } else {
                    this.effects.playFlutterSound();
                }
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.ball && this.ball.isDragging) {
                this.ball.drag(e.clientX, e.clientY);
                lastX = e.clientX;
                lastY = e.clientY;
                lastTime = Date.now();
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (this.mode === 'drag' && this.ball && this.ball.isDragging) {
                const now = Date.now();
                const dt = Math.max(1, now - lastTime);
                const deltaX = (e.clientX - lastX) / dt * 16;
                const deltaY = (e.clientY - lastY) / dt * 16;
                this.ball.endDrag(e.clientX, e.clientY, deltaX, deltaY);
                this.effects.playReleaseSound(); // Release sound
            } else if (this.mode === 'roam' && this.ball && this.ball.roamStopped) {
                this.ball.resumeRoam();
            }
        });

        // Touch input
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (!this.ball) return;
            
            if (this.mode === 'drag' && this.ball.containsPoint(touch.clientX, touch.clientY)) {
                this.ball.startDrag(touch.clientX, touch.clientY);
                this.effects.playPickupSound(); // Pickup sound
                lastX = touch.clientX;
                lastY = touch.clientY;
                lastTime = Date.now();
            } else if (this.mode === 'roam' && this.ball.containsPoint(touch.clientX, touch.clientY)) {
                this.ball.stopRoam();
                this.effects.playKillSqueak(); // Reward: caught!
            } else if (this.mode === 'prey') {
                // In prey mode, ball flees from any touch
                this.ball.fleeFrom(touch.clientX, touch.clientY);
                // Rotate reward sounds for variety
                const soundType = Math.random();
                if (soundType < 0.4) {
                    this.effects.playKillSqueak();
                } else if (soundType < 0.7) {
                    this.effects.playCrunchSound();
                } else {
                    this.effects.playFlutterSound();
                }
            }
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (this.ball && this.ball.isDragging) {
                this.ball.drag(touch.clientX, touch.clientY);
                lastX = touch.clientX;
                lastY = touch.clientY;
                lastTime = Date.now();
            }
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.mode === 'drag' && this.ball && this.ball.isDragging) {
                const now = Date.now();
                const dt = Math.max(1, now - lastTime);
                const deltaX = (this.ball.x - lastX) / dt * 16;
                const deltaY = (this.ball.y - lastY) / dt * 16;
                this.ball.endDrag(this.ball.x, this.ball.y, deltaX, deltaY);
                this.effects.playReleaseSound(); // Release sound
            } else if (this.mode === 'roam' && this.ball && this.ball.roamStopped) {
                this.ball.resumeRoam();
            }
        }, { passive: false });

        // Prevent context menu on long press
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }


    getSidebarWidth() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isLandscape = width > height;
        
        // Match CSS media query breakpoints
        if (width <= 480) {
            return 60; // Phone portrait
        } else if (width <= 834 && isLandscape) {
            return 60; // Phone landscape
        } else if (width >= 481 && width <= 1024 && !isLandscape) {
            return 80; // iPad portrait
        } else if (width >= 835 && width <= 1366 && isLandscape) {
            return 100; // iPad landscape
        } else if (width >= 1367) {
            return 120; // Desktop
        }
        return 60; // Default fallback
    }

    init() {
        // Create initial ball
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.05;
        
        this.ball = new Ball(centerX, centerY, radius, Ball.getRandomColor());
        
        // Start in prey mode (cat-optimized by default)
        this.ball.enablePreyMode();
        
        // Start game loop
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop(currentTime) {
        if (!this.isRunning) return;

        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 16.67; // Normalize to 60fps
        this.lastTime = currentTime;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate sidebar width based on screen size
        const sidebarWidth = this.getSidebarWidth();

        // Update ball
        const collision = this.ball.update(this.canvas, sidebarWidth);
        
        // Handle collision effects
        if (collision) {
            this.effects.createRipple(collision.x, collision.y, this.ball.color);
            
            // Different frequencies for different walls
            let frequency = 440;
            switch (collision.side) {
                case 'left': frequency = 300; break;
                case 'right': frequency = 400; break;
                case 'top': frequency = 500; break;
                case 'bottom': frequency = 350; break;
            }
            this.effects.playCollisionSound(frequency, 0.15);
        }

        // Draw ball
        this.ball.draw(this.ctx);
        
        // Play whoosh sound if ball is moving fast
        const speed = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
        if (speed > 5) {
            this.effects.playWhooshSound(speed);
        }

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    stop() {
        this.isRunning = false;
    }
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
