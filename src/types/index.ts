import * as THREE from 'three';

// Game state types
export type GameStatus = 'running' | 'over' | 'paused';

export interface GameState {
  status: GameStatus;
  score: number;
  cornCount: number;
  checkpointRow: number;
  checkpointTile: number;
  isPaused: boolean;
}

// Player types
export type MoveDirection = 'forward' | 'backward' | 'left' | 'right';

export interface PlayerPosition {
  rowIndex: number;
  tileIndex: number;
}

export interface PlayerState {
  currentRow: number;
  currentTile: number;
  movesQueue: MoveDirection[];
  ref: THREE.Group | null;
  shake: boolean;
  shakeStartTime: number | null;
  respawning: boolean;
  respawnStartTime: number | null;
  respawnDuration: number;
}

// Map types
export type RowType = 'forest' | 'log' | 'animal' | 'grass';

export interface Tree {
  tileIndex: number;
  height: number;
}

export interface Corn {
  tileIndex: number;
  start?: number;
}

export interface CollectedCorn {
  tileIndex: number;
  start: number;
}

export interface ForestRow {
  type: 'forest';
  trees: Tree[];
  corn?: number[];
  collectedCorn?: CollectedCorn[];
}

export interface LogRow {
  type: 'log';
  direction: boolean;
  speed: number;
  logs: Array<{ index: number }>;
}

export interface AnimalRow {
  type: 'animal';
  direction: boolean;
  speed: number;
  animals: Array<{ index: number; species: string }>;
}

export interface GrassRow {
  type: 'grass';
}

export type RowData = ForestRow | LogRow | AnimalRow | GrassRow;

// Store types
export interface GameStore {
  status: GameStatus;
  score: number;
  cornCount: number;
  checkpointRow: number;
  checkpointTile: number;
  isPaused: boolean;
  setCheckpoint: (row: number, tile: number) => void;
  incrementCorn: () => void;
  updateScore: (row: number) => void;
  setStatus: (status: GameStatus) => void;
  setPaused: (paused: boolean) => void;
  reset: () => void;
}

export interface MapStore {
  rows: RowData[];
  addRows: () => void;
  reset: () => void;
}

export interface UserData {
  id: string;
  name: string;
}

export interface UserStore {
  userData: UserData | null;
  setUserName: (name: string) => void;
  clearUser: () => void;
}

// Component props types
export interface GrassProps {
  rowIndex: number;
  children?: React.ReactNode;
}

export interface TreeProps {
  tileIndex: number;
  height: number;
}

export interface CornProps {
  tileIndex: number;
  collected?: boolean;
  start?: number;
  rowIndex?: number;
}

export interface RowProps {
  rowIndex: number;
  rowData: RowData;
}

export interface ForestProps {
  rowIndex: number;
  rowData: ForestRow;
}

// Animation types
export interface AnimationRef {
  current: THREE.Group | null;
}

// Sound types
export interface SoundState {
  isPlaying: boolean;
  volume: number;
  buffer: AudioBuffer | null;
}
