import { BaseConstructorPayload } from "Reflect";
interface Component {
}
interface ComponentClass<T extends Component, U = undefined> {
    readonly name: string;
    readonly tag?: string;
    new (payload?: BaseConstructorPayload<T, U>): T;
}
export { Component, ComponentClass };
