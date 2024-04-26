# ChatGuard

Simple and easy to use browser extension that allow end to end encryption on web messenger

[demo](https://github.com/PrivacyForge/ChatGuard/assets/58364608/7008ea5c-4fb4-49e9-a70b-749d88a38eab)
## Features 
- End-to-End Encryption (E2E): Enjoy secure and private conversations without compromising your data.
- Cross-Application Compatibility: While currently limited to Bale Messenger during the beta phase, ChatGuard aims to extend its support to a wide range of messaging applications.
- Serverless: No need of server for exchanging public key,chatGuard uses the Messenger that running on as messaging service to transfer public keys.

## How to use Chat Guard ?

1. Download and install the extension with [official documentation](https://github.com/PrivacyForge/ChatGuard/blob/main/docs/getting-started/installation.md)
   
[![firefox store](./docs/public/images/firefoxStore.svg)](https://addons.mozilla.org/en-GB/firefox/addon/chatguard/)

1. Open one of the supported messenger
1. Both user must use the action menu and click to the "Create Handshake" to initiate a encryption handshake
[![handshake](https://github.com/PrivacyForge/ChatGuard/assets/58364608/6a258e06-836f-463c-8d81-cec1ba9cbc8c)](#)
1. After the handshake complete successfully, you can enjoy a safe chat :)

## How Chat Guard encrypt the messages?

- We use hybrid (Symmetric and Asymmetric) encryption
- first both user initiate a handshake, the handshake contain user public key
- after the handshake, when each user want to send a message this proccess take place :

1. generate a secret key
2. encrypt the secret key with both public keys
3. encrypted the message with the secret key
4. append the encrypted secret keys and encrypted message to one singular message and send it to the user

#### Now other user can decrypt the secret key with their own private key and using the decrypted secret key, user can decrypt the actual message

## Special Thanks
to [Arman](https://github.com/ArmanTaheriGhaleTaki) that inspired me to embark on this project and provided me with the idea to pursue.

## Donation

I appreciate every donation for this project
every donation will be spend on growing the project and releasing it on different platform like safari, etc.

Ethereum wallet (eth):
```
0x4850d6B360d0fA6bb6ED1Df240f46dE08A7aDF0a
```
Coffeebede:

<a href="https://www.coffeebede.com/mosidev"><img  width="250px" class="img-fluid" src="https://coffeebede.ir/DashboardTemplateV2/app-assets/images/banner/default-yellow.svg" /></a>
