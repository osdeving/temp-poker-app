# 🏗️ Advanced Patterns - Padrões Arquiteturais Modernos

> **Padrões de desenvolvimento React/Next.js para aplicações premium**

---

## 🎯 **Visão Geral**

Este guia explora padrões arquiteturais avançados implementados no projeto para criar código:

-   **Escalável** - Cresce sem complexidade exponencial
-   **Manutenível** - Fácil de modificar e debugar
-   **Performático** - Otimizado para produção
-   **Testável** - Estruturado para testes eficazes

---

## 🔧 **Compound Components Pattern**

### 🎨 **Implementação no Projeto**

```tsx
// components/ui/glass/compound-card.tsx
interface GlassCardContextType {
    variant: GlassVariant;
    isHovered: boolean;
    setHovered: (hovered: boolean) => void;
}

const GlassCardContext = createContext<GlassCardContextType | null>(null);

// Componente principal
export function GlassCard({
    variant = "default",
    children,
    ...props
}: GlassCardProps) {
    const [isHovered, setHovered] = useState(false);

    const contextValue = useMemo(
        () => ({
            variant,
            isHovered,
            setHovered,
        }),
        [variant, isHovered]
    );

    return (
        <GlassCardContext.Provider value={contextValue}>
            <div
                className={cn(glassVariants({ variant }), className)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                {...props}
            >
                {children}
            </div>
        </GlassCardContext.Provider>
    );
}

// Sub-componentes
GlassCard.Header = function GlassCardHeader({
    children,
    ...props
}: ComponentProps<"div">) {
    const context = useContext(GlassCardContext);
    if (!context)
        throw new Error("GlassCard.Header must be used within GlassCard");

    return (
        <div
            className={cn(
                "p-4 border-b border-white/10",
                context.isHovered && "border-white/20"
            )}
            {...props}
        >
            {children}
        </div>
    );
};

GlassCard.Content = function GlassCardContent({
    children,
    ...props
}: ComponentProps<"div">) {
    const context = useContext(GlassCardContext);
    if (!context)
        throw new Error("GlassCard.Content must be used within GlassCard");

    return (
        <div className="p-4 flex-1" {...props}>
            {children}
        </div>
    );
};

GlassCard.Footer = function GlassCardFooter({
    children,
    ...props
}: ComponentProps<"div">) {
    const context = useContext(GlassCardContext);
    if (!context)
        throw new Error("GlassCard.Footer must be used within GlassCard");

    return (
        <div
            className={cn(
                "p-4 border-t border-white/10",
                context.isHovered && "border-white/20"
            )}
            {...props}
        >
            {children}
        </div>
    );
};
```

### 🎮 **Uso Prático**

```tsx
// app/tournament/[id]/page.tsx
<GlassCard variant="intense">
    <GlassCard.Header>
        <h2 className="text-xl font-bold">Tournament Details</h2>
    </GlassCard.Header>

    <GlassCard.Content>
        <div className="space-y-4">
            <TournamentInfo />
            <PlayersList />
        </div>
    </GlassCard.Content>

    <GlassCard.Footer>
        <div className="flex justify-between">
            <Button variant="ghost">Leave</Button>
            <Button>Join Tournament</Button>
        </div>
    </GlassCard.Footer>
</GlassCard>
```

---

## 🎯 **Render Props Pattern**

### 🔄 **Data Fetching com Render Props**

```tsx
// components/patterns/tournament-data.tsx
interface TournamentDataProps {
    tournamentId: string;
    children: (data: {
        tournament: Tournament | null;
        loading: boolean;
        error: Error | null;
        refetch: () => void;
    }) => React.ReactNode;
}

export function TournamentData({
    tournamentId,
    children,
}: TournamentDataProps) {
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTournament = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.tournaments.get(tournamentId);
            setTournament(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [tournamentId]);

    useEffect(() => {
        fetchTournament();
    }, [fetchTournament]);

    return children({
        tournament,
        loading,
        error,
        refetch: fetchTournament,
    });
}
```

### 🎨 **Uso com Diferentes UIs**

```tsx
// Versão com loading skeleton
<TournamentData tournamentId={id}>
  {({ tournament, loading, error, refetch }) => {
    if (loading) return <TournamentSkeleton />
    if (error) return <ErrorCard onRetry={refetch} />
    if (!tournament) return <NotFoundCard />

    return <TournamentCard tournament={tournament} />
  }}
</TournamentData>

// Versão com lista
<TournamentData tournamentId={id}>
  {({ tournament, loading }) => (
    <div className="space-y-4">
      {loading ? (
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/10 rounded" />
          ))}
        </div>
      ) : (
        tournament && <DetailedTournamentView tournament={tournament} />
      )}
    </div>
  )}
</TournamentData>
```

---

## 🏭 **Factory Pattern para Componentes**

### 🎨 **Component Factory**

```tsx
// lib/component-factory.ts
type ComponentVariant = "glass" | "neon" | "minimal" | "cyberpunk";
type ComponentSize = "sm" | "md" | "lg" | "xl";

interface ComponentFactoryConfig {
    variant: ComponentVariant;
    size: ComponentSize;
    theme?: string;
}

export class ComponentFactory {
    static createCard(config: ComponentFactoryConfig) {
        const { variant, size, theme } = config;

        switch (variant) {
            case "glass":
                return function GlassFactoryCard(props: CardProps) {
                    return (
                        <GlassCard
                            variant={theme as GlassVariant}
                            className={cn(sizeVariants[size], props.className)}
                            {...props}
                        />
                    );
                };

            case "neon":
                return function NeonFactoryCard(props: CardProps) {
                    return (
                        <div
                            className={cn(
                                "border-2 border-cyan-500 bg-cyan-500/10",
                                "shadow-[0_0_20px_rgba(0,255,255,0.5)]",
                                sizeVariants[size],
                                props.className
                            )}
                        >
                            {props.children}
                        </div>
                    );
                };

            case "minimal":
                return function MinimalFactoryCard(props: CardProps) {
                    return (
                        <div
                            className={cn(
                                "bg-white/5 border border-white/10 rounded-lg",
                                sizeVariants[size],
                                props.className
                            )}
                        >
                            {props.children}
                        </div>
                    );
                };

            default:
                return GlassCard;
        }
    }

    static createButton(config: ComponentFactoryConfig) {
        // Similar implementation for buttons
    }

    static createInput(config: ComponentFactoryConfig) {
        // Similar implementation for inputs
    }
}

const sizeVariants = {
    sm: "p-3 text-sm",
    md: "p-4 text-base",
    lg: "p-6 text-lg",
    xl: "p-8 text-xl",
};
```

### 🎯 **Theme-based Factory Usage**

```tsx
// components/themed/theme-aware-components.tsx
export function ThemedComponents() {
    const { theme } = useTheme();

    // Factory cria componentes baseado no tema atual
    const Card = useMemo(
        () =>
            ComponentFactory.createCard({
                variant: theme === "cyberpunk" ? "neon" : "glass",
                size: "md",
                theme: theme === "minimal" ? "subtle" : "default",
            }),
        [theme]
    );

    const Button = useMemo(
        () =>
            ComponentFactory.createButton({
                variant: theme === "cyberpunk" ? "neon" : "glass",
                size: "md",
            }),
        [theme]
    );

    return (
        <div className="space-y-4">
            <Card>
                <h3>Dynamic Component</h3>
                <p>This component adapts to the current theme</p>
                <Button>Theme-aware button</Button>
            </Card>
        </div>
    );
}
```

---

## 🔀 **Higher-Order Components (HOC)**

### 🎭 **HOC para Animações**

```tsx
// hoc/with-animations.tsx
interface WithAnimationsOptions {
    entrance?: boolean;
    hover?: boolean;
    stagger?: boolean;
}

export function withAnimations<P extends object>(
    Component: React.ComponentType<P>,
    options: WithAnimationsOptions = {}
) {
    const { entrance = true, hover = true, stagger = false } = options;

    return function AnimatedComponent(props: P & { className?: string }) {
        const [isVisible, setIsVisible] = useState(false);
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (!entrance) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                },
                { threshold: 0.1 }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => observer.disconnect();
        }, []);

        const variants = {
            hidden: { opacity: 0, y: 20 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.5,
                    ...(stagger && {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                    }),
                },
            },
            hover: {
                scale: 1.02,
                transition: { duration: 0.2 },
            },
        };

        return (
            <motion.div
                ref={ref}
                initial={entrance ? "hidden" : "visible"}
                animate={isVisible ? "visible" : "hidden"}
                whileHover={hover ? "hover" : undefined}
                variants={variants}
                className={props.className}
            >
                <Component {...props} />
            </motion.div>
        );
    };
}
```

### 🎮 **Uso do HOC**

```tsx
// components/enhanced/animated-cards.tsx
const AnimatedGlassCard = withAnimations(GlassCard, {
    entrance: true,
    hover: true,
    stagger: false,
});

const AnimatedTournamentGrid = withAnimations(TournamentGrid, {
    entrance: true,
    hover: false,
    stagger: true,
});

// app/tournaments/page.tsx
export default function TournamentsPage() {
    return (
        <div className="space-y-8">
            <AnimatedGlassCard>
                <h1>Tournaments</h1>
            </AnimatedGlassCard>

            <AnimatedTournamentGrid>
                {tournaments.map((tournament) => (
                    <AnimatedGlassCard key={tournament.id}>
                        <TournamentCard tournament={tournament} />
                    </AnimatedGlassCard>
                ))}
            </AnimatedTournamentGrid>
        </div>
    );
}
```

---

## 🪝 **Custom Hooks Patterns**

### 🎯 **Hook de Estado Complexo**

```tsx
// hooks/use-poker-game.ts
interface PokerGameState {
    phase: "preflop" | "flop" | "turn" | "river" | "showdown";
    pot: number;
    players: Player[];
    communityCards: Card[];
    currentPlayer: string;
    actions: GameAction[];
}

type PokerGameAction =
    | { type: "DEAL_CARDS" }
    | { type: "PLAYER_ACTION"; payload: { playerId: string; action: Action } }
    | { type: "NEXT_PHASE" }
    | { type: "RESET_GAME" };

function pokerGameReducer(
    state: PokerGameState,
    action: PokerGameAction
): PokerGameState {
    switch (action.type) {
        case "DEAL_CARDS":
            return {
                ...state,
                phase: "preflop",
                communityCards: dealCommunityCards(state.phase),
            };

        case "PLAYER_ACTION":
            return {
                ...state,
                pot: calculateNewPot(state.pot, action.payload.action),
                actions: [
                    ...state.actions,
                    {
                        playerId: action.payload.playerId,
                        action: action.payload.action,
                        timestamp: Date.now(),
                    },
                ],
                currentPlayer: getNextPlayer(
                    state.players,
                    action.payload.playerId
                ),
            };

        case "NEXT_PHASE":
            return {
                ...state,
                phase: getNextPhase(state.phase),
                communityCards: dealCommunityCards(getNextPhase(state.phase)),
            };

        case "RESET_GAME":
            return initialGameState;

        default:
            return state;
    }
}

export function usePokerGame(initialPlayers: Player[]) {
    const [state, dispatch] = useReducer(pokerGameReducer, {
        phase: "preflop",
        pot: 0,
        players: initialPlayers,
        communityCards: [],
        currentPlayer: initialPlayers[0]?.id || "",
        actions: [],
    });

    const gameActions = useMemo(
        () => ({
            dealCards: () => dispatch({ type: "DEAL_CARDS" }),
            playerAction: (playerId: string, action: Action) =>
                dispatch({
                    type: "PLAYER_ACTION",
                    payload: { playerId, action },
                }),
            nextPhase: () => dispatch({ type: "NEXT_PHASE" }),
            resetGame: () => dispatch({ type: "RESET_GAME" }),
        }),
        []
    );

    // Side effects
    useEffect(() => {
        // Auto-advance phase quando todos os jogadores agem
        const allPlayersActed = state.players.every((player) =>
            state.actions.some((action) => action.playerId === player.id)
        );

        if (allPlayersActed && state.phase !== "showdown") {
            const timer = setTimeout(() => gameActions.nextPhase(), 2000);
            return () => clearTimeout(timer);
        }
    }, [state.actions, state.players, state.phase, gameActions]);

    return {
        gameState: state,
        actions: gameActions,
        // Computed values
        isPlayerTurn: (playerId: string) => state.currentPlayer === playerId,
        canPlayerAct: (playerId: string) =>
            state.currentPlayer === playerId && state.phase !== "showdown",
        gamePhaseInfo: getPhaseInfo(state.phase),
    };
}
```

### 🔄 **Hook de Sincronização**

```tsx
// hooks/use-synchronized-state.ts
export function useSynchronizedState<T>(
    key: string,
    initialValue: T,
    syncMethod: "localStorage" | "sessionStorage" | "broadcast" = "localStorage"
) {
    const [state, setState] = useState<T>(initialValue);

    // Sincronizar estado inicial
    useEffect(() => {
        const stored = window[syncMethod].getItem(key);
        if (stored) {
            try {
                setState(JSON.parse(stored));
            } catch {
                // Fallback para valor inicial se parsing falhar
            }
        }
    }, [key, syncMethod]);

    // Sincronizar mudanças
    const setSynchronizedState = useCallback(
        (value: T | ((prev: T) => T)) => {
            setState((prev) => {
                const newValue =
                    typeof value === "function"
                        ? (value as (prev: T) => T)(prev)
                        : value;

                try {
                    window[syncMethod].setItem(key, JSON.stringify(newValue));

                    // Broadcast para outras abas
                    if (syncMethod === "localStorage") {
                        window.dispatchEvent(
                            new StorageEvent("storage", {
                                key,
                                newValue: JSON.stringify(newValue),
                                storageArea: localStorage,
                            })
                        );
                    }
                } catch (error) {
                    console.warn("Failed to sync state:", error);
                }

                return newValue;
            });
        },
        [key, syncMethod]
    );

    // Ouvir mudanças de outras abas
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setState(JSON.parse(e.newValue));
                } catch {
                    // Ignorar se não conseguir parsear
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key]);

    return [state, setSynchronizedState] as const;
}
```

---

## 🔄 **Observer Pattern**

### 👁️ **Event Bus Implementation**

```tsx
// lib/event-bus.ts
type EventListener<T = any> = (data: T) => void;

export class EventBus {
    private events: Map<string, Set<EventListener>> = new Map();

    on<T>(event: string, listener: EventListener<T>) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)!.add(listener);

        // Return unsubscribe function
        return () => {
            this.events.get(event)?.delete(listener);
        };
    }

    emit<T>(event: string, data?: T) {
        const listeners = this.events.get(event);
        if (listeners) {
            listeners.forEach((listener) => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(
                        `Error in event listener for "${event}":`,
                        error
                    );
                }
            });
        }
    }

    off(event: string, listener?: EventListener) {
        if (!listener) {
            this.events.delete(event);
        } else {
            this.events.get(event)?.delete(listener);
        }
    }

    once<T>(event: string, listener: EventListener<T>) {
        const unsubscribe = this.on(event, (data) => {
            listener(data);
            unsubscribe();
        });
        return unsubscribe;
    }
}

// Singleton instance
export const eventBus = new EventBus();
```

### 🎮 **Game Events System**

```tsx
// lib/game-events.ts
export interface GameEvents {
    "player:join": { playerId: string; name: string };
    "player:leave": { playerId: string };
    "game:start": { gameId: string };
    "game:end": { gameId: string; winner: string };
    "card:dealt": { cards: Card[]; playerId: string };
    "bet:placed": { amount: number; playerId: string };
    "phase:changed": { from: GamePhase; to: GamePhase };
}

// Hook para usar eventos tipados
export function useGameEvents() {
    const subscribe = useCallback(
        <K extends keyof GameEvents>(
            event: K,
            listener: (data: GameEvents[K]) => void
        ) => {
            return eventBus.on(event, listener);
        },
        []
    );

    const emit = useCallback(
        <K extends keyof GameEvents>(event: K, data: GameEvents[K]) => {
            eventBus.emit(event, data);
        },
        []
    );

    return { subscribe, emit };
}

// Uso em componentes
export function PokerTable() {
    const { subscribe, emit } = useGameEvents();

    useEffect(() => {
        const unsubscribes = [
            subscribe("player:join", ({ playerId, name }) => {
                toast.success(`${name} joined the game`);
            }),

            subscribe("bet:placed", ({ amount, playerId }) => {
                // Atualizar UI, tocar som, etc.
            }),

            subscribe("phase:changed", ({ from, to }) => {
                // Animação de transição de fase
            }),
        ];

        return () => {
            unsubscribes.forEach((unsub) => unsub());
        };
    }, [subscribe]);

    return <div>{/* Poker table UI */}</div>;
}
```

---

## 🎛️ **State Machine Pattern**

### 🔄 **Tournament State Machine**

```tsx
// lib/tournament-state-machine.ts
type TournamentState =
    | "registering"
    | "waiting"
    | "playing"
    | "paused"
    | "finished"
    | "cancelled";

type TournamentEvent =
    | "START"
    | "PAUSE"
    | "RESUME"
    | "FINISH"
    | "CANCEL"
    | "REGISTER_PLAYER";

interface TournamentContext {
    players: Player[];
    startTime?: Date;
    endTime?: Date;
    prizePool: number;
}

const tournamentMachine = {
    initial: "registering" as TournamentState,

    states: {
        registering: {
            on: {
                START: "waiting",
                CANCEL: "cancelled",
                REGISTER_PLAYER: "registering", // Stay in same state
            },
        },

        waiting: {
            on: {
                START: "playing",
                CANCEL: "cancelled",
            },
        },

        playing: {
            on: {
                PAUSE: "paused",
                FINISH: "finished",
                CANCEL: "cancelled",
            },
        },

        paused: {
            on: {
                RESUME: "playing",
                CANCEL: "cancelled",
            },
        },

        finished: {
            on: {}, // Terminal state
        },

        cancelled: {
            on: {}, // Terminal state
        },
    },
};

export function useTournamentStateMachine(initialContext: TournamentContext) {
    const [state, setState] = useState<TournamentState>(
        tournamentMachine.initial
    );
    const [context, setContext] = useState(initialContext);

    const send = useCallback(
        (event: TournamentEvent, payload?: any) => {
            const currentState = tournamentMachine.states[state];
            const nextState = currentState.on[event];

            if (nextState) {
                setState(nextState);

                // Side effects baseado na transição
                switch (event) {
                    case "START":
                        if (state === "waiting") {
                            setContext((prev) => ({
                                ...prev,
                                startTime: new Date(),
                            }));
                        }
                        break;

                    case "FINISH":
                        setContext((prev) => ({
                            ...prev,
                            endTime: new Date(),
                        }));
                        break;

                    case "REGISTER_PLAYER":
                        setContext((prev) => ({
                            ...prev,
                            players: [...prev.players, payload.player],
                        }));
                        break;
                }
            } else {
                console.warn(`Invalid transition: ${event} from ${state}`);
            }
        },
        [state]
    );

    return {
        state,
        context,
        send,
        canTransition: (event: TournamentEvent) =>
            event in tournamentMachine.states[state].on,
    };
}
```

---

## 🚀 **Performance Patterns**

### ⚡ **Virtualized Lists**

```tsx
// components/virtualized/virtual-tournament-list.tsx
interface VirtualTournamentListProps {
    tournaments: Tournament[];
    height: number;
    itemHeight: number;
}

export function VirtualTournamentList({
    tournaments,
    height,
    itemHeight,
}: VirtualTournamentListProps) {
    const [scrollTop, setScrollTop] = useState(0);

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        startIndex + Math.ceil(height / itemHeight) + 1,
        tournaments.length
    );

    const visibleItems = tournaments.slice(startIndex, endIndex);

    const totalHeight = tournaments.length * itemHeight;
    const offsetY = startIndex * itemHeight;

    return (
        <div
            style={{ height, overflow: "auto" }}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        >
            <div style={{ height: totalHeight, position: "relative" }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map((tournament, index) => (
                        <TournamentCard
                            key={tournament.id}
                            tournament={tournament}
                            style={{ height: itemHeight }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
```

### 🎯 **Intersection Observer Hook**

```tsx
// hooks/use-intersection-observer.ts
export function useIntersectionObserver(
    elementRef: RefObject<Element>,
    {
        threshold = 0,
        root = null,
        rootMargin = "0%",
        freezeOnceVisible = false,
    }: IntersectionObserverInit & { freezeOnceVisible?: boolean } = {}
) {
    const [entry, setEntry] = useState<IntersectionObserverEntry>();

    const frozen = entry?.isIntersecting && freezeOnceVisible;

    const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
        setEntry(entry);
    };

    useEffect(() => {
        const node = elementRef?.current;
        const hasIOSupport = !!window.IntersectionObserver;

        if (!hasIOSupport || frozen || !node) return;

        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver(updateEntry, observerParams);

        observer.observe(node);

        return () => observer.disconnect();
    }, [elementRef, threshold, root, rootMargin, frozen]);

    return entry;
}

// Uso para lazy loading
export function LazyTournamentCard({ tournament }: { tournament: Tournament }) {
    const ref = useRef<HTMLDivElement>(null);
    const entry = useIntersectionObserver(ref, {
        threshold: 0.1,
        freezeOnceVisible: true,
    });

    const isVisible = !!entry?.isIntersecting;

    return (
        <div ref={ref} style={{ minHeight: 200 }}>
            {isVisible ? (
                <TournamentCard tournament={tournament} />
            ) : (
                <TournamentSkeleton />
            )}
        </div>
    );
}
```

---

## 🎯 **Melhores Práticas**

### ✅ **Do's (Faça)**

1. **Use padrões apropriados para cada situação**

    ```tsx
    // ✅ Compound components para UI complexa
    <Modal>
      <Modal.Header>Title</Modal.Header>
      <Modal.Content>Content</Modal.Content>
      <Modal.Footer>Actions</Modal.Footer>
    </Modal>

    // ✅ Render props para lógica reutilizável
    <DataFetcher url="/api/data">
      {({ data, loading }) => loading ? <Spinner /> : <List data={data} />}
    </DataFetcher>
    ```

2. **Mantenha a tipagem forte**

    ```tsx
    // ✅ Types específicos para cada padrão
    interface RenderProps<T> {
        children: (data: T, loading: boolean, error: Error | null) => ReactNode;
    }
    ```

3. **Documente padrões complexos**
    ```tsx
    /**
     * HOC que adiciona capacidades de animação a qualquer componente
     * @param Component - Componente a ser animado
     * @param options - Configurações de animação
     * @returns Componente com animações aplicadas
     */
    export function withAnimations<P>(
        Component: ComponentType<P>,
        options: AnimationOptions
    ) {
        // Implementation
    }
    ```

### ❌ **Don'ts (Evite)**

1. **Não abuse de padrões complexos**

    ```tsx
    // ❌ Over-engineering para casos simples
    const SimpleButton = withAnimations(
      withTheme(
        withLogger(
          withTracking(Button)
        )
      )
    )

    // ✅ Use composição simples
    <AnimatedButton theme="dark">Click me</AnimatedButton>
    ```

2. **Não ignore performance**

    ```tsx
    // ❌ Re-renderizações desnecessárias
    const ExpensiveComponent = ({ items }) => (
        <div>
            {items.map((item) => (
                <HeavyItem key={item.id} item={item} />
            ))}
        </div>
    );

    // ✅ Use memoization
    const OptimizedComponent = memo(({ items }) => (
        <div>
            {items.map((item) => (
                <MemoizedHeavyItem key={item.id} item={item} />
            ))}
        </div>
    ));
    ```

---

## 🔗 **Recursos Adicionais**

### 📚 **Documentação**

-   [React Patterns](https://reactpatterns.com/)
-   [React Design Patterns](https://www.patterns.dev/posts/reactjs)
-   [Advanced React Patterns](https://kentcdodds.com/blog/advanced-react-patterns)

### 🛠️ **Ferramentas**

-   [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
-   [React Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)
-   [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

## 🚀 **Próximos Passos**

Explore padrões mais avançados:

1. **[🧪 Testing Patterns](./testing-patterns.md)** - Estratégias de teste
2. **[🚀 Performance Optimization](../architecture/performance.md)** - Otimizações avançadas
3. **[📦 Micro-frontends](./micro-frontends.md)** - Arquitetura distribuída

---

_🎯 **Meta**: Dominar padrões arquiteturais que escalam para aplicações enterprise._
