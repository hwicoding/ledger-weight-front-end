import { RootState } from '@/store/store';

// Game Selectors
export const selectGameState = (state: RootState) => state.game.gameState;
export const selectGameLoading = (state: RootState) => state.game.isLoading;
export const selectGameError = (state: RootState) => state.game.error;
export const selectGameEvents = (state: RootState) => state.game.events;
export const selectCurrentTurn = (state: RootState) =>
  state.game.gameState?.currentTurn;
export const selectTurnState = (state: RootState) =>
  state.game.gameState?.turnState;
export const selectPlayers = (state: RootState) =>
  state.game.gameState?.players || [];
export const selectCurrentPlayer = (state: RootState) => {
  const gameState = state.game.gameState;
  const currentPlayerId = state.player.currentPlayerId;
  if (!gameState || !currentPlayerId) return null;
  return gameState.players.find(p => p.id === currentPlayerId) || null;
};
export const selectTurnPlayer = (state: RootState) => {
  const gameState = state.game.gameState;
  if (!gameState) return null;
  return gameState.players.find(p => p.id === gameState.currentTurn) || null;
};

// Player Selectors
export const selectCurrentPlayerId = (state: RootState) =>
  state.player.currentPlayerId;
export const selectSelectedCard = (state: RootState) => state.player.selectedCard;
export const selectSelectedTarget = (state: RootState) =>
  state.player.selectedTarget;
export const selectIsTargeting = (state: RootState) => state.player.isTargeting;

// UI Selectors
export const selectModals = (state: RootState) => state.ui.modals;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectUILoading = (state: RootState) => state.ui.isLoading;
export const selectUIError = (state: RootState) => state.ui.error;

