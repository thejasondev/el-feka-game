"use client";

import { useState, useCallback } from "react";
import { SetupScreen } from "@/components/game/setup-screen";
import { PlayerSetup } from "@/components/game/player-setup";
import { RoleReveal } from "@/components/game/role-reveal";
import { TimerPhase } from "@/components/game/timer-phase";
import { IndividualVoting } from "@/components/game/individual-voting";
import { ResultsScreen } from "@/components/game/results-screen";
import { RulesSheet } from "@/components/game/rules-sheet";
import {
  getRandomWord,
  selectImpostors,
  type CategoryKey,
} from "@/lib/game-data";

type GamePhase =
  | "setup"
  | "playerSetup"
  | "roleReveal"
  | "timer"
  | "voting"
  | "results";

interface PlayerVote {
  voterIndex: number;
  votedForIndices: number[]; // Array para soportar 1 o 2 votos
}

interface GameState {
  phase: GamePhase;
  playerCount: number;
  players: string[];
  category: CategoryKey;
  timerDuration: number;
  secretWord: string;
  categoryName: string;
  impostorIndices: number[];
  currentPlayerIndex: number;
  // Voting state
  currentVoterIndex: number;
  votes: PlayerVote[];
  // Scoring
  scores: number[];
  streak: number;
  twoImpostors: boolean;
}

const initialState: GameState = {
  phase: "setup",
  playerCount: 4,
  players: [],
  category: "mixto",
  timerDuration: 180,
  secretWord: "",
  categoryName: "",
  impostorIndices: [],
  currentPlayerIndex: 0,
  currentVoterIndex: 0,
  votes: [],
  scores: [],
  streak: 0,
  twoImpostors: false,
};

export default function ElFekaGame() {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const handleStartGame = useCallback(
    (
      playerCount: number,
      category: CategoryKey,
      timerDuration: number,
      twoImpostors: boolean
    ) => {
      setGameState((prev) => ({
        ...prev,
        phase: "playerSetup",
        playerCount,
        category,
        timerDuration,
        twoImpostors,
        // Initialize scores if not already set
        scores:
          prev.scores.length === playerCount
            ? prev.scores
            : Array(playerCount).fill(0),
      }));
    },
    []
  );

  const handleConfirmPlayers = useCallback(
    (players: string[]) => {
      const { word, category: catName } = getRandomWord(gameState.category);
      const impostorCount = gameState.twoImpostors ? 2 : 1;
      const impostors = selectImpostors(players.length, impostorCount);

      setGameState((prev) => ({
        ...prev,
        phase: "roleReveal",
        players,
        secretWord: word,
        categoryName: catName,
        impostorIndices: impostors,
        currentPlayerIndex: 0,
        currentVoterIndex: 0,
        votes: [],
        // Keep existing scores or initialize new ones
        scores:
          prev.scores.length === players.length
            ? prev.scores
            : Array(players.length).fill(0),
      }));
    },
    [gameState.category, gameState.twoImpostors]
  );

  const handleBackToSetup = useCallback(() => {
    setGameState((prev) => ({ ...prev, phase: "setup" }));
  }, []);

  const handleNextPlayer = useCallback(() => {
    setGameState((prev) => {
      const nextIndex = prev.currentPlayerIndex + 1;
      if (nextIndex >= prev.playerCount) {
        return { ...prev, phase: "timer" };
      }
      return { ...prev, currentPlayerIndex: nextIndex };
    });
  }, []);

  const handleVotingStart = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: "voting",
      currentVoterIndex: 0,
      votes: [],
    }));
  }, []);

  const handleIndividualVote = useCallback((votedForIndices: number[]) => {
    setGameState((prev) => {
      const newVotes = [
        ...prev.votes,
        { voterIndex: prev.currentVoterIndex, votedForIndices },
      ];
      const nextVoter = prev.currentVoterIndex + 1;

      // If all players have voted, go to results
      if (nextVoter >= prev.players.length) {
        return calculateResults({ ...prev, votes: newVotes });
      }

      // Move to next voter
      return { ...prev, votes: newVotes, currentVoterIndex: nextVoter };
    });
  }, []);

  const handleSkipToResults = useCallback(() => {
    setGameState((prev) => calculateResults(prev));
  }, []);

  const calculateResults = (state: GameState): GameState => {
    // Contar votos para cada jugador (aplanando los arrays de votos)
    const voteCounts = state.players.map(
      (_, index) =>
        state.votes.filter((v) => v.votedForIndices.includes(index)).length
    );
    const maxVotes = Math.max(...voteCounts);
    const votedOutIndex = voteCounts.indexOf(maxVotes);

    // Lógica de victoria según modo de juego
    let realesWin: boolean;

    if (state.twoImpostors) {
      // En modo 2 impostores: REALES ganan si AMBOS impostores reciben al menos 1 voto
      const impostorsWithVotes = state.impostorIndices.filter(
        (idx) => voteCounts[idx] > 0
      );
      realesWin = impostorsWithVotes.length === 2; // Ambos deben tener votos
    } else {
      // En modo 1 impostor: REALES ganan si el impostor tiene los votos máximos (o empata)
      const impostorVotes = voteCounts[state.impostorIndices[0]];
      realesWin = impostorVotes >= maxVotes && impostorVotes > 0;
    }

    // Update scores
    const newScores = [...state.scores];
    state.votes.forEach((vote) => {
      // +1 por cada voto correcto hacia un impostor
      vote.votedForIndices.forEach((votedIdx) => {
        if (state.impostorIndices.includes(votedIdx)) {
          newScores[vote.voterIndex] += 1;
        }
      });
    });

    // Impostors get +2 each if they win
    if (!realesWin) {
      state.impostorIndices.forEach((idx) => {
        newScores[idx] += 2;
      });
    }

    return {
      ...state,
      phase: "results",
      scores: newScores,
      streak: realesWin ? state.streak + 1 : 0,
    };
  };

  const handlePlayAgain = useCallback(() => {
    const { word, category: catName } = getRandomWord(gameState.category);
    const impostorCount = gameState.twoImpostors ? 2 : 1;
    const impostors = selectImpostors(gameState.players.length, impostorCount);

    setGameState((prev) => ({
      ...prev,
      phase: "roleReveal",
      secretWord: word,
      categoryName: catName,
      impostorIndices: impostors,
      currentPlayerIndex: 0,
      currentVoterIndex: 0,
      votes: [],
    }));
  }, [gameState.category, gameState.players.length, gameState.twoImpostors]);

  const handleNewGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  // Render content based on game phase
  const renderPhaseContent = () => {
    switch (gameState.phase) {
      case "setup":
        return <SetupScreen onStartGame={handleStartGame} />;

      case "playerSetup":
        return (
          <PlayerSetup
            playerCount={gameState.playerCount}
            onConfirmPlayers={handleConfirmPlayers}
            onBack={handleBackToSetup}
          />
        );

      case "roleReveal":
        const currentImpostorIndex = gameState.impostorIndices.indexOf(
          gameState.currentPlayerIndex
        );
        const isCurrentPlayerImpostor = currentImpostorIndex !== -1;
        // Find partner for 2 impostors mode
        const partnerIndex = isCurrentPlayerImpostor
          ? gameState.impostorIndices.find(
              (i) => i !== gameState.currentPlayerIndex
            )
          : undefined;

        return (
          <RoleReveal
            playerName={gameState.players[gameState.currentPlayerIndex]}
            currentPlayerIndex={gameState.currentPlayerIndex}
            totalPlayers={gameState.playerCount}
            isImpostor={isCurrentPlayerImpostor}
            secretWord={gameState.secretWord}
            categoryName={gameState.categoryName}
            hasPartner={gameState.twoImpostors && isCurrentPlayerImpostor}
            partnerName={
              partnerIndex !== undefined
                ? gameState.players[partnerIndex]
                : undefined
            }
            onNext={handleNextPlayer}
          />
        );

      case "timer":
        return (
          <TimerPhase
            duration={gameState.timerDuration}
            secretWord={gameState.secretWord}
            categoryName={gameState.categoryName}
            onVotingStart={handleVotingStart}
          />
        );

      case "voting":
        return (
          <IndividualVoting
            players={gameState.players}
            currentVoterIndex={gameState.currentVoterIndex}
            onVote={handleIndividualVote}
            onSkipToResults={handleSkipToResults}
            votesCollected={gameState.votes.length}
            twoImpostors={gameState.twoImpostors}
          />
        );

      case "results":
        return (
          <ResultsScreen
            players={gameState.players}
            impostorIndices={gameState.impostorIndices}
            secretWord={gameState.secretWord}
            categoryName={gameState.categoryName}
            votes={gameState.votes}
            scores={gameState.scores}
            streak={gameState.streak}
            twoImpostors={gameState.twoImpostors}
            onPlayAgain={handlePlayAgain}
            onNewGame={handleNewGame}
          />
        );

      default:
        return <SetupScreen onStartGame={handleStartGame} />;
    }
  };

  return renderPhaseContent();
}
