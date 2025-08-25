-- Ensure unique constraints for idempotent upserts
-- 1) Make subscribers.email unique so ON CONFLICT (email) works
ALTER TABLE public.subscribers
ADD CONSTRAINT subscribers_email_unique UNIQUE (email);

-- 2) Ensure user_id is unique when present, to support upserts on user_id by other handlers (e.g., webhooks)
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_user_id_unique_not_null
ON public.subscribers (user_id)
WHERE user_id IS NOT NULL;

-- 3) Strengthen webhook idempotency by preventing duplicate provider_event_id entries
CREATE UNIQUE INDEX IF NOT EXISTS webhook_events_provider_event_id_unique
ON public.webhook_events (provider_event_id);
