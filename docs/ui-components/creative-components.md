# 🌈 Componentes Criativos - Além do Comum

<div align="center">

![Creative Components](https://img.shields.io/badge/Creative_Components-Innovative-ff6b6b?style=for-the-badge)
![Advanced CSS](https://img.shields.io/badge/Advanced_CSS-Effects-4ecdc4?style=for-the-badge)

**Criando componentes únicos que impressionam**

</div>

---

## 🎯 **Visão Geral**

Componentes criativos vão além do básico, combinando **múltiplas técnicas avançadas** para criar experiências visuais únicas. Nossa biblioteca inclui 12+ componentes que misturam:

-   💎 **Glass Morphism** + ✨ **Neon Effects**
-   🌊 **Animações Complexas** + 🎨 **Gradients Dinâmicos**
-   🔮 **3D Effects** + ⚡ **Particle Systems**
-   🌌 **Shader-like Effects** usando apenas CSS

---

## 🎨 **Nossa Galeria Criativa**

### **📊 Índice dos Componentes**

| Componente                                        | Técnicas               | Complexidade | Uso                  |
| ------------------------------------------------- | ---------------------- | ------------ | -------------------- |
| [`CrystalCard`](#crystalcard)                     | Glass + 3D + Gradients | ⭐⭐⭐       | Premium Content      |
| [`NeuralNetworkCard`](#neuralnetworkcard)         | Animated Lines + Nodes | ⭐⭐⭐⭐     | AI/Tech Sections     |
| [`DigitalRainCard`](#digitalraincard)             | Matrix Animation       | ⭐⭐⭐⭐     | Cyberpunk Themes     |
| [`QuantumCard`](#quantumcard)                     | Particle System        | ⭐⭐⭐⭐⭐   | Science Fiction      |
| [`DNAHelixCard`](#dnahelixcard)                   | 3D Rotation + Helix    | ⭐⭐⭐⭐     | Bio/Medical          |
| [`MatrixCodeCard`](#matrixcodecard)               | Falling Code + Glow    | ⭐⭐⭐       | Hacker Aesthetics    |
| [`CyberpunkNeonCard`](#cyberpunkneoncard)         | Multi-layer Neon       | ⭐⭐⭐⭐     | Gaming/Entertainment |
| [`SpaceWarpCard`](#spacewarpcard)                 | Radial Animations      | ⭐⭐⭐⭐     | Sci-Fi Interfaces    |
| [`DimensionalPortalCard`](#dimensionalportalcard) | CSS 3D + Transforms    | ⭐⭐⭐⭐⭐   | Fantasy/Magic        |

---

## 💎 **CrystalCard**

### **Conceito**

Simula um cristal translúcido com **reflexos prismáticos** e **profundidade 3D**.

```tsx
// components/ui/glass/creative-components.tsx
export function CrystalCard({
    children,
    className,
    ...props
}: BaseComponentProps) {
    return (
        <div
            className={cn(
                // 🎨 Base crystal structure
                "relative overflow-hidden rounded-xl",
                "bg-gradient-to-br from-white/20 via-white/10 to-white/5",
                "backdrop-blur-md border border-white/30",

                // 💎 3D Transform effects
                "transform-gpu perspective-1000",
                "hover:rotate-y-12 hover:rotate-x-6",
                "transition-all duration-500 ease-out",

                // ✨ Prismatic reflections
                "before:absolute before:inset-0",
                "before:bg-gradient-to-r before:from-cyan-400/20 before:via-magenta-400/20 before:to-yellow-400/20",
                "before:opacity-0 hover:before:opacity-100",
                "before:transition-opacity before:duration-300",

                className
            )}
            {...props}
        >
            {/* 🌟 Inner glow */}
            <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/10 to-transparent" />

            {/* 📝 Content */}
            <div className="relative z-10 p-6">{children}</div>

            {/* ✨ Shimmer effect */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full animate-shimmer" />
            </div>
        </div>
    );
}
```

### **CSS Animations**

```css
@keyframes shimmer {
    0% {
        transform: translateX(-100%) skewX(12deg);
    }
    100% {
        transform: translateX(100%) skewX(12deg);
    }
}

.animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
}

/* 3D rotation utilities */
.rotate-y-12 {
    transform: rotateY(12deg);
}

.rotate-x-6 {
    transform: rotateX(6deg);
}

.perspective-1000 {
    perspective: 1000px;
}
```

---

## 🧠 **NeuralNetworkCard**

### **Conceito**

Visualiza uma **rede neural** com nós conectados por linhas animadas.

```tsx
export function NeuralNetworkCard({
    children,
    nodeCount = 12,
    className,
    ...props
}: NeuralNetworkCardProps) {
    const nodes = useMemo(
        () =>
            Array.from({ length: nodeCount }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 2,
            })),
        [nodeCount]
    );

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-black/50 backdrop-blur-sm",
                "border border-cyan-400/30",
                className
            )}
            {...props}
        >
            {/* 🧠 Neural network background */}
            <div className="absolute inset-0">
                <svg className="w-full h-full">
                    {/* 🔗 Connections */}
                    {nodes.map((node, i) =>
                        nodes.slice(i + 1).map((targetNode, j) => (
                            <line
                                key={`${i}-${j}`}
                                x1={`${node.x}%`}
                                y1={`${node.y}%`}
                                x2={`${targetNode.x}%`}
                                y2={`${targetNode.y}%`}
                                stroke="rgba(34, 211, 238, 0.3)"
                                strokeWidth="1"
                                className="animate-pulse"
                                style={{
                                    animationDelay: `${node.delay}s`,
                                    animationDuration: "3s",
                                }}
                            />
                        ))
                    )}

                    {/* 🔵 Nodes */}
                    {nodes.map((node) => (
                        <circle
                            key={node.id}
                            cx={`${node.x}%`}
                            cy={`${node.y}%`}
                            r="3"
                            fill="#00ffff"
                            className="animate-ping"
                            style={{
                                animationDelay: `${node.delay}s`,
                                animationDuration: "2s",
                            }}
                        />
                    ))}
                </svg>
            </div>

            {/* 📝 Content */}
            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}
```

---

## 🌧️ **DigitalRainCard**

### **Conceito**

Recria o famoso efeito **"chuva digital"** do Matrix.

```tsx
export function DigitalRainCard({
    children,
    className,
    intensity = "medium",
    ...props
}: DigitalRainCardProps) {
    const columns = 20;
    const characters = "01ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-black/80 backdrop-blur-sm",
                "border border-green-400/30",
                className
            )}
            {...props}
        >
            {/* 🌧️ Digital rain effect */}
            <div className="absolute inset-0">
                {Array.from({ length: columns }, (_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 text-green-400 text-sm font-mono leading-none"
                        style={{
                            left: `${(i / columns) * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    >
                        {Array.from({ length: 30 }, (_, j) => (
                            <div
                                key={j}
                                className="animate-digital-rain opacity-70"
                                style={{
                                    animationDelay: `${j * 0.1}s`,
                                    animationDuration: `${
                                        2 + Math.random() * 3
                                    }s`,
                                }}
                            >
                                {characters.charAt(
                                    Math.floor(
                                        Math.random() * characters.length
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* 📝 Content with overlay */}
            <div className="relative z-10 bg-black/50 backdrop-blur-sm p-6">
                {children}
            </div>
        </div>
    );
}
```

### **CSS Animation**

```css
@keyframes digital-rain {
    0% {
        transform: translateY(-100vh);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(100vh);
        opacity: 0;
    }
}

.animate-digital-rain {
    animation: digital-rain linear infinite;
}
```

---

## ⚛️ **QuantumCard**

### **Conceito**

Simula **partículas quânticas** em movimento orbital.

```tsx
export function QuantumCard({
    children,
    particleCount = 8,
    className,
    ...props
}: QuantumCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-gradient-to-br from-purple-900/50 to-blue-900/50",
                "backdrop-blur-md border border-purple-400/30",
                className
            )}
            {...props}
        >
            {/* ⚛️ Quantum particles */}
            <div className="absolute inset-0">
                {Array.from({ length: particleCount }, (_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full"
                        style={{
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            animation: `quantum-orbit-${i} ${
                                3 + i * 0.5
                            }s linear infinite`,
                        }}
                    />
                ))}

                {/* 🌟 Central core */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                </div>
            </div>

            {/* 📝 Content */}
            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}
```

### **Dynamic CSS Generation**

```typescript
// Generate orbital animations dynamically
export function generateQuantumOrbits(particleCount: number) {
    const styles: string[] = [];

    for (let i = 0; i < particleCount; i++) {
        const radius = 50 + i * 20;
        const angle = (360 / particleCount) * i;

        styles.push(`
      @keyframes quantum-orbit-${i} {
        0% {
          transform: translate(-50%, -50%)
                    rotate(0deg)
                    translateX(${radius}px)
                    rotate(0deg);
        }
        100% {
          transform: translate(-50%, -50%)
                    rotate(360deg)
                    translateX(${radius}px)
                    rotate(-360deg);
        }
      }
    `);
    }

    return styles.join("\n");
}
```

---

## 🧬 **DNAHelixCard**

### **Conceito**

Cria uma **dupla hélice de DNA** rotacionando em 3D.

```tsx
export function DNAHelixCard({
    children,
    className,
    ...props
}: BaseComponentProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-gradient-to-br from-emerald-900/50 to-teal-900/50",
                "backdrop-blur-md border border-emerald-400/30",
                className
            )}
            {...props}
        >
            {/* 🧬 DNA Helix */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-full">
                    {/* Helix strands */}
                    {Array.from({ length: 20 }, (_, i) => (
                        <div
                            key={i}
                            className="absolute w-full flex justify-between items-center"
                            style={{
                                top: `${i * 5}%`,
                                transform: `rotateY(${i * 18}deg)`,
                                animation: `dna-rotate 4s linear infinite`,
                                animationDelay: `${i * 0.1}s`,
                            }}
                        >
                            {/* Left strand */}
                            <div className="w-3 h-3 bg-emerald-400 rounded-full" />

                            {/* Connecting base pairs */}
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 mx-2" />

                            {/* Right strand */}
                            <div className="w-3 h-3 bg-teal-400 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 📝 Content */}
            <div className="relative z-10 bg-black/30 backdrop-blur-sm p-6">
                {children}
            </div>
        </div>
    );
}
```

### **3D CSS Animation**

```css
@keyframes dna-rotate {
    0% {
        transform: rotateY(0deg);
    }
    100% {
        transform: rotateY(360deg);
    }
}

/* 3D perspective for parent */
.dna-container {
    perspective: 1000px;
    perspective-origin: center center;
}
```

---

## 🌌 **SpaceWarpCard**

### **Conceito**

Simula o efeito de **dobra espacial** com linhas radiais.

```tsx
export function SpaceWarpCard({
    children,
    className,
    ...props
}: BaseComponentProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-black/80 backdrop-blur-sm",
                "border border-blue-400/30",
                className
            )}
            {...props}
        >
            {/* 🌌 Space warp effect */}
            <div className="absolute inset-0">
                {/* Radial lines */}
                {Array.from({ length: 12 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 origin-left w-full h-0.5"
                        style={{
                            transform: `translate(-50%, -50%) rotate(${
                                i * 30
                            }deg)`,
                            background: `linear-gradient(to right,
                rgba(59, 130, 246, 0) 0%,
                rgba(59, 130, 246, 0.5) 50%,
                rgba(59, 130, 246, 0) 100%)`,
                        }}
                    >
                        <div className="w-full h-full animate-space-warp" />
                    </div>
                ))}

                {/* Central vortex */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 rounded-full bg-blue-400/20 animate-spin-slow" />
                    <div className="absolute inset-2 rounded-full bg-blue-400/40 animate-spin" />
                    <div className="absolute inset-4 rounded-full bg-blue-400/60 animate-spin-slow" />
                </div>
            </div>

            {/* 📝 Content */}
            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}
```

---

## 🔮 **DimensionalPortalCard**

### **Conceito**

Cria um **portal dimensional** com efeitos de profundidade infinita.

```tsx
export function DimensionalPortalCard({
    children,
    className,
    ...props
}: BaseComponentProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl",
                "bg-gradient-to-br from-purple-900/50 to-pink-900/50",
                "backdrop-blur-md border border-purple-400/30",
                className
            )}
            {...props}
        >
            {/* 🔮 Portal effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Concentric circles creating depth illusion */}
                {Array.from({ length: 8 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full border-2 border-purple-400/30"
                        style={{
                            width: `${(i + 1) * 40}px`,
                            height: `${(i + 1) * 40}px`,
                            animation: `portal-pulse ${
                                2 + i * 0.3
                            }s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}

                {/* Rotating energy rings */}
                <div className="absolute inset-0">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div
                            key={i}
                            className="absolute top-1/2 left-1/2 border border-pink-400/50 rounded-full"
                            style={{
                                width: `${100 + i * 50}px`,
                                height: `${100 + i * 50}px`,
                                transform: "translate(-50%, -50%)",
                                animation: `portal-rotate ${
                                    3 + i
                                }s linear infinite ${
                                    i % 2 === 0 ? "reverse" : ""
                                }`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* 📝 Content */}
            <div className="relative z-10 bg-black/40 backdrop-blur-sm p-6">
                {children}
            </div>
        </div>
    );
}
```

---

## 🎮 **Showcase Interativo**

### **Implementação do Showcase**

```tsx
// app/interactive-showcase/page.tsx
"use client";

import { useState } from "react";
import {
    CrystalCard,
    NeuralNetworkCard,
    DigitalRainCard,
    QuantumCard,
} from "@/components/ui/glass";

export default function InteractiveShowcase() {
    const [activeComponent, setActiveComponent] = useState("crystal");
    const [intensity, setIntensity] = useState(50);

    const components = {
        crystal: CrystalCard,
        neural: NeuralNetworkCard,
        rain: DigitalRainCard,
        quantum: QuantumCard,
    };

    const ActiveComponent = components[activeComponent];

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            {/* 🎛️ Controls */}
            <div className="mb-8">
                <div className="flex gap-4 mb-4">
                    {Object.keys(components).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveComponent(key)}
                            className={cn(
                                "px-4 py-2 rounded",
                                activeComponent === key
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-700 text-gray-300"
                            )}
                        >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <label>Intensity:</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={intensity}
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="flex-1"
                    />
                    <span>{intensity}%</span>
                </div>
            </div>

            {/* 🎨 Component Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActiveComponent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                        {activeComponent.charAt(0).toUpperCase() +
                            activeComponent.slice(1)}{" "}
                        Component
                    </h3>
                    <p className="text-gray-300">Intensity: {intensity}%</p>
                </ActiveComponent>
            </div>
        </div>
    );
}
```

---

## 📊 **Performance e Otimização**

### **Lazy Loading de Componentes**

```tsx
// Carregamento sob demanda
const CrystalCard = lazy(() =>
    import("./creative-components").then((m) => ({ default: m.CrystalCard }))
);
const QuantumCard = lazy(() =>
    import("./creative-components").then((m) => ({ default: m.QuantumCard }))
);

// Wrapper com Suspense
function CreativeComponentLoader({ type, ...props }) {
    return (
        <Suspense
            fallback={
                <div className="animate-pulse bg-gray-700 rounded-xl h-48" />
            }
        >
            {type === "crystal" && <CrystalCard {...props} />}
            {type === "quantum" && <QuantumCard {...props} />}
        </Suspense>
    );
}
```

### **Debounce para Animações**

```tsx
import { useMemo, useCallback } from "react";
import { debounce } from "lodash-es";

function useOptimizedAnimation() {
    const triggerAnimation = useCallback(
        debounce(() => {
            // Trigger expensive animation
        }, 100),
        []
    );

    return triggerAnimation;
}
```

---

## 🎯 **Casos de Uso por Setor**

### **🎮 Gaming/Entertainment**

-   `CyberpunkNeonCard` - Interfaces de jogos
-   `DigitalRainCard` - Temas hacker
-   `SpaceWarpCard` - Sci-fi games

### **🔬 Science/Medical**

-   `DNAHelixCard` - Biotecnologia
-   `QuantumCard` - Pesquisa quântica
-   `NeuralNetworkCard` - IA/ML

### **💼 Business/Finance**

-   `CrystalCard` - Premium features
-   `GlassCard` com neon - Analytics
-   Componentes híbridos - Dashboards

---

## 🔗 **Recursos Técnicos**

-   📚 [CSS Transforms 3D](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
-   🎨 [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
-   ⚡ [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
-   🖼️ [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 🎓 **Próximos Passos**

1. 🔄 **Explore**: [`Animações Avançadas`](./animations.md)
2. ⚡ **Otimize**: [`Performance Guide`](../architecture/performance.md)
3. 🌈 **Aprenda**: [`CSS Effects`](../css-effects/backdrop-filters.md)

---

<div align="center">

**🌈 Criatividade é o limite quando você domina as ferramentas!**

_Continue explorando as animações que dão vida a estes componentes._

</div>
