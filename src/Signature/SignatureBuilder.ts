import type { ComponentType } from "../Component.h";
import { CachedSignature } from "./CachedSignature";
import { NonCachedSignature } from "./NonCachedSignature";
import type { IEngine } from "../Engine";
import type { ISignature } from "./Signature.h";

/**
 * Utility class to build Signatures.
 * It's the only way to create the implementations of CachedSignature and NonCachedSignature.
 */
export class SignatureBuilder<TProperties extends {} = {}> {
  private engine: IEngine | null;

  private cached: boolean;

  private readonly excluded: ComponentType[];

  constructor(engine?: IEngine) {
    this.engine = engine || null;
    this.excluded = [];
    this.cached = true;
  }

  /**
   * Indicates than entities than are members of this class MUST NOT
   * HAVE this components.
   * @param classes A list of component classes.
   */
  exclude(...classes: ComponentType[]): SignatureBuilder {
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
  build(): ISignature<TProperties> {
    if (!this.engine) {
      throw new Error("Signature should always belong to an engine.");
    }
    if (!this.cached) {
      return new NonCachedSignature<TProperties>(this.engine, this.excluded);
    }
    return new CachedSignature<TProperties>(this.engine, this.excluded);
  }
}
