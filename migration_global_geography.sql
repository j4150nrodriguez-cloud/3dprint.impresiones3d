-- migration_global_geography.sql
-- 1. Drop the foreign keys if they exist, or just drop the table and recreate it
DROP TABLE IF EXISTS addresses;

-- 2. Drop the old geographic tables
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS countries;

-- 3. Recreate the addresses table with text fields for geography
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  address_line TEXT NOT NULL,
  reference TEXT,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Policies for addresses
CREATE POLICY "Users can view their own addresses" 
  ON addresses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" 
  ON addresses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" 
  ON addresses FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" 
  ON addresses FOR DELETE 
  USING (auth.uid() = user_id);
