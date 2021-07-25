# ECS - Entity-Component-System

An entity component system made with typescript.

Fork of [@nova-engine/ecs](https://github.com/nova-engine/ecs)

## Installing

```sh
npm i --save @joaqim/ecs
```

## Basic Usage

To use the entity component system, you first must create your Engine to store your systems and entities.

You can create as many as you wish, but usually it's only one per application.

```ts
import { Engine } from "@joaqim/ecs";
const engine = new Engine();
```

Now you just define your components:

```ts
import { Component } from "@nova-engine/ecs";

// Components can have custom constructors, but they must be able to be initialized
// with no arguments, because entities creates the instances for you.
// Try not to save complex data types in yout components
class PositionComponent implements Component {
  x = 0;
  y = 0;
}

class VelocityComponent implements Component {
  x = 0;
  y = 0;
}

// If you are making a component library, and want to avoid collitions
// You can add a tag to your component implementations

class MyLibraryComponent implements Component {
  // This will ensure your component won't collide with other "MyLibraryComponent"
  static readonly tag = "my-library/MyLibraryComponent";
}
```

You can also define your systems:

```ts
import { Component, Signature, System, SignatureBuilder } from "@nova-engine/ecs";
class GravitySystem extends System {
  static readonly DEFAULT_ACCELERATION = 0.98;
  signature?: Signature;
  acceleration: number;

  // Constructors are free for your own implementation
  constructor(acceleration = GravitySystem.DEFAULT_ACCELERATION) {
    super();
    this.acceleration = acceleration;
    // higher priorities means the system runs before others with lower priority
    this.priority = 300;
  }
  // This is called when a system is added to an engine, you may want to
  // startup your signatures here.
  onAttach(engine: Engine) {
    // Needed to work properly
    super.onAttach(engine);
    // Signatures are an easy way to have groups of entities with some criteria.
    this.signature = new SignatureBuilder(engine).include(VelocityComponent).build();
  }

  // This, in reality is the only method your system must implement
  // but using onAttach to prepare your signatures is useful.
  update(engine: Engine, delta: number) {
    for (let entity of this.signature.entities) {
      // Easy to get a component by class
      // Be warned, if the entity lacks this component, an error *will* be thrown.
      // But signatures ensures than we will always have the required components.
      const velocity = entity.getComponent(VelocityComponent);
      velocity.y += this.acceleration;
      // if the signature doesn't require that component
      // you can always check for it
      if (entity.hasComponent(PositionComponent)) {
        const position = entity.getComponent(PositionComponent);
      } else {
        // You can create components on an entity easily.
        const position = entity.putComponent(PositionComponent);
      }
    }
  }
}
```

## Limitations

You can only have one instance of a component per entity.

## LICENSE

The license is Apache-2.0, so use it as you please without worries.
