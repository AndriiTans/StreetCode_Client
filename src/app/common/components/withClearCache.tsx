/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';

const WithClearCache: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState<boolean>(true);

    const refreshCacheAndReload = () => {
        if (caches) {
            caches.keys().then((names) => {
                for (const name of names) {
                    caches.delete(name);
                }
            });
            console.log('Cache is cleared');
        }
        window.location.reload();
    };

    useEffect(() => {
        const localVersion = localStorage.getItem('VERSION');
        const envVersion = window._env_.VERSION;
        if (typeof envVersion !== 'undefined' && localVersion !== 'undefined') {
            const isVersionMatches = localVersion === envVersion;
            setIsLatestBuildDate(isVersionMatches);
            if (!isVersionMatches) {
                localStorage.setItem('VERSION', window._env_.VERSION);
                refreshCacheAndReload();
            }
        }
    });

    if (isLatestBuildDate) {
        return children;
    }
    return null;
};

export default WithClearCache;
