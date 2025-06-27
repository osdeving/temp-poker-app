# Glass Components Library 🌟

A modern, reusable library of premium glass and neon UI components built with React, TypeScript, and Tailwind CSS.

## ✨ Features

-   **🪟 Glass Morphism Effects** - Beautiful glass-like cards with customizable blur levels
-   **💫 Neon Text & Buttons** - Glowing text and interactive buttons with multiple color variants
-   **🎨 Highly Customizable** - Extensive configuration options for blur, colors, and effects
-   **📱 Fully Responsive** - Optimized for all screen sizes
-   **♿ Accessible** - Built with accessibility best practices
-   **⚡ Performance Optimized** - Lightweight and fast rendering
-   **🎯 TypeScript Support** - Fully typed for better development experience

## 🚀 Quick Start

### Installation

Copy the glass components directory to your project:

```bash
cp -r components/ui/glass /your-project/components/ui/
```

### Basic Usage

```tsx
import { GlassCard, NeonText, NeonButton } from "@/components/ui/glass";

export default function MyComponent() {
    return (
        <GlassCard variant="crystal" blur="medium">
            <NeonText color="cyan" size="lg">
                Welcome to Glass Components!
            </NeonText>
            <NeonButton variant="primary" size="md">
                Get Started
            </NeonButton>
        </GlassCard>
    );
}
```

## 📚 Components

### GlassCard

A premium glass morphism card component with customizable blur and visual effects.

```tsx
<GlassCard
    variant="crystal" // crystal | diamond | sapphire | emerald | ruby | amethyst
    blur="medium" // none | light | medium | heavy | extreme
    hover={true} // Enable hover effects
    reflection={true} // Enable reflection effects
    border={true} // Enable border
    animation={true} // Enable entrance animations
    className="p-6"
>
    Content goes here
</GlassCard>
```

#### Props

| Prop         | Type            | Default     | Description             |
| ------------ | --------------- | ----------- | ----------------------- |
| `variant`    | `GlassVariant`  | `"crystal"` | Visual style variant    |
| `blur`       | `BlurIntensity` | `"medium"`  | Backdrop blur intensity |
| `hover`      | `boolean`       | `true`      | Enable hover effects    |
| `reflection` | `boolean`       | `true`      | Enable glass reflection |
| `border`     | `boolean`       | `true`      | Show border             |
| `animation`  | `boolean`       | `true`      | Enable animations       |
| `className`  | `string`        | -           | Additional CSS classes  |

### NeonText

Glowing text component with customizable colors and effects.

```tsx
<NeonText
    color="cyan" // pink | cyan | green | red | blue | purple | orange | yellow
    intensity="medium" // low | medium | high
    glow={true} // Enable glow effect
    size="lg" // sm | md | lg | xl | 2xl
>
    Glowing Text
</NeonText>
```

#### Props

| Prop        | Type                                    | Default    | Description            |
| ----------- | --------------------------------------- | ---------- | ---------------------- |
| `color`     | `NeonColor`                             | `"cyan"`   | Neon color variant     |
| `intensity` | `"low" \| "medium" \| "high"`           | `"medium"` | Glow intensity         |
| `glow`      | `boolean`                               | `true`     | Enable glow effect     |
| `size`      | `"sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"`     | Text size              |
| `className` | `string`                                | -          | Additional CSS classes |

### NeonButton

Interactive button with neon glow effects and hover animations.

```tsx
<NeonButton
    variant="primary" // primary | secondary | danger | success
    size="md" // sm | md | lg
    onClick={handleClick}
    disabled={false}
>
    Click Me
</NeonButton>
```

#### Props

| Prop        | Type                                                | Default     | Description            |
| ----------- | --------------------------------------------------- | ----------- | ---------------------- |
| `variant`   | `"primary" \| "secondary" \| "danger" \| "success"` | `"primary"` | Button style variant   |
| `size`      | `"sm" \| "md" \| "lg"`                              | `"md"`      | Button size            |
| `onClick`   | `() => void`                                        | -           | Click handler          |
| `disabled`  | `boolean`                                           | `false`     | Disabled state         |
| `className` | `string`                                            | -           | Additional CSS classes |

## 🎨 Customization

### Glass Variants

-   **Crystal** - Clear with white highlights
-   **Diamond** - Blue-cyan tinted glass
-   **Sapphire** - Deep blue glass effect
-   **Emerald** - Green-tinted glass
-   **Ruby** - Red-pink glass effect
-   **Amethyst** - Purple glass variant

### Blur Intensities

-   **None** - `backdrop-blur-[0px]` - No blur effect
-   **Light** - `backdrop-blur-[2px]` - Subtle blur
-   **Medium** - `backdrop-blur-[6px]` - Balanced blur
-   **Heavy** - `backdrop-blur-[12px]` - Strong blur
-   **Extreme** - `backdrop-blur-[20px]` - Maximum blur

### Neon Colors

-   **Pink** - Hot pink with magenta glow
-   **Cyan** - Electric cyan blue
-   **Green** - Bright neon green
-   **Red** - Vibrant red glow
-   **Blue** - Electric blue
-   **Purple** - Rich purple neon
-   **Orange** - Warm orange glow
-   **Yellow** - Bright yellow neon

## 🛠️ Configuration

The library uses a centralized configuration system. You can customize the entire library by modifying `config.ts`:

```tsx
import { glassConfig } from "@/components/ui/glass/config";

// Access configuration
const crystalVariant = glassConfig.variants.crystal;
const mediumBlur = glassConfig.blur.medium;
const cyanColor = glassConfig.neonColors.cyan;
```

### Custom Configuration

Create your own variants by extending the configuration:

```tsx
const customConfig = {
    ...glassConfig,
    variants: {
        ...glassConfig.variants,
        custom: {
            bg: "bg-gradient-to-br from-yellow-400/20 to-orange-500/15",
            border: "border-yellow-400/50",
            glow: "hover:shadow-[0_0_50px_rgba(251,191,36,0.4)]",
            highlight: "after:via-yellow-400/60",
        },
    },
};
```

## 🎭 Interactive Demo

Visit the interactive showcase to see all components in action and experiment with different configurations:

```bash
# Navigate to the showcase
/interactive-showcase
```

The showcase includes:

-   **Live component preview**
-   **Real-time configuration controls**
-   **All variants and colors**
-   **Interactive sliders and toggles**

## 📦 Dependencies

-   **React** ^18.0.0
-   **TypeScript** ^5.0.0
-   **Tailwind CSS** ^3.0.0
-   **@/lib/utils** (cn function for class merging)

## 🎯 Usage Examples

### Landing Page Hero

```tsx
function Hero() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            <GlassCard
                variant="crystal"
                blur="medium"
                className="p-12 text-center"
            >
                <NeonText color="cyan" size="2xl" className="mb-6">
                    Welcome to the Future
                </NeonText>
                <p className="text-gray-300 mb-8">
                    Experience premium glass morphism design
                </p>
                <NeonButton variant="primary" size="lg">
                    Get Started
                </NeonButton>
            </GlassCard>
        </div>
    );
}
```

### Dashboard Card

```tsx
function StatsCard({ title, value, trend }) {
    return (
        <GlassCard variant="sapphire" blur="light" className="p-6">
            <div className="flex justify-between items-start mb-4">
                <NeonText color="blue" size="md">
                    {title}
                </NeonText>
                <span className={trend > 0 ? "text-green-400" : "text-red-400"}>
                    {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}%
                </span>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </GlassCard>
    );
}
```

### Navigation Menu

```tsx
function Navigation() {
    return (
        <GlassCard variant="crystal" blur="heavy" className="p-4 flex gap-4">
            <NeonButton variant="primary" size="sm">
                Home
            </NeonButton>
            <NeonButton variant="secondary" size="sm">
                About
            </NeonButton>
            <NeonButton variant="secondary" size="sm">
                Contact
            </NeonButton>
        </GlassCard>
    );
}
```

## 🎨 Best Practices

### Performance

-   Use appropriate blur levels (avoid "extreme" for better performance)
-   Limit the number of animated components on screen
-   Use `animation={false}` for static layouts

### Accessibility

-   Ensure sufficient contrast ratios
-   Provide alternative text for visual elements
-   Test with screen readers

### Design

-   Use consistent variants across related components
-   Choose blur levels based on content readability
-   Combine glass effects sparingly for best visual impact

## 🐛 Troubleshooting

### Common Issues

**Components not rendering correctly:**

-   Ensure Tailwind CSS is properly configured
-   Check that all required dependencies are installed
-   Verify the `cn` utility function is available

**Blur effects not working:**

-   Confirm Tailwind's backdrop-blur classes are not purged
-   Check browser support for backdrop-filter

**TypeScript errors:**

-   Ensure all types are properly imported
-   Verify component props match the interface definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

## 🙏 Acknowledgments

-   Built with modern web technologies
-   Inspired by glassmorphism design trends
-   Optimized for performance and accessibility

---

Made with ❤️ for the developer community
