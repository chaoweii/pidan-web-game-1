// Spider sprite class with animated legs
class Spider {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.bodySize = radius * 1.2;
        
        // Leg animation
        this.legs = [];
        this.legCount = 8;
        this.legLength = radius * 1.5;
        this.legAngle = 0;
        this.legSpeed = 0.2;
        
        // Initialize legs
        for (let i = 0; i < this.legCount; i++) {
            this.legs.push({
                angle: (Math.PI * 2 * i) / this.legCount,
                phase: i * 0.5
            });
        }
    }
    
    draw(ctx, isMoving, twitchOffset = 0) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Rotate for twitch
        if (twitchOffset !== 0) {
            ctx.rotate(twitchOffset);
        }
        
        // Animate legs when moving
        if (isMoving) {
            this.legAngle += this.legSpeed;
        }
        
        // Draw legs
        for (let i = 0; i < this.legCount; i++) {
            const leg = this.legs[i];
            const baseAngle = leg.angle;
            const legOffset = Math.sin(this.legAngle + leg.phase) * 0.3;
            
            ctx.beginPath();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            
            // Leg segments for scurrying effect
            const midX = Math.cos(baseAngle + legOffset) * this.legLength * 0.6;
            const midY = Math.sin(baseAngle + legOffset) * this.legLength * 0.6;
            const endX = Math.cos(baseAngle + legOffset * 1.5) * this.legLength;
            const endY = Math.sin(baseAngle + legOffset * 1.5) * this.legLength;
            
            ctx.moveTo(0, 0);
            ctx.lineTo(midX, midY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        
        // Draw body (black oval)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.bodySize, this.bodySize * 0.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        // Draw smaller head
        ctx.beginPath();
        ctx.arc(this.bodySize * 0.5, 0, this.bodySize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        ctx.restore();
    }
}

// Mouse sprite class with trailing tail
class Mouse {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.bodyLength = radius * 2;
        this.bodyWidth = radius * 1.3;
        
        // Tail segments for trailing effect
        this.tailSegments = 10;
        this.tailPositions = [];
        for (let i = 0; i < this.tailSegments; i++) {
            this.tailPositions.push({ x: x, y: y });
        }
    }
    
    updateTail(vx, vy) {
        // Shift tail segments
        for (let i = this.tailSegments - 1; i > 0; i--) {
            this.tailPositions[i].x = this.tailPositions[i - 1].x;
            this.tailPositions[i].y = this.tailPositions[i - 1].y;
        }
        
        // First segment follows body
        const angle = Math.atan2(vy, vx);
        this.tailPositions[0].x = this.x - Math.cos(angle) * this.bodyLength * 0.5;
        this.tailPositions[0].y = this.y - Math.sin(angle) * this.bodyLength * 0.5;
    }
    
    draw(ctx, isMoving, twitchOffset = 0) {
        ctx.save();
        
        // Draw tail (pink/gray curve)
        ctx.beginPath();
        ctx.moveTo(this.tailPositions[0].x, this.tailPositions[0].y);
        
        for (let i = 1; i < this.tailSegments; i++) {
            const thickness = 4 * (1 - i / this.tailSegments);
            ctx.lineTo(this.tailPositions[i].x, this.tailPositions[i].y);
        }
        
        ctx.strokeStyle = '#8B8B8B'; // Gray tail
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Draw body
        ctx.translate(this.x, this.y);
        if (twitchOffset !== 0) {
            ctx.rotate(twitchOffset);
        }
        
        // Body (black oval)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.bodyLength, this.bodyWidth, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        // Head (smaller circle)
        ctx.beginPath();
        ctx.arc(this.bodyLength * 0.6, 0, this.bodyWidth * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        // Pink nose
        ctx.beginPath();
        ctx.arc(this.bodyLength * 0.9, 0, this.bodyWidth * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFB6C1';
        ctx.fill();
        
        // Ears
        ctx.beginPath();
        ctx.arc(this.bodyLength * 0.4, -this.bodyWidth * 0.7, this.bodyWidth * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.bodyLength * 0.4, this.bodyWidth * 0.7, this.bodyWidth * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        ctx.restore();
    }
}

// Simple ball sprite (existing behavior)
class BallSprite {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    
    draw(ctx, isMoving, twitchOffset = 0) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (twitchOffset !== 0) {
            ctx.rotate(twitchOffset);
        }
        
        // Draw ball with glow effect
        const gradient = ctx.createRadialGradient(
            -this.radius * 0.3,
            -this.radius * 0.3,
            this.radius * 0.1,
            0, 0,
            this.radius
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.getDarkerColor(this.color));
        
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add shine
        ctx.beginPath();
        ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        
        ctx.restore();
    }
    
    getDarkerColor(color) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 50);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 50);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 50);
        return `rgb(${r}, ${g}, ${b})`;
    }
}
