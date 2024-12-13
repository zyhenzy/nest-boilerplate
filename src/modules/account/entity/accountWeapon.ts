import { Weapon } from '../../weapon/entity/weapon.entity';

export class AccountWeapon extends Weapon {
  constructor(meta: any) {
    super();
    this.weaponId = meta.gear_id;
    this.name = meta.name;
    this.featureId = meta.feature_id;
    this.price = 0;
    const [feature] = meta.feature;
    if (feature) {
      this.featureName = feature[0] + feature[1];
    }
  }
}
