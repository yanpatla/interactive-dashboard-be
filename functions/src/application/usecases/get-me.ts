import type { AuthedUser } from "../../presentation/http/middlewares/auth.middleware";
import { getRole, type UserRole } from "../../config/roles";

export type MeDTO = {
  uid: string;
  email: string;
  name: string | null;
  picture: string | null;
  role: UserRole;
};

export class GetMeUseCase {
  execute(user: AuthedUser): MeDTO {
    return {
      uid: user.uid,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: getRole(user.email),
    };
  }
}