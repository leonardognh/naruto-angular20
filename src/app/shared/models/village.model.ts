import { BaseEntity } from './base.model';

export interface IVillageData {
  id: number;
  name: string;
  characters?: string[];
}

export class Village extends BaseEntity {
  public readonly name: string;
  public readonly characters: string[];

  constructor(data: IVillageData) {
    super(data.id);
    this.name = data.name;
    this.characters = data.characters || [];
  }

  isValid(): boolean {
    return Boolean(this.name && this.name.trim().length > 0);
  }
}
