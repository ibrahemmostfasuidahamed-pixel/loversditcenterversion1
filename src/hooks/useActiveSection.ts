'use client';

import { useState, useEffect } from 'react';

const SECTIONS = ['home', 'offer', 'services', 'stats', 'howItWorks', 'testimonials', 'cta'];

export function useActiveSection(): string {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-10% 0px -10% 0px',
            }
        );

        SECTIONS.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return activeSection;
}
