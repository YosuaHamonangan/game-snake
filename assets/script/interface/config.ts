export interface FieldConfig {
  tiles: number[][];
}

export interface SnakeConfig {
  parts: { x: number; y: number }[];
  interval: {
    initial: number;
    accelerateMultiplier: number;
    accelerateEvery: number;
    minimum: number;
  };
}

export interface LevelConfig {
  fieldConfig: FieldConfig;
  snakeConfig: SnakeConfig;
}
