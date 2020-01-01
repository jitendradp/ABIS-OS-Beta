export interface IAction {
  name:string;
  icon:string,
  position:"left"|"right";
  action:()=>void;
}
