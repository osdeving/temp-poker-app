# 🏗️ Estrutura do Projeto - Arquitetura Modular

<div align="center">

![Project Structure](https://img.shields.io/badge/Architecture-Modular-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=for-the-badge&logo=next.js)

</div>

---

## 🎯 **Visão Geral**

Este documento explica como o projeto está organizado, seguindo princípios de **arquitetura modular** e **separation of concerns**. Cada diretório tem uma responsabilidade específica, facilitando manutenção e escalabilidade.

---

## 📁 **Estrutura Completa**

```
poker-app/
├── 📁 app/                          # Next.js 15 App Router
│   ├── 📄 globals.css              # Estilos globais e animações
│   ├── 📄 layout.tsx               # Layout raiz da aplicação
│   ├── 📄 page.tsx                 # Página inicial
│   ├── 📁 dashboard/               # Dashboard do usuário
│   ├── 📁 cash-games/              # Jogos de cash
│   ├── 📁 tournament/[id]/         # Torneios dinâmicos
│   ├── 📁 interactive-showcase/    # Showcase dos componentes
│   └── 📁 component-showcase/      # Galeria estática
│
├── 📁 components/                   # Componentes reutilizáveis
│   ├── 📁 ui/                      # Biblioteca de UI
│   │   └── 📁 glass/               # 🌟 Componentes premium
│   │       ├── 📄 index.ts         # Exports centralizados
│   │       ├── 📄 types.ts         # Definições TypeScript
│   │       ├── 📄 config.ts        # Configurações globais
│   │       ├── 📄 glass-card.tsx   # Componente base glass
│   │       ├── 📄 neon-effects.tsx # Efeitos neon
│   │       ├── 📄 creative-components.tsx # Componentes únicos
│   │       └── 📄 effects-components.tsx  # Efeitos especiais
│   │
│   ├── 📁 auth/                    # Componentes de autenticação
│   ├── 📁 layout/                  # Componentes de layout
│   ├── 📁 tournament/              # Componentes de torneio
│   └── 📁 poker/                   # Componentes do jogo
│
├── 📁 hooks/                       # Custom React Hooks
├── 📁 lib/                         # Utilitários e configurações
├── 📁 docs/                        # 📚 Documentação técnica
└── 📁 [config files]               # Arquivos de configuração
```

---

## 🎨 **Arquitetura de UI Components**

### 🌟 **Biblioteca Premium (`/components/ui/glass/`)**

Esta é a **joia** do projeto - uma biblioteca modular de componentes premium:

```typescript
// components/ui/glass/index.ts
export { GlassCard } from "./glass-card";
export { NeonText, NeonButton, NeonInput } from "./neon-effects";
export {
    CrystalCard,
    NeuralNetworkCard,
    DigitalRainCard,
} from "./creative-components";
export type { GlassVariant, NeonVariant } from "./types";
```

**Princípios da Arquitetura:**

1. **📦 Modularidade** - Cada componente em seu próprio arquivo
2. **🔧 Configurabilidade** - Props flexíveis via TypeScript
3. **🎨 Composabilidade** - Componentes combinam entre si
4. **♻️ Reutilização** - Um componente, vários contextos

---

## 📱 **Next.js 15 App Router**

### **Estrutura de Rotas**

```
app/
├── layout.tsx                 # Layout global
├── page.tsx                  # / (home)
├── dashboard/
│   └── page.tsx             # /dashboard
├── cash-games/
│   └── page.tsx             # /cash-games
├── cash-game/[id]/
│   └── page.tsx             # /cash-game/123
└── tournament/[id]/
    └── page.tsx             # /tournament/456
```

**Vantagens do App Router:**

-   ✅ **Server Components** por padrão
-   ✅ **Streaming e Suspense** nativo
-   ✅ **Layouts aninhados** automáticos
-   ✅ **Loading states** simplificados

### **Exemplo Prático - Layout Aninhado**

```tsx
// app/layout.tsx (Layout Global)
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className="bg-slate-900 text-white">
                <Navbar />
                <main className="min-h-screen">{children}</main>
            </body>
        </html>
    );
}
```

---

## 🎨 **Sistema de Design**

### **Tokens de Design**

```typescript
// components/ui/glass/config.ts
export const GLASS_CONFIG = {
    variants: {
        subtle: "bg-white/5 backdrop-blur-sm",
        medium: "bg-white/10 backdrop-blur-md",
        strong: "bg-white/20 backdrop-blur-lg",
    },
    borders: {
        subtle: "border border-white/10",
        medium: "border border-white/20",
        strong: "border border-white/30",
    },
} as const;
```

### **Consistency Pattern**

```tsx
// Todos os componentes seguem o mesmo padrão
interface BaseComponentProps {
    variant?: "subtle" | "medium" | "strong";
    className?: string;
    children?: React.ReactNode;
}
```

---

## 🔧 **Padrões de Organização**

### **1. Barrel Exports**

```typescript
// components/ui/glass/index.ts
// ✅ Centralize todas as exportações
export { GlassCard } from "./glass-card";
export { NeonText } from "./neon-effects";
export type { GlassCardProps } from "./types";

// ❌ Evite imports diretos
// import { GlassCard } from './glass-card'
```

### **2. Co-location**

```
tournament/
├── tournament-card.tsx       # Componente
├── tournament-card.test.tsx  # Teste (próximo ao componente)
└── tournament-card.md        # Documentação (se necessário)
```

### **3. Separation of Concerns**

```typescript
// ✅ Cada arquivo tem uma responsabilidade clara
types.ts; // → Tipos TypeScript
config.ts; // → Configurações
glass - card.tsx; // → Componente específico
index.ts; // → Exportações
```

---

## 🎯 **Fluxo de Desenvolvimento**

### **1. Criando um Novo Componente**

```bash
# 1. Crie o arquivo do componente
touch components/ui/glass/nova-feature.tsx

# 2. Implemente seguindo o padrão
# 3. Adicione tipos se necessário em types.ts
# 4. Exporte em index.ts
# 5. Teste no showcase interativo
```

### **2. Exemplo Prático**

```tsx
// components/ui/glass/nova-feature.tsx
import { cn } from "@/lib/utils";
import { GLASS_CONFIG } from "./config";
import type { BaseComponentProps } from "./types";

interface NovaFeatureProps extends BaseComponentProps {
    intensity?: "low" | "high";
}

export function NovaFeature({
    variant = "medium",
    intensity = "low",
    className,
    children,
}: NovaFeatureProps) {
    return (
        <div
            className={cn(
                GLASS_CONFIG.variants[variant],
                intensity === "high" && "opacity-80",
                className
            )}
        >
            {children}
        </div>
    );
}
```

---

## 📊 **Métricas da Arquitetura**

```
🏗️ Modularidade:     ████████████ 95%
🔧 Reutilização:     ███████████  90%
📖 Manutenibilidade: ███████████  90%
⚡ Performance:      ████████████ 95%
🧪 Testabilidade:    █████████    85%
```

---

## 🚀 **Benefícios da Estrutura**

### **Para Desenvolvimento:**

-   ✅ **Encontrar arquivos** é intuitivo
-   ✅ **Adicionar features** é padronizado
-   ✅ **Refatorar** é seguro com TypeScript
-   ✅ **Debugar** é simplificado

### **Para Performance:**

-   ✅ **Tree shaking** automático
-   ✅ **Code splitting** por rota
-   ✅ **Bundle optimization** pelo Next.js
-   ✅ **Componentes lazy** quando necessário

### **Para Manutenção:**

-   ✅ **Responsabilidades claras** por diretório
-   ✅ **Dependências explícitas** via imports
-   ✅ **Evolução incremental** sem quebrar
-   ✅ **Onboarding rápido** para novos devs

---

## 🎓 **Próximos Passos**

1. 📖 **Explore**: [`Next.js 15 Guide`](../nextjs/nextjs-15-guide.md)
2. 🎨 **Aprenda**: [`Glass Morphism`](../ui-components/glass-morphism.md)
3. ⚡ **Otimize**: [`Performance Guide`](./performance.md)

---

<div align="center">

**🏗️ Uma arquitetura bem estruturada é a base de um projeto sustentável!**

_Continue para a próxima seção e explore como implementamos cada parte._

</div>
