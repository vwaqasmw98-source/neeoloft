/**
 * Slack + Discord webhook notifier.
 * Both accept JSON payloads; we send rich embeds for readability.
 */

type Embed = {
  title: string;
  description?: string;
  color?: number; // decimal RGB
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: string;
  timestamp?: string;
};

async function postWebhook(url: string | undefined, body: unknown): Promise<void> {
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('[notify] webhook post failed:', (err as Error).message);
  }
}

export async function notifySlack(input: {
  title: string;
  description?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
}) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  const blocks: unknown[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: input.title, emoji: true },
    },
  ];
  if (input.description) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: input.description },
    });
  }
  if (input.fields?.length) {
    blocks.push({
      type: 'section',
      fields: input.fields.map((f) => ({ type: 'mrkdwn', text: `*${f.name}*\n${f.value}` })),
    });
  }
  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: 'Neeoloft • AI-first agency' }],
  });
  await postWebhook(url, { blocks });
}

export async function notifyDiscord(input: {
  title: string;
  description?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  color?: number;
}) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;
  const embed: Embed = {
    title: input.title,
    description: input.description,
    color: input.color ?? 0x3a5cff,
    fields: input.fields,
    footer: { text: 'Neeoloft • AI-first agency' } as unknown as string,
    timestamp: new Date().toISOString(),
  };
  await postWebhook(url, { embeds: [embed] });
}

export async function notifyLead(input: {
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  source?: string;
}) {
  const fields = [
    { name: 'Name', value: input.name, inline: true },
    ...(input.email ? [{ name: 'Email', value: input.email, inline: true }] : []),
    ...(input.phone ? [{ name: 'Phone', value: input.phone, inline: true }] : []),
    ...(input.service ? [{ name: 'Service', value: input.service, inline: true }] : []),
    ...(input.source ? [{ name: 'Source', value: input.source, inline: true }] : []),
    ...(input.message ? [{ name: 'Message', value: input.message.slice(0, 500), inline: false }] : []),
  ];
  await Promise.all([
    notifySlack({ title: '🆕 New Neeoloft lead', fields }),
    notifyDiscord({ title: '🆕 New Neeoloft lead', fields }),
  ]);
}

export async function notifyBooking(input: {
  name: string;
  email: string;
  scheduledAt: string;
  durationMinutes?: number;
  source?: string;
}) {
  const fields = [
    { name: 'Name', value: input.name, inline: true },
    { name: 'Email', value: input.email, inline: true },
    { name: 'When', value: input.scheduledAt, inline: true },
    ...(input.durationMinutes
      ? [{ name: 'Duration', value: `${input.durationMinutes} min`, inline: true }]
      : []),
  ];
  await Promise.all([
    notifySlack({ title: '📅 New booking', fields }),
    notifyDiscord({ title: '📅 New booking', fields }),
  ]);
}
