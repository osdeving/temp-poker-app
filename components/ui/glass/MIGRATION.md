# Migration Guide: Old Components → Glass Library

This guide shows how to migrate existing components to use the new Glass Components Library.

## 🔄 Migration Example

### Before: Using old neon.tsx components

```tsx
// OLD WAY - Using the monolithic neon.tsx file
import { UltraGlassCard, NeonText, NeonButton } from "@/components/ui/neon";

function OldComponent() {
    return (
        <UltraGlassCard variant="emerald" className="p-6">
            <NeonText color="green" className="text-xl font-bold mb-4">
                Old Component Style
            </NeonText>
            <p className="text-gray-400 mb-6">
                This uses the old monolithic component system
            </p>
            <NeonButton variant="success">Old Button</NeonButton>
        </UltraGlassCard>
    );
}
```

### After: Using Glass Library

```tsx
// NEW WAY - Using the modular glass library
import { GlassCard, NeonText, NeonButton } from "@/components/ui/glass";

function NewComponent() {
    return (
        <GlassCard variant="emerald" blur="medium" hover={true} className="p-6">
            <NeonText color="green" size="xl" className="font-bold mb-4">
                New Component Style
            </NeonText>
            <p className="text-gray-400 mb-6">
                This uses the new modular glass library with better
                configuration
            </p>
            <NeonButton variant="success">New Button</NeonButton>
        </GlassCard>
    );
}
```

## 📊 Migration Table

| Old Component     | New Component | Key Changes                                 |
| ----------------- | ------------- | ------------------------------------------- |
| `UltraGlassCard`  | `GlassCard`   | More configurable blur levels               |
| `NeonCard`        | `GlassCard`   | Unified glass component                     |
| `MirrorCard`      | `GlassCard`   | Single component for all glass effects      |
| `HolographicCard` | `GlassCard`   | Use `variant="amethyst"` for similar effect |
| `NeonText`        | `NeonText`    | Added size prop, more colors                |
| `NeonButton`      | `NeonButton`  | Same API, better performance                |

## 🎯 Benefits of Migration

### ✅ Advantages

-   **Better Performance** - Optimized components
-   **More Configurable** - Granular control over effects
-   **Type Safety** - Better TypeScript support
-   **Maintainable** - Modular structure
-   **Reusable** - Easy to use in other projects

### 🚨 Breaking Changes

-   `UltraGlassCard` → `GlassCard` (prop changes)
-   Some variant names changed
-   New blur intensity system

## 🛠️ Step-by-Step Migration

### 1. Update Imports

```tsx
// OLD
import { UltraGlassCard, NeonText } from "@/components/ui/neon";

// NEW
import { GlassCard, NeonText } from "@/components/ui/glass";
```

### 2. Update Component Usage

```tsx
// OLD
<UltraGlassCard variant="crystal">
  <NeonText color="cyan">Text</NeonText>
</UltraGlassCard>

// NEW
<GlassCard variant="crystal" blur="medium" hover={true}>
  <NeonText color="cyan" size="md" glow={true}>Text</NeonText>
</GlassCard>
```

### 3. Update Props

| Old Prop         | New Prop            | Notes            |
| ---------------- | ------------------- | ---------------- |
| No blur control  | `blur="medium"`     | Now configurable |
| Automatic hover  | `hover={true}`      | Now optional     |
| Fixed reflection | `reflection={true}` | Now optional     |
| No size control  | `size="md"`         | For NeonText     |

## 🎨 Advanced Migration Examples

### Dashboard Card Migration

```tsx
// BEFORE
function OldDashboardCard({ title, value, icon }) {
    return (
        <UltraGlassCard variant="sapphire" className="p-6">
            <div className="flex items-center justify-between mb-4">
                <NeonText color="cyan" className="text-lg font-semibold">
                    {title}
                </NeonText>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </UltraGlassCard>
    );
}

// AFTER
function NewDashboardCard({ title, value, icon }) {
    return (
        <GlassCard variant="sapphire" blur="light" hover={true} className="p-6">
            <div className="flex items-center justify-between mb-4">
                <NeonText color="blue" size="lg" intensity="high">
                    {title}
                </NeonText>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </GlassCard>
    );
}
```

### Modal Migration

```tsx
// BEFORE - Custom modal implementation
function OldModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <UltraGlassCard className="max-w-lg w-full m-4">
                <button onClick={onClose}>×</button>
                {children}
            </UltraGlassCard>
        </div>
    );
}

// AFTER - Using built-in GlassModal
import { GlassModal } from "@/components/ui/glass";

function NewModal({ isOpen, onClose, title, children }) {
    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant="crystal"
            blur="heavy"
            size="md"
        >
            {children}
        </GlassModal>
    );
}
```

## 🧪 Testing Migration

1. **Visual Testing**

    - Compare old vs new components side by side
    - Check hover effects and animations
    - Verify responsive behavior

2. **Performance Testing**

    - Monitor rendering performance
    - Check bundle size impact
    - Test on mobile devices

3. **Accessibility Testing**
    - Verify keyboard navigation
    - Test with screen readers
    - Check color contrast ratios

## 🚀 Quick Migration Script

Use this script to help automate the migration:

```bash
# Find and list all files using old components
grep -r "UltraGlassCard\|NeonCard\|MirrorCard" src/ --include="*.tsx" --include="*.ts"

# Replace imports (review before running)
find src/ -name "*.tsx" -exec sed -i 's/@\/components\/ui\/neon/@\/components\/ui\/glass/g' {} \;
```

## 📝 Migration Checklist

-   [ ] Update all imports
-   [ ] Replace component names
-   [ ] Update prop usage
-   [ ] Test visual appearance
-   [ ] Check hover/interaction effects
-   [ ] Verify responsive behavior
-   [ ] Test performance impact
-   [ ] Update documentation
-   [ ] Remove old component dependencies

## 💡 Migration Tips

1. **Gradual Migration** - Migrate one component at a time
2. **Side-by-Side Testing** - Keep old components temporarily for comparison
3. **Performance Monitoring** - Check for any performance regressions
4. **User Testing** - Ensure the new components feel as good as the old ones
5. **Documentation** - Update any component documentation

## 🆘 Troubleshooting

### Common Issues

**Components look different after migration:**

-   Check blur intensity settings
-   Verify variant mappings
-   Compare hover effects

**TypeScript errors:**

-   Update prop types
-   Check import statements
-   Verify component interfaces

**Performance issues:**

-   Use lighter blur settings
-   Disable animations where not needed
-   Check for unnecessary re-renders

## 📞 Support

If you encounter issues during migration:

1. Check the component showcase for examples
2. Review the full documentation
3. Compare with working examples in the codebase
4. Test with minimal props first, then add complexity
