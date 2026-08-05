import PrimaryButton from '@/components/PrimaryButton';
import GuestLayout from '@/layouts/GuestLayout';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/api/client';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const id = searchParams.get('id');
        const hash = searchParams.get('hash');

        if (id && hash) {
            api.get('/auth/verify-email', { params: { id, hash } })
                .then(({ data }) => setStatus(data.message))
                .catch((err) =>
                    setError(
                        err.response?.data?.message ??
                            'Unable to verify your email.',
                    ),
                );
        }
    }, [searchParams]);

    const submit = async (e) => {
        e.preventDefault();

        setProcessing(true);
        setError(null);

        try {
            const { data } = await api.post(
                '/auth/email/verification-notification',
            );
            setStatus(data.message);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                    'Unable to resend the verification email.',
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <GuestLayout>
            <div className="mb-4 text-sm text-slate-300">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-400">
                    {status}
                </div>
            )}

            {error && (
                <div className="mb-4 text-sm font-medium text-rose-400">
                    {error}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Resend Verification Email
                    </PrimaryButton>

                    <Link
                        to="/login"
                        className="rounded-md text-sm text-violet-400 underline hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-0"
                    >
                        Log In
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
