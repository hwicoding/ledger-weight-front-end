/**
 * React Navigation 타입 정의
 */

export type RootStackParamList = {
  Lobby: undefined;
  Game: { gameId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

