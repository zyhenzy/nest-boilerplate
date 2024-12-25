export class AccountSkill {
  id: number;
  name: string;
  constructor(meta: any) {
    this.id = meta.skill_id;
    this.name = meta.name;
  }
}
