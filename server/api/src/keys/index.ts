import { Key } from "porto/viem";
import { DEFAULT_PERMISSIONS } from "../contracts/permissions";
import { Permissions } from "porto/viem/Key";

type Role = 'admin' | 'session';

const generateKey = ({ expiry, role, permissions = DEFAULT_PERMISSIONS }: { expiry: number, role: Role, permissions?: Permissions }) => {
  return Key.createP256({
    expiry,
    role,
    permissions
  })

}

export { generateKey };
