import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN');
const SLACK_CHANNEL_ID = '#gufa-alerts'; // Or your preferred channel

async function postToSlack(text: string) {
  if (!SLACK_BOT_TOKEN) {
    console.error('SLACK_BOT_TOKEN is not set.');
    return new Response(JSON.stringify({ error: 'Slack token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({ channel: SLACK_CHANNEL_ID, text }),
    });

    const result = await response.json();
    if (!result.ok) {
      throw new Error(`Slack API Error: ${result.error}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error posting to Slack:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

serve(async (req) => {
  try {
    const payload = await req.json();

    // Handle the test message
    if (payload.type === 'TEST') {
      return await postToSlack(payload.message);
    }

    // Handle Supabase webhook for new user
    if (payload.type === 'INSERT' && payload.table === 'profiles') {
      const newUser = payload.record;
      const message = `🎉 New User Registered!\nPhone: ${newUser.phone}\nRole: ${newUser.role}`;
      return await postToSlack(message);
    }

    return new Response(JSON.stringify({ message: 'Payload received, but no action taken.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
