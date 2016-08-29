
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class Backstab extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'backstab',  spellPower: 1, weight: 30, cost: 15,  level: 8,  profession: 'Rogue' }
  ];

  static shouldCast(caster) {
    return _.includes(['opening strike'], caster.$lastComboSkill);
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.4;
    const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.6;
    return this.minMax(min, max) * this.spellPower;
  }

  cast() {
    this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
    const message = '%player used %spellName on %targetName and dealt %damage damage!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      super.cast({
        damage,
        message,
        targets: [target]
      });
    });
  }
}