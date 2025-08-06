-- Disable email confirmation by updating auth configuration
-- This will allow users to sign up without needing email confirmation
UPDATE auth.config 
SET email_confirm = false
WHERE config_key = 'email_confirm';

-- If the config doesn't exist, we need to modify the signup flow in the application instead
-- since we cannot directly modify auth schema configuration from migrations