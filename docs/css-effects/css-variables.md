# 🎨 CSS Variables - Temas Dinâmicos

> **Criando sistemas de design flexíveis com Custom Properties**

---

## 🎯 **O que são CSS Variables?**

CSS Variables (Custom Properties) permitem armazenar valores reutilizáveis em CSS, criando:

-   **Temas dinâmicos** que mudam em runtime
-   **Consistência visual** em todo o projeto
-   **Manutenção simplificada** de cores e valores
-   **Performance otimizada** vs variáveis Sass/Less

### ✨ **Vantagens sobre Preprocessadores**

| CSS Variables                           | Sass/Less Variables                   |
| --------------------------------------- | ------------------------------------- |
| ✅ **Runtime** - Mudam dinamicamente    | ❌ **Compile-time** - Estáticas       |
| ✅ **Cascata** - Herdam escopo          | ❌ **Global** - Escopo fixo           |
| ✅ **JavaScript** - Manipuláveis via JS | ❌ **Limitado** - Só CSS              |
| ✅ **Nativo** - Suporte browser         | ❌ **Build step** - Requer compilação |

---

## 🏗️ **Implementação no Projeto**

### 📁 **Estrutura de Temas**

```css
/* app/globals.css - Tema principal */
:root {
    /* === CORES PRINCIPAIS === */
    --color-primary: 59 130 246; /* blue-500 */
    --color-primary-foreground: 255 255 255;
    --color-secondary: 99 102 241; /* indigo-500 */
    --color-accent: 34 197 94; /* green-500 */

    /* === GLASS MORPHISM === */
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
    --glass-blur: 12px;

    /* === NEON EFFECTS === */
    --neon-cyan: 0 255 255;
    --neon-purple: 147 51 234;
    --neon-pink: 236 72 153;
    --neon-glow-size: 20px;

    /* === SPACING === */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* === TYPOGRAPHY === */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;

    /* === ANIMATIONS === */
    --duration-fast: 150ms;
    --duration-normal: 300ms;
    --duration-slow: 500ms;
    --easing-out: cubic-bezier(0.4, 0, 0.2, 1);
    --easing-in: cubic-bezier(0.4, 0, 1, 1);
}

/* Tema escuro - override automático */
@media (prefers-color-scheme: dark) {
    :root {
        --glass-bg: rgba(255, 255, 255, 0.05);
        --glass-border: rgba(255, 255, 255, 0.1);
    }
}

/* Tema cyberpunk - classe customizada */
.theme-cyberpunk {
    --color-primary: 0 255 255; /* cyan */
    --color-secondary: 255 0 255; /* magenta */
    --color-accent: 0 255 0; /* green */
    --glass-bg: rgba(0, 255, 255, 0.1);
    --glass-border: rgba(0, 255, 255, 0.3);
    --neon-glow-size: 30px;
}
```

### 🎨 **Usando Variables nos Componentes**

```tsx
// components/ui/glass/glass-card.tsx
export function GlassCard({ variant = "default", ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border shadow-lg transition-all duration-300",
                "backdrop-blur-[var(--glass-blur)]",
                className
            )}
            style={{
                backgroundColor: "var(--glass-bg)",
                borderColor: "var(--glass-border)",
                boxShadow: `0 8px 32px rgba(var(--color-primary), 0.1)`,
            }}
            {...props}
        >
            {children}
        </div>
    );
}
```

### ✨ **Neon Effects com Variables**

```tsx
// components/ui/glass/neon-effects.tsx
export function NeonText({
    color = "cyan",
    intensity = "normal",
    ...props
}: NeonTextProps) {
    const colorMap = {
        cyan: "var(--neon-cyan)",
        purple: "var(--neon-purple)",
        pink: "var(--neon-pink)",
    };

    const intensityMap = {
        subtle: "10px",
        normal: "var(--neon-glow-size)",
        intense: "calc(var(--neon-glow-size) * 1.5)",
    };

    return (
        <span
            className={cn("font-bold transition-all duration-300", className)}
            style={{
                color: `rgb(${colorMap[color]})`,
                textShadow: `
          0 0 5px rgb(${colorMap[color]}),
          0 0 ${intensityMap[intensity]} rgb(${colorMap[color]}),
          0 0 ${intensityMap[intensity]} rgb(${colorMap[color]}),
          0 0 calc(${intensityMap[intensity]} * 2) rgb(${colorMap[color]})
        `,
            }}
            {...props}
        />
    );
}
```

---

## 🎯 **Sistema de Temas Dinâmicos**

### 🌓 **Theme Provider com Context**

```tsx
// lib/theme-provider.tsx
interface ThemeContextType {
    theme: "default" | "cyberpunk" | "neon" | "minimal";
    setTheme: (theme: string) => void;
    toggleTheme: () => void;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<string>("default");

    useEffect(() => {
        // Aplicar tema ao root element
        document.documentElement.className =
            theme === "default" ? "" : `theme-${theme}`;

        // Salvar preferência
        localStorage.setItem("poker-app-theme", theme);
    }, [theme]);

    useEffect(() => {
        // Restaurar tema salvo
        const savedTheme = localStorage.getItem("poker-app-theme");
        if (savedTheme) setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const themes = ["default", "cyberpunk", "neon", "minimal"];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
```

### 🔄 **Theme Toggle Component**

```tsx
// components/ui/theme-toggle.tsx
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { name: "default", label: "Padrão", icon: "🌟" },
        { name: "cyberpunk", label: "Cyberpunk", icon: "🔮" },
        { name: "neon", label: "Neon", icon: "✨" },
        { name: "minimal", label: "Minimal", icon: "⚪" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    {themes.find((t) => t.name === theme)?.icon} Tema
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map((themeOption) => (
                    <DropdownMenuItem
                        key={themeOption.name}
                        onClick={() => setTheme(themeOption.name)}
                        className={
                            theme === themeOption.name ? "bg-accent" : ""
                        }
                    >
                        {themeOption.icon} {themeOption.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
```

---

## 🎨 **Temas Personalizados**

### 🌙 **Tema Minimal**

```css
.theme-minimal {
    /* Cores neutras */
    --color-primary: 71 85 105; /* slate-600 */
    --color-secondary: 100 116 139; /* slate-500 */
    --color-accent: 148 163 184; /* slate-400 */

    /* Glass sutil */
    --glass-bg: rgba(255, 255, 255, 0.02);
    --glass-border: rgba(255, 255, 255, 0.05);
    --glass-blur: 8px;

    /* Sem neon */
    --neon-glow-size: 0px;

    /* Animações suaves */
    --duration-fast: 200ms;
    --duration-normal: 400ms;
    --easing-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 🔥 **Tema Neon Intenso**

```css
.theme-neon {
    /* Cores vibrantes */
    --color-primary: 255 0 255; /* magenta */
    --color-secondary: 0 255 255; /* cyan */
    --color-accent: 255 255 0; /* yellow */

    /* Glass brilhante */
    --glass-bg: rgba(255, 0, 255, 0.15);
    --glass-border: rgba(255, 0, 255, 0.4);
    --glass-blur: 16px;

    /* Neon intenso */
    --neon-glow-size: 40px;

    /* Animações rápidas */
    --duration-fast: 100ms;
    --duration-normal: 200ms;
}
```

---

## 🛠️ **Utilitários JavaScript**

### 🎨 **Manipulação Dinâmica**

```typescript
// lib/theme-utils.ts
export class ThemeManager {
    private root = document.documentElement;

    // Definir variável
    setVariable(name: string, value: string) {
        this.root.style.setProperty(name, value);
    }

    // Obter variável
    getVariable(name: string): string {
        return getComputedStyle(this.root).getPropertyValue(name).trim();
    }

    // Animar transição de cor
    animateColor(
        variable: string,
        fromColor: string,
        toColor: string,
        duration = 300
    ) {
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Interpolar RGB
            const from = this.parseRGB(fromColor);
            const to = this.parseRGB(toColor);
            const current = from.map((f, i) =>
                Math.round(f + (to[i] - f) * progress)
            );

            this.setVariable(variable, current.join(" "));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    private parseRGB(color: string): number[] {
        return color.split(" ").map(Number);
    }

    // Gerar tema aleatório
    generateRandomTheme() {
        const hue = Math.floor(Math.random() * 360);
        const primary = `hsl(${hue}, 70%, 50%)`;
        const secondary = `hsl(${(hue + 60) % 360}, 70%, 50%)`;
        const accent = `hsl(${(hue + 120) % 360}, 70%, 50%)`;

        this.setVariable("--color-primary", this.hslToRgb(primary));
        this.setVariable("--color-secondary", this.hslToRgb(secondary));
        this.setVariable("--color-accent", this.hslToRgb(accent));
    }

    private hslToRgb(hsl: string): string {
        // Implementação de conversão HSL para RGB
        // ... (código de conversão)
        return "255 0 0"; // placeholder
    }
}

// Hook para usar o ThemeManager
export function useThemeManager() {
    const themeManager = useMemo(() => new ThemeManager(), []);
    return themeManager;
}
```

### 🎯 **Reactive Theme Hook**

```tsx
// hooks/use-reactive-theme.tsx
export function useReactiveTheme() {
    const [variables, setVariables] = useState<Record<string, string>>({});

    // Observar mudanças nas CSS variables
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const root = document.documentElement;
            const computedStyle = getComputedStyle(root);

            const newVariables: Record<string, string> = {};

            // Capturar todas as custom properties
            for (let i = 0; i < computedStyle.length; i++) {
                const prop = computedStyle[i];
                if (prop.startsWith("--")) {
                    newVariables[prop] = computedStyle
                        .getPropertyValue(prop)
                        .trim();
                }
            }

            setVariables(newVariables);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["style", "class"],
        });

        return () => observer.disconnect();
    }, []);

    return variables;
}
```

---

## 🎮 **Casos de Uso Avançados**

### 🃏 **Temas Adaptativos por Context**

```tsx
// components/poker/adaptive-theme.tsx
export function AdaptivePokerTable() {
    const { gameState } = usePokerGame();
    const themeManager = useThemeManager();

    useEffect(() => {
        // Adaptar tema baseado no estado do jogo
        switch (gameState.phase) {
            case "preflop":
                themeManager.setVariable("--color-accent", "59 130 246"); // blue
                break;
            case "flop":
                themeManager.setVariable("--color-accent", "34 197 94"); // green
                break;
            case "turn":
                themeManager.setVariable("--color-accent", "251 191 36"); // yellow
                break;
            case "river":
                themeManager.setVariable("--color-accent", "239 68 68"); // red
                break;
        }
    }, [gameState.phase]);

    return <PokerTable />;
}
```

### 📊 **Temas Baseados em Performance**

```tsx
// hooks/use-performance-theme.tsx
export function usePerformanceTheme() {
    const themeManager = useThemeManager();

    useEffect(() => {
        // Ajustar efeitos baseado na performance
        const checkPerformance = () => {
            if (performance.memory?.usedJSHeapSize) {
                const memoryUsage =
                    performance.memory.usedJSHeapSize / 1024 / 1024;

                if (memoryUsage > 100) {
                    // > 100MB
                    // Reduzir efeitos
                    themeManager.setVariable("--glass-blur", "4px");
                    themeManager.setVariable("--neon-glow-size", "10px");
                } else {
                    // Efeitos normais
                    themeManager.setVariable("--glass-blur", "12px");
                    themeManager.setVariable("--neon-glow-size", "20px");
                }
            }
        };

        const interval = setInterval(checkPerformance, 5000);
        return () => clearInterval(interval);
    }, []);
}
```

---

## 📱 **Responsive Variables**

### 📐 **Variables por Breakpoint**

```css
/* Valores responsivos com CSS variables */
:root {
    /* Mobile */
    --card-padding: 1rem;
    --grid-gap: 0.5rem;
    --font-scale: 1;
}

@media (min-width: 768px) {
    :root {
        /* Tablet */
        --card-padding: 1.5rem;
        --grid-gap: 1rem;
        --font-scale: 1.1;
    }
}

@media (min-width: 1024px) {
    :root {
        /* Desktop */
        --card-padding: 2rem;
        --grid-gap: 1.5rem;
        --font-scale: 1.2;
    }
}

/* Uso nos componentes */
.tournament-card {
    padding: var(--card-padding);
    font-size: calc(1rem * var(--font-scale));
}

.tournament-grid {
    gap: var(--grid-gap);
}
```

### 🔧 **Container Query Variables**

```css
/* Futuro: CSS Container Queries + Variables */
@container poker-table (min-width: 800px) {
    .poker-table {
        --player-size: 80px;
        --card-size: 60px;
    }
}

@container poker-table (max-width: 400px) {
    .poker-table {
        --player-size: 40px;
        --card-size: 30px;
    }
}
```

---

## 🎯 **Performance e Otimização**

### ⚡ **Variables vs Inline Styles**

```tsx
// ❌ Evitar - Inline styles causam re-renders
function BadComponent({ color }: { color: string }) {
    return <div style={{ backgroundColor: color }}>Content</div>;
}

// ✅ Melhor - CSS variables são mais eficientes
function GoodComponent({ color }: { color: string }) {
    useEffect(() => {
        document.documentElement.style.setProperty("--dynamic-color", color);
    }, [color]);

    return <div className="bg-[var(--dynamic-color)]">Content</div>;
}
```

### 🚀 **Batching de Updates**

```typescript
// lib/theme-batch-updater.ts
class ThemeBatchUpdater {
    private updates: Map<string, string> = new Map();
    private rafId: number | null = null;

    setVariable(name: string, value: string) {
        this.updates.set(name, value);

        if (!this.rafId) {
            this.rafId = requestAnimationFrame(() => {
                this.applyUpdates();
                this.rafId = null;
            });
        }
    }

    private applyUpdates() {
        const root = document.documentElement;

        for (const [name, value] of this.updates) {
            root.style.setProperty(name, value);
        }

        this.updates.clear();
    }
}
```

---

## 🔗 **Integração com Tailwind**

### 🎨 **Tailwind + CSS Variables**

```javascript
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--color-primary) / <alpha-value>)",
                secondary: "rgb(var(--color-secondary) / <alpha-value>)",
                accent: "rgb(var(--color-accent) / <alpha-value>)",
            },
            spacing: {
                "dynamic-sm": "var(--spacing-sm)",
                "dynamic-md": "var(--spacing-md)",
                "dynamic-lg": "var(--spacing-lg)",
            },
            fontSize: {
                "dynamic-base": "var(--font-size-base)",
                "dynamic-lg": "var(--font-size-lg)",
            },
        },
    },
};
```

### 🔧 **Plugin Customizado**

```javascript
// tailwind-plugins/css-variables.js
const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ addUtilities, theme }) {
    const newUtilities = {
        ".glass-default": {
            backgroundColor: "var(--glass-bg)",
            borderColor: "var(--glass-border)",
            backdropFilter: "blur(var(--glass-blur))",
        },
        ".neon-glow": {
            textShadow: `
        0 0 5px rgb(var(--neon-color)),
        0 0 var(--neon-glow-size) rgb(var(--neon-color))
      `,
        },
    };

    addUtilities(newUtilities);
});
```

---

## 🛠️ **Debugging e DevTools**

### 🔍 **CSS Variables Inspector**

```javascript
// DevTools helper para debug
function inspectCSSVariables() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const variables = {};

    for (let i = 0; i < computedStyle.length; i++) {
        const prop = computedStyle[i];
        if (prop.startsWith("--")) {
            variables[prop] = computedStyle.getPropertyValue(prop).trim();
        }
    }

    console.table(variables);
    return variables;
}

// Executar no console: inspectCSSVariables()
```

### 📊 **Theme Performance Monitor**

```typescript
// lib/theme-monitor.ts
export class ThemePerformanceMonitor {
    private startTime: number = 0;
    private observer: PerformanceObserver;

    constructor() {
        this.observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (
                    entry.name.includes("style") ||
                    entry.name.includes("layout")
                ) {
                    console.log(`Theme change impact: ${entry.duration}ms`);
                }
            });
        });

        this.observer.observe({ entryTypes: ["measure", "navigation"] });
    }

    measureThemeChange(callback: () => void) {
        const measureName = `theme-change-${Date.now()}`;
        performance.mark(`${measureName}-start`);

        callback();

        requestAnimationFrame(() => {
            performance.mark(`${measureName}-end`);
            performance.measure(
                measureName,
                `${measureName}-start`,
                `${measureName}-end`
            );
        });
    }
}
```

---

## 🎯 **Melhores Práticas**

### ✅ **Do's (Faça)**

1. **Organize variables por contexto**

    ```css
    :root {
        /* === CORES === */
        --color-primary: 59 130 246;

        /* === ESPACAMENTOS === */
        --spacing-sm: 0.5rem;

        /* === ANIMAÇÕES === */
        --duration-fast: 150ms;
    }
    ```

2. **Use convenção de nomenclatura**

    ```css
    /* Padrão: --[categoria]-[elemento]-[modificador] */
    --color-primary-500
    --spacing-card-padding
    --animation-fade-duration
    ```

3. **Forneça fallbacks**
    ```css
    .element {
        color: rgb(59 130 246); /* fallback */
        color: rgb(var(--color-primary, 59 130 246));
    }
    ```

### ❌ **Don'ts (Evite)**

1. **Não abuse de !important**

    ```css
    /* ❌ Evitar */
    :root {
        --color-primary: 255 0 0 !important;
    }
    ```

2. **Não use unidades incompatíveis**

    ```css
    /* ❌ Evitar misturar unidades */
    --size: 16px;
    font-size: calc(var(--size) + 2rem); /* problemático */

    /* ✅ Melhor */
    --size-base: 1rem;
    font-size: calc(var(--size-base) * 1.2);
    ```

---

## 🔗 **Recursos Úteis**

### 📚 **Documentação**

-   [CSS Custom Properties - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
-   [CSS Variables Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
-   [Tailwind CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)

### 🛠️ **Ferramentas**

-   [CSS Variables Polyfill](https://github.com/jhildenbiddle/css-vars-ponyfill)
-   [PostCSS Custom Properties](https://github.com/postcss/postcss-custom-properties)
-   [CSS Variable Inspector](https://chrome.google.com/webstore/detail/css-variable-inspector)

---

## 🚀 **Próximos Passos**

Continue explorando temas dinâmicos:

1. **[🔄 Animações](../ui-components/animations.md)** - Animar mudanças de tema
2. **[🚀 Performance](../architecture/performance.md)** - Otimizar temas em produção
3. **[🎨 Design System](../architecture/design-system.md)** - Escalabilidade de temas

---

_🎯 **Meta**: Criar sistemas de design flexíveis que se adaptam dinamicamente às necessidades do usuário._
