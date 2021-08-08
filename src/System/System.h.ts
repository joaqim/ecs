import { IEngine } from "../Engine";

export interface ISystem {
  priority: number;
  onAttach(engine: IEngine): void;
  onDetach(engine: IEngine): void;
  update(engine: IEngine, delta: number): any;
}
