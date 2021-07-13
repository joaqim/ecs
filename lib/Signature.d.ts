import { Component, ComponentClass } from "./Component";
import { Engine } from "./Engine";
import { Entity } from "./Entity";
interface Signature {
    readonly entities: ReadonlyArray<Entity>;
    includesEntity(entity: Entity): boolean;
}
declare class SignatureBuilder {
    private _engine;
    private _cached;
    private readonly _include;
    private readonly _exclude;
    constructor(engine?: Engine);
    include(...classes: ComponentClass<Component>[]): SignatureBuilder;
    exclude(...classes: ComponentClass<Component>[]): SignatureBuilder;
    changeEngine(engine: Engine): SignatureBuilder;
    setCached(cached: boolean): void;
    build(): Signature;
}
export { Signature, SignatureBuilder };
