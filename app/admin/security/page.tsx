import { PageHeader } from '@/components/PageHeader';
import { PasswordForm } from '@/components/PasswordForm';

export default function AdminSecurityPage() {
  return (
    <div>
      <PageHeader
        title="Security"
        description="Manage your password and account security."
      />
      <PasswordForm />
    </div>
  );
}
