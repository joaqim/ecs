export const PrimedSystems = (systems) => {
    if (systems === undefined)
        return [];
    return systems;
};
class System {
    priority;
    engines;
    constructor() {
        this.priority = 0;
        this.engines = [];
    }
    getPriority() {
        return this.priority;
    }
    setPriority(value) {
        this.priority = value;
        this.listEngines().forEach((engine) => {
            engine.notifyPriorityChange(this);
        });
    }
    listEngines() {
        return Object.freeze(this.engines.slice(0));
    }
    onAttach(engine) {
        const index = this.engines.indexOf(engine);
        if (index === -1) {
            this.engines.push(engine);
        }
    }
    onDetach(engine) {
        const index = this.engines.indexOf(engine);
        if (index !== -1) {
            this.engines.splice(index, 1);
        }
    }
}
export { System };
