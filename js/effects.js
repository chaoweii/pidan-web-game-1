// Visual and audio effects manager
class EffectsManager {
    constructor() {
        this.effectsLayer = document.getElementById('effects-layer');
        this.soundEnabled = true;
        this.audioContext = null;
        this.sounds = {};
        this.lastSoundTime = 0;
        this.soundCooldown = 100; // milliseconds between sounds
        this.ambientInterval = null;
        this.initAudio();
        this.startAmbientSounds();
    }

    initAudio() {
        // Initialize Web Audio API for generating sounds
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // Generate collision sound using Web Audio API with cooldown
    playCollisionSound(frequency = 440, duration = 0.1) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        // Check cooldown to prevent sound flickering
        const now = Date.now();
        if (now - this.lastSoundTime < this.soundCooldown) return;
        this.lastSoundTime = now;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Random frequency for variety (higher = more interesting)
        const randomFreq = frequency + (Math.random() * 200 - 100);
        oscillator.frequency.setValueAtTime(randomFreq, this.audioContext.currentTime);
        oscillator.type = 'sine';

        // Quick fade out
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Play a "pop" sound when ball is touched
    playPopSound() {
        if (!this.soundEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Create ripple effect at position
    createRipple(x, y, color = 'rgba(255, 255, 255, 0.8)') {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = (x - 10) + 'px';
        ripple.style.top = (y - 10) + 'px';
        ripple.style.borderColor = color;
        
        this.effectsLayer.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Removed - flash effect was too intense

    // Create particle burst
    createParticleBurst(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.backgroundColor = color;
            
            const angle = (Math.PI * 2 * i) / count;
            const distance = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            this.effectsLayer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            this.startAmbientSounds();
        } else {
            this.stopAmbientSounds();
        }
        return this.soundEnabled;
    }
    
    // Movement sound - whoosh when ball moves fast
    playWhooshSound(speed) {
        if (!this.soundEnabled || !this.audioContext || speed < 3) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Low frequency whoosh, volume based on speed
        const freq = 100 + speed * 10;
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.2);
        oscillator.type = 'sawtooth';
        
        const volume = Math.min(0.15, speed * 0.02);
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    // Interaction sound - pickup when dragging starts
    playPickupSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Rising pitch
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    // Interaction sound - release when drag ends
    playReleaseSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Falling pitch
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }
    
    // LAYER 1: THE LURE - Background Ambience
    
    // Rustle sound - mimics dry leaves/paper crinkling (STEALTH MIX: 40%)
    playRustleSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        // Create noise buffer for rustle effect
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // Fading noise
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000 + Math.random() * 2000; // 3-5kHz
        filter.Q.value = 5;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.03, this.audioContext.currentTime); // Reduced: 40% vol
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        noise.start(this.audioContext.currentTime);
        noise.stop(this.audioContext.currentTime + 0.3);
    }
    
    // Skitter sound - rapid scratching like claws on cardboard (STEALTH MIX: 40%)
    playSkitterSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const clicks = 8;
        const interval = 0.02;
        
        for (let i = 0; i < clicks; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            const freq = 4000 + Math.random() * 4000; // 4-8kHz
            osc.frequency.value = freq;
            osc.type = 'square';
            
            const startTime = this.audioContext.currentTime + i * interval;
            gain.gain.setValueAtTime(0.03, startTime); // Reduced: 40% vol
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.015);
            
            osc.start(startTime);
            osc.stop(startTime + 0.015);
        }
        
        // Add ultrasonic layer (15-17kHz)
        this.addUltrasonicLayer(0.16);
    }
    
    // Enhanced chirp with ultrasonic (STEALTH MIX: 50%)
    playChirpSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // High-pitched bird chirp (cat hearing optimized)
        const baseFreq = 3000 + Math.random() * 3000; // 3-6kHz (higher than before)
        oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(baseFreq * 1.3, this.audioContext.currentTime + 0.05);
        oscillator.frequency.setValueAtTime(baseFreq * 0.8, this.audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.04, this.audioContext.currentTime); // Reduced: 50% vol
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
        
        // Add ultrasonic layer
        this.addUltrasonicLayer(0.15);
    }
    
    // LAYER 2: THE REWARD - Hit Feedback
    
    // Kill squeak - sharp downward pitch (REWARD: 75% vol, capped)
    playKillSqueak() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Sharp downward sweep 8kHz → 3kHz
        oscillator.frequency.setValueAtTime(8000, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(3000, this.audioContext.currentTime + 0.08);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime); // Increased: 75% vol, capped
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.08);
        
        // Add ultrasonic layer
        this.addUltrasonicLayer(0.08);
    }
    
    // Crunch sound - mimics breaking exoskeleton (REWARD: 75% vol, capped)
    playCrunchSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        // Sharp noise burst
        const bufferSize = this.audioContext.sampleRate * 0.05;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000; // High frequency crunch
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime); // Increased: 75% vol, capped
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        noise.start(this.audioContext.currentTime);
        noise.stop(this.audioContext.currentTime + 0.05);
    }
    
    // Flutter sound - rapid wing flaps (REWARD: 75% vol, capped)
    playFlutterSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const flaps = 6;
        const interval = 0.03;
        
        for (let i = 0; i < flaps; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            const freq = 2500 + Math.sin(i) * 800; // Oscillating frequency
            osc.frequency.value = freq;
            osc.type = 'triangle';
            
            const startTime = this.audioContext.currentTime + i * interval;
            gain.gain.setValueAtTime(0.25, startTime); // Increased: 75% vol, capped
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.025);
            
            osc.start(startTime);
            osc.stop(startTime + 0.025);
        }
        
        // Add ultrasonic layer
        this.addUltrasonicLayer(0.18);
    }
    
    // Ultrasonic layer (15-18kHz) - cats hear clearly (STEALTH: quiet)
    addUltrasonicLayer(duration) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // High frequency near human hearing limit (cats hear clearly)
        const ultraFreq = 15000 + Math.random() * 3000; // 15-18kHz
        oscillator.frequency.value = ultraFreq;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime); // Reduced for stealth
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // Start ambient background sounds (THE LURE with TENSE SILENCE)
    startAmbientSounds() {
        if (!this.soundEnabled) return;
        
        // Rotate through different lure sounds with longer gaps
        const playRandomLure = () => {
            if (this.soundEnabled) {
                const soundType = Math.random();
                if (soundType < 0.4) {
                    this.playRustleSound();
                } else if (soundType < 0.7) {
                    this.playSkitterSound();
                } else {
                    this.playChirpSound();
                }
                
                // TENSE SILENCE: Random interval 4-12 seconds (Gap-Induced Prepulse Inhibition)
                const nextDelay = 4000 + Math.random() * 8000;
                this.ambientInterval = setTimeout(playRandomLure, nextDelay);
            }
        };
        
        // Start first lure after 2 seconds
        this.ambientInterval = setTimeout(playRandomLure, 2000);
    }
    
    // Stop ambient sounds
    stopAmbientSounds() {
        if (this.ambientInterval) {
            clearTimeout(this.ambientInterval);
            this.ambientInterval = null;
        }
    }
}
