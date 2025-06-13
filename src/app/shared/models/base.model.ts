export abstract class BaseEntity {
  constructor(public readonly id: number) {}

  abstract isValid(): boolean;
}
