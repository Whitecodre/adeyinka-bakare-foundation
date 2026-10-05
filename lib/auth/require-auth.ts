import { getUser } from "./get-user";

export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
