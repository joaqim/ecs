import type { IComponent, IComponentClass } from "../Component.h";
import type { IEngine } from "../Engine";
import type { ISignature } from "./Signature.h";
export declare class SignatureBuilder {
    private engine;
    private cached;
    private readonly included;
    private readonly excluded;
    constructor(engine?: IEngine);
    include(...classes: IComponentClass<IComponent>[]): SignatureBuilder;
    exclude(...classes: IComponentClass<IComponent>[]): SignatureBuilder;
    changeEngine(engine: IEngine): SignatureBuilder;
    setCached(cached: boolean): void;
    build(): ISignature;
}
