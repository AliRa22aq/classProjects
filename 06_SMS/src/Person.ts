export class Person {
  _id?: number;
  _name: string;
  _age?: number;
  _gender?: string;
  constructor(name: string) {
    this._name = name;
  }
}
