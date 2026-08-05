import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') ?? 'null');
        } catch {
            return null;
        }
    });
    const [currency, setCurrency] = useState(() => localStorage.getItem('currency') ?? '$');
    const [categories, setCategories] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [booting, setBooting] = useState(Boolean(localStorage.getItem('token')));

    const refreshBootstrap = useCallback(async () => {
        if (!localStorage.getItem('token')) return null;

        const { data } = await api.get('/bootstrap');

        setUser(data.user);
        setCurrency(data.currency);
        setCategories(data.categories);
        setUnreadNotifications(data.unreadNotifications ?? 0);

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('currency', data.currency);

        return data;
    }, []);

    useEffect(() => {
        let active = true;

        (async () => {
            if (!localStorage.getItem('token')) {
                if (active) setBooting(false);
                return;
            }

            try {
                await refreshBootstrap();
            } catch {
                // api client handles 401 (clears token + redirects)
            } finally {
                if (active) setBooting(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [refreshBootstrap]);

    const setAuth = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('currency', userData.currency);

        setUser(userData);
        setCurrency(userData.currency);
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // ignore
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currency');

        setUser(null);
        setCurrency('$');
        setUnreadNotifications(0);
        setCategories([]);
    }, []);

    const value = useMemo(
        () => ({
            user,
            currency,
            categories,
            unreadNotifications,
            setUnreadNotifications,
            setCategories,
            booting,
            setAuth,
            logout,
            refreshBootstrap,
        }),
        [user, currency, categories, unreadNotifications, booting, setAuth, logout, refreshBootstrap],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);

    if (!ctx) {
        throw new Error('useApp must be used within an AppProvider');
    }

    return ctx;
}
