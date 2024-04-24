import { supabase } from './supabase';

async function addUserToExternalTable(userUUID, userEmail) {
    try {
        const { data, error } = await supabase.rpc('upsert_external_user', {
            user_uuid: userUUID,
            user_email: userEmail
        });

        if (error) {
            throw error;
        }

        console.log('User added or existed:', data);
    } catch (error) {
        console.error('Error adding user to external table:', error.message);
    }
}

export { addUserToExternalTable };