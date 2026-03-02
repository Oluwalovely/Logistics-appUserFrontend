import { Link } from 'react-router-dom';

const AboutUs = () => {
    
    const stats = [
        { value: '5+', label: 'Years in Business' },
        { value: '50k+', label: 'Deliveries Completed' },
        { value: '500+', label: 'Happy Clients' },
        { value: '98%', label: 'On-Time Delivery' }
    ];


    const team = [
        { 
            name: 'Adebayo Emmanuel', 
            role: 'Founder & CEO',
            bio: '15+ years in logistics and supply chain management.',
            initials: 'AE'
        },
        { 
            name: 'Adekunle', 
            role: 'Operations Director',
            bio: 'Ensures every delivery meets our high standards.',
            initials: 'AG'
        },
        { 
            name: 'Mubarak', 
            role: 'Technology Lead',
            bio: 'Building the tech that powers your deliveries.',
            initials: 'MB'
        },
        { 
            name: 'Oluwalonimi', 
            role: 'Customer Experience',
            bio: 'Making sure you\'re happy every step of the way.',
            initials: 'NM'
        }
    ];

    return (
        <>
            
            <section className="py-5" style={{ backgroundColor: '#0a1a3f' }}>
                <div className="container py-4 text-center">
                    <h1 className="display-4 fw-bold text-white mb-3">About Lovelistics</h1>
                    <p className="lead text-white mb-0" style={{ opacity: 0.9 }}>
                        Delivering trust, on time, every time.
                    </p>
                </div>
            </section>

            
            <section className="py-5">
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <p className="text-uppercase mb-3 fw-semibold" style={{ letterSpacing: '2px', color: '#fdb813' }}>
                                Our Mission
                            </p>
                            <h2 className="display-5 fw-bold mb-4" style={{ color: '#0a1a3f' }}>
                                Making delivery simple, reliable, and transparent
                            </h2>
                            <p className="lead text-secondary mb-4">
                                Lovelistics was founded in 2020 with a simple goal: to make package delivery 
                                stress-free for everyone. What started as a small local service has grown into 
                                a trusted logistics partner for businesses and individuals across the country.
                            </p>
                            <p className="text-secondary">
                                We believe that every delivery matters. Whether it's a document, a gift, or 
                                business inventory, we treat every package with the same care and attention. 
                                Our combination of smart technology and dedicated people ensures your items 
                                arrive safely, every time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container py-4">
                    <div className="row g-4 text-center">
                        {stats.map((stat, index) => (
                            <div className="col-6 col-md-3" key={index}>
                                <h3 className="display-4 fw-bold mb-2" style={{ color: '#0a1a3f' }}>
                                    {stat.value}
                                </h3>
                                <p className="text-secondary mb-0">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container py-4">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6 text-center text-lg-start">
                            <p className="text-uppercase mb-3 fw-semibold" style={{ letterSpacing: '2px', color: '#fdb813' }}>
                                Our Story
                            </p>
                            <h2 className="display-5 fw-bold mb-4" style={{ color: '#0a1a3f' }}>
                                From a simple idea to a trusted service
                            </h2>
                            <p className="text-secondary mb-4">
                                It started with a frustrating experience: a package that arrived late, damaged, 
                                and with no updates along the way. We knew there had to be a better way.
                            </p>
                            <p className="text-secondary mb-4">
                                Today, Lovelistics combines real-time tracking, verified drivers, and transparent 
                                pricing to give you peace of mind. We've grown from a single bike courier to a 
                                fleet of vehicles serving multiple cities.
                            </p>
                            <p className="text-secondary">
                                But our mission hasn't changed: to deliver your packages with the care and urgency 
                                we'd want for our own.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="bg-light p-5 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3" 
                                        style={{ width: '60px', height: '60px', backgroundColor: '#0a1a3f' }}>
                                        <span className="fw-bold text-white">5</span>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1">5+ Years of Excellence</h5>
                                        <p className="text-secondary mb-0 small">Serving customers since 2020</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3" 
                                        style={{ width: '60px', height: '60px', backgroundColor: '#0a1a3f' }}>
                                        <span className="fw-bold text-white">50k</span>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1">50,000+ Deliveries</h5>
                                        <p className="text-secondary mb-0 small">And counting</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3" 
                                        style={{ width: '60px', height: '60px', backgroundColor: '#0a1a3f' }}>
                                        <span className="fw-bold text-white">98%</span>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1">98% On-Time Rate</h5>
                                        <p className="text-secondary mb-0 small">Reliability you can count on</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <p className="text-uppercase mb-3 fw-semibold" style={{ letterSpacing: '2px', color: '#fdb813' }}>
                            What Drives Us
                        </p>
                        <h2 className="display-5 fw-bold mb-4" style={{ color: '#0a1a3f' }}>
                            Our Core Values
                        </h2>
                    </div>

                    <div className="row g-4 text-center">
                        {[
                            { title: 'Reliability', desc: 'We do what we say, every time.' },
                            { title: 'Transparency', desc: 'No hidden fees, no surprises.' },
                            { title: 'Speed', desc: 'Fast deliveries without cutting corners.' },
                            { title: 'Care', desc: 'Every package treated like our own.' }
                        ].map((value, index) => (
                            <div className="col-md-6 col-lg-3" key={index}>
                                <div className="card h-100 border-0 shadow-sm p-4">
                                    <h4 className="fw-bold mb-3" style={{ color: '#0a1a3f' }}>{value.title}</h4>
                                    <p className="text-secondary mb-0">{value.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            
            <section className="py-5">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <p className="text-uppercase mb-3 fw-semibold" style={{ letterSpacing: '2px', color: '#fdb813' }}>
                            Meet The Team
                        </p>
                        <h2 className="display-5 fw-bold mb-4" style={{ color: '#0a1a3f' }}>
                            The people behind your deliveries
                        </h2>
                    </div>

                    <div className="row g-4">
                        {team.map((member, index) => (
                            <div className="col-md-6 col-lg-3" key={index}>
                                <div className="card h-100 border-0 shadow-sm text-center p-4">
                                    <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{ width: '100px', height: '100px', backgroundColor: '#0a1a3f' }}>
                                        <span className="fw-bold text-white fs-2">{member.initials}</span>
                                    </div>
                                    <h5 className="fw-bold mb-1">{member.name}</h5>
                                    <p className="small fw-semibold mb-2" style={{ color: '#fdb813' }}>{member.role}</p>
                                    <p className="text-secondary small mb-0">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            
            <section className="py-5" style={{ backgroundColor: '#0a1a3f' }}>
                <div className="container py-4 text-center text-white">
                    <h2 className="display-5 fw-bold mb-4">Ready to ship with us?</h2>
                    <p className="lead mb-4" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
                        Join thousands of happy customers who trust us with their deliveries.
                    </p>
                    <Link to="/register" className="btn btn-lg px-5 py-3 fw-semibold" 
                        style={{ backgroundColor: '#fdb813', borderColor: '#fdb813', color: '#0a1a3f' }}>
                        Get Started Today →
                    </Link>
                </div>
            </section>
        </>
    );
};

export default AboutUs;