# 🎨 Layout Systems - CSS Grid & Flexbox Modernos

> **Dominando sistemas de layout responsivos e performáticos**

---

## 🎯 **Visão Geral**

Este guia explica como utilizamos **CSS Grid** e **Flexbox** de forma otimizada no projeto, com foco em:

-   **Layouts responsivos** fluidos
-   **Performance** e renderização eficiente
-   **Manutenibilidade** com Tailwind utilities
-   **Padrões modernos** de estruturação

---

## 🔧 **CSS Grid - Layout 2D**

### 📐 **Casos de Uso Principais**

#### 1. **Dashboard Layout**

```tsx
// app/dashboard/page.tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {stats.map((stat) => (
        <GlassCard key={stat.id} className="p-6">
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
        </GlassCard>
    ))}
</div>
```

**Resultado**: Grid responsivo que adapta de 1 coluna (mobile) a 4 colunas (desktop)

#### 2. **Tournament Grid**

```tsx
// app/tournaments/page.tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="space-y-6">
        {liveTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} {...tournament} />
        ))}
    </div>
    <div className="space-y-6">
        {upcomingTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} {...tournament} />
        ))}
    </div>
</div>
```

#### 3. **Complex Grid Areas**

```css
/* Layout de poker table complexo */
.poker-table-grid {
    display: grid;
    grid-template-areas:
        "player1 pot player2"
        "cards  cards cards"
        "player3 actions player4";
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 1rem;
    height: 100vh;
}

.pot-area {
    grid-area: pot;
}
.cards-area {
    grid-area: cards;
}
.actions-area {
    grid-area: actions;
}
```

### 🎯 **Tailwind Grid Classes**

| Classe         | CSS Equivalente                                     | Uso                      |
| -------------- | --------------------------------------------------- | ------------------------ |
| `grid-cols-1`  | `grid-template-columns: repeat(1, minmax(0, 1fr))`  | 1 coluna                 |
| `grid-cols-12` | `grid-template-columns: repeat(12, minmax(0, 1fr))` | 12 colunas               |
| `col-span-2`   | `grid-column: span 2 / span 2`                      | Elemento ocupa 2 colunas |
| `col-start-3`  | `grid-column-start: 3`                              | Inicia na coluna 3       |
| `row-span-2`   | `grid-row: span 2 / span 2`                         | Elemento ocupa 2 linhas  |

---

## 💪 **Flexbox - Layout 1D**

### 🎯 **Padrões Comuns**

#### 1. **Navbar Layout**

```tsx
// components/layout/navbar.tsx
<nav className="flex items-center justify-between px-6 py-4">
    <div className="flex items-center space-x-4">
        <Logo />
        <NavLinks />
    </div>
    <div className="flex items-center space-x-2">
        <UserProfile />
        <ThemeToggle />
    </div>
</nav>
```

#### 2. **Card Content**

```tsx
// components/tournament/tournament-card.tsx
<GlassCard className="p-6">
    <div className="flex flex-col h-full">
        <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
            <p className="text-gray-300 mb-4">{tournament.description}</p>
        </div>
        <div className="flex justify-between items-center mt-auto">
            <Badge>{tournament.status}</Badge>
            <Button>Join Tournament</Button>
        </div>
    </div>
</GlassCard>
```

#### 3. **Center Content**

```tsx
// Pattern para centralização perfeita
<div className="flex items-center justify-center min-h-screen">
    <div className="w-full max-w-md">
        <LoginForm />
    </div>
</div>
```

### 🔄 **Flex Utilities Avançadas**

```css
/* Distribuição de espaço */
.space-between {
    justify-content: space-between;
}
.space-around {
    justify-content: space-around;
}
.space-evenly {
    justify-content: space-evenly;
}

/* Crescimento/Encolhimento */
.flex-1 {
    flex: 1 1 0%;
} /* Cresce e encolhe igualmente */
.flex-auto {
    flex: 1 1 auto;
} /* Cresce baseado no conteúdo */
.flex-none {
    flex: none;
} /* Não cresce nem encolhe */

/* Alinhamento individual */
.self-start {
    align-self: flex-start;
}
.self-center {
    align-self: center;
}
.self-end {
    align-self: flex-end;
}
.self-stretch {
    align-self: stretch;
}
```

---

## 📱 **Responsividade Avançada**

### 🎯 **Mobile-First Strategy**

```tsx
// Estratégia mobile-first com breakpoints progressivos
<div
    className="
  flex flex-col gap-4          /* Mobile: stack vertical */
  md:flex-row md:gap-8         /* Tablet: horizontal */
  lg:grid lg:grid-cols-3       /* Desktop: grid 3 colunas */
  xl:grid-cols-4               /* Large: grid 4 colunas */
"
>
    {items.map((item) => (
        <Item key={item.id} {...item} />
    ))}
</div>
```

### 📐 **Breakpoints do Tailwind**

| Prefix | Min Width | Descrição                |
| ------ | --------- | ------------------------ |
| `sm:`  | 640px     | Small devices            |
| `md:`  | 768px     | Medium devices (tablets) |
| `lg:`  | 1024px    | Large devices (laptops)  |
| `xl:`  | 1280px    | Extra large devices      |
| `2xl:` | 1536px    | 2X large devices         |

### 🔧 **Container Queries (Futuro)**

```css
/* Próxima versão - CSS Container Queries */
@container poker-table (min-width: 800px) {
    .player-position {
        display: grid;
        grid-template-columns: auto 1fr auto;
    }
}
```

---

## 🚀 **Performance e Otimização**

### ⚡ **CSS Grid vs Flexbox Performance**

| Aspecto             | CSS Grid   | Flexbox    | Recomendação       |
| ------------------- | ---------- | ---------- | ------------------ |
| **Layout 2D**       | ⭐⭐⭐⭐⭐ | ⭐⭐       | Use Grid           |
| **Layout 1D**       | ⭐⭐       | ⭐⭐⭐⭐⭐ | Use Flexbox        |
| **Responsividade**  | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | Ambos excelentes   |
| **Browser Support** | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | Flexbox mais amplo |

### 🎯 **Otimizações Específicas**

```css
/* ✅ BOM - Evita layout shifts */
.tournament-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    min-height: 400px; /* Define altura mínima */
}

/* ✅ BOM - Força compositing layer para animações */
.animated-card {
    display: flex;
    transform: translateZ(0); /* GPU acceleration */
    will-change: transform;
}

/* ❌ EVITAR - Layout thrashing */
.bad-layout {
    display: flex;
    width: calc(100% - 20px); /* Evite calc desnecessário */
}
```

---

## 🎮 **Casos de Uso Específicos do Projeto**

### 🃏 **Poker Table Layout**

```tsx
// components/poker/poker-table-premium.tsx
<div className="relative w-full aspect-[16/10] bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-3xl overflow-hidden">
    {/* Grid para posições dos jogadores */}
    <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 gap-4">
        <div className="col-start-2 row-start-1 flex justify-center">
            <PlayerPosition position="top" />
        </div>
        <div className="col-start-1 row-start-2 flex items-center">
            <PlayerPosition position="left" />
        </div>
        <div className="col-start-2 row-start-2 flex items-center justify-center">
            <CommunityCards />
        </div>
        <div className="col-start-3 row-start-2 flex items-center justify-end">
            <PlayerPosition position="right" />
        </div>
        <div className="col-start-2 row-start-3 flex justify-center items-end">
            <PlayerPosition position="bottom" />
        </div>
    </div>
</div>
```

### 📊 **Dashboard Stats Grid**

```tsx
// app/dashboard/page.tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard
        title="Total Games"
        value={stats.totalGames}
        change="+12%"
        trend="up"
    />
    <StatCard
        title="Win Rate"
        value={`${stats.winRate}%`}
        change="+2.3%"
        trend="up"
    />
    <StatCard
        title="Best Streak"
        value={stats.bestStreak}
        change="Personal record"
        trend="neutral"
    />
    <StatCard
        title="Total Winnings"
        value={`$${stats.totalWinnings}`}
        change="+$1,250"
        trend="up"
    />
</div>
```

### 🎯 **Tournament List Layout**

```tsx
// app/tournaments/page.tsx
<div className="space-y-8">
    {/* Header com filtros */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Tournaments</h1>
        <div className="flex flex-wrap gap-2">
            <FilterButton>All</FilterButton>
            <FilterButton>Live</FilterButton>
            <FilterButton>Upcoming</FilterButton>
        </div>
    </div>

    {/* Grid responsivo de torneios */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} {...tournament} />
        ))}
    </div>
</div>
```

---

## 🎨 **Patterns Avançados**

### 🔄 **Auto-fit vs Auto-fill**

```css
/* auto-fit - Expande itens para preencher espaço */
.grid-auto-fit {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

/* auto-fill - Mantém largura mínima, cria colunas vazias */
.grid-auto-fill {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}
```

### 📐 **Subgrid (CSS Futurística)**

```css
/* Quando disponível - alinhamento perfeito em nested grids */
.tournament-card {
    display: grid;
    grid-template-rows: subgrid; /* Herda estrutura do pai */
    grid-row: span 3;
}
```

### 🎯 **Masonry Layout com CSS**

```css
/* Layout tipo Pinterest (experimental) */
.masonry-grid {
    columns: 3;
    column-gap: 1rem;
    column-fill: balance;
}

.masonry-item {
    break-inside: avoid;
    margin-bottom: 1rem;
}
```

---

## 🔧 **Debugging e Ferramentas**

### 🔍 **Visualização de Grid**

```css
/* Debug grid lines */
.debug-grid {
    background-image: linear-gradient(
            rgba(255, 0, 0, 0.1) 1px,
            transparent 1px
        ), linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
}
```

### 🛠️ **DevTools Tips**

```javascript
// Console helper para debug de flexbox
function debugFlex(element) {
    const styles = getComputedStyle(element);
    console.log({
        display: styles.display,
        flexDirection: styles.flexDirection,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems,
        flexWrap: styles.flexWrap,
    });
}

// Uso: debugFlex(document.querySelector('.my-flex-container'))
```

---

## 🎯 **Melhores Práticas**

### ✅ **Do's (Faça)**

1. **Use CSS Grid para layouts 2D**

    ```tsx
    <div className="grid grid-cols-3 gap-4">
        <aside>Sidebar</aside>
        <main>Content</main>
        <aside>Widgets</aside>
    </div>
    ```

2. **Use Flexbox para componentes 1D**

    ```tsx
    <div className="flex items-center justify-between">
        <h1>Title</h1>
        <button>Action</button>
    </div>
    ```

3. **Combine ambos quando apropriado**
    ```tsx
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
            <div key={card.id} className="flex flex-col h-full">
                <div className="flex-1">{card.content}</div>
                <div className="mt-auto">{card.actions}</div>
            </div>
        ))}
    </div>
    ```

### ❌ **Don'ts (Evite)**

1. **Não use float para layouts modernos**

    ```css
    /* ❌ Evitar - float é legacy */
    .old-layout {
        float: left;
    }

    /* ✅ Use - flexbox ou grid */
    .modern-layout {
        display: flex;
    }
    ```

2. **Não abuse de position absolute**

    ```css
    /* ❌ Dificulta responsividade */
    .bad-position {
        position: absolute;
        top: 20px;
        left: 50%;
    }

    /* ✅ Use sistemas de layout */
    .good-layout {
        display: grid;
        place-items: center;
    }
    ```

---

## 📊 **Comparação de Abordagens**

| Situação             | CSS Grid | Flexbox | Tailwind Classes                                                |
| -------------------- | -------- | ------- | --------------------------------------------------------------- |
| **Cards em linha**   | ❌       | ✅      | `flex space-x-4`                                                |
| **Dashboard 2D**     | ✅       | ❌      | `grid grid-cols-3`                                              |
| **Navbar**           | ❌       | ✅      | `flex justify-between`                                          |
| **Centralização**    | ✅       | ✅      | `grid place-items-center` ou `flex items-center justify-center` |
| **Lista responsiva** | ✅       | ❌      | `grid grid-cols-1 md:grid-cols-3`                               |

---

## 🔗 **Recursos Adicionais**

### 📚 **Documentação**

-   [CSS Grid Complete Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
-   [Flexbox Complete Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
-   [Tailwind Layout Docs](https://tailwindcss.com/docs/display)

### 🎮 **Jogos e Prática**

-   [Flexbox Froggy](https://flexboxfroggy.com/) - Aprenda flexbox brincando
-   [Grid Garden](https://cssgridgarden.com/) - Aprenda grid de forma divertida
-   [Flexbox Defense](http://www.flexboxdefense.com/) - Tower defense com CSS

### 🛠️ **Ferramentas**

-   [CSS Grid Generator](https://cssgrid-generator.netlify.app/)
-   [Flexbox Patterns](https://www.flexboxpatterns.com/)
-   [Layout Land (YouTube)](https://www.youtube.com/c/LayoutLand)

---

## 🚀 **Próximos Passos**

Continue aprofundando em layouts modernos:

1. **[🎨 CSS Variables](./css-variables.md)** - Temas dinâmicos
2. **[🔄 Animações](../ui-components/animations.md)** - Layout com movimento
3. **[🚀 Performance](../architecture/performance.md)** - Otimizações avançadas

---

_🎯 **Meta**: Dominar layouts modernos para criar interfaces fluidas e responsivas._
