import { Weapon } from '../../weapon/entity/weapon.entity';

export class AccountWeapon extends Weapon {
  constructor(meta: any) {
    super();
    this.id = Number(meta.gear_id.toString() + meta.feature_id.toString());
    this.gearId = meta.gear_id;
    this.featureId = meta.feature_id;
    this.name = meta.name;
    this.price = 0;
    const [feature] = meta.feature;
    if (feature) {
      this.featureName = feature[0] + feature[1];
    }
  }
}
