import {IChangeAction} from "./IChangeAction";

export class ChangeAction<T> implements IChangeAction<T> {
  public name: string;

  public oldValue: T;
  public newValue: T;

  constructor(name:string, oldValue:T, newValue:T) {
    this.name = name;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
}
