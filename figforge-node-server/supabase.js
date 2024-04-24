import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function fetchProjectDetails(projectId) {
    try {
        const { data, error } = await supabase
            .rpc('get_project_details2', { p_project_id: projectId });

        if (error) {
            console.error('Error fetching project details:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error fetching project details:', error);
        return null;
    }
}

export { fetchProjectDetails };