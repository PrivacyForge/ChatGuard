# Cipher Class Documentation

## Overview

The `ChatGuard` class is designed to manage and handle security-related functionalities for a chat application. It utilizes the Node Forge library for cryptographic operations and integrates with Chrome storage for storing user information. This class is intended to be used in a web environment, specifically in a Chrome extension or a web application.

## Properties:

- **storage:** An instance of the `LocalStorage` class used for managing local storage operations.

- **root:** The root selector obtained from the configuration based on the current hostname.

- **selector:** A selector property determined based on the device type (desktop or mobile) and the current hostname.

- **state:** A Svelte writable store used to maintain the state of the chat, including the raw text, encrypted text, submission status, and loading status.

- **isTouch:** A boolean indicating whether the current device is a touch-enabled mobile device.

## Constructor:

- **constructor():** Initializes the `ChatGuard` instance. It determines the device type and selector based on the current environment.

## Methods:

- **register():** A method responsible for registering the user with the chat service. It performs the following steps:

  1. Checks if the chat service is enabled in Chrome storage. If not enabled, the registration process is skipped.

  2. If the user is not registered, it generates an RSA key pair (512 bits) using the Node Forge library.

  3. Stores the user's public key, private key, and other relevant information in local storage and Chrome storage.

  4. Resolves a promise once the registration process is complete.

## Usage:

1. **Initialization:**

   ```javascript
   const chatGuard = new ChatGuard();
   ```

2. **Registration:**

   ```javascript
   await chatGuard.register();
   ```

   If successful, the `ChatGuard` instance is ready for use, and the user is registered with the chat service.

## Notes:

- Ensure that the Node Forge library and other dependencies are properly included in the project.

- This class assumes the presence of a `LocalStorage` class, selectors, and other dependencies as specified in the import statements.

- The class is designed to be used in a specific web environment, and adjustments may be needed for different use cases or environments.
