import { PageHeader } from '@/components/PageHeader';
import { ProfileForm } from '@/components/ProfileForm';

export default function AdminProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your admin account details. Changes here only affect you."
      />
      <ProfileForm />
    </div>
  );
}
