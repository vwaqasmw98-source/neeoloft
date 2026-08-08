import { PageHeader } from '@/components/PageHeader';
import { ProfileForm } from '@/components/ProfileForm';

export default function DashboardProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile"
        description="Update your name, email, phone, and address."
      />
      <ProfileForm />
    </div>
  );
}
