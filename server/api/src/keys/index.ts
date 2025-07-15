import { P256, PublicKey } from "ox";
import { Address } from "viem";

const evmTimeNow = () => Math.floor(Date.now() / 1000);

type Role = 'admin' | 'session';
type Type = 'p256';

const generateRandomPair = () => {
  const privateKey = P256.randomPrivateKey();
  const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
    includePrefix: false,
  });

  return { privateKey, publicKey };
};

const generateKey = ({ role, timeFromNow, type, address }: { role: Role, timeFromNow: number, type: Type, address: Address }) => {
  if (type === 'p256') {
    return { ...generateRandomPair(), expiry: evmTimeNow() + timeFromNow, role, address, type }
  } else {
    throw new Error('Unsupported key type');
  }
}

export { generateKey, generateRandomPair };
