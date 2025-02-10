import supabase from './supabase';
import crypto from 'crypto';

/**
 * Hashes a password using crypto and stores it in Supabase
 * @param email - User email
 * @param password - User password
 * @returns Promise<{ success: boolean, message: string }>
 */
export default async function sighUp(user_email: string, user_password: string) {
  try {
    // Generate salt and hash password
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(user_password, salt, 100000, 64, 'sha256').toString('hex');

    // Store in Supabase
    const { data, error } = await supabase.from('users').insert([{ user_email, user_password: hashedPassword }]);

    if (error) throw error;
    return { success: true, message: 'Password stored successfully', data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
