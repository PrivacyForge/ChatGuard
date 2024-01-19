# ChatGuard Browser Extension

ChatGuard is a browser extension designed to make a secure and private chatting across various applications by implementing end-to-end encryption (E2E). The current beta version is exclusively available for use in the Bale Messenger, with plans to extend support to almost all messaging applications in the near future.

## Features

- **End-to-End Encryption (E2E):** Enjoy secure and private conversations without compromising your data.
- **Cross-Application Compatibility:** While currently limited to Bale Messenger during the beta phase, ChatGuard aims to extend its support to a wide range of messaging applications.
- **serverless:** No need of server for exchanging public key,chatGuard uses the Messenger that running on as messaging service to transfer public keys

## How It's Works ?

there are 2 step to make a chat secure (E2E), and the step are:

- Public key Handshake
  ChatGuard will transfer the public key by the current Messenger

- Acknowledgment
  Both side acknowledge each other that they have each others public keys

- encryption
  Now when chatGuard know the public keys it will use a Combination of DRSAP (dynamic RSA packet) Algorithm to encrypt each message

## DRSAP (dynamic RSA packet)

how encrypted message packet are made? so the client that want to create message :

- 1. Generate a secret key

- 2. encrypt the secret key by the public key of the message owner

- 3. encrypt the secret key by the public key of person that we want to send the message to

- 4. encrypt the message with the secret key

- 5. create a packet including the 2 encrypted secret key's and the actual encrypted message

- 6. now each client can decrypt the secret key's with their own private key and finally decrypt the actual message with that.

## Support The Project

This is a Free and Open Source (FOS) project, but your donation would be greatly appreciated.

Your support helps us maintain and improve the project, ensuring its continued availability to the community.

<a href="https://www.coffeebede.com/mosidev"><img width="250px" class="img-fluid" src="https://coffeebede.ir/DashboardTemplateV2/app-assets/images/banner/default-yellow.svg" /></a>

## License

This project is licensed under the [MIT License](link to license file). See the LICENSE.md file for details.

**Note:** This version is currently in beta, and we appreciate your patience as we work towards expanding ChatGuard's compatibility and features. Stay tuned for updates!
