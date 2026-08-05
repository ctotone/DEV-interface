import { rollD100ForActor } from "../services/d100-roll-service.mjs";

export class InterfaceActor extends Actor {
  getRollData() {
    return {
      ...super.getRollData(),
      derived: this.system.derived
    };
  }

  async rollStandardD100({ skillKey, talentKey, mode, modifier = 0 }) {
    return rollD100ForActor({
      actor: this,
      source: {
        kind: "standard",
        skillKey,
        talentKey
      },
      mode,
      modifier,
      context: {
        kind: "general"
      }
    });
  }

  async rollDerivedD100({ key, mode, modifier = 0 }) {
    return rollD100ForActor({
      actor: this,
      source: {
        kind: "derived",
        key
      },
      mode,
      modifier,
      context: {
        kind: "combat"
      }
    });
  }
}
