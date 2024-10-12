export class RegistrationCommand {
  constructor(public readonly emailAddress: string, public readonly password: string) {}
}

export class Registration {
  execute(command: RegistrationCommand) {}
}