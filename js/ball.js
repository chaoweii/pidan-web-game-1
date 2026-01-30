// Ball class with physics
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        
        // Random initial velocity
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        
        // Physics properties
        this.gravity = 0.2;
        this.friction = 0.99;
        this.bounce = 0.8; // 80% energy retention on bounce (more bounces!)
        this.stopped = false;
        
        // For bounce height tracking
        this.bounceCount = 0;
        this.lastBounceHeight = 0;
        
        // For trail effect
        this.trail = [];
        this.maxTrailLength = 10;
        
        // For drag functionality
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        
        // For random roam mode
        this.roamMode = false;
        this.roamStopped = false;
        this.roamChangeTimer = 0;
        this.roamChangeInterval = 2000; // Change direction every 2 seconds
        
        // Cat-optimized prey behavior
        this.preyMode = false;
        
        // SACCADIC "ALIVE" MOVEMENT
        this.isMoving = true;
        this.moveTimer = 0;
        this.moveDuration = 300 + Math.random() * 700; // 0.3-1.0s
        this.freezeDuration = 500 + Math.random() * 1500; // 0.5-2.0s
        this.twitchAngle = 0;
        this.twitchSpeed = 0.1;
        
        // Sprite system
        this.spriteType = 'ball'; // 'ball', 'spider', 'mouse'
        this.sprite = null;
        this.createSprite();
    }
    
    createSprite() {
        const radius = this.radius;
        switch (this.spriteType) {
            case 'spider':
                this.sprite = new Spider(this.x, this.y, radius);
                break;
            case 'mouse':
                this.sprite = new Mouse(this.x, this.y, radius);
                break;
            default:
                this.sprite = new BallSprite(this.x, this.y, radius, this.color);
        }
    }
    
    changeSprite(type) {
        this.spriteType = type;
        this.changeColor();
    }
    
    changeColor() {
        // Get a new random color from the cat-optimized palette
        this.color = Ball.getRandomColor();
        // Recreate sprite with new color
        this.createSprite();
    }

    update(canvas) {
        // Don't update if dragging or stopped
        if (this.isDragging || (this.stopped && !this.roamMode && !this.preyMode) || this.roamStopped) {
            return null;
        }
        
        // Cat-optimized SACCADIC prey behavior
        if (this.preyMode) {
            this.moveTimer += 16.67;
            
            if (this.isMoving) {
                // MOVE PHASE: Fast burst (5x speed)
                const speed = 5 + Math.random() * 5;
                const normalizedVx = this.vx / (Math.abs(this.vx) + Math.abs(this.vy) + 0.001);
                const normalizedVy = this.vy / (Math.abs(this.vx) + Math.abs(this.vy) + 0.001);
                this.vx = normalizedVx * speed * 5; // 5x multiplier
                this.vy = normalizedVy * speed * 5;
                
                // Random chance to FREEZE (5% per frame)
                if (Math.random() < 0.05 || this.moveTimer >= this.moveDuration) {
                    this.isMoving = false;
                    this.vx = 0;
                    this.vy = 0;
                    this.moveTimer = 0;
                    this.freezeDuration = 500 + Math.random() * 1500;
                }
            } else {
                // FREEZE PHASE: Twitch while stopped
                this.twitchAngle = Math.sin(this.moveTimer * this.twitchSpeed) * 0.1;
                
                // After freeze duration, EXPLODE in new direction
                if (this.moveTimer >= this.freezeDuration) {
                    this.isMoving = true;
                    this.moveTimer = 0;
                    this.moveDuration = 300 + Math.random() * 700;
                    // EXPLODE in random direction
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 5 + Math.random() * 5;
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed;
                    this.twitchAngle = 0;
                }
            }
            // No gravity in prey mode
        } else if (this.roamMode) {
            // Original random roam mode behavior with larger steps
            this.roamChangeTimer += 16.67;
            if (this.roamChangeTimer >= this.roamChangeInterval) {
                this.roamChangeTimer = 0;
                const angle = Math.random() * Math.PI * 2;
                const speed = 4 + Math.random() * 4; // Increased from 2-5 to 4-8
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
            }
        } else {
            // Apply gravity in drag mode
            this.vy += this.gravity;
        }
        
        // Apply friction (less in prey mode for constant movement)
        const frictionFactor = this.preyMode ? 0.995 : this.friction;
        this.vx *= frictionFactor;
        this.vy *= frictionFactor;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Store trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Check collision with edges and return collision info
        let collision = null;
        
        // Different edge behavior for prey/roam modes vs drag mode
        if (this.preyMode || this.roamMode) {
            // In prey/roam mode: bounce toward center when hitting edges
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            if (this.x - this.radius <= 0) {
                this.x = this.radius;
                // Bounce toward center with larger steps
                const angle = Math.atan2(centerY - this.y, centerX - this.x);
                const speed = 5 + Math.random() * 4; // Increased from 4-7 to 5-9
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                collision = { x: 0, y: this.y, side: 'left' };
            } else if (this.x + this.radius >= canvas.width) {
                this.x = canvas.width - this.radius;
                // Bounce toward center with larger steps
                const angle = Math.atan2(centerY - this.y, centerX - this.x);
                const speed = 5 + Math.random() * 4; // Increased from 4-7 to 5-9
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                collision = { x: canvas.width, y: this.y, side: 'right' };
            }
            
            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                // Bounce toward center with larger steps
                const angle = Math.atan2(centerY - this.y, centerX - this.x);
                const speed = 5 + Math.random() * 4; // Increased from 4-7 to 5-9
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                collision = { x: this.x, y: 0, side: 'top' };
            } else if (this.y + this.radius >= canvas.height) {
                this.y = canvas.height - this.radius;
                // Bounce toward center with larger steps
                const angle = Math.atan2(centerY - this.y, centerX - this.x);
                const speed = 5 + Math.random() * 4; // Increased from 4-7 to 5-9
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                collision = { x: this.x, y: canvas.height, side: 'bottom' };
            }
        } else {
            // Drag mode: normal bounce physics
            if (this.x - this.radius <= 0) {
                this.x = this.radius;
                this.vx = Math.abs(this.vx) * this.bounce;
                collision = { x: 0, y: this.y, side: 'left' };
            } else if (this.x + this.radius >= canvas.width) {
                this.x = canvas.width - this.radius;
                this.vx = -Math.abs(this.vx) * this.bounce;
                collision = { x: canvas.width, y: this.y, side: 'right' };
            }
            
            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.vy = Math.abs(this.vy) * this.bounce;
                collision = { x: this.x, y: 0, side: 'top' };
            }
            
            // Bottom wall with 20% bounce decay
            if (this.y + this.radius >= canvas.height) {
                this.y = canvas.height - this.radius;
                
                const currentBounceHeight = Math.abs(this.vy);
                
                // Check if bounce is getting too small (after at least 1 bounce)
                if (this.bounceCount > 0 && this.lastBounceHeight > 0) {
                    const energyRatio = currentBounceHeight / this.lastBounceHeight;
                    
                    // Stop if current bounce < 3% of last bounce height or velocity too small
                    if (energyRatio < 0.03 || currentBounceHeight < 0.3) {
                        this.vy = 0;
                        this.vx *= 0.8;
                        this.stopped = true;
                    } else {
                        this.vy = -Math.abs(this.vy) * this.bounce;
                        this.lastBounceHeight = currentBounceHeight;
                        this.bounceCount++;
                    }
                } else {
                    // First bounce - just apply physics
                    this.vy = -Math.abs(this.vy) * this.bounce;
                    this.lastBounceHeight = Math.abs(this.vy);
                    this.bounceCount++;
                }
                
                collision = { x: this.x, y: canvas.height, side: 'bottom' };
            }
        }
        
        return collision;
    }

    draw(ctx) {
        // Update sprite position
        if (this.sprite) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            
            // Update mouse tail
            if (this.spriteType === 'mouse') {
                this.sprite.updateTail(this.vx, this.vy);
            }
            
            // Draw sprite with twitch effect
            this.sprite.draw(ctx, this.isMoving, this.twitchAngle);
        }
        
        // Draw shadow for depth
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 1) {
            const shadowOffsetX = this.vx * 0.3;
            const shadowOffsetY = this.vy * 0.3 + 8;
            
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
            
            ctx.beginPath();
            ctx.ellipse(
                this.x, 
                this.y + 10, 
                this.radius * 0.8, 
                this.radius * 0.3, 
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fill();
            ctx.restore();
        }
    }

    getDarkerColor(color) {
        // Simple color darkening
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 50);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 50);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 50);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Check if point is inside ball
    containsPoint(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }

    // Apply impulse (for touch/click interaction)
    applyImpulse(ix, iy) {
        this.stopped = false; // Resume movement
        this.vx += ix;
        this.vy += iy;
        
        // Limit maximum velocity
        const maxSpeed = 15;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }
    
    // Start dragging
    startDrag(x, y) {
        this.isDragging = true;
        this.stopped = false;
        this.dragStartX = x;
        this.dragStartY = y;
        this.vx = 0;
        this.vy = 0;
        // Reset bounce tracking
        this.bounceCount = 0;
        this.lastBounceHeight = 0;
    }
    
    // Update position while dragging
    drag(x, y) {
        if (this.isDragging) {
            this.x = x;
            this.y = y;
        }
    }
    
    // End dragging and apply momentum
    endDrag(x, y, deltaX, deltaY) {
        this.isDragging = false;
        // Apply momentum based on drag velocity
        this.vx = deltaX * 0.5;
        this.vy = deltaY * 0.5;
        
        // Limit maximum velocity
        const maxSpeed = 15;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }
    
    // Random roam mode methods
    enableRandomRoam() {
        this.roamMode = true;
        this.preyMode = false;
        this.roamStopped = false;
        this.stopped = false;
        // Start with random velocity (larger steps)
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 4; // Increased from 2-5 to 4-8
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }
    
    stopRoam() {
        this.roamStopped = true;
        this.vx = 0;
        this.vy = 0;
    }
    
    resumeRoam() {
        this.roamStopped = false;
        // Resume with new random velocity (larger steps)
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 4; // Increased from 2-5 to 4-8
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }
    
    // Cat-optimized prey mode
    enablePreyMode() {
        this.preyMode = true;
        this.roamMode = false;
        this.roamStopped = false;
        this.stopped = false;
        this.injuredPhase = false;
        this.hidingPhase = false;
        // Start with random velocity (larger steps)
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 5; // Increased from 3-6 to 5-10
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }
    
    // "Fleeing Prey" - move away from touch point
    fleeFrom(touchX, touchY) {
        if (!this.preyMode) return;
        
        // Calculate direction AWAY from touch
        const dx = this.x - touchX;
        const dy = this.y - touchY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Flee in opposite direction with burst of speed
            const speed = 6 + Math.random() * 4;
            this.vx = (dx / distance) * speed;
            this.vy = (dy / distance) * speed;
            
            // Add some randomness to make it erratic
            const randomAngle = (Math.random() - 0.5) * 0.5;
            const cos = Math.cos(randomAngle);
            const sin = Math.sin(randomAngle);
            const newVx = this.vx * cos - this.vy * sin;
            const newVy = this.vx * sin + this.vy * cos;
            this.vx = newVx;
            this.vy = newVy;
        }
    }

    // Cat-optimized colors (blue and yellow spectrum only)
    static getRandomColor() {
        const colors = [
            '#0066FF', // Vivid Blue
            '#4169E1', // Royal Blue
            '#00BFFF', // Deep Sky Blue
            '#FFD700', // Gold Yellow
            '#FFEB3B', // Bright Yellow
            '#FFC107', // Amber Yellow
            '#000000'  // Black (high contrast silhouette)
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
