import { User } from "@/app/generated/prisma";

export type PermissionCheckUser = {
  // define the properties of PermissionCheckUser here
  // e.g. id: string;
  // institutionname?: string;
  usertype: string;
  admin: boolean;
  institutionname?: string;
  // ...other properties...
};

export function isInstitutionAdmin(user: PermissionCheckUser) {
  return user.usertype === "INSTITUTION";
}
