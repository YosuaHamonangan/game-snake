import {
  _decorator,
  Component,
  Node,
  UITransform,
  Vec2,
  Vec3,
  Prefab,
  instantiate,
  systemEvent,
  SystemEvent,
  macro,
  randomRangeInt,
  AudioClip,
  AudioSource,
  assetManager,
} from "cc";
import { FIELD_EVENT, FIELD_STATE } from "../enum/field";
import { SNAKE_DIRECTION, SNAKE_SECTION_TYPE } from "../enum/snake";
import { SnakeControl } from "./SnakeControl";
import levelConfigs from "../config/level";
import { FieldConfig, LevelConfig, SnakeConfig } from "../interface/config";
import { AUDIO_KEY, AUDIO_KEY_PROP } from "../enum/asset";
import { getAudioId } from "../util/asset";
import { AudioControl } from "./AudioControl";
import { PanelControl } from "./PanelControl";
import { PANEL_EVENT } from "../enum/panel";
import { DataManagerControl } from "./DataManagerControl";

const { ccclass, property } = _decorator;

enum ContentKey {
  snake,
  food,
  wall,
  bound,
}

interface SnakeSectionInfo {
  key: ContentKey.snake;
  pos: Vec3;
  tile: Vec2;
  type: SNAKE_SECTION_TYPE;
  node: Node;
  control: SnakeControl;
  dir: SNAKE_DIRECTION;
  hasFood: boolean;
}

interface FoodInfo {
  key: ContentKey.food;
  pos: Vec3;
  tile: Vec2;
  node: Node;
}

interface WallInfo {
  key: ContentKey.wall;
  pos: Vec3;
  tile: Vec2;
  node: Node;
}

type TileContent = WallInfo | FoodInfo | SnakeSectionInfo | null;

@ccclass("FieldControl")
export class FieldControl extends Component {
  @property(Node)
  bgNode?: Node | null;

  @property(Prefab)
  snakePrefab?: Prefab | null;

  @property(Prefab)
  foodPrefab?: Prefab | null;

  @property(Prefab)
  wallPrefab?: Prefab | null;

  @property(AUDIO_KEY_PROP)
  private eatKey?: AUDIO_KEY | null;
  private eatClip?: AudioClip | null;

  @property(AUDIO_KEY_PROP)
  private crashKey?: AUDIO_KEY | null;
  private crashClip?: AudioClip | null;

  @property(AUDIO_KEY_PROP)
  private turnKey?: AUDIO_KEY | null;
  private turnClip?: AudioClip | null;

  @property(Node)
  container?: Node | null;

  @property(PanelControl)
  panel?: PanelControl | null;

  private cols = 0;
  get Cols(): number {
    return this.cols;
  }
  private rows = 0;
  get Rows(): number {
    return this.rows;
  }
  private tiles: TileContent[][] = [];
  private tileSize: number = 0;
  get TileSize(): number {
    return this.tileSize;
  }

  private snakeSections: SnakeSectionInfo[] = [];

  private nextDir = SNAKE_DIRECTION.UP;

  private state = FIELD_STATE.PREPARE;
  private score = 0;
  private generatedTail = 0;
  // Value of generatedTail when last update move
  private lastUpdateMoveIdx = 0;
  private moveInterval = 0;
  private minMoveInterval = 0;
  private accelerateEvery = 0;
  private acceleration = 0;

  private audioSource?: AudioSource | null;

  onLoad() {
    this.setUpLevel();
    this.setEventHandler();
  }

  start() {
    this.spawnFood();
    this.waitForPlayer();
  }

  private setEventHandler() {
    systemEvent.on(SystemEvent.EventType.KEY_DOWN, (evt) => {
      let dir: SNAKE_DIRECTION;
      switch (evt.keyCode) {
        case macro.KEY.up:
          dir = SNAKE_DIRECTION.UP;
          break;
        case macro.KEY.down:
          dir = SNAKE_DIRECTION.DOWN;
          break;
        case macro.KEY.left:
          dir = SNAKE_DIRECTION.LEFT;
          break;
        case macro.KEY.right:
          dir = SNAKE_DIRECTION.RIGHT;
          break;
        default:
          return;
      }
      this.node.emit(FIELD_EVENT.CHANGE_DIR, dir);
    });

    this.node.on(FIELD_EVENT.CHANGE_DIR, (dir: SNAKE_DIRECTION) => {
      const valid = this.setDirection(dir);
      if (valid && this.state === FIELD_STATE.WAIT_PLAYER) {
        this.setState(FIELD_STATE.PLAY);
      }
    });

    this.panel?.node.on(PANEL_EVENT.PLAY_AGAIN, () => {
      this.setUpLevel();
      this.waitForPlayer();
      this.panel?.hide();
    });
  }

  private setUpLevel() {
    const idx = randomRangeInt(0, 3);
    const config: LevelConfig = levelConfigs[idx];
    const { fieldConfig, snakeConfig } = config;

    this.setScore(0);

    this.setUpField(fieldConfig);
    this.setUpSnake(snakeConfig);
    this.setUpAudio();
  }

  private setUpField(config: FieldConfig) {
    this.rows = config.tiles.length;
    this.cols = config.tiles[0].length;
    const bgUITransform = this.bgNode?.getComponent(UITransform);
    if (bgUITransform) {
      this.tileSize =
        (bgUITransform.contentSize.x / this.cols) * bgUITransform.node.scale.x;
    }

    if (this.container) {
      this.container.children.forEach((child) => child.destroy());
    }

    this.tiles = new Array(this.rows);
    for (let row = 0; row < this.rows; row++) {
      this.tiles[row] = new Array(this.cols);
      for (let col = 0; col < this.cols; col++) {
        if (config.tiles[row][col]) {
          this.createWall(col, row);
        } else this.tiles[row][col] = null;
      }
    }
  }

  private setUpSnake(config: SnakeConfig) {
    const { interval, parts } = config;
    this.moveInterval = interval.initial;
    this.minMoveInterval = interval.minimum;
    this.accelerateEvery = interval.accelerateEvery;
    this.acceleration = interval.accelerateMultiplier;
    this.generatedTail = 0;
    this.lastUpdateMoveIdx = 0;

    if (config.parts.length < 3) {
      throw new Error("Snake parts can't be less than 3");
    }

    this.snakeSections = [];
    parts.forEach((part) => {
      this.createSnakeSection(
        part.x,
        part.y,
        SNAKE_DIRECTION.UP,
        SNAKE_SECTION_TYPE.BODY
      );
    });

    for (let i = this.snakeSections.length - 1; i > 0; i--) {
      const section = this.snakeSections[i];
      const front = this.snakeSections[i - 1];
      const dir = this.getPairsDir(front, section);
      if (dir === null) {
        throw new Error("Invalid snake part sequence");
      }
      section.dir = dir;
    }

    const head = this.snakeSections[0];
    head.dir = this.snakeSections[1].dir;
    head.type = SNAKE_SECTION_TYPE.HEAD;
    const tail = this.snakeSections[this.snakeSections.length - 1];
    tail.type = SNAKE_SECTION_TYPE.TAIL;

    this.updateSectionNode();
  }

  setUpAudio() {
    this.audioSource = AudioControl.Instance.audioSource;

    if (this.eatKey) {
      const id = getAudioId(this.eatKey);
      this.eatClip = assetManager.assets.get(id) as AudioClip;
    }

    if (this.crashKey) {
      const id = getAudioId(this.crashKey);
      this.crashClip = assetManager.assets.get(id) as AudioClip;
    }

    if (this.turnKey) {
      const id = getAudioId(this.turnKey);
      this.turnClip = assetManager.assets.get(id) as AudioClip;
    }
  }

  private getPairsDir(
    front: SnakeSectionInfo,
    back: SnakeSectionInfo
  ): SNAKE_DIRECTION | null {
    const delta = front.tile.clone().subtract(back.tile);
    if (delta.x === 1 && delta.y === 0) {
      return SNAKE_DIRECTION.RIGHT;
    }
    if (delta.x === -1 && delta.y === 0) {
      return SNAKE_DIRECTION.LEFT;
    }
    if (delta.x === 0 && delta.y === 1) {
      return SNAKE_DIRECTION.DOWN;
    }
    if (delta.x === 0 && delta.y === -1) {
      return SNAKE_DIRECTION.UP;
    }
    return null;
  }

  waitForPlayer() {
    this.setState(FIELD_STATE.WAIT_PLAYER);
    this.scheduleMove();
  }

  scheduleMove() {
    this.unschedule(this.move);
    this.schedule(this.move, this.moveInterval);
  }

  private getTilePos(tile: Vec2): Vec3 {
    const x = this.getColX(tile.x);
    const y = this.getRowY(tile.y);

    return new Vec3(x, y, 0);
  }

  private getColX(col: number): number {
    return (col - this.cols / 2 + 0.5) * this.tileSize;
  }

  private getRowY(row: number): number {
    return -(row - this.rows / 2 + 0.5) * this.tileSize;
  }

  setTileContent(tile: Vec2, content: TileContent) {
    this.tiles[tile.y][tile.x] = content;
  }

  getTileContent(tile: Vec2): TileContent {
    return this.tiles[tile.y][tile.x];
  }

  private spawnFood() {
    const newFoodTile = this.getRandomEmptyTile();
    if (newFoodTile) {
      this.createFood(newFoodTile.x, newFoodTile.y);
    } else {
      this.gameOver();
    }
  }

  getRandomEmptyTile(): Vec2 | null {
    const candidate: Vec2[] = [];
    this.tiles.forEach((r, row) =>
      r.forEach((tile, col) => {
        if (!tile) candidate.push(new Vec2(col, row));
      })
    );

    if (!candidate.length) return null;
    const idx = randomRangeInt(0, candidate.length);
    return candidate[idx];
  }

  private setState(newState: FIELD_STATE) {
    this.state = newState;
  }

  private createWall(col: number, row: number) {
    const tile = new Vec2(col, row);
    const pos = this.getTilePos(tile);
    const node = instantiate(this.wallPrefab!);
    node.parent = this.container!;
    node.setPosition(pos);

    const content: WallInfo = { key: ContentKey.wall, tile, pos, node };
    this.setTileContent(tile, content);
    return content;
  }

  private createFood(col: number, row: number) {
    const tile = new Vec2(col, row);
    const pos = this.getTilePos(tile);
    const node = instantiate(this.foodPrefab!);
    node.parent = this.container!;
    node.setPosition(pos);

    const content: FoodInfo = { key: ContentKey.food, tile, pos, node };
    this.setTileContent(tile, content);
    return content;
  }

  private createSnakeSection(
    col: number,
    row: number,
    dir: SNAKE_DIRECTION,
    type: SNAKE_SECTION_TYPE
  ): SnakeSectionInfo {
    const tile = new Vec2(col, row);
    const pos = this.getTilePos(tile);
    const node = instantiate(this.snakePrefab!);
    node.parent = this.container!;
    node.setPosition(pos);

    const control = node.getComponent(SnakeControl)!;
    control.setDir(dir);
    control.setType(type);

    const section: SnakeSectionInfo = {
      key: ContentKey.snake,
      tile,
      pos,
      type,
      node,
      control,
      dir,
      hasFood: false,
    };

    this.snakeSections.push(section);

    return section;
  }

  getSnakeHead(): SnakeSectionInfo {
    return this.snakeSections[0];
  }

  getSnakeTail(): SnakeSectionInfo {
    return this.snakeSections[this.snakeSections.length - 1];
  }

  private getNextHeadTile() {
    const head = this.getSnakeHead();
    const result = head.tile.clone();

    switch (this.nextDir) {
      case SNAKE_DIRECTION.RIGHT:
        result.add2f(1, 0);
        break;
      case SNAKE_DIRECTION.LEFT:
        result.add2f(-1, 0);
        break;
      case SNAKE_DIRECTION.UP:
        result.add2f(0, -1);
        break;
      case SNAKE_DIRECTION.DOWN:
        result.add2f(0, 1);
        break;
    }

    return result;
  }

  public setDirection(dir: SNAKE_DIRECTION): boolean {
    const head = this.getSnakeHead();
    const currentDir = head.dir;
    const { UP, DOWN, LEFT, RIGHT } = SNAKE_DIRECTION;

    switch (currentDir) {
      case dir:
        break;
      case RIGHT:
      case LEFT:
        if (dir === LEFT || dir === RIGHT) return false;
        break;
      case UP:
      case DOWN:
        if (dir === UP || dir === DOWN) return false;
        break;
    }

    if (this.nextDir !== dir) {
      this.playTurnSfx();
    }
    this.nextDir = dir;
    return true;
  }

  private move() {
    if (this.state !== FIELD_STATE.PLAY) return;

    // temp variable for caching informations between sections
    let tempSection = {} as SnakeSectionInfo;
    let prvSection = {} as SnakeSectionInfo;

    const head = this.getSnakeHead();

    // cache current head information before change
    Object.assign(prvSection, head);

    head.tile = this.getNextHeadTile();
    head.pos = this.getTilePos(head.tile);
    head.dir = this.nextDir;
    head.hasFood = false;

    // the section after head always follows head direction
    prvSection.dir = this.nextDir;

    for (let i = 1; i < this.snakeSections.length; i++) {
      const section = this.snakeSections[i];
      Object.assign(tempSection, section);

      section.tile = prvSection.tile;
      section.pos = prvSection.pos;
      section.dir = prvSection.dir;
      section.hasFood = prvSection.hasFood;

      Object.assign(prvSection, tempSection);
    }

    // Information about tail before move
    const prvTail = prvSection;

    // Check if any food reached tail, if so create new section
    if (prvTail.hasFood) {
      const { x: col, y: row } = prvSection.tile;
      const tail = this.getSnakeTail();
      tail.type = SNAKE_SECTION_TYPE.BODY;

      this.createSnakeSection(
        col,
        row,
        prvSection.dir,
        SNAKE_SECTION_TYPE.TAIL
      );

      this.generatedTail++;
    }

    this.updateSectionNode();

    // Update tile content
    // Head updated later to prevent collision detection
    for (let i = 1; i < this.snakeSections.length; i++) {
      const section = this.snakeSections[i];
      this.setTileContent(section.tile, section);
    }

    // Remove tail from tiles since it moved
    // Not remove if tail has moved since there is replacement
    if (!prvSection.hasFood) {
      this.setTileContent(prvSection.tile, null);
    }

    if (this.checkLose()) {
      this.playCrashSfx();
      return this.gameOver();
    }

    // Check for food
    const collidedContent = this.getTileContent(head.tile);
    if (collidedContent?.key === ContentKey.food) {
      collidedContent.node.destroy();
      head.hasFood = true;
      this.onEatFood();
    }

    this.updateMoveInterval();
  }

  private updateSectionNode() {
    this.snakeSections.forEach((section, i, sections) => {
      section.node.setPosition(section.pos);
      section.control.setDir(section.dir);

      if (section.type === SNAKE_SECTION_TYPE.BODY) {
        section.control.setType(section.type, {
          hasFood: section.hasFood,
          // direction for the section in behind for turning
          prvDir: sections[i + 1].dir,
        });
      } else {
        section.control.setType(section.type);
      }
    });
  }

  private updateMoveInterval() {
    if (this.generatedTail === this.lastUpdateMoveIdx) return;

    if (this.generatedTail % this.accelerateEvery === 0) {
      this.lastUpdateMoveIdx = this.generatedTail;
      this.moveInterval = Math.max(
        this.minMoveInterval,
        this.moveInterval * this.acceleration
      );
      this.scheduleMove();
    }
  }

  private checkLose(): boolean {
    const { tile } = this.getSnakeHead();

    // Check hit bound
    if (
      tile.x < 0 ||
      tile.x >= this.cols ||
      tile.y < 0 ||
      tile.y >= this.rows
    ) {
      return true;
    }

    const collidedContent = this.getTileContent(tile);
    if (!collidedContent) return false;
    if (collidedContent.key === ContentKey.snake) return true;
    if (collidedContent.key === ContentKey.wall) return true;
    return false;
  }

  onEatFood() {
    this.setScore(this.score + 1);
    this.playEatSfx();
    this.spawnFood();
  }

  setScore(val: number) {
    this.score = val;

    if (DataManagerControl.Instance) {
      DataManagerControl.Instance.score = val;
    }

    this.node.emit(FIELD_EVENT.SCORE_UPDATE, val);
  }

  private gameOver() {
    this.setState(FIELD_STATE.GAME_OVER);
    this.unschedule(this.move);

    if (DataManagerControl.Instance) {
      DataManagerControl.Instance.setHighScore(this.score);
    }

    this.panel?.show();
  }

  private playCrashSfx() {
    if (this.audioSource && this.crashClip) {
      this.audioSource.playOneShot(this.crashClip);
    }
  }

  private playEatSfx() {
    if (this.audioSource && this.eatClip) {
      this.audioSource.playOneShot(this.eatClip);
    }
  }

  private playTurnSfx() {
    if (this.audioSource && this.turnClip) {
      this.audioSource.playOneShot(this.turnClip);
    }
  }
}
