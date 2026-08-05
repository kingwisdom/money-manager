import { useCallback, useState } from 'react';

/**
 * Thin wrapper around axios for page data fetching.
 *
 * const { data, loading, error, run } = useApiData();
 * useEffect(() => { run(() => api.get('/bills')) }, []);
 */
export default function useApiData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const run = useCallback(async (request) => {
        setLoading(true);
        setError(null);

        try {
            const response = await request();
            setData(response.data);

            return response.data;
        } catch (err) {
            setError(err);

            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, setData, loading, error, run };
}
