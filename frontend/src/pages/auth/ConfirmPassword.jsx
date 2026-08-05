import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { useNavigate } from 'react-router-dom';
import useApiForm from '@/hooks/useApiForm';
import { pushToast } from '@/store/toastStore';

export default function ConfirmPassword() {
    const navigate = useNavigate();
    const { data, setData, post, processing, errors, reset } = useApiForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post('/auth/confirm-password', {
            onSuccess: (response) => {
                pushToast({
                    type: 'success',
                    title: 'Password confirmed',
                    message: response.message,
                });
                navigate('/dashboard');
            },
            onFinish: () => reset(['password']),
        });
    };

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-slate-300">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Confirm
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
