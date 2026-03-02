import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Wallet } from 'lucide-react';

const Services = () => {
    // Service areas/cities
    const cities = ['Osogbo', 'Ibadan', 'Lagos', 'Kano', 'Port Harcourt', 'Owerri'];

    // Services data with icons (using SVG placeholders - you can replace with your icons)
    const services = [
        {
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 4 8 12 8 12s8-8 8-12a8 8 0 0 0-8-8z"/></svg>,
            title: 'Same-Day Delivery',
            description: 'Urgent delivery within the same day. Perfect for time-sensitive documents and packages within the same city.',
            features: ['Delivery within hours', 'Real-time tracking', 'SMS notifications']
        },
        {
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12A10 10 0 0 0 12 2"/><path d="M22 12h-4"/><path d="M12 22A10 10 0 0 1 2 12"/><path d="M12 22v-4"/><path d="M2 12h4"/><circle cx="12" cy="12" r="4"/></svg>,
            title: 'Next-Day Delivery',
            description: 'Reliable next-day delivery to major cities. Check availability for your location.',
            features: ['Guaranteed next-day', 'Trackable', 'Insurance available']
        },
        {
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
            title: 'Specialized Handling',
            description: 'Extra care for fragile, perishable, and valuable items. Temperature-controlled options available.',
            features: ['Fragile items', 'Perishable goods', 'Temperature control']
        },
        {
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
            title: 'Interstate Shipping',
            description: 'Seamless shipping between states. We handle the logistics so you don\'t have to.',
            features: ['Cross-country', 'Bulk shipments', 'Fleet management']
        },
        {
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
            title: 'Intrastate Shipping',
            description: 'Fast and reliable shipping within your state. Perfect for local businesses and individuals.',
            features: ['Same-state delivery', 'Economical rates', 'Quick turnaround']
        },
        {
            icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12"/><path d="M3.3 7L12 12l8.7-5"/></svg>,
            title: 'Business Logistics',
            description: 'Custom logistics solutions for businesses of all sizes. Volume discounts available.',
            features: ['Bulk shipping', 'Regular pickups', 'Dedicated account manager']
        }
    ];

    return (
        <>
            {/* Header Section */}
            <section className="py-5" style={{ backgroundColor: '#0a1a3f' }}>
                <div className="container py-4 text-center">
                    <h1 className="display-4 fw-bold text-white mb-3">Our Services</h1>
                    <p className="lead text-white mb-0" style={{ opacity: 0.9 }}>
                        Fast, reliable, and secure delivery solutions tailored to your needs
                    </p>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-5">
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <p className="text-uppercase mb-3 fw-semibold" style={{ letterSpacing: '2px', color: '#fdb813' }}>
                                What We Offer
                            </p>
                            <h2 className="display-5 fw-bold mb-4" style={{ color: '#0a1a3f' }}>
                                Delivery solutions for every need
                            </h2>
                            <p className="lead text-secondary">
                                Whether you need same-day delivery or interstate shipping, we've got you covered. 
                                Our team ensures your packages arrive safely and on time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container py-4 text-center text-lg-start">
                    <div className="row g-4">
                        {services.map((service, index) => (
                            <div className="col-md-6 col-lg-4" key={index}>
                                <div className="card h-100 border-0 shadow-sm p-4">
                                    <div className="mb-4" style={{ color: '#0a1a3f' }}>
                                        {service.icon}
                                    </div>
                                    <h4 className="fw-bold mb-3" style={{ color: '#0a1a3f' }}>
                                        {service.title}
                                    </h4>
                                    <p className="text-secondary mb-4">
                                        {service.description}
                                    </p>
                                    <div className="mt-auto">
                                        <p className="fw-semibold mb-2 small" style={{ color: '#fdb813' }}>
                                            Features:
                                        </p>
                                        <ul className="list-unstyled mb-0">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="small text-secondary mb-1">
                                                    ✓ {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Areas */}
            <section className="py-5">
                <div className="container py-4">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
                            <p className="text-uppercase mb-3 fw-semibold" style={{ letterSpacing: '2px', color: '#fdb813' }}>
                                Where We Deliver
                            </p>
                            <h2 className="display-5 fw-bold mb-4" style={{ color: '#0a1a3f' }}>
                                Serving major cities across Nigeria
                            </h2>
                            <p className="text-secondary mb-4">
                                We're constantly expanding our network to reach more customers. 
                                Currently operating in these major cities:
                            </p>
                            <div className="row g-2">
                                {cities.map((city, index) => (
                                    <div className="col-6 col-md-4" key={index}>
                                        <div className="d-flex align-items-center mb-2">
                                            <span style={{ color: '#fdb813', marginRight: '8px' }}>✓</span>
                                            <span className="text-secondary">{city}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-secondary mt-4 small">
                                *Next-day delivery availability varies by location. Contact us to confirm.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="bg-light p-5 rounded-4 text-center" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="mb-4" style={{ color: '#0a1a3f' }}>
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <h4 className="fw-bold mb-3" style={{ color: '#0a1a3f' }}>Expanding to more cities</h4>
                                <p className="text-secondary mb-0">
                                    We're growing! New locations coming soon. 
                                    Follow us for updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container py-4">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="text-center">
                                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                                     style={{ width: '80px', height: '80px', backgroundColor: 'rgba(10, 26, 63, 0.1)' }}>
                                    <span className="fs-2" style={{ color: '#0a1a3f' }}><Truck /></span>
                                </div>
                                <h5 className="fw-bold mb-3">Real-time Tracking</h5>
                                <p className="text-secondary">Know exactly where your package is, anytime.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center">
                                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                                     style={{ width: '80px', height: '80px', backgroundColor: 'rgba(10, 26, 63, 0.1)' }}>
                                    <span className="fs-2" style={{ color: '#0a1a3f' }}><ShieldCheck /></span>
                                </div>
                                <h5 className="fw-bold mb-3">Verified Drivers</h5>
                                <p className="text-secondary">All our drivers are thoroughly vetted.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center">
                                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                                     style={{ width: '80px', height: '80px', backgroundColor: 'rgba(10, 26, 63, 0.1)' }}>
                                    <span className="fs-2" style={{ color: '#0a1a3f' }}><Wallet /></span>
                                </div>
                                <h5 className="fw-bold mb-3">Transparent Pricing</h5>
                                <p className="text-secondary">No hidden fees, ever. See costs upfront.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-5" style={{ backgroundColor: '#0a1a3f' }}>
                <div className="container py-4 text-center text-white">
                    <h2 className="display-5 fw-bold mb-4">Need a custom solution?</h2>
                    <p className="lead mb-4" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
                        Contact us for bulk shipping, regular pickups, or special requirements.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Link to="/contact" className="btn btn-lg px-5 py-3 fw-semibold" 
                              style={{ backgroundColor: '#fdb813', borderColor: '#fdb813', color: '#0a1a3f' }}>
                            Contact Us
                        </Link>
                        <Link to="/register" className="btn btn-lg px-5 py-3 fw-semibold btn-outline-light">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Services;