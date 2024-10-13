import argon2 from 'argon2'
export class RegistrationCommand {
  constructor(
    public readonly emailAddress: string,
    public readonly password: string
  ) {}
}

export interface IUserStorage {
  save(account: Account): void;
  isEmailAddressAvailable(emailAddress: string): boolean;
}

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}

export type Account = {
  emailAddress: string;
  password: string;
}

export class Registration {
  constructor(
    private readonly userStorage: IUserStorage,
    private readonly hasher: IPasswordHasher
  ) {}

  async execute(command: RegistrationCommand) {
    if (!this.userStorage.isEmailAddressAvailable(command.emailAddress)) {
      throw new Error("Email address unavailable");
    }

    if (!this.isPasswordValid(command)) {
      throw new Error("Invalid password");
    }

    this.userStorage.save({
      emailAddress: command.emailAddress,
      password: await this.hasher.hash(command.password)
    });
  }

  private isPasswordValid(command: RegistrationCommand) {
    return command.password.length >= 6 && command.password.search(/\d/) !== -1 && command.password.search(/[A-Z]/) !== -1;
  }
}

