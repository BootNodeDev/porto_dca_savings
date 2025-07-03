import { P256, PublicKey } from "ox";

const generateRandomPair = () => {
  const privateKey = P256.randomPrivateKey();
  const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
    includePrefix: false,
  });

  return { privateKey, publicKey };
};

export { generateRandomPair };
