import { Weapon } from '../entity/weapon.entity';
import { bieming } from '../const/weapon/bieming';
import { biyi } from '../const/weapon/biyi';
import { bolang } from '../const/weapon/bolang';
import { chengying } from '../const/weapon/chengying';
import { dajiang } from '../const/weapon/dajiang';
import { dalu } from '../const/weapon/dalu';
import { jingyangwanren } from '../const/weapon/jingyangwanren';
import { minghong } from '../const/weapon/minghong';
import { mingshangouyue } from '../const/weapon/mingshangouyue';
import { qulu } from '../const/weapon/qulu';
import { renfeng } from '../const/weapon/renfeng';
import { shaofu } from '../const/weapon/shaofu';
import { tengshe } from '../const/weapon/tengshe';
import { tongsu } from '../const/weapon/tongsu';
import { wuhao } from '../const/weapon/wuhao';
import { xuanjian } from '../const/weapon/xuanjian';
import { xushibishou } from '../const/weapon/xushibishou';
import { yanri } from '../const/weapon/yanri';
import { youpiao } from '../const/weapon/youpiao';
import { zhangri } from '../const/weapon/zhangri';
import { zhengang } from '../const/weapon/zhengang';
import { zhengjiaoqiang } from '../const/weapon/zhengjiaoqiang';

export const getAllWeapon = (): Weapon[] => {
  return [
    ...generateWeapon(bieming),
    ...generateWeapon(biyi),
    ...generateWeapon(bolang),
    ...generateWeapon(chengying),
    ...generateWeapon(dajiang),
    ...generateWeapon(dalu),
    ...generateWeapon(jingyangwanren),
    ...generateWeapon(minghong),
    ...generateWeapon(mingshangouyue),
    ...generateWeapon(qulu),
    ...generateWeapon(renfeng),
    ...generateWeapon(shaofu),
    ...generateWeapon(tengshe),
    ...generateWeapon(tongsu),
    ...generateWeapon(wuhao),
    ...generateWeapon(xuanjian),
    ...generateWeapon(xushibishou),
    ...generateWeapon(yanri),
    ...generateWeapon(youpiao),
    ...generateWeapon(zhangri),
    ...generateWeapon(zhengang),
    ...generateWeapon(zhengjiaoqiang),
  ];
};

export const generateWeapon = (weapons: any[]): Weapon[] => {
  return weapons.map((weapon) => {
    return {
      weaponId: Number(weapon.gear_id.toString() + weapon.featureId.toString()),
      gearId: weapon.gear_id,
      name: weapon.name,
      featureId: weapon.featureId,
      featureName: weapon.featureName,
      price: weapon.price,
    };
  });
};
