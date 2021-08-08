import type { IEngine } from "../Engine";
import type { ISystem } from "./System.h";
export declare const PrimedSystems: (systems: ISystem[]) => ISystem[];
declare abstract class System implements ISystem {
    priority: number;
    private readonly engines;
    constructor();
    getPriority(): number;
    setPriority(value: number): void;
    listEngines(): readonly IEngine[];
    onAttach(engine: IEngine): void;
    onDetach(engine: IEngine): void;
    abstract update(engine: IEngine, delta: number): any;
}
export { System };
