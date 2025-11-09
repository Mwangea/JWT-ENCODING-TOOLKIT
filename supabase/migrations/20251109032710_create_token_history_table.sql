/*
  # Create Token History Table

  1. New Tables
    - `token_history`
      - `id` (uuid, primary key) - Unique identifier for each token entry
      - `token` (text, not null) - The generated JWT token
      - `token_type` (text, not null) - Type of token: 'access' or 'refresh'
      - `payload` (jsonb) - The payload data used to generate the token
      - `created_at` (timestamptz) - Timestamp when the token was generated
      - `expires_at` (timestamptz) - Token expiration timestamp

  2. Security
    - Enable RLS on `token_history` table
    - Add policy for anyone to insert tokens (public tool, no auth required)
    - Add policy for anyone to read their created tokens (by session or public access)

  3. Indexes
    - Index on `created_at` for efficient time-based queries
    - Index on `token_type` for filtering by type
*/

CREATE TABLE IF NOT EXISTS token_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL,
  token_type text NOT NULL CHECK (token_type IN ('access', 'refresh')),
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_token_history_created_at ON token_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_history_token_type ON token_history(token_type);

ALTER TABLE token_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on token_history"
  ON token_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read on token_history"
  ON token_history
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public delete on token_history"
  ON token_history
  FOR DELETE
  TO anon, authenticated
  USING (true);
