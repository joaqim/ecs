import { IComponent, IComponentClass } from "Component.h";
import { IEngine } from "Engine";
import { ISignature } from "Signature";
import CachedSignature from "./CachedSignature";
import NonCachedSignature from "./NonCachedSignature";

/**
 * Utility class to build Signatures.
 * It's the only way to create the implementations of CachedSignature and NonCachedSignature.
 */
export default class SignatureBuilder {
  private engine: IEngine | null;

  private cached: boolean;

  private readonly included: IComponentClass<IComponent>[];

  private readonly excluded: IComponentClass<IComponent>[];

  constructor(engine?: IEngine) {
    this.engine = engine || null;
    this.included = [];
    this.excluded = [];
    this.cached = true;
  }

  /**
   * Indicates than entities than are members of this class MUST
   * HAVE this components.
   * @param classes A list of component classes.
   */
  include(...classes: IComponentClass<IComponent>[]): SignatureBuilder {
    this.included.push(...classes);
    return this;
  }

  /**
   * Indicates than entities than are members of this class MUST NOT
   * HAVE this components.
   * @param classes A list of component classes.
   */
  exclude(...classes: IComponentClass<IComponent>[]): SignatureBuilder {
    this.excluded.push(...classes);
    return this;
  }

  /**
   * Changes the engine of the builder.
   * Useful to create multiple instances of the same signature for different
   * engines.
   * @param engine
   */
  changeEngine(engine: IEngine): SignatureBuilder {
    this.engine = engine;
    return this;
  }

  /**
   * Changes if the signature should use cached values or not.
   * @param cached If the signature must use or not a cache.
   */
  setCached(cached: boolean): void {
    this.cached = cached;
  }

  /**
   * Builds the signature, using the information provided.
   * @returns a new signature to retrieve the entities.
   */
  build(): ISignature {
    if (!this.engine) {
      throw new Error("Signature should always belong to an engine.");
    }
    if (!this.cached) {
      return new NonCachedSignature(this.engine, this.included, this.excluded);
    }
    return new CachedSignature(this.engine, this.included, this.excluded);
  }
}
