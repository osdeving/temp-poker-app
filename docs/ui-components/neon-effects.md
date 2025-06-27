# ✨ Efeitos Neon e Glow - Cyberpunk UI

<div align="center">

![Neon Effects](https://img.shields.io/badge/Neon_Effects-Cyberpunk-ff00ff?style=for-the-badge)
![CSS](https://img.shields.io/badge/CSS-Text_Shadow-1572B6?style=for-the-badge&logo=css3)

**Criando interfaces futuristas e vibrantes**

</div>

---

## 🎯 **O que são Efeitos Neon?**

Efeitos neon simulam **luzes de neon** encontradas em cenários cyberpunk e futuristas. Eles criam:

-   🌟 **Glow Intenso** - Brilho ao redor dos elementos
-   🎨 **Cores Vibrantes** - Paleta cyberpunk (cyan, magenta, verde)
-   ⚡ **Pulsação** - Animações de respiração
-   🔮 **Profundidade** - Múltiplas camadas de sombra

---

## 🔬 **Anatomia do Efeito Neon**

### **CSS Base do Neon**

```css
.neon-text {
    /* 🎨 Cor base vibrante */
    color: #00ffff;

    /* ✨ Múltiplas camadas de glow */
    text-shadow: 0 0 5px currentColor, /* Inner glow */ 0 0 10px currentColor,
        /* Medium glow */ 0 0 20px currentColor, /* Outer glow */ 0 0 40px
            currentColor; /* Far glow */

    /* 🔤 Font weight para melhor definição */
    font-weight: 600;

    /* 📝 Melhor renderização */
    text-rendering: optimizeLegibility;
}
```

**Resultado Visual:**

<div style="color: #00ffff; text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff; font-weight: 600; font-size: 24px; text-align: center; margin: 20px 0; background: #0a0a0a; padding: 20px; border-radius: 8px;">
✨ NEON TEXT EFFECT ✨
</div>

---

## 🏗️ **Nossa Implementação: NeonEffects**

### **Componente NeonText**

```tsx
// components/ui/glass/neon-effects.tsx
"use client";

import { cn } from "@/lib/utils";
import type { NeonTextProps } from "./types";

export function NeonText({
    variant = "cyan",
    intensity = "medium",
    className,
    children,
    ...props
}: NeonTextProps) {
    return (
        <span
            className={cn(
                // 🎨 Base styling
                "font-semibold tracking-wide",

                // 🌈 Cor do variant
                NEON_COLORS[variant].text,

                // ✨ Intensidade do glow
                NEON_INTENSITY[intensity],

                // 🎭 Classes customizadas
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
```

### **Configuração dos Variants**

```typescript
// components/ui/glass/config.ts
export const NEON_COLORS = {
    // 🔵 Cyan - Clássico cyberpunk
    cyan: {
        text: "text-cyan-400",
        shadow: "shadow-cyan-500/50",
        glow: [
            "0 0 5px rgb(34 211 238)",
            "0 0 10px rgb(34 211 238)",
            "0 0 20px rgb(34 211 238)",
            "0 0 40px rgb(34 211 238)",
        ].join(", "),
    },

    // 🟣 Magenta - Vibrante e moderno
    magenta: {
        text: "text-fuchsia-400",
        shadow: "shadow-fuchsia-500/50",
        glow: [
            "0 0 5px rgb(244 114 182)",
            "0 0 10px rgb(244 114 182)",
            "0 0 20px rgb(244 114 182)",
            "0 0 40px rgb(244 114 182)",
        ].join(", "),
    },

    // 🟢 Green - Matrix style
    green: {
        text: "text-green-400",
        shadow: "shadow-green-500/50",
        glow: [
            "0 0 5px rgb(34 197 94)",
            "0 0 10px rgb(34 197 94)",
            "0 0 20px rgb(34 197 94)",
            "0 0 40px rgb(34 197 94)",
        ].join(", "),
    },

    // 🔴 Red - Alerta/perigo
    red: {
        text: "text-red-400",
        shadow: "shadow-red-500/50",
        glow: [
            "0 0 5px rgb(248 113 113)",
            "0 0 10px rgb(248 113 113)",
            "0 0 20px rgb(248 113 113)",
            "0 0 40px rgb(248 113 113)",
        ].join(", "),
    },
} as const;

export const NEON_INTENSITY = {
    // 🌫️ Sutil - Glow discreto
    subtle: "drop-shadow-sm",

    // 🔍 Médio - Balanceado
    medium: "drop-shadow-md",

    // 💥 Alto - Glow intenso
    high: "drop-shadow-lg drop-shadow-xl",
} as const;
```

---

## 🎨 **Variants de Cores**

### **1. Cyan - O Clássico**

```tsx
<NeonText variant="cyan" intensity="high">
    CYBER POKER 2084
</NeonText>
```

```css
/* CSS gerado */
.neon-cyan {
    color: rgb(34 211 238);
    text-shadow: 0 0 5px rgb(34 211 238), 0 0 10px rgb(34 211 238),
        0 0 20px rgb(34 211 238), 0 0 40px rgb(34 211 238);
}
```

**Quando usar:**

-   ✅ Títulos principais
-   ✅ Logos e branding
-   ✅ CTAs importantes

### **2. Magenta - Vibrante**

```tsx
<NeonText variant="magenta" intensity="medium">
    NEON CASINO
</NeonText>
```

**Quando usar:**

-   ✅ Elementos de destaque
-   ✅ Promoções especiais
-   ✅ Botões de ação

### **3. Green - Matrix Style**

```tsx
<NeonText variant="green" intensity="high">
    ENTERING THE MATRIX
</NeonText>
```

**Quando usar:**

-   ✅ Confirmações e sucesso
-   ✅ Dados positivos
-   ✅ Status online

### **4. Red - Alerta**

```tsx
<NeonText variant="red" intensity="high">
    CRITICAL ERROR
</NeonText>
```

**Quando usar:**

-   ✅ Alertas e erros
-   ✅ Avisos importantes
-   ✅ Estados de perigo

---

## 🔘 **Componente NeonButton**

### **Implementação Completa**

```tsx
// components/ui/glass/neon-effects.tsx
export function NeonButton({
    variant = "cyan",
    size = "md",
    className,
    children,
    ...props
}: NeonButtonProps) {
    return (
        <button
            className={cn(
                // 🎨 Base styling
                "relative font-semibold tracking-wide",
                "border-2 rounded-lg transition-all duration-300",
                "hover:scale-105 active:scale-95",

                // 📏 Tamanhos
                BUTTON_SIZES[size],

                // 🌈 Variant colors
                NEON_COLORS[variant].text,
                `border-${variant}-400/50`,
                `hover:border-${variant}-400`,

                // ✨ Hover effects
                "hover:shadow-lg hover:shadow-current/25",

                className
            )}
            {...props}
        >
            {/* 🌟 Background glow */}
            <div className="absolute inset-0 bg-current opacity-0 hover:opacity-10 rounded-lg transition-opacity duration-300" />

            {/* 📝 Content */}
            <span className="relative z-10">{children}</span>
        </button>
    );
}
```

### **Configuração de Tamanhos**

```typescript
export const BUTTON_SIZES = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
    xl: "px-10 py-4 text-xl",
} as const;
```

---

## 📱 **Componente NeonInput**

### **Input com Glow**

```tsx
export function NeonInput({
    variant = "cyan",
    className,
    ...props
}: NeonInputProps) {
    return (
        <input
            className={cn(
                // 🎨 Base styling
                "w-full px-4 py-3 rounded-lg",
                "bg-black/50 backdrop-blur-sm",
                "border-2 transition-all duration-300",

                // 🌈 Variant colors
                `border-${variant}-400/30`,
                `focus:border-${variant}-400`,
                `text-${variant}-100`,
                `placeholder-${variant}-400/60`,

                // ✨ Focus effects
                "focus:outline-none focus:ring-0",
                `focus:shadow-lg focus:shadow-${variant}-400/25`,

                className
            )}
            {...props}
        />
    );
}
```

---

## 🎪 **Animações Neon Avançadas**

### **1. Pulsação (Breathing)**

```css
@keyframes neon-pulse {
    0%,
    100% {
        text-shadow: 0 0 5px currentColor, 0 0 10px currentColor,
            0 0 20px currentColor;
    }
    50% {
        text-shadow: 0 0 2px currentColor, 0 0 5px currentColor,
            0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor;
    }
}

.neon-pulse {
    animation: neon-pulse 2s ease-in-out infinite;
}
```

### **2. Flickering (Cintilação)**

```css
@keyframes neon-flicker {
    0%,
    19%,
    21%,
    23%,
    25%,
    54%,
    56%,
    100% {
        text-shadow: 0 0 5px currentColor, 0 0 10px currentColor,
            0 0 20px currentColor;
    }
    20%,
    24%,
    55% {
        text-shadow: none;
    }
}

.neon-flicker {
    animation: neon-flicker 3s infinite;
}
```

### **3. Color Shift**

```css
@keyframes neon-rainbow {
    0% {
        color: #ff0040;
    }
    16% {
        color: #ff8000;
    }
    33% {
        color: #ffff00;
    }
    50% {
        color: #00ff00;
    }
    66% {
        color: #0080ff;
    }
    83% {
        color: #8000ff;
    }
    100% {
        color: #ff0040;
    }
}

.neon-rainbow {
    animation: neon-rainbow 4s linear infinite;
}
```

---

## 🎯 **Casos de Uso Reais**

### **1. Login Form Cyberpunk**

```tsx
// components/auth/login-form.tsx
export function LoginForm() {
    return (
        <GlassCard variant="medium" className="p-8 max-w-md">
            <NeonText
                variant="cyan"
                intensity="high"
                className="text-2xl mb-6 block text-center"
            >
                CYBER LOGIN
            </NeonText>

            <div className="space-y-4">
                <NeonInput
                    variant="cyan"
                    placeholder="Enter username..."
                    type="text"
                />

                <NeonInput
                    variant="cyan"
                    placeholder="Enter password..."
                    type="password"
                />

                <NeonButton variant="cyan" size="lg" className="w-full">
                    HACK THE MATRIX
                </NeonButton>
            </div>
        </GlassCard>
    );
}
```

### **2. Dashboard Stats**

```tsx
// app/dashboard/page.tsx
export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="medium" className="p-6 text-center">
                <NeonText
                    variant="green"
                    intensity="high"
                    className="text-4xl block mb-2"
                >
                    $12,500
                </NeonText>
                <p className="text-gray-400">Total Winnings</p>
            </GlassCard>

            <GlassCard variant="medium" className="p-6 text-center">
                <NeonText
                    variant="cyan"
                    intensity="high"
                    className="text-4xl block mb-2"
                >
                    42
                </NeonText>
                <p className="text-gray-400">Games Played</p>
            </GlassCard>

            <GlassCard variant="medium" className="p-6 text-center">
                <NeonText
                    variant="magenta"
                    intensity="high"
                    className="text-4xl block mb-2"
                >
                    89%
                </NeonText>
                <p className="text-gray-400">Win Rate</p>
            </GlassCard>
        </div>
    );
}
```

### **3. Tournament Timer**

```tsx
// components/tournament/tournament-clock.tsx
export function TournamentClock({ timeLeft }: { timeLeft: string }) {
    return (
        <div className="text-center">
            <NeonText
                variant="red"
                intensity="high"
                className="text-6xl font-mono neon-pulse"
            >
                {timeLeft}
            </NeonText>
            <p className="text-gray-400 mt-2">Time Remaining</p>
        </div>
    );
}
```

---

## 🔧 **Otimizações de Performance**

### **GPU Acceleration**

```css
.neon-text {
    /* ✅ Força aceleração GPU */
    transform: translateZ(0);
    will-change: text-shadow;
}

.neon-text:hover {
    /* ✅ Use transform em vez de box-shadow quando possível */
    transform: translateZ(0) scale(1.05);
}
```

### **Redução de Reflow/Repaint**

```css
/* ❌ Evite mudar layout properties */
.neon-button:hover {
    width: 110%; /* Causa reflow */
}

/* ✅ Use transform */
.neon-button:hover {
    transform: scale(1.1); /* Apenas compositor */
}
```

---

## 🎨 **Paleta de Cores Cyberpunk**

```css
:root {
    /* 🔵 Azuis cyberpunk */
    --neon-cyan: #00ffff;
    --neon-blue: #0080ff;
    --electric-blue: #0040ff;

    /* 🟣 Magentas futuristas */
    --neon-magenta: #ff00ff;
    --hot-pink: #ff0080;
    --electric-purple: #8000ff;

    /* 🟢 Verdes matrix */
    --neon-green: #00ff00;
    --lime-green: #80ff00;
    --matrix-green: #00ff80;

    /* 🔴 Vermelhos de alerta */
    --neon-red: #ff0040;
    --danger-red: #ff0000;
    --warning-orange: #ff8000;
}
```

---

## 📱 **Responsividade**

### **Mobile Optimizations**

```css
/* Reduz intensidade em dispositivos móveis */
@media (max-width: 768px) {
    .neon-text {
        text-shadow: 0 0 3px currentColor, 0 0 6px currentColor,
            0 0 12px currentColor;
    }
}

/* Desativa animações para economizar bateria */
@media (prefers-reduced-motion: reduce) {
    .neon-pulse,
    .neon-flicker {
        animation: none;
    }
}
```

---

## 🧪 **Testing e Acessibilidade**

### **Contrast Ratios**

```css
/* ✅ Garanta contraste adequado */
.neon-text-accessible {
    color: #00ffff;
    /* Fallback sem glow para leitores de tela */
    text-shadow: none;
}

/* Aplique glow apenas quando suportado */
@supports (text-shadow: 0 0 5px currentColor) {
    .neon-text-accessible {
        text-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
    }
}
```

---

## 🔗 **Recursos Externos**

-   📚 [MDN: text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow)
-   🎨 [Cyberpunk Color Palette](https://www.schemecolor.com/cyberpunk-neon.php)
-   🛠️ [CSS Neon Generator](https://www.cssportal.com/css-neon-text-generator/)
-   📖 [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎓 **Próximos Passos**

1. 🎪 **Explore**: [`Componentes Criativos`](./creative-components.md)
2. 🔄 **Aprenda**: [`Animações Avançadas`](./animations.md)
3. 🌈 **Domine**: [`Gradients e Shadows`](../css-effects/gradients-shadows.md)

---

<div align="center">

**✨ Efeitos neon transformam interfaces comuns em experiências cyberpunk!**

_Continue explorando os componentes criativos que combinam glass + neon._

</div>
