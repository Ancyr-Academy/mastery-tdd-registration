import argon2 from "argon2";
import {IPasswordHasher} from "./registration.js";

export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password);
  }
}