import { useState, useEffect } from 'react';

export function getLoadingProgress() {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(oldProgress => Math.min(oldProgress + 10, 100));
        }, 100);

        return () => clearInterval(timer);
    }, []);

    return progress;
    /*const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => setProgress((oldProgress) => {
            if (oldProgress === 100) return 100;
            const diff = Math.random() * 20;
            return Math.min(oldProgress + diff, 100);
        });
        const timer = setInterval(updateProgress, 100);
        return () => clearInterval(timer);
    }, []);

    return progress;*/
}
