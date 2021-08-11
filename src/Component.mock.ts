import { Component } from "./Component";
import { EntityConfig } from "./Entity.h";

export class Velocity extends Component({ dx: 0, dy: 0 }) {}
const circleStruct = { x: 0, y: 0, r: 0 };
export class Circle extends Component(circleStruct) {}
export class Flag extends Component({}) {}

export class Position extends Component({ x: 0, y: 0 }) {}
export class Shape extends Component({ value: "" }) {}
export const Renderable = { Position, Shape };
export type RenderEntity = EntityConfig<typeof Renderable>;

export class BaseSystem<TProperties extends {} = {}> {
  properties: TProperties;
}

//export default class RenderableSystem extends System<typeof Renderable> {
