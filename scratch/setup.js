const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:989848177s@db.unfveyhxbfnshjdadcfn.supabase.co:5432/postgres'
});

async function run() {
  await client.connect();
  
  const sql = `
    CREATE TABLE IF NOT EXISTS marketing_demands (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamp with time zone DEFAULT now(),
      user_id uuid REFERENCES auth.users(id),
      title text NOT NULL,
      description text,
      status text NOT NULL DEFAULT 'backlog',
      priority text NOT NULL DEFAULT 'medium',
      cover_image text,
      comments_count integer DEFAULT 0,
      attachments_count integer DEFAULT 0,
      due_date timestamp with time zone
    );
    
    ALTER TABLE marketing_demands ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Enable read/write for all" ON marketing_demands;
    CREATE POLICY "Enable read/write for all" ON marketing_demands 
    AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);
  `;
  
  await client.query(sql);
  console.log("Done");
  await client.end();
}

run().catch(console.error);
