export const iosSpring = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
};

export const iosBounce = {
    type: 'spring' as const,
    stiffness: 500,
    damping: 25,
    mass: 0.6,
};

export const cardEnter = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { ...iosSpring, delay: i * 0.1 },
    }),
};

export const slideUp = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: iosSpring },
    exit: { y: '100%', opacity: 0 },
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { ...iosSpring, delay: i * 0.15 },
    }),
};

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: iosSpring,
    },
};

export const slideDown = {
    hidden: { y: '-100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: iosSpring },
    exit: { y: '-100%', opacity: 0, transition: { duration: 0.3 } },
};
