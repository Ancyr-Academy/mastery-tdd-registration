# Registration System

Develop a registration system like the ones you've probably already coded for your applications (essentially, a member area).

The task is to code a single class called **Registration** that has only one method: execute.

This class handles the registration of a new user. It is an implementation of the Command pattern, which is often referred to as a UseCase.

The `execute` method takes an object called RegisterCommand as a parameter, which contains only two pieces of information:

- The email address for the account to be created
- A password

After the `execute` method is called, the user is persistently and durably saved (probably in a database).

Here are the business rules:

- An email address can only be used once
- The password must be encrypted, preferably with argon2
- The password must comply with the following minimal rules:
    - At least 6 characters
    - At least 1 uppercase letter
    - At least 1 number
