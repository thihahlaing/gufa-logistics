import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const slackBotToken = process.env.SLACK_BOT_TOKEN;
  const channel = '#gufa-alerts'; // Or your preferred channel

  if (!slackBotToken) {
    console.error('SLACK_BOT_TOKEN is not set in environment variables.');
    return NextResponse.json({ error: 'Slack bot token is not configured.' }, { status: 500 });
  }

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${slackBotToken}`,
      },
      body: JSON.stringify({ channel, text: message }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Slack API error:', data.error);
      return NextResponse.json({ error: `Slack API Error: ${data.error}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent to Slack successfully' });
  } catch (error: any) {
    console.error('Failed to send message to Slack:', error);
    return NextResponse.json({ error: `Failed to send message to Slack: ${error.message}` }, { status: 500 });
  }
}
