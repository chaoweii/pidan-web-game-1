# Pidan's Playground 🐱

An interactive HTML5 game scientifically designed for cats, based on research into feline vision, hearing, and hunting behavior. Built with pure JavaScript, no dependencies required.

## 🎯 Overview

Pidan's Playground is a cat engagement app that uses biological AI instead of traditional physics. The game implements **saccadic movement** (dash-freeze-twitch-explode pattern) to mimic real prey behavior, triggering cats' natural hunting instincts more effectively than smooth, predictable animations.

## 🧬 Scientific Design

### Visual Optimization
- **Cat-Optimized Colors**: Blue and yellow spectrum only (colors cats see best)
- **High Contrast**: Black silhouettes on white/cream background
- **Saccadic Movement**: Erratic dash-freeze-twitch patterns (not smooth physics)
- **Internal Motion**: Animated spider legs create movement even when stationary

### Audio Engineering ("The Stealth Mix")
Designed for cats' 4x more sensitive hearing (up to 85kHz detection):

**Layer 1: The Lure (40-50% volume)**
- Rustle: Mimics dry leaves/paper crinkling (3-5kHz)
- Skitter: Rapid scratching sounds (4-8kHz)
- Chirp: High-pitched bird calls (3-6kHz)
- Ultrasonic layer (15-18kHz - cats hear clearly, humans barely)

**Layer 2: The Reward (75-80% volume, capped)**
- Kill Squeak: Sharp 8kHz→3kHz downward sweep (mouse distress call)
- Crunch: Breaking exoskeleton simulation
- Flutter: Rapid wing-flap oscillations

**Tense Silence**: 4-12 second gaps between ambient sounds trigger "Where did it go?" search instinct (Gap-Induced Prepulse Inhibition)

## 🎮 Game Modes

### 1. Drag Mode ✋
- Physics-based bouncing ball
- 80% energy retention per bounce
- Drag and throw with momentum
- Realistic gravity and friction

### 2. Random Roam 🎲
- Autonomous wandering behavior
- Random direction changes
- Pause/resume on touch
- Faster movement (4-8 units/frame)

### 3. Prey Mode 🐁 (Cat-Optimized Default)
- **Move Phase**: Fast burst (5x speed) for 0.3-1.0s
- **Freeze Phase**: Instant stop (5% chance per frame)
- **Twitch Phase**: Subtle rotation/vibration for 0.5-2.0s
- **Explode**: New random direction
- Edge collision → bounce toward center (not predictable walls)

## 🕷️ Prey Sprites

### Ball 🔴
- Classic colorful sphere with glow
- Cat-optimized colors (blue/yellow)
- Motion trails and shadows

### Spider 🕷️
- 8 animated legs that scurry independently
- Black silhouette (high contrast)
- Legs create "internal motion" when frozen
- Ideal for triggering peripheral vision

### Mouse 🐭
- Oval body with trailing tail (secondary motion cue)
- Pink nose, black body
- Tail follows with delay for organic movement
- Gray tail segments create追踪 effect

## 🔊 Sound Features

- **Zero Latency**: Instant feedback on touch
- **Procedurally Generated**: Web Audio API (no sound files)
- **Safety Capped**: All sounds max at 80% to prevent startle reflex
- **Toggle On/Off**: Full sound control
- **Ambient Intelligence**: Varies lure sounds to prevent habituation

## 📱 Technical Features

- Pure HTML5 Canvas + JavaScript
- No external dependencies
- Responsive design (works on all screen sizes)
- Touch-optimized for iPad/tablets
- Mouse support for desktop testing
- Fullscreen mode
- Web Audio API for sound generation
- 60 FPS smooth animation

## 🚀 How to Use

1. **Open**: Simply open `index.html` in any modern browser
2. **Go Fullscreen**: Click the fullscreen button for immersive play
3. **Select Mode**: Choose Drag, Roam, or Prey mode (left sidebar)
4. **Select Sprite**: Choose Ball, Spider, or Mouse (left sidebar)
5. **Let Your Cat Play**: 
   - In Prey mode, touch anywhere → prey flees
   - In Roam mode, touch to pause/resume
   - In Drag mode, drag and throw the ball
6. **Adjust Sound**: Toggle sound on/off as needed

## 💻 Development

```bash
# No build process needed!
# Just open index.html in a browser

# For local development:
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📂 Project Structure

```
pidan/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Styling and animations
├── js/
│   ├── game.js         # Game loop and input handling
│   ├── ball.js         # Ball physics and behavior
│   ├── sprites.js      # Spider and Mouse sprite classes
│   └── effects.js      # Visual and audio effects
└── README.md
```

## 🎯 Key Features Summary

✅ Saccadic "alive" movement (biological AI)  
✅ Cat-optimized audio with ultrasonic components  
✅ Three game modes (Drag, Roam, Prey)  
✅ Three prey sprites (Ball, Spider, Mouse)  
✅ "Stealth Mix" volume balancing  
✅ High contrast visuals (blue/yellow/black)  
✅ Touch and mouse support  
✅ Fullscreen mode  
✅ Pure JavaScript (no dependencies)  

## 🐾 Design Philosophy

**"Cats don't chase perfect circles - they hunt erratic, fearful prey."**

This game abandons predictable physics in favor of biological realism:
- Prey that freezes (not smooth movement)
- Erratic direction changes (not arcs)
- Internal motion (wiggling legs/tail)
- Quiet lures + loud rewards (not constant noise)
- High contrast shapes (not photorealistic textures)

## 📚 Research References

- Cat vision: Blue/yellow dichromatic spectrum (no red/green)
- Cat hearing: 4x human sensitivity, up to 85kHz detection
- Saccadic movement: Prey behavior patterns that trigger hunting
- Gap-Induced Prepulse Inhibition: Silence increases auditory sensitivity
- Hyperacusis: Avoiding overstimulation with volume caps

## 🙏 Credits

Built for Pidan (皮蛋) with love. 


**Enjoy watching your cat play! 🎉**

*If your cat ignores it, try Prey mode with Spider sprite and sound ON. The saccadic movement + leg animation is scientifically designed to trigger their hunting instinct.*
