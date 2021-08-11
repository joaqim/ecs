import type { IEngine } from "../Engine";
import type { ISystem } from "./System.h";

abstract class System implements ISystem {
  priority: number;

  private readonly engines: IEngine[];

  constructor() {
    this.priority = 0;
    this.engines = [];
  }

  getPriority(): number {
    return this.priority;
  }

  setPriority(value: number) {
    this.priority = value;
    this.listEngines().forEach((engine: IEngine) => {
      engine.notifyPriorityChange(this);
    });
  }

  listEngines(): readonly IEngine[] {
    return Object.freeze(this.engines.slice(0));
  }

  onAttach(engine: IEngine): void {
    const index = this.engines.indexOf(engine);
    if (index === -1) {
      this.engines.push(engine);
    }
  }

  onDetach(engine: IEngine): void {
    const index = this.engines.indexOf(engine);
    if (index !== -1) {
      this.engines.splice(index, 1);
    }
  }

  abstract update(engine: IEngine, delta: number): any;
}

export { System };
