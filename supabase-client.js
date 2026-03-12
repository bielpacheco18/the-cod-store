const SUPABASE_URL = 'https://qupnpyqfuwmfhwceobbc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9mHjOVVYLLXafRod2eB32Q_2e1YIcrv';

function hasValidSupabaseConfig() {
  return (
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('YOUR-PROJECT-REF') &&
    !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
  );
}

const supabaseReady = Boolean(window.supabase) && hasValidSupabaseConfig();

window.theCodStoreSupabase = {
  client: supabaseReady ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null,
  isConfigured: supabaseReady
};
