# WebAuthn Wallet

To get a grasp of the reason to build a WebAuthn Wallet, please read the [KIP](./KIP.md)

## Prerequisite

To get started you need to have the following installed:

- docker
- pnpm > 8
- node > 18

## Installation

We need [devnet](https://github.com/kadena-io/devnet/tree/main/nix#running-the-devnet-docker-image)
to run this application for development. A special image has been prepared for
development using WebAuthn. The image is called `kadena/devnet:l2-webauthn`.
The command to run is:

```sh
docker volume create l1
docker run -it -p 8080:8080 -v l1:/data kadena/devnet:l2-webauthn
```

When devnet is up and running, you can deploy the contracts using:

```sh
pnpm install
pnpm run deploy
```

Now the app is ready to start:

```sh
pnpm run dev
```

Visit the wallet on [localhost:1337](http://localhost:1337)
