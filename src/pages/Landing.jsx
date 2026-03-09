import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Package, MapPin, Bell, ShieldCheck, CircleDollarSign, Search } from 'lucide-react';
import logo from '../assets/logo.png';
import heroBackground from '../assets/hero-bg.png';
import trackingApp from '../assets/tracking-app.png';
import driverAssigned from '../assets/driver-assigned.png';
import createOrder from '../assets/create-order.png';
import trackingBg from '../assets/trackingBg.png';

const DRIVER_APP_URL = import.meta.env.VITE_DRIVER_APP_URL || 'http://localhost:5174';

const features = [
    { icon: <MapPin size={24} />, title: 'Live GPS Tracking', desc: 'Watch your driver move on the map in real-time, updated every 3 seconds.' },
    { icon: <Bell size={24} />, title: 'Smart Notifications', desc: 'Get instant alerts at every step: assigned, picked up, and delivered.' },
    { icon: <ShieldCheck size={24} />, title: 'Secure Delivery', desc: 'Nothing is marked delivered without your personal confirmation code.' },
    { icon: <CircleDollarSign size={24} />, title: 'Transparent Pricing', desc: 'See your exact fee upfront. No hidden charges or surprises.' },
];

const marqueeItems = [
    'Fast Delivery', 'Live Tracking', 'Real-time Alerts', 'Safe & Secure',
    'Easy Ordering', 'Verified Drivers', 'Fast Delivery', 'Live Tracking',
    'Real-time Alerts', 'Safe & Secure', 'Easy Ordering', 'Verified Drivers',
];

// Hook to detect when element enters viewport
const useInView = (options = {}) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, { threshold: 0.15, ...options });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return [ref, inView];
};

const Landing = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const navigate = useNavigate();

    const [howItWorksRef, howItWorksInView] = useInView();
    const [ctaRef, ctaInView] = useInView();

    const handleTrack = (e) => {
        e.preventDefault();
        const trimmed = trackingNumber.trim();
        if (!trimmed) return;
        navigate(`/track/${trimmed}`);
    };

    return (
        <>
            <style>{`
                /* ── Marquee ── */
                @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

                /* ── Hero animations ── */
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                .hero-tagline  { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.1s; }
                .hero-heading  { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.3s; }
                .hero-sub      { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.5s; }
                .hero-para     { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.65s; }
                .hero-buttons  { animation: fadeSlideUp 0.7s ease both; animation-delay: 0.8s; }

                /* ── How It Works card animations ── */
                .hiw-card {
                    opacity: 0;
                    transform: translateY(32px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }
                .hiw-card.visible { opacity: 1; transform: translateY(0); }
                .hiw-card:nth-child(1) { transition-delay: 0s; }
                .hiw-card:nth-child(2) { transition-delay: 0.15s; }
                .hiw-card:nth-child(3) { transition-delay: 0.3s; }

                /* ── CTA animation ── */
                .cta-section {
                    opacity: 0;
                    transform: scale(0.97);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }
                .cta-section.visible { opacity: 1; transform: scale(1); }

                /* ── Footer links ── */
footer a:hover { color: #fdb813 !important; opacity: 1 !important; transition: color 0.15s; }
            `}</style>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingTop: '100px' }} />
            <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1050, width: '90%', maxWidth: '1320px' }}>
                <nav className="shadow-lg py-2" style={{ backgroundColor: 'rgba(10,26,63,0.9)', borderRadius: '30px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                    <div className="container-fluid px-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to="/" className="d-flex align-items-center text-decoration-none">
                                <img src={logo} alt="Lovelistics Logo" width="45" height="45" className="me-2" />
                                <span className="fw-bold text-white fs-6">LOVELISTICS</span>
                            </Link>
                            <div className="d-none d-lg-flex align-items-center gap-4">
                                <Link to="/login" className="text-decoration-none px-3 py-1" style={{ color: '#ffffff', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px' }}>Sign In</Link>
                                <Link to="/register" className="text-decoration-none px-3 py-1" style={{ backgroundColor: '#fdb813', color: '#0a1a3f', fontSize: '0.95rem', borderRadius: '20px', border: '1px solid #fdb813', fontWeight: '500' }}>Sign Up</Link>
                            </div>
                            <button className="d-lg-none btn btn-link p-0 border-0" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
                                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <span className="navbar-toggler-icon" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")" }}></span>
                            </button>
                        </div>
                        {menuOpen && (
                            <div className="d-lg-none mt-3 pb-2">
                                <div className="d-flex flex-column align-items-center gap-2">
                                    <Link to="/login" className="text-decoration-none py-1" style={{ color: '#ffffff' }}>Sign In</Link>
                                    <Link to="/register" className="text-decoration-none py-1" style={{ color: '#fdb813' }}>Sign Up</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* ── Hero ── */}
            <section style={{
                backgroundImage: `url(${heroBackground})`,
                backgroundSize: 'cover', backgroundPosition: 'center 30%',
                backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll',
                position: 'relative', minHeight: '100svh', height: '100vh',
                width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 60%, transparent 100%)', zIndex: 1 }} />
                <div className="container py-5 py-lg-0" style={{ position: 'relative', zIndex: 2, paddingTop: '120px' }}>
                    <div className="row align-items-center" style={{ minHeight: '50vh', marginTop: '-12rem' }}>
                        <div className="col-lg-6 text-center text-lg-start">
                            <p className="hero-tagline text-uppercase fw-semibold mb-3" style={{ letterSpacing: '2px', color: '#fdb813' }}>Now Live in Your City</p>
                            <h1 className="hero-heading display-3 fw-bold mb-4" style={{ color: '#0a1a3f', lineHeight: '1.1' }}>
                                Your package,<br />
                                <span style={{ color: '#fdb813' }}>delivered fast with love.</span>
                            </h1>
                            <p className="hero-sub lead fw-bold mb-2" style={{ color: '#0a1a3f' }}>Delivering Trust, On Time. Every Time.</p>
                            <p className="hero-para mb-4 fw-bold" style={{ color: '#0a1a3f', maxWidth: '480px' }}>
                                Experience the new standard in logistics. Place an order in seconds, track it live, and relax while we handle the rest.
                            </p>
                            <div className="hero-buttons d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                                <Link to="/register" className="btn btn-lg px-4 fw-semibold" style={{ backgroundColor: '#fdb813', borderColor: '#fdb813', color: '#0a1a3f' }}>Get Started →</Link>
                                <Link to="/track" className="btn btn-outline-dark btn-lg px-4 fw-semibold">Track Order</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Marquee ── */}
            <div style={{ backgroundColor: '#fdb813', padding: '0.6rem 0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', animation: 'marqueeScroll 22s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
                    {[...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0 1.75rem', fontSize: '0.78rem', fontWeight: '700', color: '#0a1a3f', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            <span style={{ fontSize: '0.4rem', verticalAlign: 'middle' }}>●</span>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── How It Works ── */}
            <section className="d-flex align-items-center py-5">
                <div className="container text-center">
                    <p className="text-uppercase text-secondary mb-3 fw-semibold" style={{ letterSpacing: '2px' }}>How It Works</p>
                    <h2 className="display-5 fw-bold mb-5" style={{ color: '#0a1a3f' }}>Delivery in 3 simple steps</h2>
                    <div ref={howItWorksRef} className="row g-4">
                        {[
                            { num: '01', img: createOrder, imgAlt: 'Person creating a delivery order on a phone', title: 'Place Request', desc: 'Enter pickup & drop-off details. Get an instant quote and confirm your order in seconds.' },
                            { num: '02', img: driverAssigned, imgAlt: 'Courier receiving a delivery assignment', title: 'Driver Assigned', desc: 'Our smart system assigns the nearest verified driver. You get their details instantly.' },
                            { num: '03', img: trackingApp, imgAlt: 'Live tracking app on a phone', title: 'Live Tracking', desc: 'Watch your package move on the map. Get notified when it arrives safely.' },
                        ].map((step) => (
                            <div key={step.num} className={`col-md-4 hiw-card ${howItWorksInView ? 'visible' : ''}`}>
                                <div className="card h-100 border-0 bg-light position-relative overflow-hidden" style={{ borderRadius: '16px', textAlign: 'left' }}>
                                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                                        <img src={step.img} alt={step.imgAlt} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', backgroundColor: '#0a1a3f', color: '#fdb813', fontWeight: '800', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '6px', letterSpacing: '1px' }}>{step.num}</div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="fw-bold mb-2" style={{ color: '#0a1a3f' }}>{step.title}</h4>
                                        <p className="text-secondary mb-0">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why Choose Us ── */}
            <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-5 text-center">
                            <p className="text-uppercase text-secondary mb-3 fw-semibold" style={{ letterSpacing: '2px' }}>Why Choose Us</p>
                            <h2 className="display-5 fw-bold mb-4" style={{ color: '#0a1a3f' }}>Built for speed, designed for trust.</h2>
                            <p className="text-secondary mb-4">We've reimagined logistics to be transparent and reliable. From real-time GPS tracking to verified drivers, we give you complete peace of mind.</p>
                            <Link to="/register" className="btn btn-primary btn-lg px-4 mb-4" style={{ backgroundColor: '#0a1a3f', borderColor: '#0a1a3f' }}>Get Started Free →</Link>
                        </div>
                        <div className="col-lg-7">
                            {features.map((f, i) => (
                                <div className="d-flex mb-4" key={i}>
                                    <div className="me-3 p-3 bg-white rounded-3" style={{ color: '#0a1a3f' }}>{f.icon}</div>
                                    <div>
                                        <h5 className="fw-bold">{f.title}</h5>
                                        <p className="text-secondary mb-0">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Track Your Order ── */}
            <section className="py-5" style={{
                backgroundImage: `url(${trackingBg})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat', position: 'relative', backgroundColor: '#0a1a3f'
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,26,63,0.85)', zIndex: 1 }} />
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="row justify-content-center text-center mb-4">
                        <div className="col-lg-7">
                            <p className="text-uppercase fw-semibold mb-2" style={{ letterSpacing: '2px', color: '#fdb813', fontSize: '0.8rem' }}>Real-Time Updates</p>
                            <h2 className="display-5 fw-bold text-white mb-3">Track Your Package</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Enter your tracking number below to get an instant update on your delivery status. No login required.</p>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <form onSubmit={handleTrack}>
                                <div className="d-flex gap-2">
                                    <div className="position-relative flex-grow-1">
                                        <Package size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7a99', pointerEvents: 'none' }} />
                                        <input
                                            type="text"
                                            value={trackingNumber}
                                            onChange={e => setTrackingNumber(e.target.value)}
                                            placeholder="Enter tracking number e.g. TRK-8842"
                                            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                                            onFocus={e => e.target.style.borderColor = '#fdb813'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                        />
                                    </div>
                                    <button type="submit" className="btn fw-bold d-flex align-items-center gap-2"
                                        style={{ background: '#fdb813', color: '#0a1a3f', borderRadius: '12px', padding: '0.85rem 1.5rem', whiteSpace: 'nowrap', border: 'none' }}>
                                        <Search size={16} /> Track
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Start Now CTA ── */}
            <section ref={ctaRef} className={`cta-section py-4 ${ctaInView ? 'visible' : ''}`} style={{ backgroundColor: '#f3f4f5' }}>
                <div className="container text-center text-white py-lg-5">                    <p className="text-uppercase mb-3 fw-semibold" style={{ letterSpacing: '2px', color: '#fdb813' }}>Start Now</p>
                    <h2 className="display-5 fw-bold mb-4" style={{ color: '#05102e' }}>Ready to send your first package?</h2>
                    <p className="lead mb-4" style={{ maxWidth: '700px', margin: '0 auto 2rem auto', opacity: 0.9, color: '#05102e' }}>
                        Join thousands of happy customers using LOVELISTICS. Fast, secure, and affordable delivery at your fingertips.
                    </p>
                    <Link to="/register" className="btn btn-warning fw-semibold btn-lg" style={{ backgroundColor: '#fdb813', borderColor: '#fdb813', color: '#0a1a3f' }}>
                        Create Free Account →
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-4" style={{ backgroundColor: '#05102e', color: '#fff' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="d-flex align-items-center mb-3">
                                <img src={logo} alt="Logo" width="35" height="35" className="me-2" />
                                <span className="fw-bold fs-4">LOVELISTICS</span>
                            </div>
                            <p style={{ opacity: 0.7 }}>Reliable, fast, and secure logistics for modern businesses and individuals. We deliver trust, every time.</p>
                        </div>
                        <div className="col-6 col-lg-2">
                            <h6 className="fw-bold mb-3">Company</h6>
                            <ul className="list-unstyled">
                                <li className="mb-2"><Link to="/" className="text-white text-decoration-none" style={{ opacity: 0.7 }}>Home</Link></li>
                                <li className="mb-2"><Link to="/about" className="text-white text-decoration-none" style={{ opacity: 0.7 }}>About Us</Link></li>
                                <li className="mb-2"><Link to="/services" className="text-white text-decoration-none" style={{ opacity: 0.7 }}>Services</Link></li>
                            </ul>
                        </div>
                        <div className="col-6 col-lg-2">
                            <h6 className="fw-bold mb-3">Platform</h6>
                            <ul className="list-unstyled">
                                <li className="mb-2"><Link to="/login" className="text-white text-decoration-none" style={{ opacity: 0.7 }}>Login</Link></li>
                                <li className="mb-2"><Link to="/register" className="text-white text-decoration-none" style={{ opacity: 0.7 }}>Sign Up</Link></li>
                                <li className="mb-2"><a href={`${DRIVER_APP_URL}/register`} className="text-white text-decoration-none" style={{ opacity: 0.7 }} target="_blank" rel="noopener noreferrer">Drive for Us</a></li>
                                <li className="mb-2"><Link to="/track" className="text-white text-decoration-none" style={{ opacity: 0.7 }}>Track Order</Link></li>
                            </ul>
                        </div>
                        <div className="col-lg-4">
                            <h6 className="fw-bold mb-3">Contact</h6>
                            <ul className="list-unstyled" style={{ opacity: 0.7 }}>
                                <li className="mb-2">+234 816 782 1650</li>
                                <li className="mb-2">support@lovelistics.com</li>
                                <li className="mb-2">12 Marina Street, Sharp Estate,<br />Osogbo, Nigeria.</li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0" style={{ opacity: 0.6 }}>
                            <p className="mb-0">© 2026 LOVELISTICS. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <Link to="/privacy" className="text-white text-decoration-none me-3" style={{ opacity: 0.6 }}>Privacy Policy</Link>
                            <Link to="/terms" className="text-white text-decoration-none" style={{ opacity: 0.6 }}>Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Landing;