import { createProfile, updateProfile, deleteProfile, findAllProfiles, findProfileById } from "../repositories/profiles.repository";
import { createAdminClient } from "../supabase/admin";
import type { ProfileInsert, ProfileUpdate } from "../types/database.types";

export async function getAllAdmins() {
  return findAllProfiles();
}

export async function getAdminById(id: string) {
  return findProfileById(id);
}

export async function createNewAdmin(data: Omit<ProfileInsert, "id"> & { email: string; password?: string }, actorId: string) {
  const { email, password, ...profileData } = data;

  // Create auth user using service role client
  const supabaseAdmin = createAdminClient();

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: password || Math.random().toString(36).slice(-10), // Generate random password if not provided
    email_confirm: true,
    user_metadata: {
      full_name: profileData.full_name,
    },
  });

  if (authError) {
    throw new Error(`Failed to create auth user: ${authError.message}`);
  }

  // Create profile with the auth user ID
  const profile = await createProfile({
    id: authData.user.id,
    ...profileData,
  });

  return profile;
}

export async function updateAdminById(id: string, data: Partial<ProfileUpdate>, actorId: string) {
  return updateProfile(id, data);
}

export async function removeAdmin(id: string, actorId: string) {
  // Delete auth user using service role client
  const supabaseAdmin = createAdminClient();
  
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (authError) {
    throw new Error(`Failed to delete auth user: ${authError.message}`);
  }

  // Note: Deleting the auth user will cascade delete the profile due to FK constraint
  // So we don't need to call deleteProfile separately
}
