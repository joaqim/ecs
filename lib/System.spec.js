import { System } from "./System";
import { Engine } from "./Engine";
import { SignatureBuilder } from "./Signature";
class MySystem extends System {
    constructor() {
        super(...arguments);
        this.signature = null;
    }
    onAttach(engine) {
        super.onAttach(engine);
        this.signature = new SignatureBuilder(engine).build();
    }
    onDetach(engine) {
        super.onDetach(engine);
        this.signature = null;
    }
    update(_engine, _delta) { }
}
describe("Systems works", function () {
    it("Can be extended", function () {
        expect(new MySystem()).toBeInstanceOf(System);
        expect(new MySystem()).toBeInstanceOf(MySystem);
    });
    it("Attached systems should call the onAttach method", () => {
        const engine = new Engine();
        const system = new MySystem();
        engine.addSystem(system);
        expect(system.signature).not.toEqual(null);
    });
    it("Detached systems should call the onDetach method", () => {
        const engine = new Engine();
        const system = new MySystem();
        engine.addSystem(system);
        engine.removeSystem(system);
        expect(system.signature).toEqual(null);
    });
});
//# sourceMappingURL=System.spec.js.map