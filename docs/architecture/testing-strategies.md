# 🧪 Testing Strategies - Garantindo Qualidade Premium

> **Estratégias e técnicas de teste para aplicações React/Next.js modernas**

---

## 🎯 **Filosofia de Testing**

Nossa abordagem de testes é baseada na **pirâmide de testes** moderna:

```
    🔺 E2E Tests (5%)
   🔺🔺 Integration Tests (25%)
  🔺🔺🔺 Unit Tests (70%)
```

### 🏗️ **Princípios**

1. **Teste comportamento, não implementação**
2. **Priorize testes que trazem confiança**
3. **Mantenha testes rápidos e determinísticos**
4. **Escreva testes que documentem o código**

---

## 🧪 **Unit Testing - Componentes**

### 🎨 **Testing Glass Components**

```tsx
// __tests__/components/ui/glass-card.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { GlassCard } from "@/components/ui/glass/glass-card";

describe("GlassCard", () => {
    it("renders children correctly", () => {
        render(
            <GlassCard>
                <div data-testid="content">Test content</div>
            </GlassCard>
        );

        expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("applies variant styles correctly", () => {
        const { container } = render(
            <GlassCard variant="intense" data-testid="glass-card">
                Content
            </GlassCard>
        );

        const card = screen.getByTestId("glass-card");
        expect(card).toHaveClass("bg-white/20");
        expect(card).toHaveClass("backdrop-blur-xl");
    });

    it("supports custom blur and opacity", () => {
        render(
            <GlassCard blur={20} opacity={0.3} data-testid="custom-glass">
                Content
            </GlassCard>
        );

        const card = screen.getByTestId("custom-glass");
        expect(card).toHaveStyle({
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
        });
    });

    it("handles hover interactions", async () => {
        const { user } = setup(
            <GlassCard className="hover:bg-white/30" data-testid="hover-card">
                Hoverable content
            </GlassCard>
        );

        const card = screen.getByTestId("hover-card");

        await user.hover(card);
        // Verificar mudanças visuais ou callbacks
    });
});

// Helper para setup com user-event
function setup(jsx: React.ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    };
}
```

### ✨ **Testing Neon Effects**

```tsx
// __tests__/components/ui/neon-effects.test.tsx
import { render, screen } from "@testing-library/react";
import { NeonText, NeonButton } from "@/components/ui/glass/neon-effects";

describe("NeonText", () => {
    it("renders with correct neon styles", () => {
        render(
            <NeonText color="cyan" intensity="normal" data-testid="neon-text">
                Cyber Text
            </NeonText>
        );

        const text = screen.getByTestId("neon-text");
        expect(text).toHaveStyle({
            color: "rgb(0, 255, 255)",
            textShadow: expect.stringContaining("rgb(0, 255, 255)"),
        });
    });

    it("supports different intensities", () => {
        const { rerender } = render(
            <NeonText intensity="subtle" data-testid="neon">
                Text
            </NeonText>
        );

        let text = screen.getByTestId("neon");
        expect(text).toHaveStyle({
            textShadow: expect.stringContaining("10px"),
        });

        rerender(
            <NeonText intensity="intense" data-testid="neon">
                Text
            </NeonText>
        );

        text = screen.getByTestId("neon");
        expect(text).toHaveStyle({
            textShadow: expect.stringContaining("30px"),
        });
    });
});

describe("NeonButton", () => {
    it("handles click events", async () => {
        const handleClick = jest.fn();
        const { user } = setup(
            <NeonButton onClick={handleClick}>Click me</NeonButton>
        );

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("can be disabled", () => {
        render(<NeonButton disabled>Disabled</NeonButton>);

        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
        expect(button).toHaveClass("opacity-50");
    });
});
```

---

## 🔗 **Integration Testing - Features**

### 🎮 **Testing Tournament Flow**

```tsx
// __tests__/features/tournament.integration.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TournamentPage } from "@/app/tournament/[id]/page";
import { mockTournamentApi } from "../__mocks__/api";

// Mock API
jest.mock("@/lib/api", () => ({
    tournaments: mockTournamentApi,
}));

describe("Tournament Feature", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
    });

    afterEach(() => {
        queryClient.clear();
    });

    function renderWithProviders(ui: React.ReactElement) {
        return render(
            <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
        );
    }

    it("displays tournament details and allows joining", async () => {
        const mockTournament = {
            id: "1",
            name: "Weekly Texas Hold'em",
            status: "registering",
            playerCount: 5,
            maxPlayers: 10,
            buyIn: 100,
        };

        mockTournamentApi.get.mockResolvedValue(mockTournament);

        const { user } = setup(
            renderWithProviders(<TournamentPage params={{ id: "1" }} />)
        );

        // Verificar loading state
        expect(screen.getByText("Loading tournament...")).toBeInTheDocument();

        // Aguardar dados carregarem
        await waitFor(() => {
            expect(
                screen.getByText("Weekly Texas Hold'em")
            ).toBeInTheDocument();
        });

        // Verificar detalhes do torneio
        expect(screen.getByText("5/10 players")).toBeInTheDocument();
        expect(screen.getByText("$100 buy-in")).toBeInTheDocument();

        // Testar funcionalidade de join
        const joinButton = screen.getByRole("button", {
            name: /join tournament/i,
        });
        expect(joinButton).toBeEnabled();

        await user.click(joinButton);

        // Verificar chamada API
        expect(mockTournamentApi.join).toHaveBeenCalledWith("1");

        // Verificar feedback visual
        await waitFor(() => {
            expect(
                screen.getByText("Joined successfully!")
            ).toBeInTheDocument();
        });
    });

    it("handles tournament not found", async () => {
        mockTournamentApi.get.mockRejectedValue(new Error("Not found"));

        renderWithProviders(<TournamentPage params={{ id: "invalid" }} />);

        await waitFor(() => {
            expect(
                screen.getByText("Tournament not found")
            ).toBeInTheDocument();
        });
    });

    it("disables join button when tournament is full", async () => {
        const fullTournament = {
            id: "2",
            name: "Full Tournament",
            status: "registering",
            playerCount: 10,
            maxPlayers: 10,
            buyIn: 50,
        };

        mockTournamentApi.get.mockResolvedValue(fullTournament);

        renderWithProviders(<TournamentPage params={{ id: "2" }} />);

        await waitFor(() => {
            const joinButton = screen.getByRole("button", {
                name: /tournament full/i,
            });
            expect(joinButton).toBeDisabled();
        });
    });
});
```

### 🎨 **Testing Theme System**

```tsx
// __tests__/features/theme-system.integration.test.tsx
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/lib/theme-provider";

function TestComponent() {
    const { theme, setTheme, toggleTheme } = useTheme();

    return (
        <div>
            <span data-testid="current-theme">{theme}</span>
            <button onClick={() => setTheme("cyberpunk")}>Set Cyberpunk</button>
            <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
    );
}

describe("Theme System Integration", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.className = "";
    });

    it("manages theme state correctly", async () => {
        const { user } = setup(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        // Tema inicial
        expect(screen.getByTestId("current-theme")).toHaveTextContent(
            "default"
        );

        // Mudar para cyberpunk
        await user.click(screen.getByText("Set Cyberpunk"));
        expect(screen.getByTestId("current-theme")).toHaveTextContent(
            "cyberpunk"
        );

        // Verificar classe aplicada
        expect(document.documentElement).toHaveClass("theme-cyberpunk");

        // Verificar localStorage
        expect(localStorage.getItem("poker-app-theme")).toBe("cyberpunk");
    });

    it("toggles through themes correctly", async () => {
        const { user } = setup(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const themes = ["default", "cyberpunk", "neon", "minimal"];

        for (let i = 0; i < themes.length; i++) {
            if (i > 0) {
                await user.click(screen.getByText("Toggle Theme"));
            }
            expect(screen.getByTestId("current-theme")).toHaveTextContent(
                themes[i]
            );
        }

        // Deve voltar ao primeiro após o último
        await user.click(screen.getByText("Toggle Theme"));
        expect(screen.getByTestId("current-theme")).toHaveTextContent(
            "default"
        );
    });

    it("persists theme across app restarts", () => {
        // Simular tema salvo
        localStorage.setItem("poker-app-theme", "neon");

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        // Deve restaurar tema salvo
        expect(screen.getByTestId("current-theme")).toHaveTextContent("neon");
        expect(document.documentElement).toHaveClass("theme-neon");
    });
});
```

---

## 🎯 **E2E Testing - User Journeys**

### 🚀 **Playwright Configuration**

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",

    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
        {
            name: "Mobile Chrome",
            use: { ...devices["Pixel 5"] },
        },
    ],

    webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
    },
});
```

### 🎮 **Complete Tournament Journey**

```typescript
// e2e/tournament-journey.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Tournament User Journey", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");

        // Mock authentication if needed
        await page.evaluate(() => {
            localStorage.setItem("auth-token", "mock-token");
        });
    });

    test("user can discover, join, and play in tournament", async ({
        page,
    }) => {
        // 1. Navigate to tournaments page
        await page.click('nav a[href="/tournaments"]');
        await expect(page).toHaveURL("/tournaments");

        // 2. Wait for tournaments to load
        await page.waitForSelector('[data-testid="tournament-card"]');

        // 3. Find and click on available tournament
        const firstTournament = page
            .locator('[data-testid="tournament-card"]')
            .first();
        await expect(firstTournament).toContainText("Registering");

        const tournamentName = await firstTournament
            .locator("h3")
            .textContent();
        await firstTournament.click();

        // 4. Verify tournament details page
        await expect(page).toHaveURL(/\/tournament\/\w+/);
        await expect(page.locator("h1")).toContainText(tournamentName!);

        // 5. Join tournament
        const joinButton = page.locator('button:has-text("Join Tournament")');
        await expect(joinButton).toBeEnabled();
        await joinButton.click();

        // 6. Verify join confirmation
        await expect(page.locator(".toast")).toContainText(
            "Joined successfully"
        );
        await expect(joinButton).toContainText("Leave Tournament");

        // 7. Wait for tournament to start (or simulate)
        await page.evaluate(() => {
            // Simulate tournament start via websocket/polling
            window.dispatchEvent(new CustomEvent("tournament:started"));
        });

        // 8. Verify redirect to game table
        await expect(page).toHaveURL(/\/game\/\w+/);

        // 9. Verify poker table interface
        await expect(page.locator('[data-testid="poker-table"]')).toBeVisible();
        await expect(
            page.locator('[data-testid="player-cards"]')
        ).toBeVisible();
        await expect(
            page.locator('[data-testid="community-cards"]')
        ).toBeVisible();

        // 10. Test basic game actions
        const foldButton = page.locator('button:has-text("Fold")');
        const callButton = page.locator('button:has-text("Call")');

        await expect(foldButton).toBeEnabled();
        await expect(callButton).toBeEnabled();

        await callButton.click();

        // 11. Verify action was recorded
        await expect(page.locator('[data-testid="game-log"]')).toContainText(
            "called"
        );
    });

    test("user can customize theme while playing", async ({ page }) => {
        // Navigate to game
        await page.goto("/game/test-game");

        // Open theme selector
        await page.click('[data-testid="theme-toggle"]');

        // Select cyberpunk theme
        await page.click("text=Cyberpunk");

        // Verify theme applied
        await expect(page.locator("html")).toHaveClass(/theme-cyberpunk/);

        // Verify visual changes
        const glassCard = page.locator('[data-testid="glass-card"]').first();
        await expect(glassCard).toHaveCSS(
            "background-color",
            /rgba\(0, 255, 255/
        );

        // Verify persistence
        await page.reload();
        await expect(page.locator("html")).toHaveClass(/theme-cyberpunk/);
    });

    test("responsive design works on mobile", async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto("/tournaments");

        // Verify mobile layout
        const tournamentGrid = page.locator('[data-testid="tournament-grid"]');
        await expect(tournamentGrid).toHaveCSS("grid-template-columns", /1fr/);

        // Test mobile navigation
        const mobileMenu = page.locator('[data-testid="mobile-menu-trigger"]');
        await expect(mobileMenu).toBeVisible();

        await mobileMenu.click();
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    });
});
```

### 🎨 **Visual Regression Testing**

```typescript
// e2e/visual-regression.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Visual Regression", () => {
    test("homepage renders correctly", async ({ page }) => {
        await page.goto("/");

        // Wait for fonts and images to load
        await page.waitForLoadState("networkidle");

        await expect(page).toHaveScreenshot("homepage.png");
    });

    test("glass components render correctly", async ({ page }) => {
        await page.goto("/component-showcase");

        // Test different glass variants
        const variants = ["default", "intense", "subtle", "frosted", "crystal"];

        for (const variant of variants) {
            await page.click(`button:has-text("${variant}")`);
            await page.waitForTimeout(500); // Wait for transition

            await expect(
                page.locator('[data-testid="glass-preview"]')
            ).toHaveScreenshot(`glass-${variant}.png`);
        }
    });

    test("neon effects render correctly", async ({ page }) => {
        await page.goto("/component-showcase");
        await page.click('tab:has-text("Neon Effects")');

        // Test different neon colors
        const colors = ["cyan", "purple", "pink", "green"];

        for (const color of colors) {
            await page.click(`button:has-text("${color}")`);
            await page.waitForTimeout(300);

            await expect(
                page.locator('[data-testid="neon-preview"]')
            ).toHaveScreenshot(`neon-${color}.png`);
        }
    });

    test("dark mode consistency", async ({ page }) => {
        await page.goto("/");

        // Take light mode screenshot
        await expect(page).toHaveScreenshot("light-mode.png");

        // Switch to dark mode
        await page.click('[data-testid="theme-toggle"]');
        await page.click("text=Dark");

        await expect(page).toHaveScreenshot("dark-mode.png");
    });
});
```

---

## 🛠️ **Testing Utilities**

### 🔧 **Custom Render Helper**

```tsx
// test-utils/render.tsx
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/lib/theme-provider";
import { ReactElement } from "react";

interface CustomRenderOptions extends RenderOptions {
    initialTheme?: string;
    queryClient?: QueryClient;
}

function customRender(
    ui: ReactElement,
    {
        initialTheme = "default",
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        }),
        ...options
    }: CustomRenderOptions = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <ThemeProvider initialTheme={initialTheme}>
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        );
    }

    return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
export { userEvent } from "@testing-library/user-event";
```

### 🎭 **Mock Factories**

```typescript
// test-utils/factories.ts
import { faker } from "@faker-js/faker";

export const TournamentFactory = {
    build: (overrides?: Partial<Tournament>): Tournament => ({
        id: faker.string.uuid(),
        name: faker.company.name() + " Tournament",
        description: faker.lorem.sentence(),
        status: "registering",
        buyIn: faker.number.int({ min: 10, max: 1000 }),
        playerCount: faker.number.int({ min: 0, max: 100 }),
        maxPlayers: faker.number.int({ min: 50, max: 500 }),
        startTime: faker.date.future(),
        prizePool: faker.number.int({ min: 1000, max: 100000 }),
        blindStructure: BlindStructureFactory.build(),
        ...overrides,
    }),

    buildMany: (count: number, overrides?: Partial<Tournament>): Tournament[] =>
        Array.from({ length: count }, () => TournamentFactory.build(overrides)),
};

export const PlayerFactory = {
    build: (overrides?: Partial<Player>): Player => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        avatar: faker.image.avatar(),
        chips: faker.number.int({ min: 1000, max: 50000 }),
        position: faker.number.int({ min: 1, max: 9 }),
        status: "active",
        ...overrides,
    }),
};

export const GameStateFactory = {
    build: (overrides?: Partial<GameState>): GameState => ({
        id: faker.string.uuid(),
        phase: "preflop",
        pot: faker.number.int({ min: 0, max: 10000 }),
        communityCards: [],
        players: PlayerFactory.buildMany(6),
        currentPlayer: faker.string.uuid(),
        smallBlind: 25,
        bigBlind: 50,
        ...overrides,
    }),
};
```

### 🎯 **Mock API Responses**

```typescript
// __mocks__/api.ts
import { TournamentFactory, PlayerFactory } from "../test-utils/factories";

export const mockTournamentApi = {
    getAll: jest.fn(() => Promise.resolve(TournamentFactory.buildMany(10))),
    get: jest.fn((id: string) =>
        Promise.resolve(TournamentFactory.build({ id }))
    ),
    join: jest.fn(() => Promise.resolve({ success: true })),
    leave: jest.fn(() => Promise.resolve({ success: true })),
    create: jest.fn((data) => Promise.resolve(TournamentFactory.build(data))),
};

export const mockPlayerApi = {
    getProfile: jest.fn(() => Promise.resolve(PlayerFactory.build())),
    updateProfile: jest.fn((data) =>
        Promise.resolve({ ...PlayerFactory.build(), ...data })
    ),
};

export const mockGameApi = {
    getState: jest.fn(() => Promise.resolve(GameStateFactory.build())),
    makeAction: jest.fn(() => Promise.resolve({ success: true })),
    subscribe: jest.fn(() => ({
        unsubscribe: jest.fn(),
    })),
};
```

---

## 🎭 **Component Testing Patterns**

### 🧩 **Testing Compound Components**

```tsx
// __tests__/components/compound-glass-card.test.tsx
describe("Compound GlassCard", () => {
    it("renders all sub-components correctly", () => {
        render(
            <GlassCard data-testid="compound-card">
                <GlassCard.Header>Header Content</GlassCard.Header>
                <GlassCard.Content>Main Content</GlassCard.Content>
                <GlassCard.Footer>Footer Content</GlassCard.Footer>
            </GlassCard>
        );

        expect(screen.getByText("Header Content")).toBeInTheDocument();
        expect(screen.getByText("Main Content")).toBeInTheDocument();
        expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });

    it("shares context between sub-components", async () => {
        const { user } = setup(
            <GlassCard data-testid="compound-card">
                <GlassCard.Header data-testid="header">Header</GlassCard.Header>
                <GlassCard.Content>Content</GlassCard.Content>
            </GlassCard>
        );

        const card = screen.getByTestId("compound-card");
        const header = screen.getByTestId("header");

        // Initial state
        expect(header).not.toHaveClass("border-white/20");

        // Hover should affect all sub-components
        await user.hover(card);
        expect(header).toHaveClass("border-white/20");
    });

    it("throws error when sub-components used outside provider", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        expect(() => {
            render(<GlassCard.Header>Orphaned Header</GlassCard.Header>);
        }).toThrow("GlassCard.Header must be used within GlassCard");

        consoleSpy.mockRestore();
    });
});
```

### 🎨 **Testing Custom Hooks**

```tsx
// __tests__/hooks/use-poker-game.test.tsx
import { renderHook, act } from "@testing-library/react";
import { usePokerGame } from "@/hooks/use-poker-game";
import { PlayerFactory } from "../test-utils/factories";

describe("usePokerGame", () => {
    const mockPlayers = PlayerFactory.buildMany(4);

    it("initializes with correct default state", () => {
        const { result } = renderHook(() => usePokerGame(mockPlayers));

        expect(result.current.gameState.phase).toBe("preflop");
        expect(result.current.gameState.pot).toBe(0);
        expect(result.current.gameState.players).toEqual(mockPlayers);
    });

    it("handles player actions correctly", () => {
        const { result } = renderHook(() => usePokerGame(mockPlayers));

        act(() => {
            result.current.actions.playerAction(mockPlayers[0].id, {
                type: "bet",
                amount: 100,
            });
        });

        expect(result.current.gameState.pot).toBe(100);
        expect(result.current.gameState.currentPlayer).toBe(mockPlayers[1].id);
    });

    it("advances phases automatically", async () => {
        jest.useFakeTimers();

        const { result } = renderHook(() => usePokerGame(mockPlayers));

        // All players act
        mockPlayers.forEach((player, index) => {
            act(() => {
                result.current.actions.playerAction(player.id, {
                    type: index === 0 ? "bet" : "call",
                    amount: 100,
                });
            });
        });

        // Should auto-advance after timeout
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(result.current.gameState.phase).toBe("flop");

        jest.useRealTimers();
    });
});
```

---

## 📊 **Performance Testing**

### ⚡ **Component Performance**

```tsx
// __tests__/performance/component-performance.test.tsx
import { render } from "@testing-library/react";
import { performance } from "perf_hooks";

describe("Component Performance", () => {
    it("GlassCard renders within performance budget", () => {
        const startTime = performance.now();

        const { unmount } = render(
            <div>
                {Array.from({ length: 100 }, (_, i) => (
                    <GlassCard key={i} variant="default">
                        <p>Content {i}</p>
                    </GlassCard>
                ))}
            </div>
        );

        const renderTime = performance.now() - startTime;

        // Should render 100 components in under 100ms
        expect(renderTime).toBeLessThan(100);

        const unmountStart = performance.now();
        unmount();
        const unmountTime = performance.now() - unmountStart;

        // Should unmount quickly
        expect(unmountTime).toBeLessThan(50);
    });

    it("Virtual list handles large datasets efficiently", () => {
        const largeDataset = TournamentFactory.buildMany(10000);

        const startTime = performance.now();

        const { getByTestId } = render(
            <VirtualTournamentList
                tournaments={largeDataset}
                height={400}
                itemHeight={80}
            />
        );

        const renderTime = performance.now() - startTime;

        // Should render virtual list quickly regardless of data size
        expect(renderTime).toBeLessThan(50);

        // Should only render visible items
        const container = getByTestId("virtual-container");
        const renderedItems = container.querySelectorAll(
            '[data-testid="tournament-item"]'
        );
        expect(renderedItems.length).toBeLessThan(20); // Only visible items
    });
});
```

### 📈 **Memory Leak Detection**

```tsx
// __tests__/performance/memory-leaks.test.tsx
describe("Memory Leak Detection", () => {
    it("does not leak event listeners", () => {
        const addEventListenerSpy = jest.spyOn(window, "addEventListener");
        const removeEventListenerSpy = jest.spyOn(
            window,
            "removeEventListener"
        );

        const { unmount } = render(
            <ThemeProvider>
                <App />
            </ThemeProvider>
        );

        const listenersAdded = addEventListenerSpy.mock.calls.length;

        unmount();

        const listenersRemoved = removeEventListenerSpy.mock.calls.length;

        // All listeners should be cleaned up
        expect(listenersAdded).toBe(listenersRemoved);

        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });

    it("cleans up timers and intervals", () => {
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");
        const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");

        const { unmount } = render(<TournamentClock />);

        const timersSet = setTimeoutSpy.mock.calls.length;

        unmount();

        const timersCleared = clearTimeoutSpy.mock.calls.length;

        expect(timersCleared).toBeGreaterThanOrEqual(timersSet);

        setTimeoutSpy.mockRestore();
        clearTimeoutSpy.mockRestore();
    });
});
```

---

## 🎯 **Test Organization**

### 📁 **File Structure**

```
__tests__/
├── components/           # Component unit tests
│   ├── ui/
│   │   ├── glass-card.test.tsx
│   │   └── neon-effects.test.tsx
│   └── tournament/
│       └── tournament-card.test.tsx
├── features/            # Integration tests
│   ├── tournament.integration.test.tsx
│   └── theme-system.integration.test.tsx
├── hooks/               # Custom hook tests
│   └── use-poker-game.test.tsx
├── performance/         # Performance tests
│   └── component-performance.test.tsx
├── __mocks__/          # Mock implementations
│   ├── api.ts
│   └── websocket.ts
└── test-utils/         # Testing utilities
    ├── render.tsx
    ├── factories.ts
    └── setup.ts

e2e/                    # E2E tests (Playwright)
├── tournament-journey.spec.ts
├── visual-regression.spec.ts
└── mobile-responsive.spec.ts
```

### 🔧 **Jest Configuration**

```javascript
// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "jest-environment-jsdom",

    // Module path mapping
    moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/$1",
        "^@/components/(.*)$": "<rootDir>/components/$1",
        "^@/lib/(.*)$": "<rootDir>/lib/$1",
    },

    // Coverage configuration
    collectCoverageFrom: [
        "components/**/*.{js,jsx,ts,tsx}",
        "lib/**/*.{js,jsx,ts,tsx}",
        "hooks/**/*.{js,jsx,ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],

    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },

    // Test patterns
    testMatch: [
        "**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)",
        "**/*.(test|spec).(js|jsx|ts|tsx)",
    ],

    // Transform ignore patterns
    transformIgnorePatterns: ["/node_modules/(?!(some-esm-package)/)"],
};

module.exports = createJestConfig(customJestConfig);
```

---

## 🎯 **Melhores Práticas**

### ✅ **Do's (Faça)**

1. **Teste comportamento do usuário**

    ```tsx
    // ✅ Foca no que o usuário vê e faz
    await user.click(screen.getByRole("button", { name: /join tournament/i }));
    expect(screen.getByText("Joined successfully!")).toBeInTheDocument();
    ```

2. **Use data-testid com parcimônia**

    ```tsx
    // ✅ Prefira queries semânticas
    screen.getByRole("button", { name: /submit/i });
    screen.getByLabelText(/email address/i);

    // ✅ Use data-testid apenas quando necessário
    screen.getByTestId("complex-component-state");
    ```

3. **Teste casos edge**
    ```tsx
    // ✅ Teste loading, error, empty states
    it("handles empty tournament list", () => {
        render(<TournamentList tournaments={[]} />);
        expect(
            screen.getByText("No tournaments available")
        ).toBeInTheDocument();
    });
    ```

### ❌ **Don'ts (Evite)**

1. **Não teste implementação**

    ```tsx
    // ❌ Testa implementação interna
    expect(component.state.isLoading).toBe(true);

    // ✅ Testa comportamento visível
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    ```

2. **Não teste bibliotecas externas**

    ```tsx
    // ❌ Testando React Router
    expect(mockPush).toHaveBeenCalledWith("/tournaments");

    // ✅ Testando resultado da navegação
    expect(screen.getByText("Tournaments Page")).toBeInTheDocument();
    ```

---

## 🔗 **Recursos e Ferramentas**

### 📚 **Documentação**

-   [Testing Library](https://testing-library.com/docs/)
-   [Jest](https://jestjs.io/docs/getting-started)
-   [Playwright](https://playwright.dev/docs/intro)
-   [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### 🛠️ **Ferramentas Essenciais**

-   [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro)
-   [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)
-   [@testing-library/user-event](https://testing-library.com/docs/user-event/intro)
-   [Playwright](https://playwright.dev/)
-   [MSW (Mock Service Worker)](https://mswjs.io/)

---

## 🚀 **Próximos Passos**

Continue melhorando a qualidade:

1. **[🚀 Performance](../architecture/performance.md)** - Otimizações e monitoramento
2. **[📦 Deployment](./deployment-guide.md)** - CI/CD e produção
3. **[🔧 Maintenance](./maintenance-guide.md)** - Manutenção a longo prazo

---

_🎯 **Meta**: Construir confiança através de testes que garantem qualidade premium._
