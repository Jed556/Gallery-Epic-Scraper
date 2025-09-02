import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(targetValue, duration = 1000) {
    const [currentValue, setCurrentValue] = useState(0);
    const animationRef = useRef();
    const startTimeRef = useRef();
    const startValueRef = useRef(0);

    useEffect(() => {
        if (targetValue === currentValue) return;

        const startValue = currentValue;
        startValueRef.current = startValue;
        startTimeRef.current = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            // Use easeOutCubic for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const animatedValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);

            setCurrentValue(animatedValue);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setCurrentValue(targetValue);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [targetValue, duration, currentValue]);

    return currentValue;
}
