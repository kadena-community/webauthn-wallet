"use client";

import {
  Button,
  ContentHeader,
  Select,
  Stack,
  TextField,
} from "@kadena/react-ui";
import { useCallback, useEffect, useState } from "react";
import {
  startRegistration,
  bufferToBase64URLString,
  base64URLStringToBuffer,
} from "@simplewebauthn/browser";
import { getAccountName, registerAccount } from "./register";
import { useRouter } from "next/navigation";
import cbor from "cbor";
import cosekey from "parse-cosekey";
import { l1Client } from "../utils/client";
import { getReturnUrl } from "@/utils/url";

type AccountProps = {
  searchParams: {
    payload: string;
    response: string;
  };
};

const getJosePublicKey = async (res: any) => {
  const { authData } = cbor.decode(
    base64URLStringToBuffer(res.response.attestationObject)
  );

  console.log(authData);

  const dataView = new DataView(new ArrayBuffer(2));
  const idLenBytes = authData.slice(53, 55);
  idLenBytes.forEach((value: number, index: number) =>
    dataView.setUint8(index, value)
  );
  const credentialIdLength = dataView.getUint16(0);
  const publicKeyBytes = authData.slice(55 + credentialIdLength);

  // the publicKeyBytes are encoded again as CBOR
  const publicKeyObject = cbor.decode(publicKeyBytes);
  const jwk = cosekey.KeyParser.cose2jwk(publicKeyObject);
  const pubKey = Buffer.from(JSON.stringify(jwk)).toString("base64");
  return pubKey;
};

const getHexFromBase64 = async (res: any) => {
  return Buffer.from(base64URLStringToBuffer(res.response.publicKey)).toString(
    "hex"
  );
};

const getHexFromCbor = async (res: any) => {
  const { authData } = cbor.decode(
    base64URLStringToBuffer(res.response.attestationObject)
  );

  const dataView = new DataView(new ArrayBuffer(2));
  const idLenBytes = authData.slice(53, 55);
  idLenBytes.forEach((value: number, index: number) =>
    dataView.setUint8(index, value)
  );
  const credentialIdLength = dataView.getUint16(0);
  const publicKeyBytes = authData.slice(55 + credentialIdLength);

  return Buffer.from(publicKeyBytes).toString("hex");
};

const getHexFromSubtle = async (res: any) => {
  const { authData } = cbor.decode(
    base64URLStringToBuffer(res.response.attestationObject)
  );

  const dataView = new DataView(new ArrayBuffer(2));
  const idLenBytes = authData.slice(53, 55);
  idLenBytes.forEach((value: number, index: number) =>
    dataView.setUint8(index, value)
  );
  const credentialIdLength = dataView.getUint16(0);
  const publicKeyBytes = authData.slice(55 + credentialIdLength);

  const publicKeyObject = cbor.decode(publicKeyBytes);
  const jwk = cosekey.KeyParser.cose2jwk(publicKeyObject);
  const importedJWK = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"]
  );
  const rawKey = await crypto.subtle.exportKey("raw", importedJWK);
  return Buffer.from(rawKey).toString("hex");
};

const getBase64PublicKey = async (res: any) => {
  return res.response.publicKey;
};

type PublicKeyType =
  | "jose"
  | "base64"
  | "hex-from-subtle-crypto"
  | "hex-from-base64"
  | "hex-from-cbor";
const getPublicKey = async (res: any, publicKeyType: PublicKeyType) => {
  switch (publicKeyType) {
    case "jose":
      return getJosePublicKey(res);
    case "base64":
      return getBase64PublicKey(res);
    case "hex-from-subtle-crypto":
      return getHexFromSubtle(res);
    case "hex-from-base64":
      return getHexFromBase64(res);
    case "hex-from-cbor":
      return getHexFromCbor(res);
    default:
      throw new Error("Invalid public key type");
  }
};

export default function Account(req: AccountProps) {
  const router = useRouter();
  const [account, setAccount] = useState<string>("");
  const onAccountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAccount(e.target.value);
    },
    [setAccount]
  );

  const register = useCallback(async () => {
    const res = await startRegistration({
      challenge: bufferToBase64URLString(Buffer.from("some-random-string")),
      rp: {
        name: "Kadena WebAuthN Wallet",
        id: window.location.hostname,
      },
      pubKeyCredParams: [
        {
          alg: -7,
          type: "public-key",
        },
      ],
      authenticatorSelection: {
        requireResidentKey: true,
        userVerification: "preferred",
      },
      attestation: "direct",
      user: {
        id: account, // @TODO: this should be a random string
        displayName: account,
        name: account,
      },
      timeout: 60000,
    });
    if (!res.response.publicKey)
      throw new Error("No public key returned from webauthn");

    // currently only hex-from-cbor works
    const pubKey = await getPublicKey(res, "hex-from-cbor");
    const tx = await registerAccount({
      domain: window.location.hostname,
      displayName: account,
      credentialId: res.id,
      credentialPubkey: pubKey,
    });
    console.log(tx);

    const accounts = localStorage.getItem("accounts") || "[]";
    const accs = JSON.parse(accounts);
    localStorage.setItem("accounts", JSON.stringify([...accs, account]));
  }, [account]);
  return (
    <Stack direction="column" gap="$md" margin="$md">
      <ContentHeader
        heading="Account"
        description="Create an account using WebAuthN"
        icon="Account"
      />
      <TextField
        label="account"
        inputProps={{
          id: "account",
          value: account,
          onChange: onAccountChange,
        }}
        helperText="Enter your account name"
      />
      <Button onClick={register}>Register</Button>
    </Stack>
  );
}
