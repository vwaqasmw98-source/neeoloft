import { PageHeader } from '@/components/PageHeader';
import { PasswordForm } from '@/components/PasswordForm';

export default function DashboardSecurityPage() {
  return (
    <div>
      <PageHeader
        title="Security"
        description="Change your password and manage account security."
      />
      <PasswordForm />
    </div>
  );
}
