// Test avec une adresse e-mail disponible et un mot de passe correct
// -> Note : où va t'on enregistrer les comptes utilisateur ?
// Tester lorsque l'adresse e-mail est indisponible
// Tester avec un mot de passe à 5 caractères
// Mot de passe avec 8 caractères, mais pas de chiffre
// Mot de passe avec 8 caractères, mais pas de lettre
// Chiffrer le mot de passe

import {Account, IPasswordHasher, IUserStorage, Registration, RegistrationCommand} from "./registration.js";

class LocalUserStorage implements IUserStorage {
  constructor(public accounts: Account[] = []) {}

  save(account: Account): void {
    this.accounts.push(account);
  }

  isEmailAddressAvailable(emailAddress: string): boolean {
    return this.accounts.every(account => account.emailAddress !== emailAddress);
  }
}

class BlankHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return "hashed::" + password;
  }
}

test('when registering, the account should be created', async () => {
  const userStorage = new LocalUserStorage();

  const command = new RegistrationCommand("anthony@ancyracademy.fr", "azerty123A");
  const registration = new Registration(userStorage, new BlankHasher());
  await registration.execute(command);

  expect(userStorage.accounts[0]).toEqual({
    emailAddress: "anthony@ancyracademy.fr",
    password: "hashed::azerty123A"
  })
})

test('when the email address is unavailable, the account should not be created', async () => {
  const userStorage = new LocalUserStorage([{
    emailAddress: "anthony@ancyracademy.fr",
    password: "azerty123A"
  }]);

  const command = new RegistrationCommand("anthony@ancyracademy.fr", "azerty123A");
  const registration = new Registration(userStorage, new BlankHasher());

  await expect(() => registration.execute(command)).rejects.toThrow("Email address unavailable");

  expect(userStorage.accounts.length).toBe(1);
});

test('refusing a password with less than 5 characters', async () => {
  const userStorage = new LocalUserStorage();

  const command = new RegistrationCommand("anthony@ancyracademy.fr", "azert");
  const registration = new Registration(userStorage, new BlankHasher());

  await expect(() => registration.execute(command)).rejects.toThrow("Invalid password");
})

test('refusing a password with no numbers', async () => {
  const userStorage = new LocalUserStorage();

  const command = new RegistrationCommand("anthony@ancyracademy.fr", "azertyazerty");
  const registration = new Registration(userStorage, new BlankHasher());

  await expect(() => registration.execute(command)).rejects.toThrow("Invalid password");
})

test('refusing a password with no capital letters', async () => {
  const userStorage = new LocalUserStorage();

  const command = new RegistrationCommand("anthony@ancyracademy.fr", "azerty123123");
  const registration = new Registration(userStorage, new BlankHasher());

  await expect(() => registration.execute(command)).rejects.toThrow("Invalid password");
})

test('refusing a password with no capital letters', async () => {
  const userStorage = new LocalUserStorage();
  const command = new RegistrationCommand("anthony@ancyracademy.fr", "azerty123A");
  const registration = new Registration(userStorage, new BlankHasher());

  await registration.execute(command);

  expect(userStorage.accounts[0]).toEqual({
    emailAddress: "anthony@ancyracademy.fr",
    password: "hashed::azerty123A"
  })
})