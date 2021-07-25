import { IComponent, IComponentClass } from "Component.h";
import { IEngine } from "Engine";
import { ISignature } from "Signature";
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
