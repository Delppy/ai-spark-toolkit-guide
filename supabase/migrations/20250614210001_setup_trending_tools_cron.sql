
-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule weekly update of trending tools (every Monday at 6 AM UTC)
SELECT cron.schedule(
  'update-trending-tools-weekly',
  '0 6 * * 1', -- Every Monday at 6 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://kcgxrzcpppsfhfsdqioz.supabase.co/functions/v1/update-trending-tools',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZ3hyemNwcHBzZmhmc2RxaW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMTM4MTEsImV4cCI6MjA0OTc4OTgxMX0.DU8c2nzwwlpztyajT2LWkT3y-sQZ3fNhiifPXevRbDs"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
