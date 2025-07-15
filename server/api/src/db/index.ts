import { generateKey } from "../keys";


type KeyPair = ReturnType<typeof generateKey>;

export const db = new Map<`0x${string}`, KeyPair>();
