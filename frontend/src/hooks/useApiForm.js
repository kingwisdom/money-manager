import { useCallback, useMemo, useState } from 'react';
import api from '../api/client';

export default function useApiForm(initialData) {
    const [data, setDataState] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const setData = useCallback((key, value) => {
        setDataState((prev) => ({ ...prev, [key]: value }));
    }, []);

    const reset = useCallback(
        (...args) => {
            const fields = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;

            setDataState(
                fields.length
                    ? Object.fromEntries(fields.map((field) => [field, initialData[field]]))
                    : initialData,
            );
        },
        [initialData],
    );

    const clearErrors = useCallback(() => setErrors({}), []);

    const submit = useCallback(
        async (method, url, options = {}) => {
            setProcessing(true);
            setErrors({});

            try {
                const { data: response } = await api.request({ method, url, data });

                options.onSuccess?.(response);

                return response;
            } catch (error) {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors ?? {});
                }

                options.onError?.(error);

                throw error;
            } finally {
                setProcessing(false);
            }
        },
        [data],
    );

    const post = useCallback((url, options) => submit('post', url, options), [submit]);
    const patch = useCallback((url, options) => submit('patch', url, options), [submit]);
    const put = useCallback((url, options) => submit('put', url, options), [submit]);
    const destroy = useCallback((url, options) => submit('delete', url, options), [submit]);

    return useMemo(
        () => ({
            data,
            setData,
            errors,
            setErrors,
            processing,
            reset,
            clearErrors,
            post,
            patch,
            put,
            destroy,
        }),
        [data, setData, errors, processing, reset, clearErrors, post, patch, put, destroy],
    );
}
