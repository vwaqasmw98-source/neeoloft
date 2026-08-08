import { SettingsClient } from './SettingsClient';

export const metadata = { title: 'Settings · Neeoloft', robots: { index: false, follow: false } };

export default function DashboardSettingsPage() {
  return <SettingsClient />;
}
