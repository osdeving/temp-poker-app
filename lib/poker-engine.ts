/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Import das bibliotecas de poker
// import PokerTable from 'poker-ts'; // Comentado por problemas de import

// Tipos customizados
export interface Card {
    rank: string;
    suit: string;
    value: string; // Ex: "As", "Kh", "Qd", "Jc"
}

export interface Player {
    id: string;
    name: string;
    chips: number;
    cards: Card[];
    currentBet: number;
    isDealer: boolean;
    isSmallBlind: boolean;
    isBigBlind: boolean;
    isActive: boolean;
    isFolded: boolean;
    isAllIn: boolean;
    position: number;
    avatar?: string;
}

export interface GameState {
    players: Player[];
    communityCards: Card[];
    pot: number;
    currentBet: number;
    gamePhase: "preflop" | "flop" | "turn" | "river" | "showdown" | "ended";
    activePlayerIndex: number;
    dealerPosition: number;
    smallBlind: number;
    bigBlind: number;
    round: number;
}

export interface PokerAction {
    type: "fold" | "call" | "raise" | "check" | "all-in";
    amount?: number;
    playerId: string;
}

// Gerador de cartas
export class Deck {
    private cards: Card[] = [];
    private usedCards: Set<string> = new Set();

    constructor() {
        this.initializeDeck();
        this.shuffle();
    }

    private initializeDeck() {
        const suits = ["♠", "♥", "♦", "♣"];
        const ranks = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
            "A",
        ];
        const suitCodes = ["s", "h", "d", "c"];

        this.cards = [];
        suits.forEach((suit, suitIndex) => {
            ranks.forEach((rank) => {
                this.cards.push({
                    rank,
                    suit,
                    value: rank + suitCodes[suitIndex],
                });
            });
        });
    }

    private shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    dealCard(): Card | null {
        const availableCards = this.cards.filter(
            (card) => !this.usedCards.has(card.value)
        );
        if (availableCards.length === 0) return null;

        const card = availableCards[0];
        this.usedCards.add(card.value);
        return card;
    }

    reset() {
        this.usedCards.clear();
        this.shuffle();
    }
}

// Engine principal do poker
export class PokerEngine {
    private deck: Deck;
    private gameState: GameState;

    constructor(
        players: { id: string; name: string; chips: number; avatar?: string }[],
        smallBlind: number = 25,
        bigBlind: number = 50
    ) {
        this.deck = new Deck();
        this.gameState = this.initializeGame(players, smallBlind, bigBlind);
    }

    private initializeGame(
        players: { id: string; name: string; chips: number; avatar?: string }[],
        smallBlind: number,
        bigBlind: number
    ): GameState {
        const gamePlayers: Player[] = players.map((p, index) => ({
            id: p.id,
            name: p.name,
            chips: p.chips,
            cards: [],
            currentBet: 0,
            isDealer: index === 0,
            isSmallBlind: index === 1 % players.length,
            isBigBlind: index === 2 % players.length,
            isActive: index === 3 % players.length, // Primeiro após big blind
            isFolded: false,
            isAllIn: false,
            position: index,
            avatar: p.avatar,
        }));

        return {
            players: gamePlayers,
            communityCards: [],
            pot: 0,
            currentBet: bigBlind,
            gamePhase: "preflop",
            activePlayerIndex: 3 % players.length,
            dealerPosition: 0,
            smallBlind,
            bigBlind,
            round: 1,
        };
    }

    // Iniciar nova mão
    startNewHand(): GameState {
        this.deck.reset();

        // Resetar estado dos jogadores
        this.gameState.players.forEach((player) => {
            player.cards = [];
            player.currentBet = 0;
            player.isFolded = false;
            player.isActive = false;
        });

        // Rotacionar dealer
        this.gameState.dealerPosition =
            (this.gameState.dealerPosition + 1) % this.gameState.players.length;

        // Definir posições
        this.updatePositions();

        // Distribuir cartas
        this.dealHoleCards();

        // Postar blinds
        this.postBlinds();

        // Reset do estado da mesa
        this.gameState.communityCards = [];
        this.gameState.pot =
            this.gameState.smallBlind + this.gameState.bigBlind;
        this.gameState.currentBet = this.gameState.bigBlind;
        this.gameState.gamePhase = "preflop";
        this.gameState.activePlayerIndex =
            (this.gameState.dealerPosition + 3) % this.gameState.players.length;
        this.gameState.round++;

        return { ...this.gameState };
    }

    private updatePositions() {
        this.gameState.players.forEach((player, index) => {
            const position =
                (index -
                    this.gameState.dealerPosition +
                    this.gameState.players.length) %
                this.gameState.players.length;
            player.isDealer = position === 0;
            player.isSmallBlind = position === 1;
            player.isBigBlind = position === 2;
        });
    }

    private dealHoleCards() {
        // Distribuir 2 cartas para cada jogador
        for (let round = 0; round < 2; round++) {
            for (const player of this.gameState.players) {
                const card = this.deck.dealCard();
                if (card) {
                    player.cards.push(card);
                }
            }
        }
    }

    private postBlinds() {
        const sbPlayer = this.gameState.players.find((p) => p.isSmallBlind);
        const bbPlayer = this.gameState.players.find((p) => p.isBigBlind);

        if (sbPlayer) {
            sbPlayer.currentBet = this.gameState.smallBlind;
            sbPlayer.chips -= this.gameState.smallBlind;
        }

        if (bbPlayer) {
            bbPlayer.currentBet = this.gameState.bigBlind;
            bbPlayer.chips -= this.gameState.bigBlind;
        }
    }

    // Processar ação do jogador
    processAction(action: PokerAction): {
        success: boolean;
        message?: string;
        newState: GameState;
    } {
        const player = this.gameState.players.find(
            (p) => p.id === action.playerId
        );
        if (!player) {
            return {
                success: false,
                message: "Jogador não encontrado",
                newState: this.gameState,
            };
        }

        const activePlayer =
            this.gameState.players[this.gameState.activePlayerIndex];
        if (activePlayer.id !== action.playerId) {
            return {
                success: false,
                message: "Não é sua vez",
                newState: this.gameState,
            };
        }

        switch (action.type) {
            case "fold":
                return this.processFold(player);
            case "call":
                return this.processCall(player);
            case "raise":
                return this.processRaise(player, action.amount || 0);
            case "check":
                return this.processCheck(player);
            case "all-in":
                return this.processAllIn(player);
            default:
                return {
                    success: false,
                    message: "Ação inválida",
                    newState: this.gameState,
                };
        }
    }

    private processFold(player: Player): {
        success: boolean;
        message?: string;
        newState: GameState;
    } {
        player.isFolded = true;
        player.isActive = false;

        this.advanceToNextPlayer();

        return { success: true, newState: { ...this.gameState } };
    }

    private processCall(player: Player): {
        success: boolean;
        message?: string;
        newState: GameState;
    } {
        const callAmount = this.gameState.currentBet - player.currentBet;

        if (player.chips < callAmount) {
            return {
                success: false,
                message: "Chips insuficientes",
                newState: this.gameState,
            };
        }

        player.chips -= callAmount;
        player.currentBet += callAmount;
        this.gameState.pot += callAmount;

        this.advanceToNextPlayer();

        return { success: true, newState: { ...this.gameState } };
    }

    private processRaise(
        player: Player,
        amount: number
    ): { success: boolean; message?: string; newState: GameState } {
        const totalBet = this.gameState.currentBet + amount;
        const requiredChips = totalBet - player.currentBet;

        if (player.chips < requiredChips) {
            return {
                success: false,
                message: "Chips insuficientes",
                newState: this.gameState,
            };
        }

        if (amount < this.gameState.bigBlind) {
            return {
                success: false,
                message: "Raise mínimo é o big blind",
                newState: this.gameState,
            };
        }

        player.chips -= requiredChips;
        player.currentBet = totalBet;
        this.gameState.pot += requiredChips;
        this.gameState.currentBet = totalBet;

        this.advanceToNextPlayer();

        return { success: true, newState: { ...this.gameState } };
    }

    private processCheck(player: Player): {
        success: boolean;
        message?: string;
        newState: GameState;
    } {
        if (player.currentBet < this.gameState.currentBet) {
            return {
                success: false,
                message: "Não é possível dar check, há aposta para igualar",
                newState: this.gameState,
            };
        }

        this.advanceToNextPlayer();

        return { success: true, newState: { ...this.gameState } };
    }

    private processAllIn(player: Player): {
        success: boolean;
        message?: string;
        newState: GameState;
    } {
        const allInAmount = player.chips;
        player.currentBet += allInAmount;
        this.gameState.pot += allInAmount;
        player.chips = 0;
        player.isAllIn = true;

        if (player.currentBet > this.gameState.currentBet) {
            this.gameState.currentBet = player.currentBet;
        }

        this.advanceToNextPlayer();

        return { success: true, newState: { ...this.gameState } };
    }

    private advanceToNextPlayer() {
        let nextPlayerIndex =
            (this.gameState.activePlayerIndex + 1) %
            this.gameState.players.length;
        let attempts = 0;

        // Encontrar próximo jogador ativo
        while (attempts < this.gameState.players.length) {
            const nextPlayer = this.gameState.players[nextPlayerIndex];
            if (!nextPlayer.isFolded && !nextPlayer.isAllIn) {
                this.gameState.activePlayerIndex = nextPlayerIndex;
                return;
            }
            nextPlayerIndex =
                (nextPlayerIndex + 1) % this.gameState.players.length;
            attempts++;
        }

        // Se chegou aqui, todos os jogadores foldaram ou deram all-in
        this.advanceToNextStreet();
    }

    // Avançar para próxima rua (flop, turn, river, showdown)
    advanceToNextStreet(): GameState {
        // Reset das apostas
        this.gameState.players.forEach((player) => {
            player.currentBet = 0;
        });
        this.gameState.currentBet = 0;

        switch (this.gameState.gamePhase) {
            case "preflop":
                this.gameState.gamePhase = "flop";
                this.dealCommunityCards(3);
                break;
            case "flop":
                this.gameState.gamePhase = "turn";
                this.dealCommunityCards(1);
                break;
            case "turn":
                this.gameState.gamePhase = "river";
                this.dealCommunityCards(1);
                break;
            case "river":
                this.gameState.gamePhase = "showdown";
                this.determineWinner();
                break;
            case "showdown":
                this.gameState.gamePhase = "ended";
                break;
        }

        // Resetar posição ativa para primeiro jogador após dealer
        this.gameState.activePlayerIndex =
            (this.gameState.dealerPosition + 1) % this.gameState.players.length;
        this.findNextActivePlayer();

        return { ...this.gameState };
    }

    private dealCommunityCards(count: number) {
        for (let i = 0; i < count; i++) {
            const card = this.deck.dealCard();
            if (card) {
                this.gameState.communityCards.push(card);
            }
        }
    }

    private findNextActivePlayer() {
        let attempts = 0;
        while (attempts < this.gameState.players.length) {
            const player =
                this.gameState.players[this.gameState.activePlayerIndex];
            if (!player.isFolded && !player.isAllIn) {
                return;
            }
            this.gameState.activePlayerIndex =
                (this.gameState.activePlayerIndex + 1) %
                this.gameState.players.length;
            attempts++;
        }
    }

    private determineWinner() {
        // Implementação básica - pode ser melhorada com pokersolver
        const activePlayers = this.gameState.players.filter((p) => !p.isFolded);

        if (activePlayers.length === 1) {
            // Apenas um jogador restante
            activePlayers[0].chips += this.gameState.pot;
            this.gameState.pot = 0;
        } else {
            // Distribuir pot igualmente por enquanto (simplificado)
            const winAmount = Math.floor(
                this.gameState.pot / activePlayers.length
            );
            activePlayers.forEach((player) => {
                player.chips += winAmount;
            });
            this.gameState.pot = 0;
        }
    }

    // Getters
    getGameState(): GameState {
        return { ...this.gameState };
    }

    getCurrentPlayer(): Player | null {
        return this.gameState.players[this.gameState.activePlayerIndex] || null;
    }

    getAvailableActions(playerId: string): string[] {
        const player = this.gameState.players.find((p) => p.id === playerId);
        if (!player || player.isFolded || player.isAllIn) return [];

        const activePlayer = this.getCurrentPlayer();
        if (!activePlayer || activePlayer.id !== playerId) return [];

        const actions = ["fold"];

        if (player.currentBet === this.gameState.currentBet) {
            actions.push("check");
        } else {
            actions.push("call");
        }

        if (player.chips > this.gameState.bigBlind) {
            actions.push("raise");
        }

        if (player.chips > 0) {
            actions.push("all-in");
        }

        return actions;
    }

    // Método para adicionar bot
    addBot(botName: string, chips: number): boolean {
        if (this.gameState.players.length >= 9) return false;

        const botPlayer: Player = {
            id: `bot_${Date.now()}`,
            name: botName,
            chips,
            cards: [],
            currentBet: 0,
            isDealer: false,
            isSmallBlind: false,
            isBigBlind: false,
            isActive: false,
            isFolded: false,
            isAllIn: false,
            position: this.gameState.players.length,
            avatar: "🤖",
        };

        this.gameState.players.push(botPlayer);
        return true;
    }

    // Simular ação de bot
    simulateBotAction(): PokerAction | null {
        const currentPlayer = this.getCurrentPlayer();
        if (!currentPlayer || !currentPlayer.id.startsWith("bot_")) {
            return null;
        }

        const availableActions = this.getAvailableActions(currentPlayer.id);
        if (availableActions.length === 0) return null;

        // Estratégia simples de bot
        const random = Math.random();

        if (random < 0.3) {
            return { type: "fold", playerId: currentPlayer.id };
        } else if (random < 0.8 && availableActions.includes("call")) {
            return { type: "call", playerId: currentPlayer.id };
        } else if (availableActions.includes("check")) {
            return { type: "check", playerId: currentPlayer.id };
        } else if (availableActions.includes("raise") && random < 0.9) {
            const raiseAmount =
                this.gameState.bigBlind * (1 + Math.floor(Math.random() * 3));
            return {
                type: "raise",
                amount: raiseAmount,
                playerId: currentPlayer.id,
            };
        } else {
            return { type: "call", playerId: currentPlayer.id };
        }
    }
}
