import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useApiForm from '@/hooks/useApiForm';
import { useApp } from '@/context/AppContext';

export default function Login() {
    const { setAuth } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const { data, setData, post, processing, errors, reset } = useApiForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post('/auth/login', {
            onSuccess: (response) => {
                setAuth(response.token, response.user);
                navigate(location.state?.from ?? '/dashboard');
            },
            onFinish: () => reset(['password']),
        });
    };

    return (
        <GuestLayout>
            {location.state?.status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {location.state.status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-slate-300">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        to="/forgot-password"
                        className="rounded-md text-sm text-violet-400 underline hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-0"
                    >
                        Forgot your password?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 border-t border-white/5 pt-5 text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <Link
                    to="/register"
                    className="font-semibold text-violet-400 hover:text-violet-300"
                >
                    Create one free
                </Link>
            </div>
        </GuestLayout>
    );
}
