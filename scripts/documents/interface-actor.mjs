export class InterfaceActor extends Actor {
  getRollData() {
    return {
      ...super.getRollData(),
      derived: this.system.derived
    };
  }
}
