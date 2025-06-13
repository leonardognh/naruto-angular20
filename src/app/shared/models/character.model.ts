import { BaseEntity } from './base.model';

export interface ICharacterData {
  id: number;
  name: string;
  images?: string[];
  debut?: {
    manga?: string;
    anime?: string;
    novel?: string;
    movie?: string;
    game?: string;
    ova?: string;
    appearsIn?: string;
  };
  family?: Record<string, string>;
  jutsu?: string[];
  natureType?: string[];
  personal?: {
    birthdate?: string;
    sex?: string;
    age?: Record<string, string>;
    height?: Record<string, string>;
    weight?: Record<string, string>;
    bloodType?: string;
    kekkeiGenkai?: string[];
    classification?: string[];
    affiliation?: string[];
    occupation?: string[];
    team?: string[];
    clan?: string;
  };
  rank?: {
    ninjaRank?: Record<string, string>;
  };
  tools?: string[];
  voiceActors?: {
    japanese?: string[];
    english?: string[];
  };
}

export class Character extends BaseEntity {
  public readonly name: string;
  public readonly images: string[];
  public readonly debut?: ICharacterData['debut'];
  public readonly family?: ICharacterData['family'];
  public readonly jutsu: string[];
  public readonly natureType: string[];
  public readonly personal?: ICharacterData['personal'];
  public readonly rank?: ICharacterData['rank'];
  public readonly tools: string[];
  public readonly voiceActors?: ICharacterData['voiceActors'];

  constructor(data: ICharacterData) {
    super(data.id);
    this.name = data.name;
    this.images = data.images || [];
    this.debut = data.debut;
    this.family = data.family;
    this.jutsu = data.jutsu || [];
    this.natureType = data.natureType || [];
    this.personal = data.personal;
    this.rank = data.rank;
    this.tools = data.tools || [];
    this.voiceActors = data.voiceActors;
  }

  isValid(): boolean {
    return Boolean(this.name && this.name.trim().length > 0);
  }

  get primaryImage(): string {
    return this.images.length > 0
      ? this.images[0]
      : '/assets/images/no-image.png';
  }

  get age(): string {
    if (!this.personal?.age) return 'Desconhecido';
    const ages = Object.values(this.personal.age);
    return ages.length > 0 ? ages[0] : 'Desconhecido';
  }

  get village(): string {
    if (!this.personal?.affiliation) return 'Desconhecida';
    if (Array.isArray(this.personal.affiliation)) {
      return this.personal.affiliation[0] || 'Desconhecida';
    }
    if (typeof this.personal.affiliation === 'string') {
      return this.personal.affiliation;
    }
    return 'Desconhecida';
  }

  get classification(): string {
    if (!this.personal?.classification) return 'Desconhecida';
    if (Array.isArray(this.personal.classification)) {
      return this.personal.classification.join(', ');
    }
    if (typeof this.personal.classification === 'string') {
      return this.personal.classification;
    }
    return 'Desconhecida';
  }

  get occupation(): string {
    if (!this.personal?.occupation) return 'Desconhecida';
    if (Array.isArray(this.personal.occupation)) {
      return this.personal.occupation.join(', ');
    }
    if (typeof this.personal.occupation === 'string') {
      return this.personal.occupation;
    }
    return 'Desconhecida';
  }

  get ninjaRank(): string {
    if (!this.rank?.ninjaRank) return 'Desconhecido';
    const ranks = Object.values(this.rank.ninjaRank);
    return ranks.length > 0 ? ranks[0] : 'Desconhecido';
  }
}
