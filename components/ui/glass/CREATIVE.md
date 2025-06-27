# Creative Glass Components 🎨✨

Advanced creative components with unique visual effects and interactions.

## 🌈 Creative Components

### HolographicCard

A card with rainbow holographic border effects and color-shifting animations.

```tsx
<HolographicCard
    rainbow={true} // Enable rainbow border animation
    intensity="medium" // subtle | medium | intense
    hover={true} // Enable hover effects
    animation={true} // Enable entrance animations
    className="p-6"
>
    <NeonText color="purple">Holographic Content</NeonText>
</HolographicCard>
```

**Features:**

-   🌈 Rainbow gradient border with animation
-   ✨ Configurable intensity levels
-   🎭 Smooth color transitions
-   📱 Responsive design

---

### FloatingCard

A card that appears to float with dynamic shadows and depth.

```tsx
<FloatingCard
    floatHeight="medium" // low | medium | high
    shadowIntensity="dramatic" // soft | medium | dramatic
    variant="crystal" // Glass variant
    blur="medium" // Blur intensity
    className="p-6"
>
    <NeonText color="blue">Floating Content</NeonText>
</FloatingCard>
```

**Features:**

-   🕊️ Floating animation with smooth motion
-   🌑 Dynamic shadow effects
-   📏 Configurable float height
-   💫 Entrance animations

---

### RippleCard

Interactive card that creates ripple effects on interaction.

```tsx
<RippleCard
    rippleColor="cyan" // Any neon color
    triggerOnHover={true} // Trigger on hover or click only
    variant="sapphire" // Glass variant
    blur="medium" // Blur intensity
    className="p-6"
>
    <NeonText color="cyan">Click me for ripples!</NeonText>
</RippleCard>
```

**Features:**

-   💧 Ripple effects on interaction
-   🎯 Configurable trigger methods
-   🎨 Customizable ripple colors
-   ⚡ Smooth animations

---

### GlitchCard

Card with digital glitch effects and color distortions.

```tsx
<GlitchCard
    glitchIntensity="medium" // subtle | medium | intense
    triggerOnHover={true} // Auto-trigger on hover
    variant="crystal" // Glass variant
    className="p-6"
>
    <NeonText color="red">Glitch Effect</NeonText>
</GlitchCard>
```

**Features:**

-   💥 Digital glitch animations
-   🔴 Color channel separation effects
-   ⚡ Configurable intensity
-   🎮 Gaming/cyberpunk aesthetic

---

### MorphingCard

Card that smoothly transitions between different glass variants.

```tsx
<MorphingCard
    morphVariants={[
        { variant: "crystal", duration: 3000 },
        { variant: "sapphire", duration: 3000 },
        { variant: "emerald", duration: 3000 },
    ]}
    autoMorph={true} // Auto-cycle variants
    blur="medium" // Blur intensity
    className="p-6"
>
    <NeonText>Morphing Content</NeonText>
</MorphingCard>
```

**Features:**

-   🔄 Smooth variant transitions
-   ⏱️ Configurable timing
-   🎭 Multiple variant support
-   🔁 Auto-cycling option

## 🎪 Effect Components

### ParticleField

Animated particle background with floating elements.

```tsx
<ParticleField
    particleCount={50} // Number of particles
    particleColor="cyan" // Particle color
    speed="medium" // slow | medium | fast
    className="h-64"
>
    <GlassCard className="h-full flex items-center justify-center">
        <NeonText>Content with particles</NeonText>
    </GlassCard>
</ParticleField>
```

**Features:**

-   ✨ Floating particle animations
-   🎨 Configurable colors and count
-   ⚡ Variable speed settings
-   📱 Mobile-optimized

---

### GradientShiftCard

Card with continuously shifting background gradients.

```tsx
<GradientShiftCard
    gradients={[
        "from-pink-500/20 via-purple-500/15 to-cyan-500/20",
        "from-blue-500/20 via-indigo-500/15 to-purple-500/20",
    ]}
    shiftSpeed={3000} // Milliseconds between shifts
    blur="medium" // Blur intensity
    className="p-6"
>
    <NeonText>Shifting gradients</NeonText>
</GradientShiftCard>
```

**Features:**

-   🌈 Smooth gradient transitions
-   ⏱️ Configurable timing
-   🎨 Custom gradient support
-   🔄 Infinite cycling

---

### LiquidCard

Card with flowing liquid-like animations.

```tsx
<LiquidCard
    liquidColor="green" // Flow color
    flowSpeed="medium" // slow | medium | fast
    intensity="medium" // subtle | medium | intense
    className="p-6"
>
    <NeonText color="green">Liquid Flow</NeonText>
</LiquidCard>
```

**Features:**

-   💧 Liquid flow animations
-   🌊 Smooth wave effects
-   🎨 Configurable colors
-   ⚡ Variable speeds

---

### MagneticCard

Interactive card that follows mouse movement with magnetic attraction.

```tsx
<MagneticCard
    magnetStrength="medium" // weak | medium | strong
    variant="crystal" // Glass variant
    className="p-6"
>
    <NeonText color="orange">I follow your mouse!</NeonText>
</MagneticCard>
```

**Features:**

-   🧲 Magnetic mouse tracking
-   📱 Mobile-friendly (disabled on touch)
-   ⚡ Smooth 3D transformations
-   🎯 Configurable attraction strength

## 🎨 Usage Examples

### Hero Section with Particles

```tsx
function CreativeHero() {
    return (
        <ParticleField
            particleCount={100}
            particleColor="cyan"
            speed="slow"
            className="min-h-screen"
        >
            <div className="flex items-center justify-center min-h-screen">
                <HolographicCard
                    intensity="intense"
                    className="p-12 text-center"
                >
                    <NeonText color="purple" size="2xl" className="mb-6">
                        Welcome to the Future
                    </NeonText>
                    <p className="text-gray-300 mb-8">
                        Experience next-generation UI components
                    </p>
                    <NeonButton variant="primary" size="lg">
                        Get Started
                    </NeonButton>
                </HolographicCard>
            </div>
        </ParticleField>
    );
}
```

### Interactive Gallery

```tsx
function CreativeGallery() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RippleCard rippleColor="pink" className="p-6">
                <NeonText color="pink">Ripple Effect</NeonText>
            </RippleCard>

            <GlitchCard glitchIntensity="medium" className="p-6">
                <NeonText color="red">Glitch Art</NeonText>
            </GlitchCard>

            <MagneticCard magnetStrength="strong" className="p-6">
                <NeonText color="orange">Magnetic Pull</NeonText>
            </MagneticCard>

            <FloatingCard floatHeight="high" className="p-6">
                <NeonText color="blue">Floating Dreams</NeonText>
            </FloatingCard>

            <LiquidCard liquidColor="cyan" flowSpeed="fast" className="p-6">
                <NeonText color="cyan">Liquid Motion</NeonText>
            </LiquidCard>

            <MorphingCard autoMorph={true} className="p-6">
                <NeonText>Shape Shifter</NeonText>
            </MorphingCard>
        </div>
    );
}
```

### Gaming Interface

```tsx
function GamingUI() {
    return (
        <div className="space-y-6">
            <GlitchCard glitchIntensity="intense" className="p-4">
                <div className="flex items-center justify-between">
                    <NeonText color="red" size="lg">
                        SYSTEM ALERT
                    </NeonText>
                    <NeonText color="red">ERROR_CODE_404</NeonText>
                </div>
            </GlitchCard>

            <ParticleField
                particleCount={30}
                particleColor="green"
                speed="fast"
                className="h-32"
            >
                <HolographicCard className="h-full p-4 flex items-center">
                    <NeonText color="green" size="xl">
                        LOADING MATRIX...
                    </NeonText>
                </HolographicCard>
            </ParticleField>

            <div className="grid grid-cols-2 gap-4">
                <MagneticCard
                    magnetStrength="medium"
                    className="p-4 text-center"
                >
                    <NeonText color="cyan">SCAN</NeonText>
                </MagneticCard>
                <LiquidCard
                    liquidColor="red"
                    flowSpeed="fast"
                    className="p-4 text-center"
                >
                    <NeonText color="red">ATTACK</NeonText>
                </LiquidCard>
            </div>
        </div>
    );
}
```

## 🎯 Performance Tips

### Optimization Guidelines

1. **Particle Count**: Keep particles under 100 for mobile devices
2. **Animation Speed**: Use "slow" speeds for better performance
3. **Reduced Motion**: Components respect `prefers-reduced-motion`
4. **Mobile Considerations**: Some effects are disabled on mobile

### Best Practices

```tsx
// Good: Responsive particle count
const isMobile = window.innerWidth < 768;
<ParticleField
  particleCount={isMobile ? 20 : 50}
  speed="medium"
>

// Good: Conditional complex effects
<MagneticCard
  magnetStrength={isMobile ? "weak" : "strong"}
>

// Good: Performance-friendly settings
<GradientShiftCard
  shiftSpeed={4000} // Slower = better performance
>
```

## 🎪 Accessibility

All creative components maintain accessibility standards:

-   ✅ **Keyboard Navigation**: All interactive elements are keyboard accessible
-   ✅ **Screen Readers**: Proper ARIA labels and semantic HTML
-   ✅ **Reduced Motion**: Respects user motion preferences
-   ✅ **Color Contrast**: Maintains readability standards
-   ✅ **Focus Indicators**: Clear focus states for all components

## 🚀 Animation Performance

The components use optimized CSS animations and transforms:

-   **GPU Acceleration**: Uses `transform` and `opacity` properties
-   **RequestAnimationFrame**: Smooth 60fps animations
-   **Debounced Events**: Optimized mouse tracking
-   **Conditional Rendering**: Smart component rendering

## 🎨 Customization

### Custom Animations

Add your own animations by extending the CSS:

```css
@keyframes myCustomEffect {
    0% {
        transform: scale(1) rotate(0deg);
    }
    50% {
        transform: scale(1.1) rotate(180deg);
    }
    100% {
        transform: scale(1) rotate(360deg);
    }
}

.my-custom-card {
    animation: myCustomEffect 2s ease-in-out infinite;
}
```

### Custom Effects

Create your own effect components:

```tsx
function MyCustomCard({ children, ...props }) {
    return (
        <GlassCard
            {...props}
            className={cn("my-custom-effects", props.className)}
        >
            {children}
        </GlassCard>
    );
}
```

## 🎭 Creative Combinations

Mix and match components for unique effects:

```tsx
<ParticleField particleCount={40} particleColor="purple">
    <MorphingCard autoMorph={true}>
        <RippleCard rippleColor="cyan" className="p-8">
            <HolographicCard intensity="subtle" className="p-6">
                <NeonText color="purple" size="xl">
                    Multi-layered Magic ✨
                </NeonText>
            </HolographicCard>
        </RippleCard>
    </MorphingCard>
</ParticleField>
```

---

Ready to create amazing user experiences with these creative components! 🚀✨
