import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, CheckCircle, Truck, Bell, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'lv_onboarded';

const steps = [
    {
        label: 'Welcome',
        title: 'Welcome to Lovelistics',
        subtitle: "Nigeria's on-demand delivery platform. Send parcels across the city in minutes — tracked live, every step of the way.",
        items: [
            { icon: <Package size={16} />, text: 'Place an order in under 60 seconds' },
            { icon: <MapPin size={16} />,  text: 'Watch your driver live on the map' },
            { icon: <CheckCircle size={16} />, text: 'You confirm delivery — no surprises' },
        ],
    },
    {
        label: 'How it works',
        title: 'Three steps. That\'s it.',
        subtitle: 'No experience needed. If you can fill a form, you can send a package.',
        items: [
            { icon: <Package size={16} />,  text: 'Fill in pickup & drop-off details, add a photo if needed' },
            { icon: <Truck size={16} />,    text: 'A verified driver nearby is assigned automatically' },
            { icon: <Bell size={16} />,     text: 'Track live and get notified at every milestone' },
        ],
    },
    {
        label: 'Get started',
        title: 'Ready to send your first package?',
        subtitle: 'Free to sign up. No subscription. No hidden charges.',
        items: [
            { icon: <ShieldCheck size={16} />, text: 'Verified drivers only — vetted before they go live' },
            { icon: <CheckCircle size={16} />, text: 'Your data is private and never shared' },
            { icon: <MapPin size={16} />,      text: 'Track any order without logging in' },
        ],
        isFinal: true,
    },
];

const OnboardingModal = () => {
    const [visible, setVisible] = useState(false);
    const [step, setStep]       = useState(0);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem(STORAGE_KEY);
        if (!seen) {
            // Small delay so the hero has a moment to paint first
            const t = setTimeout(() => setVisible(true), 600);
            return () => clearTimeout(t);
        }
    }, []);

    const dismiss = () => {
        setExiting(true);
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, '1');
            setVisible(false);
            setExiting(false);
        }, 250);
    };

    const next = () => {
        if (step < steps.length - 1) setStep(s => s + 1);
        else dismiss();
    };

    if (!visible) return null;

    const current = steps[step];

    return (
        <>
            <style>{`
                @keyframes lvFadeIn  { from { opacity: 0; }              to { opacity: 1; } }
                @keyframes lvSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes lvFadeOut { from { opacity: 1; }              to { opacity: 0; } }
                .lv-ob-backdrop { animation: ${exiting ? 'lvFadeOut' : 'lvFadeIn'} 0.25s ease both; }
                .lv-ob-card     { animation: ${exiting ? 'lvFadeOut' : 'lvSlideUp'} 0.3s ease both; }
            `}</style>

            {/* Backdrop */}
            <div
                className="lv-ob-backdrop"
                onClick={dismiss}
                style={{
                    position: 'fixed', inset: 0, zIndex: 2000,
                    background: 'rgba(5,16,46,0.65)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem',
                }}
            >
                {/* Card — stop clicks bubbling to backdrop */}
                <div
                    className="lv-ob-card"
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: '#fff', borderRadius: '20px',
                        width: '100%', maxWidth: '440px',
                        padding: '2rem', position: 'relative',
                        boxShadow: '0 24px 60px rgba(5,16,46,0.18)',
                    }}
                >
                    {/* Close */}
                    <button
                        onClick={dismiss}
                        aria-label="Close"
                        style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#888', fontSize: '20px', lineHeight: 1, padding: '2px',
                        }}
                    >×</button>

                    {/* Progress bar */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem' }}>
                        {steps.map((_, i) => (
                            <div key={i} style={{
                                height: '3px', flex: 1, borderRadius: '2px',
                                background: i <= step ? '#fdb813' : '#e5e7eb',
                                transition: 'background 0.3s',
                            }} />
                        ))}
                    </div>

                    {/* Step label */}
                    <p style={{
                        fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
                        color: '#6b7a99', textTransform: 'uppercase', marginBottom: '0.4rem',
                    }}>
                        Step {step + 1} of {steps.length}
                    </p>

                    {/* Title */}
                    <h2 style={{
                        fontSize: '1.35rem', fontWeight: 700, color: '#0a1a3f',
                        marginBottom: '0.5rem', lineHeight: 1.25,
                    }}>
                        {current.title}
                    </h2>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: '0.9rem', color: '#6b7a99',
                        lineHeight: 1.6, marginBottom: '1.25rem',
                    }}>
                        {current.subtitle}
                    </p>

                    {/* Feature list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.75rem' }}>
                        {current.items.map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '10px 14px',
                                background: '#f8f9fb', borderRadius: '10px',
                            }}>
                                <span style={{ color: '#0a1a3f', flexShrink: 0 }}>{item.icon}</span>
                                <span style={{ fontSize: '0.875rem', color: '#0a1a3f' }}>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    {current.isFinal ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link
                                to="/register"
                                onClick={dismiss}
                                style={{
                                    display: 'block', textAlign: 'center',
                                    background: '#fdb813', color: '#0a1a3f',
                                    borderRadius: '10px', padding: '11px',
                                    fontWeight: 700, fontSize: '0.9rem',
                                    textDecoration: 'none',
                                }}
                            >
                                Create Free Account →
                            </Link>
                            <Link
                                to="/track"
                                onClick={dismiss}
                                style={{
                                    display: 'block', textAlign: 'center',
                                    background: 'transparent',
                                    border: '1.5px solid #0a1a3f',
                                    color: '#0a1a3f', borderRadius: '10px',
                                    padding: '10px', fontWeight: 600,
                                    fontSize: '0.9rem', textDecoration: 'none',
                                }}
                            >
                                Track a Package
                            </Link>
                            <button
                                onClick={dismiss}
                                style={{
                                    background: 'none', border: 'none',
                                    color: '#6b7a99', fontSize: '0.8rem',
                                    cursor: 'pointer', padding: '4px',
                                }}
                            >
                                I'll explore on my own
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                onClick={dismiss}
                                style={{
                                    background: 'none', border: 'none',
                                    color: '#6b7a99', fontSize: '0.85rem',
                                    cursor: 'pointer', padding: 0,
                                }}
                            >
                                Skip
                            </button>
                            <button
                                onClick={next}
                                style={{
                                    background: '#fdb813', color: '#0a1a3f',
                                    border: 'none', borderRadius: '10px',
                                    padding: '10px 24px', fontWeight: 700,
                                    fontSize: '0.875rem', cursor: 'pointer',
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OnboardingModal;