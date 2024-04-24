import { supabase } from '../../supabaseClient';

/* export default async function verifyUserKey(userKey: string) {
  console.log('rqhtqiuwe');

  userKey = '35613243124';

  try {
    //const { data, error } = await supabase.from('external_users').select('*').eq('key', userKey);

    let { data: external_users, error } = await supabase.from('external_users').select('user_key').single();

    console.log('35613243124');

    if (error) {
      throw error;
    }

    return external_users;
  } catch (error) {
    console.error('Error verifying user key:', error);
    // Handle or throw the error as needed
  }
} */

export interface VerifyUserKeyResponse {
  is_authenticated: boolean;
  user_id: number | null;
  email: string | null;
  projects: Array<{
    project_id: number;
    project_name: string;
    page_count: number;
  }>;
}

export async function verifyUserKey(userKey: string): Promise<VerifyUserKeyResponse | null> {
  console.log('key received: ', userKey);

  const { data, error } = await supabase.rpc('verify_user_key', { key: userKey });

  if (error) {
    console.error('Error verifying user key:', error);
    return null;
  } else {
    console.log('data: ', data);
    console.log('User authenticated');
  }

  return data as VerifyUserKeyResponse;
}
