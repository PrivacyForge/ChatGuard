
> " Freedom of speech is not just a right; it's a cornerstone of democracy. In its purest form, it allows ideas to clash, perspectives to evolve, and societies to progress. Yet, with this great power comes the responsibility to navigate the delicate balance between expression and respect. How do we safeguard this essential freedom while fostering a culture of inclusivity and understanding? "
>
<p align="center">
<img align="center" src="https://github.com/PrivacyForge/ChatGuard/assets/58364608/f4fcd89f-e3e1-42e8-aa6d-58d2e13e8a6a" />
</p>

# ChatGuard

Simple and easy to use browser extension that allow end to end encryption on [telegram/k](https://telegram.com/k), [telegram/a](https://telegram.com/a), [twitter](https://twitter.com), [bale](https://web.bale.ai/chat) ,[soroush](https://web.splus.ir/), [eitaa](https://web.eitaa.com/)

### ChatGuard is a global solution to make almost any standard web messenger to be end to end encrypted

## How to use Chat Guard ?

1. Download and install the extension with [official documentation](https://chat-guard.vercel.app/getting-started/installation)

1. Open one of the [supported messenger](https://chat-guard.vercel.app/getting-started/support)
1. Both user must use the action menu and click to the "Create Handshake" to initiate a encryption handshake
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

## Donation

I appreciate every donation for this project
every donation will be spend on growing the project and releasing it on different platform like safari, etc.

<a href="https://www.coffeebede.com/mosidev"><img  width="250px" class="img-fluid" src="https://coffeebede.ir/DashboardTemplateV2/app-assets/images/banner/default-yellow.svg" /></a>
