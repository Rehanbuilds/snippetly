-- Update boilerplates table to support multiple languages
-- Change language from TEXT to TEXT[] to store multiple languages

-- First, convert existing single language values to arrays
ALTER TABLE public.boilerplates 
  ALTER COLUMN language TYPE TEXT[] 
  USING ARRAY[language];

-- Update the index to work with array type
DROP INDEX IF EXISTS boilerplates_language_idx;
CREATE INDEX IF NOT EXISTS boilerplates_languages_idx ON public.boilerplates USING GIN(language);
