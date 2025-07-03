import { generateRandomPair } from "../keys";


type KeyPair = ReturnType<typeof generateRandomPair>;

export const db = new Map<`0x${string}`, KeyPair>();
