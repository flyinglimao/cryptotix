# CryptoTix
[CryptoTix](https://github.com/flyinglimao/cryptotix) is a tool for event holders to verifiy whether a user qualified by having some tokens.

## How it works

### Create an event
The event holders will create an event on CryptoTix (the holders can run their own server), and specify the rules of the ticket issuing. Then, they will get an URL that can be shared to people.
![Create Event Demo](/public/create-event.png)

### Verify and sign
A user will be able to sign a message on this website to obtain a ticket if its wallet is qualified under the rules. The user can encrypt the ticket with a password and transfer the ticket to another device. Since the ticket is encrypted, user can safely send it via an insecure way and decrypt it when verifying.
![Issue Ticket Demo](/public/issue-ticket.png)

### Validate certificate
At the event, the event holder will check the ticket. The content of the ticket includes an approving message and a signature. If the content and signature are matched and user's state (ownership of tokens) are checked on chain, the ticket will get passed and be cut. Event host can see if an address already used its ticket.
![Issue Ticket Demo](/public/cut-ticket.png)

## Demo

[CryptoTix](https://cryptotix.limaois.me).

## Run a New Server

A new server can be started by cloning this repository, then run

```
yarn install
yarn build
```

Before start the server, environment variables should be provided.
```
cp .env .env.production
vim .env.production
```

The server is now ready.
```
yarn start
```

The default database is SQLite, it can be changed by modifiying `db/index.ts`.

You may want to limit people to create an event, set `DISABLE_REGISTER` to `true` in the environment variable will achieve that. (You have to create yours before disabling.)

## Development

CryptoTix is built with [Blitz](https://blitzjs.com/), please refer to [Blitz's documentation](https://blitzjs.com/docs/get-started) for details.
The underlying token data source is [Moralis](https://moralis.io/) since indexing is a heavy work that consumes a lot of time and network resource.
