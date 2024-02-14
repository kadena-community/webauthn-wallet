---
KIP: '00XX'
Title: SpireConnect
Author: Andy Tang @EnoF
Status: Draft
Type: Standard
Category: Interface
Created: 2024-01-22
---

# Abstract

We propose to use a different way for dApps to connect with Wallets using
existing and proven Web2 Standards in order to improve the usability for end
users interacting with dApps and Wallets.

# Motivation

As of writing there are several ways to connect a dApp to a Wallet in order to
sign for transactions. We believe that the available setups do not provide for
the seamless connection we ambition for.

On the Web2 space there are well established techniques to provide authorization
over multiple domains. One well known and widely used technique is OAuth. Users
use this often in a seemless way and often provides for a lower level of entry
in the registration process.

Our belief is that the wallets could serve as the new decentralized hub of
authorization and authentication that centralized services like Google, Twitter
and Facebook offer now. Utilizing a Wallet with this proposed solution should
reduce the friction for users to interact with the services offered and increase
conversion rate.

# Specifications

Wallets and dApps will communicate with the end user's browser via `https`. All
the information will be relayed via the end user's browser. In this
specification there will be the following points of interest:

1. Login token
2. Signers information
3. Signatures

## Login Token

In tradition OAuth applications the token issued is scoped with access rights.
This could include not only reading resources, but also creating, updating or
even deleting resources. For the purpose of this specification we recommend the
login token to only be used to read insensitive information.

In general information stored on the blockchain is public. So if the information
that is displayed is stored on the blockchain, it should pose no risk. If this
login token is used to display information retrieved from a private database,
then it should be used with caution. This specification has no elaborate
implementation of session or token management.

### Implementation

For a user to login we could create a transaction for the user to sign. This
could work for traditional accounts (`k:accounts` or `w:accounts`) or even
`c:accounts` guarded by a `WebAuthn Guard` [KIP-0023](./KIP-0023.md).

When a user visits a dApp, the dApp can send the user to their wallet. When
sending the user to their wallet the following information should be provided
for the wallet:

| param     | type    | comment                                                                               |
| :-------- | :------ | :------------------------------------------------------------------------------------ |
| returnUrl | string! | This is the url the wallet should redirect the end user to after confirming the login |
| reason    | string? | The dApp can provide a reason for the login request                                   |

The Wallet will then prepare a transaction for the end user to sign. For the
WebAuthn Wallet account it would look like:

```pact
(n_9...c.webauthn-wallet.login "c:Ld...Gx")
```

With the capability to scope the signature:

```pact
(n_9...c.webauthn-wallet.LOGIN "c:Ld...Gx")
```

The `ttl` in the meta should be used to determine the lifetime of this token.
The signed transaction will then be base64 encoded and can then be used by the
dApp to perform a `/local?preflight=true` call to see if the transaction
validates.

There are several ways to remember if a user is logged in. It's at the
descretion of the dApp's how to store the information of the user. The
information that will be send back to the dApp are:

| param | type    | comment                                                                   |
| :---- | :------ | :------------------------------------------------------------------------ |
| token | string! | The base64 encoded signed transaction to proof authentication of the user |
| user  | string! | The base64 encoded JSON object of describing a user                       |

The JSON describing a user:

| param        | type      | comment                                            |
| :----------- | :-------- | :------------------------------------------------- |
| credentials  | [JSON]!   | An array containing the credentials of an user     |
| accountName  | string!   | The caccount the user                              |
| name         | string!   | The display name provided by a wallet for the user |
| pendingTxIds | [string]! | The pending tx for registration                    |

The JSON describing Credentials:

| param     | type    | comment                                                                                      |
| :-------- | :------ | :------------------------------------------------------------------------------------------- |
| type      | string! | The type of the credential, can be `WebAuthn` or `ED25519`                                   |
| publicKey | string! | The public key that is associated with this credential, keys are formatted as `WEBAUTHN-hex` |
| id        | string? | The credential-id if the credential is a WebAuthn key, the id will be omited fo `ED25519`    |

## Signers Information

In order for dApps to prepare a transaction all signers need to be communicated
with the dApp. In cases where only the user needs to sign for the transaction
the login token flow should suffice. However in cases where multiple parties
need to sign for the transaction all public keys of those parties need to be
collected and communicated with the dApp. The information about the signers does
not cover authentication and only provides the necessary information to
construct a transaction.

The dApp can provide an interface from the dApp, but there are many cases that
we believe would make sense for a Wallet to assist a user to orchastrate the
collection of signers information. We envision a wallet to hold contact
information allowing the user to select from their contacts who to include in
the signers information.

### Implementation

The dApp can prompt a Wallet to provide information via search parameters. The
following interface can be used to communicate the context of the request:

| param     | type    | comment                        |
| :-------- | :------ | :----------------------------- |
| reason    | string! | The purpose of the transaction |
| returnUrl | string! | The return url                 |

The wallet can then provide a list of signers as response to the dApp:

| param   | type    | comment                                        |
| :------ | :------ | :--------------------------------------------- |
| signers | string! | The base64 encoded JSON of Signers in an Array |

The signer JSON would have the following interface:

| param       | type    | comment                                            |
| :---------- | :------ | :------------------------------------------------- |
| credentials | [JSON]! | An array containing the credentials of an user     |
| name        | string! | The display name provided by a wallet for the user |

The JSON describing Credentials:

| param     | type    | comment                                                                                      |
| :-------- | :------ | :------------------------------------------------------------------------------------------- |
| type      | string! | The type of the credential, can be `WebAuthn` or `ED25519`                                   |
| publicKey | string! | The public key that is associated with this credential, keys are formatted as `WEBAUTHN-hex` |
| id        | string? | The credential-id if the credential is a WebAuthn key, the id will be omited fo `ED25519`    |

## Signatures

So far we have only discussed the preparation of transactions. This section will
cover how a transaction can be finilized. Like the preparation process, the dApp
can always opt to orchastrate the collection of signatures. We however believe
that providing a way to orchastrate the collection of signatures via the wallet
will open up new UX possibilities that will smoothen the experience further.

This specification will describe two ways to orchastrate the collection of
signatures through a Wallet:

1. Link sharing
2. Peer to Peer channels

### Sign flow from the dApp

To start a sign request from the dApp, the dApp will navigate the end user to
their wallet with the transaction information attached as search parameters:

| param       | type    | comment                                                                                                           |
| :---------- | :------ | :---------------------------------------------------------------------------------------------------------------- |
| transaction | string! | The unsigned transaction as described by [chainweb](https://api.chainweb.com/openapi/pact.html#tag/model-command) |
| returnUrl   | string! | This is the url the wallet should redirect the end user to after confirming the login                             |

After the wallet has collected the signature the wallet will send the user back
to the dApp's provided `returnUrl` with the following search params:

| param       | type    | comment                                                      |
| :---------- | :------ | :----------------------------------------------------------- |
| transaction | string! | The signed or partially signed transaction encoded in base64 |

The transaction returned from the wallet can be signed or partially signed. The
dApp should act accordingly. TODO: Explain multi sig flows

### Link sharing

In the Web2 it's common to send transaction links to your peers. It's a concept
most users will be familiar with. Users will also be able to share such link via
any of their already established ways of communication, may it be their
messaging app, email or even SMS.

Wallet developers can use this as a base to incorporate even more convienient
ways of sharing these links. Think of NFC, bluetooth or even QR scanning. This
spec will describe how such a link should be build in order for all Wallets to
be interoperable.