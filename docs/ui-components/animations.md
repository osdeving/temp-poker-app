# 🔄 Animações e Transições - Dando Vida à Interface

<div align="center">

![Animations](https://img.shields.io/badge/Animations-Advanced-9b59b6?style=for-the-badge)
![CSS](https://img.shields.io/badge/CSS-Keyframes-f39c12?style=for-the-badge&logo=css3)

**Criando movimento fluido e envolvente**

</div>

---

## 🎯 **Filosofia das Animações**

Animações bem feitas são **invisíveis** - o usuário sente o movimento natural sem perceber a técnica. Nosso sistema de animações segue princípios de:

-   🎬 **Easing Natural** - Curvas de movimento realistas
-   ⚡ **Performance First** - GPU acceleration sempre
-   🎭 **Meaningful Motion** - Cada animação tem propósito
-   📱 **Responsive** - Adapta-se ao dispositivo

---

## 🏗️ **Arquitetura das Animações**

### **Hierarquia de Complexidade**

```
🔄 Animações
├── 🌫️ Micro (0.1-0.3s)     # Hover, focus, click
├── 🔍 Macro (0.3-0.8s)     # Transições de estado
├── 🎭 Sequence (0.8-2s)    # Animações compostas
└── 🌊 Ambient (2s+)        # Loops de ambiente
```

### **Sistema de Timing**

```typescript
// lib/animation-config.ts
export const ANIMATION_TIMING = {
    // 🌫️ Micro interactions
    micro: {
        duration: "150ms",
        easing: "cubic-bezier(0.4, 0, 0.2, 1)", // Material Design
    },

    // 🔍 Standard transitions
    standard: {
        duration: "300ms",
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Ease-out-quad
    },

    // 🎭 Complex sequences
    complex: {
        duration: "500ms",
        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // Back-out
    },

    // 🌊 Ambient loops
    ambient: {
        duration: "3s",
        easing: "ease-in-out",
    },
} as const;
```

---

## ✨ **Micro Animações**

### **1. Hover Effects**

```css
/* 🎨 Glass card hover */
.glass-card {
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateZ(0); /* Force GPU layer */
}

.glass-card:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* ✨ Neon button glow */
.neon-button {
    transition: all 150ms ease-out;
    filter: brightness(1);
}

.neon-button:hover {
    filter: brightness(1.2);
    text-shadow: 0 0 5px currentColor, 0 0 10px currentColor,
        0 0 20px currentColor, 0 0 40px currentColor;
}
```

### **2. Focus States**

```css
/* 🎯 Input focus */
.neon-input {
    transition: all 200ms ease;
    border-color: rgba(34, 211, 238, 0.3);
    box-shadow: 0 0 0 0 rgba(34, 211, 238, 0);
}

.neon-input:focus {
    border-color: rgb(34, 211, 238);
    box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
    outline: none;
}
```

### **3. Click Feedback**

```css
/* 👆 Active states */
.interactive-element {
    transition: transform 100ms ease-out;
    transform: scale(1);
}

.interactive-element:active {
    transform: scale(0.98);
}

/* 🌊 Ripple effect */
@keyframes ripple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(4);
        opacity: 0;
    }
}

.ripple-effect {
    position: relative;
    overflow: hidden;
}

.ripple-effect::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 600ms linear;
    pointer-events: none;
}
```

---

## 🌊 **Transições de Estado**

### **1. Page Transitions**

```tsx
// components/ui/page-transition.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
        >
            {children}
        </motion.div>
    );
}
```

### **2. Modal Animations**

```tsx
// Modal com backdrop + scale
const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 50,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 300,
        },
    },
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export function AnimatedModal({ isOpen, children }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        className="flex items-center justify-center min-h-screen p-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <GlassCard className="max-w-md w-full">
                            {children}
                        </GlassCard>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
```

---

## 🎭 **Animações Complexas**

### **1. Staggered Animations**

```tsx
// Lista com animação escalonada
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 300,
        },
    },
};

export function AnimatedGrid({ items }: { items: any[] }) {
    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {items.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                    <GlassCard className="p-6">{item.content}</GlassCard>
                </motion.div>
            ))}
        </motion.div>
    );
}
```

### **2. Morphing Shapes**

```css
/* 🔄 Button que vira loading spinner */
.morph-button {
    width: 120px;
    height: 40px;
    border-radius: 20px;
    transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.morph-button.loading {
    width: 40px;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* 📊 Progress bar morphing */
.progress-morph {
    width: 0%;
    height: 4px;
    background: linear-gradient(90deg, #00ffff, #ff00ff);
    border-radius: 2px;
    transition: width 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## 🌌 **Animações Ambientes**

### **1. Floating Elements**

```css
/* 🎈 Elementos flutuantes */
@keyframes float {
    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-10px) rotate(2deg);
    }
}

@keyframes float-reverse {
    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(10px) rotate(-2deg);
    }
}

.float-animation {
    animation: float 6s ease-in-out infinite;
}

.float-animation:nth-child(even) {
    animation: float-reverse 8s ease-in-out infinite;
    animation-delay: -2s;
}
```

### **2. Particle Systems**

```tsx
// Partículas flutuantes em CSS
export function ParticleBackground() {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        left: Math.random() * 100,
        animationDuration: Math.random() * 20 + 10,
        animationDelay: Math.random() * 20,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-white/10"
                    style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        left: `${particle.left}%`,
                        animation: `particle-float ${particle.animationDuration}s linear infinite`,
                        animationDelay: `${particle.animationDelay}s`,
                    }}
                />
            ))}
        </div>
    );
}
```

```css
@keyframes particle-float {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-10vh) rotate(360deg);
        opacity: 0;
    }
}
```

---

## ⚡ **Performance de Animações**

### **1. GPU Acceleration**

```css
/* ✅ Properties que trigram GPU */
.gpu-accelerated {
    transform: translateZ(0); /* Force layer creation */
    will-change: transform, opacity; /* Hint to browser */
}

/* ✅ Use transform em vez de position */
.smooth-movement {
    transition: transform 300ms ease-out;
}

.smooth-movement:hover {
    transform: translateX(10px); /* ✅ GPU accelerated */
    /* left: 10px; ❌ Causes reflow */
}

/* ✅ Use scale em vez de width/height */
.smooth-resize {
    transition: transform 300ms ease-out;
}

.smooth-resize:hover {
    transform: scale(1.1); /* ✅ GPU accelerated */
    /* width: 110%; ❌ Causes reflow */
}
```

### **2. Otimização de Reflow/Repaint**

```css
/* 🎯 Composite layers - mudanças não afetam outros elementos */
.optimized-animation {
    /* Trigger composite layer */
    transform: translateZ(0);
    backface-visibility: hidden;

    /* Animate only transform and opacity */
    transition: transform 300ms ease-out, opacity 300ms ease-out;
}

/* 📱 Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
    .optimized-animation {
        transition: none;
        animation: none;
    }
}
```

### **3. Intersection Observer para Animações**

```tsx
// Hook para animações on-scroll otimizadas
import { useInView } from "framer-motion";

export function ScrollTriggeredAnimation({
    children,
}: {
    children: React.ReactNode;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true, // Animate only once
        amount: 0.3, // Trigger when 30% visible
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}
```

---

## 🎨 **Animações Específicas do Projeto**

### **1. Tournament Clock Animation**

```tsx
// components/tournament/tournament-clock.tsx
export function TournamentClock({ timeLeft }: { timeLeft: number }) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="relative">
            {/* 🔴 Urgency indicator */}
            <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                    backgroundColor:
                        timeLeft < 60
                            ? ["rgba(239, 68, 68, 0)", "rgba(239, 68, 68, 0.2)"]
                            : "rgba(239, 68, 68, 0)",
                }}
                transition={{
                    duration: 1,
                    repeat: timeLeft < 60 ? Infinity : 0,
                    repeatType: "reverse",
                }}
            />

            {/* ⏰ Time display */}
            <NeonText
                variant={timeLeft < 60 ? "red" : "cyan"}
                className="text-6xl font-mono"
            >
                {formatTime(timeLeft)}
            </NeonText>
        </div>
    );
}
```

### **2. Poker Card Flip**

```css
/* 🃏 Card flip animation */
.poker-card {
    perspective: 1000px;
    width: 80px;
    height: 120px;
}

.poker-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.poker-card.flipped .poker-card-inner {
    transform: rotateY(180deg);
}

.poker-card-front,
.poker-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 8px;
}

.poker-card-back {
    transform: rotateY(180deg);
}
```

### **3. Chip Stack Animation**

```tsx
// Animação de fichas empilhando
export function ChipStack({ amount }: { amount: number }) {
    const chipCount = Math.min(Math.floor(amount / 100), 10);

    return (
        <div className="relative">
            {Array.from({ length: chipCount }, (_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-12 h-3 bg-gradient-to-r from-red-500 to-red-700 rounded-full border border-white/30"
                    initial={{ y: 0, scale: 0 }}
                    animate={{
                        y: -i * 4,
                        scale: 1,
                    }}
                    transition={{
                        delay: i * 0.1,
                        type: "spring",
                        damping: 15,
                        stiffness: 300,
                    }}
                    style={{
                        bottom: "0px",
                    }}
                />
            ))}
        </div>
    );
}
```

---

## 🎬 **Sequências de Animação**

### **1. Loading Sequence**

```tsx
export function LoadingSequence() {
    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* 🌀 Spinner */}
            <motion.div
                className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />

            {/* 📝 Text sequence */}
            <motion.div
                className="mt-8 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <NeonText variant="cyan" className="text-xl">
                    Connecting to the Matrix...
                </NeonText>

                <motion.div
                    className="mt-2 flex justify-center space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
```

---

## 📱 **Animações Responsivas**

### **Mobile Optimizations**

```css
/* 📱 Reduce animations on mobile */
@media (max-width: 768px) {
    .complex-animation {
        animation-duration: 1s; /* Shorter on mobile */
        animation-iteration-count: 1; /* Don't loop */
    }

    .hover-animation:hover {
        transform: none; /* Disable hover on touch */
    }
}

/* 🔋 Battery level considerations */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* 🌙 Dark mode animation adjustments */
@media (prefers-color-scheme: dark) {
    .glow-effect {
        filter: brightness(0.8); /* Reduce intensity */
    }
}
```

---

## 🔧 **Debugging Animations**

### **Chrome DevTools**

```css
/* 🔍 Visualize composite layers */
* {
    outline: 1px solid red; /* See layout boundaries */
}

/* 📊 Show repaint areas */
.debug-repaint {
    background: lime; /* Temporary background */
    transition: background 100ms;
}

/* ⚡ Force hardware acceleration for testing */
.force-gpu {
    transform: translateZ(0);
    will-change: transform;
}
```

### **Performance Monitoring**

```tsx
// Performance monitoring hook
export function useAnimationPerformance() {
    useEffect(() => {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === "measure") {
                    console.log(
                        `Animation: ${entry.name} took ${entry.duration}ms`
                    );
                }
            });
        });

        observer.observe({ entryTypes: ["measure"] });

        return () => observer.disconnect();
    }, []);
}

// Usage in component
function AnimatedComponent() {
    useAnimationPerformance();

    const handleAnimation = useCallback(() => {
        performance.mark("animation-start");

        // Animation logic here

        performance.mark("animation-end");
        performance.measure(
            "animation-duration",
            "animation-start",
            "animation-end"
        );
    }, []);

    return <motion.div onAnimationComplete={handleAnimation} />;
}
```

---

## 🔗 **Recursos e Ferramentas**

### **Libraries**

-   🎭 [Framer Motion](https://www.framer.com/motion/) - React animations
-   🌊 [React Spring](https://react-spring.dev/) - Spring-based animations
-   ⚡ [React Transition Group](https://reactcommunity.org/react-transition-group/) - Transition components
-   🎪 [Lottie React](https://lottiereact.com/) - After Effects animations

### **Tools**

-   🔧 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/rendering) - Performance debugging
-   📊 [WebPageTest](https://www.webpagetest.org/) - Performance analysis
-   🎨 [Easings.net](https://easings.net/) - Easing functions
-   📐 [Cubic Bezier](https://cubic-bezier.com/) - Timing function generator

---

## 🎓 **Próximos Passos**

1. 🌈 **Aprenda**: [`CSS Effects Avançados`](../css-effects/backdrop-filters.md)
2. ⚡ **Otimize**: [`Performance Guide`](../architecture/performance.md)
3. 🧪 **Teste**: [`Testing Strategies`](../architecture/testing.md)

---

<div align="center">

**🔄 Animações são a alma da interface - use-as com sabedoria!**

_Continue explorando os efeitos CSS que tornam essas animações possíveis._

</div>
