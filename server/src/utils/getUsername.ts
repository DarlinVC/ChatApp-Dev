import Users from "../models/user.model";

/**
 * Gets the username associated with a specific user ID.
 * @param id The ID of the user whose username is to be looked up.
 * @returns The username associated with the supplied ID,
 *  or a "UserNotFound" string if no user was found.
 */
async function getUsername(id: string): Promise<string | undefined> {
  try {
    const user = await Users.findOne({ _id: id });
    if (user) {
      return user.username;
    }
    return "UserNotFound";
  } catch (error) {
    throw new Error("Error looking up username");
  }
}

export { getUsername };
