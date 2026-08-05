import AppLayout from '@/layouts/AppLayout';
import PageHeader from '@/components/PageHeader';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit() {
    return (
        <AppLayout title="Profile">
            <PageHeader title="Profile" subtitle="Manage your account settings" />

            <div className="space-y-6">
                <div className="card p-6 sm:p-8">
                    <UpdateProfileInformationForm className="max-w-xl" />
                </div>

                <div className="card p-6 sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="card border-rose-500/20 p-6 sm:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AppLayout>
    );
}
