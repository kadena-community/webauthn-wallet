# **Create an account and connect to a dApp**

Decentralized applications (dApps) offer convenient avenues for individuals to
engage in transactions on the blockchain. However, before dApps can execute
transactions, they require knowledge of which account will sign for them.
Typically, users connect a cryptocurrency wallet to the dApp and designate an
account for subsequent transactions. Spirekey simplifies this process,
facilitating the creation and connection of accounts to dApps effortlessly. This
article serves as a pragmatic guide for dApp developers, detailing the
integration of dApps with Spirekey. It provides step-by-step instructions on
recognizing if a Spirekey account is connected to your dApp, linking to the
Spirekey wallet dApp, creating a Spirekey account, sharing a Spirekey account
from the Spirekey wallet back to the dApp, and displaying the connected account
within the dApp. After following this guide, your users will be able to connect
their Spirekey account to your dApp. Subsequently, your dApp can utilize the
connected account to generate blockchain transactions, which the account owner
can sign for. Further instructions on transaction creation and signing are
elaborated in subsequent chapters.

## Before you begin

Set up a project scaffold for your dApp using the platform and framework of your
choice. This guide assumes a JavaScript based web application. Your dApp will
connect to a Spirekey wallet dApp that can be hosted anywhere. You could for
instance use [spirekey.kadena.io](spirekey.kadena.io), host it yourself, or run
it locally as described in the official Spirekey
[Github repository](https://github.com/kadena-community/webauthn-wallet/). This
guide assumes that you will be using the latter approach. Spirekey offers you
the freedom to adapt and deploy its smart contracts to fit your needs. However,
this guide assumes that you have deployed the smart contracts as provided in the
offical Github repository to your locally running Devnet.

## Link to the Spirekey wallet

On the homepage of your dApp, create a simple link to the `/register` page of
the Spirekey wallet dApp, using the example code below. You need to pass the URL
of your dApp as a base64 encoded query parameter `redirectUrl`, so the Spirekey
wallet knows where to redirect users back to after they connect. On the
`/register` page, the Spirekey wallet will check if the user already has an
account. If so, it will redirect to the `/login` page where the user can select
an existing account to connect to your dApp. Users without a Spirekey account
will be able to create an account on the fly and subsequently connect it to your
dApp in one go.

```HTML
<a id="connect" href="">Connect</a>

<script type="text/javascript">
  const spirekeyHost = 'http://localhost:1337';
  // Your dApp URL
  const redirectUrl = Buffer.from(window.location.href).toString('base64');
  const connectElement = document.getElementById('connect');
  const href = `/register?redirectUrl=${redirectUrl}`;
  connectElement.setAttribute('href', href);
</script>
```

## Create an account

In the account creation flow of the Spirekey wallet dApp, users need to provide
an account alias, a network, webauthn credentials, an icon and a color. The
alias, icon and color are used to help users easily identify different accounts
in their Spirekey wallet. The network determines on what network users will
create their account. Choose Devnet if you are following along with this guide.

Depending on the network, confirming the account creation transaction on the
blockchain can take quite some time. If you want to optimize the onboarding of
users to your app for speed, you can opt to allow users to connect their account
optimistically, by adding the `optimistic=true` query parameter to the Spirekey
wallet dApp URl. This allows users to connect their account to your dApp before
the corresponding transaction is confirmed on the blockchain. Without this
parameter, users without an account have to wait until their account is
successfully created on the blockchain before they can continue connecting to
your dApp.

```JavaScript
const href = `/register?redirectUrl=${redirectUrl}&optimistic=true`;
```

## Connect an account

After users have created their first Spirekey account or if they already have an
account, they will be redirected to the `/login` page of the Spirekey wallet
dApp. Here, they select one of their account and press a button to login. Then,
they will be redirected back to your dApp with their public account details
appended as a base64 encoded query parameter `user` to the `redirectUrl` that
you initially provided as part of the link to Spirekey. Before moving on to
handling the received account data in your dApp, there are two more features
related to the Spirekey connection worth mentioning.

### Force a network

A deployment of your dApp may be configured for a specific network to make
transactions on, like Devnet, Testnet, or Mainnet only. A transaction on Devnet
will fail if users connect an account they created on Testnet. To prevent this
from happening you can force users to select an account on a specific network.
It can be achieved by adding the query parameter `networkId` to the Spirekey
wallet URL, with the required network identifier as value. See the example
below.

```JavaScript
const href = `/register?redirectUrl=${redirectUrl}&networkId=${networkId}`;
```

### Show the reason

Add the query parameter `networkId` to the Spirekey wallet URL with a value
containing a more elaborate description of the reason that your dApp requires
account information from the user. See the example below.

```JavaScript
const href = `/register?redirectUrl=${redirectUrl}&reason=Creating+transactions+for+in+game+purchases.`;
```

### Use the account data

After creating an account in the Spirekey Wallet dApp - if applicable - and
confirming the selected account to connect, users are redirected to your dApp
with their public account details appended as a base64 encoded query parameter
`user`. You can parse and display the account details as outlined in the example
code below. In this example, the link to the Spirekey wallet is displayed if no
user details are present in the URL. If user details are present, it means that
the user connected a Spirekey account, so the user can be greeted by the account
alias and the details are be displayed for educational purposes.

The decoded and parsed account details are an object with fiels: credentials,
accountName, alias and pendingTxIds. The alias has already been explained above.
The account name is the actual name of the account on the blockchain. It is a
string consisting of a `c:` prefix followed by a hash. The credentials contain a
credential object. The most notable field in that object is the `publicKey` of
the Webauthn credential. Note that the private key is not present here. It is
securely encrypted and stored on the user's device. The `pendingTxIds` field
will contain the account creation transaction identifier, in case the user
connected with an account that was created on the fly with the optimistic
connection mode enabled. You can poll the status of this transaction against the
Chainweb Data API to ensure that you are not creating transactions for this
account before it is confirmed on the blockchain. If an account creation
transaction is completed before users confirm connecting to your dApp, then
`pendingTxIds` will be empty, even in optmitistic mode.

```HTML
<a id="connect" href="">Connect</a>
<div id="account">
    <p id="welcome"></p>
    <pre id="details"></pre>
</div>

<script type="text/javascript">
  const urlParams = new URLSearchParams(window?.location?.search);
  const user = urlParams.get('user');

  const connectElement = document.getElementById('connect');
  const accountElement = document.getElementById('account');

  if (user) {
    // Hide the link to Spirekey
    connectElement.style.display = 'none';
    // Decode and parse the account data from the URL
    const account = JSON.parse(Buffer.from(user, 'base64').toString());
    // Greet the user by the account alias
    document.getElementById('welcome').innerText = `Welcome, ${account.alias}`,
    // Display all account details
    document.getElementById('details').innerText = account;
  } else {
    // Hide the user details
    accountElement.style.display = 'none';
    // Prepare the link to Spirekey
    const spirekeyHost = 'http://localhost:1337';
    const redirectUrl = Buffer.from(window.location.href).toString('base64');
    const href = `/register?redirectUrl=${redirectUrl}&optimistic=true`;
    connectElement.setAttribute('href', href);
  }

  const
</script>
```