import { useState } from 'react';
import { Transition } from '@headlessui/react';
import api from '@/api/client';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import useApiForm from '@/hooks/useApiForm';
import { useApp } from '@/context/AppContext';
import { pushToast } from '@/store/toastStore';

export default function UpdateProfileInformation({ className = '' }) {
    const { user, refreshBootstrap } = useApp();
    const [status, setStatus] = useState(null);
    const [resending, setResending] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const { data, setData, patch, errors, processing } = useApiForm({
        name: user.name,
        email: user.email,
        currency: user.currency,
    });

    const submit = (e) => {
        e.preventDefault();

        patch('/profile', {
            onSuccess: async (response) => {
                await refreshBootstrap();
                pushToast({
                    type: 'success',
                    title: 'Profile updated',
                    message: response.message,
                });
                setRecentlySuccessful(true);
                setTimeout(() => setRecentlySuccessful(false), 2000);
            },
        });
    };

    const sendVerification = async () => {
        setResending(true);

        try {
            await api.post('/auth/email/verification-notification');
            setStatus('verification-link-sent');
        } finally {
            setResending(false);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-white">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="currency" value="Currency" />

                    <select
                        id="currency"
                        className="input mt-1 block w-full"
                        value={data.currency}
                        onChange={(e) => setData('currency', e.target.value)}
                        required
                    >
                        {[
                            ['$', 'USD ($)'],
                            ['€', 'EUR (€)'],
                            ['£', 'GBP (£)'],
                            ['¥', 'JPY (¥)'],
                            ['₦', 'NGN (₦)'],
                            ['₹', 'INR (₹)'],
                            ['A$', 'AUD (A$)'],
                            ['C$', 'CAD (C$)'],
                            ['CHF', 'CHF'],
                            ['R$', 'BRL (R$)'],
                            ['₩', 'KRW (₩)'],
                            ['zł', 'PLN (zł)'],
                            ['₺', 'TRY (₺)'],
                            ['R', 'ZAR (R)'],
                        ].map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>

                    <InputError className="mt-2" message={errors.currency} />
                </div>

                {user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-slate-300">
                            Your email address is unverified.
                            <button
                                type="button"
                                onClick={sendVerification}
                                disabled={resending}
                                className="rounded-md text-sm text-violet-400 underline hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-0"
                            >
                                Click here to re-send the verification email.
                            </button>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-emerald-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-slate-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
