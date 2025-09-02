import { useState, useEffect, useRef } from 'react';
import { formatCompact } from '../utils/numberFormat';

// Generic animated counter hook.
// Signature: useCounter(targetValue, duration=1000, useCompact=false)
// When useCompact is true returns a compact-formatted string; otherwise returns a number.
export function useCounter(targetValue, duration = 1000, useCompact = false) {
    const [currentValue, setCurrentValue] = useState(0);
    const animationRef = useRef();
    const startTimeRef = useRef();
    const startValueRef = useRef(0);

    useEffect(() => {
        if (targetValue === currentValue) return; // Already at target

        const startValue = currentValue;
        startValueRef.current = startValue;
        startTimeRef.current = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
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
        return () => animationRef.current && cancelAnimationFrame(animationRef.current);
    }, [targetValue, duration, currentValue]);

    return useCompact ? formatCompact(currentValue) : currentValue;
}
