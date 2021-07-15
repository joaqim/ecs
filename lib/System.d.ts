import { Engine } from "./Engine";
export declare const PrimedSystems: (systems: System[]) => System[];
declare abstract class System {
    private _priority;
    private readonly _engines;
    constructor();
    get priority(): number;
    set priority(value: number);
    get engines(): readonly Engine[];
    onAttach(engine: Engine): void;
    onDetach(engine: Engine): void;
    abstract update(engine: Engine, delta: number): void;
}
export { System };
