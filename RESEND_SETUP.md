# Resend Email Integration Setup

## Environment Variables

Add the following environment variable to your Vercel project:

\`\`\`
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

### How to get your Resend API Key:

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Snippetly Production")
4. Copy the API key
5. Add it to your Vercel project environment variables

## Domain Configuration

Since you've already verified your domain, make sure:

1. Your domain is verified in Resend dashboard
2. DNS records are properly configured
3. Update the `EMAIL_FROM` constant in `lib/resend.ts` if needed:
   \`\`\`typescript
   export const EMAIL_FROM = 'Snippetly <noreply@snippetly.xyz>'
   \`\`\`

## Usage Examples

### Send Welcome Email

\`\`\`typescript
import { sendWelcomeEmail } from '@/lib/emails/send-email'

// After user signs up
await sendWelcomeEmail(
  user.email,
  user.display_name || 'there',
  'https://snippetly.xyz/dashboard'
)
\`\`\`

### Send Pro Upgrade Email

\`\`\`typescript
import { sendProUpgradeEmail } from '@/lib/emails/send-email'

// After successful Pro plan purchase
await sendProUpgradeEmail(
  user.email,
  user.display_name || 'there',
  transactionId,
  'https://snippetly.xyz/dashboard'
)
\`\`\`

### Send Custom Email

\`\`\`typescript
import { sendCustomEmail } from '@/lib/emails/send-email'

await sendCustomEmail(
  'user@example.com',
  'Your Custom Subject',
  '<h1>Your HTML content</h1>'
)
\`\`\`

## Integration Points

### 1. Welcome Email on Signup
Add to `app/signup/page.tsx` after successful signup:

\`\`\`typescript
// After successful signup
if (data.user) {
  await sendWelcomeEmail(
    email,
    data.user.user_metadata?.display_name || email.split('@')[0]
  )
}
\`\`\`

### 2. Pro Upgrade Email
Add to `app/api/webhooks/paddle/route.ts` after successful payment:

\`\`\`typescript
// After payment confirmation
if (event.event_type === 'transaction.completed') {
  await sendProUpgradeEmail(
    userEmail,
    userName,
    transactionId
  )
}
\`\`\`

## Email Templates

Email templates are located in `lib/emails/templates/`:

- `welcome-email.tsx` - Sent when users sign up
- `pro-upgrade-email.tsx` - Sent when users upgrade to Pro

You can customize these templates or create new ones following the same pattern.

## Testing

To test emails in development:

1. Use Resend's test mode
2. Check the Resend dashboard for sent emails
3. Use your own email for testing

## Rate Limits

Resend free tier includes:
- 100 emails/day
- 3,000 emails/month

For production, consider upgrading to a paid plan.

## Troubleshooting

If emails aren't sending:

1. Check that `RESEND_API_KEY` is set in environment variables
2. Verify your domain in Resend dashboard
3. Check server logs for error messages
4. Ensure the "from" email uses your verified domain
5. Check Resend dashboard for delivery status

## Next Steps

1. Add the `RESEND_API_KEY` to your Vercel environment variables
2. Deploy your changes
3. Test the email functionality
4. Monitor email delivery in Resend dashboard
