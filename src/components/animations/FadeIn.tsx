import React, { type FC, useEffect, useRef } from 'react';
import './FadeIn.css';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
}

export const FadeIn: FC<FadeInProps> = ({ children, delay = 0 }) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('fade-in-visible');
                        }, delay);
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [delay]);

    return (
        <div ref={elementRef} className="fade-in">
            {children}
        </div>
    );
};
