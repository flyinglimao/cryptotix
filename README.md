# CryptoTix
[CryptoTix](https://cryptotix.limaois.me) is a tool for event holders to verifiy whether a user qualified by having some tokens.

## How it works

### Create an event
The event holders will create an event on CryptoTix (the holders can run their own server), and specify the rules of the certificate issuing. Then, they will get an URL that can share to people.

### Verify and sign
A user will be able to sign a message on this website to obtain a certificate if its wallet is qualified under the rules. The user can transfer the certificate to another device (and optionally encrypt it). The user can revoke a certificate. The certificate is a QR code.

### Validate certificate
At the event, the event holder will scan the certificate QR code. The content of the QR code includes data (such as collection, token id, etc.) and a signature. If the content and signature are matched and checked on chain, the certificate will get passed.

## Getting Started

Open [CryptoTix](https://cryptotix.limaois.me).

## Run a New Server

A new server can be started by cloning this repository and running

```
yarn install
yarn build
yarn start
```

The default database is SQLite, it can be changed by modifiying `db/index.ts`.

You may want to limit people to register as an event holder, set `ALLOW_REGISTER` to `true` in the environment variable will achieve that. (You have to register yourself
before disabling.)

## Developing

CryptoTix is built with [Blitz](https://blitzjs.com/), please refer to [Blitz's documentation](https://blitzjs.com/docs/get-started) for details.
