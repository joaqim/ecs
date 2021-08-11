export * from "./AbstractSignature";
export * from "./CachedSignature";
export * from "./NonCachedSignature";
export * from "./SignatureBuilder";
export * from "./Signature.h";

/**
 * A signature is a criteria to separate your entities.
 * You can have signatures on wich entities must have a component,
 * entities cannot have some components or a mix of both.
 * Signatures also cache the entities of the engine by default,
 * so you won't have to worry about filtering entities every time.
 */
