import { Head, Link } from '@inertiajs/react';
import "../../css/landing.css";
import { router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, laravelVersion, phpVersion }) {

    /**
     * Direct the user to the login action.
     */
    const login = () => {
        router.visit(route('login'));
    };

    /**
     * Direct the user to the register action.
     */
    const register = () => {
        router.visit(route('register'));
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="landing-page">
                {/* Hero Section */}
                <section className="hero">
                    <div className="flex justify-center">
                        <ApplicationLogo className="w-10 h-10 text-center" color={'#a94dff'} />
                    </div>
                    <h1 className="font-bold text-gray-200">Flow</h1>
                    <div className="hero-content">
                        <h2>Efficient Engineering Document Management</h2>
                        <p>Stay on top of document versions, streamline formal transmittals, and automate updates to keep your team aligned.</p>
                        <div className="flex items-center justify-center">
                            <button onClick={register} className="cta-btn">Get Started Free</button>
                            <p className="px-4 text-center">or</p>
                            <button className="cta-btn" onClick={login}>Login</button>
                        </div>
                    </div>
                </section>
        
                {/* Features Section */}
                <section className="py-5 features">
                    <h2 className='pb-4 font-bold'>Key Features</h2>
                    <div className="feature-list">
                        <div className="feature">
                            <h3>Version Control</h3>
                            <p className='feature-subtext'>Track document revisions with ease, ensuring everyone is working from the most up-to-date version.</p>
                        </div>
                        <div className="feature">
                            <h3>Automated Transmittals</h3>
                            <p className='feature-subtext'>Automatically send out documents to recipients with notifications about new versions or changes.</p>
                        </div>
                        <div className="feature">
                            <h3>Document Tracking</h3>
                            <p className='feature-subtext'>Ensure recipients acknowledge receipt of documents with formal, trackable transmittals.</p>
                        </div>
                    </div>
                </section>
            
                {/* How It Works Section */}
                <section className="py-4 how-it-works">
                    <h2>How It Works</h2>
                    <div className="py-4 steps">
                        <div className="step">
                            <h3>Step 1</h3>
                            <p>Upload documents and set initial version.</p>
                        </div>
                        <div className="step">
                            <h3>Step 2</h3>
                            <p>Automate transmittals to relevant team members.</p>
                        </div>
                        <div className="step">
                            <h3>Step 3</h3>
                            <p>Track document revisions and send automatic updates.</p>
                        </div>
                    </div>
                </section>
            
                {/* Benefits Section */}
                <section className="benefits">
                    <h2>Benefits</h2>
                    <ul>
                        <li>Increase efficiency with automated processes.</li>
                        <li>Ensure accuracy by using version control.</li>
                        <li>Streamline collaboration across teams.</li>
                        <li>Keep documents secure with role-based access.</li>
                    </ul>
                </section>
            
                {/* Testimonials Section */}
                <section className="testimonials">
                    <h2>What Our Users Are Saying</h2>
                    <div className="testimonial">
                        <p>"This system has transformed the way we manage our engineering documents. We can easily track versions and automate transmittals!"</p>
                        <span>- John Doe, Engineering Manager</span>
                    </div>
                </section>
            
                {/* Pricing Section */}
                <section className="pricing">
                    <h2>Pricing Plans</h2>
                    <div className="pricing-plans">
                        <div className="plan">
                            <h3>Free Plan</h3>
                            <p>Basic features for individuals or small teams.</p>
                        </div>
                        <div className="plan">
                            <h3>Pro Plan</h3>
                            <p>Advanced features for growing teams.</p>
                        </div>
                    </div>
                    <button onClick={register} className="cta-btn">Start Free Trial</button>
                </section>
        
                {/* FAQ Section */}
                <section className="faq">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-item">
                        <h3>How does version control work?</h3>
                        <p>Our system allows you to track document versions and ensures everyone works with the latest version.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Can I integrate this with other tools?</h3>
                        <p>Yes, we offer seamless integration with popular project management and cloud storage tools.</p>
                    </div>
                </section>
            
                {/* Footer Section */}
                <footer className="footer">
                    <p>&copy; 2025 Flow</p>
                </footer>
            </div>
        </>
    );
}
