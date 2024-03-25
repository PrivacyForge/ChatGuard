# Cipher Class Documentation

## Overview

The `Cipher` class provides encryption and decryption functionality using the DRSAP (Double RSA with AES Payload) algorithm. It utilizes the [node-forge](https://github.com/digitalbazaar/forge) library for cryptographic operations and interacts with the Chrome Storage API for storing and retrieving data.

## Class Structure

### Constructor

```typescript
constructor(storage: LocalStorage, config: Config)
```

- **Parameters:**
  - `storage`: An instance of `LocalStorage` for managing local storage.
  - `config`: An object of type `Config` containing configuration settings.

### Methods

#### `createDRSAP(message: string, to: string): Promise<string | null>`

Encrypts a message using the DRSAP algorithm and returns the encrypted template.

- **Parameters:**

  - `message`: The message to be encrypted.
  - `to`: The recipient's identifier.

- **Returns:** A Promise that resolves to the encrypted DRSAP template or `null` if the recipient's public key is not available.

#### `resolveDRSAP(packet: string): Promise<string | null>`

Decrypts a DRSAP-encrypted packet and returns the original message.

- **Parameters:**

  - `packet`: The DRSAP-encrypted packet.

- **Returns:** A Promise that resolves to the decrypted message or `null` if decryption fails.

#### `createDRSAPHandshake(to: string): Promise<string>`

Creates a DRSAP handshake packet for establishing a secure connection.

- **Parameters:**

  - `to`: The recipient's identifier.

- **Returns:** A Promise that resolves to the DRSAP handshake packet.

#### `resolveDRSAPHandshake(packet: string, from: string): Promise<string | undefined>`

Resolves a DRSAP handshake packet and validates the sender's public key.

- **Parameters:**

  - `packet`: The DRSAP handshake packet.
  - `from`: The sender's identifier.

- **Returns:** A Promise that resolves to an boolean packet or `undefined` if validation fails.

#### `static validatePublicPem(pem: string): boolean`

Validates a public key in PEM format.

- **Parameters:**

  - `pem`: The public key in PEM format.

- **Returns:** `true` if the public key is valid, `false` otherwise.

#### `static validatePrivatePem(pem: string): boolean`

Validates a private key in PEM format.

- **Parameters:**

  - `pem`: The private key in PEM format.

- **Returns:** `true` if the private key is valid, `false` otherwise.

#### `encryptAES(message: string, secretKey: string): Promise<string>`

Encrypts a message using AES-CBC encryption with a given secret key.

- **Parameters:**

  - `message`: The message to be encrypted.
  - `secretKey`: The secret key for encryption.

- **Returns:** A Promise that resolves to the encrypted message.

#### `decryptAES(encryptedMessage: string, secretKey: string): Promise<string>`

Decrypts an AES-CBC-encrypted message with a given secret key.

- **Parameters:**

  - `encryptedMessage`: The encrypted message.
  - `secretKey`: The secret key for decryption.

- **Returns:** A Promise that resolves to the decrypted message.

## Example Usage

```typescript
import { Cipher } from "./Cipher";
import { chromeStorage } from "src/store";
import { Config } from "src/types/Config";

const storage = new LocalStorage(); // assuming LocalStorage class is available
const config: Config = {
  // provide configuration settings
};

const cipher = new Cipher(storage, config);

// Example: Creating DRSAP
const encryptedTemplate = await cipher.createDRSAP("Hello, World!", "recipientId");
console.log("Encrypted Template:", encryptedTemplate);

// Example: Resolving DRSAP
const decryptedMessage = await cipher.resolveDRSAP(encryptedTemplate);
console.log("Decrypted Message:", decryptedMessage);
```

## Dependencies

- [node-forge](https://github.com/digitalbazaar/forge): A JavaScript implementation of cryptographic standards.

## Disclaimer

This documentation assumes a certain environment and dependencies. Ensure that the required libraries and APIs are available and properly configured for the class to function as intended.
