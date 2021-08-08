// Adapted from 'primed-model': https://github.com/cuzox/primed-model
import { Base, Model, Primed } from ".";

@Model
class Cat extends Base<Cat> {
  name: string | null = null;
  breed: string | null = null;
}

@Model
class Person extends Base<Person> {
  name: string = "";
  middleName: string = "";
  lastName: string = "";

  get fullName() {
    return (
      [this.name, this.middleName, this.lastName].join(" ").trim() ||
      "Empty Name"
    );
  }

  @Primed(Person)
  parent!: Person;

  @Primed("Cat", { array: true })
  cats!: Cat[];
}

describe(">>> Reflect", () => {
  it("Constructs Model with Primed values", () => {
    expect(new Person()).toEqual({
      name: "",
      middleName: "",
      lastName: "",
      fullName: "Empty Name",
      parent: {
        name: "",
        middleName: "",
        lastName: "",
        fullName: "Empty Name",
        cats: [
          {
            name: null,
            breed: null,
          },
        ],
      },
      cats: [
        {
          name: null,
          breed: null,
        },
      ],
    });
  });
  it("Constructs Model with object structure as payload", () => {
    const alice = new Person({
      name: "Alice",
      lastName: "Liddell",
      cats: [
        {
          name: "garfield",
        },
      ],
      parent: {
        name: "Bob",
        cats: [
          {
            name: "Tom",
          },
        ],
      },
    });
    expect(alice.name).toBe("Alice");
    expect(alice.cats[0].name).toBe("garfield");
    expect(alice.parent.name).toBe("Bob");
    expect(alice.parent.cats[0].name).toBe("Tom");
  });
});
