import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Contact.module.css';

const Contact = () => {
    return (
        <div className={styles.contactPage}>
            {/* Hero Section / Breadcrumb */}
            <section className={styles.heroSection}>
                <div className={styles.heroGlow}></div>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <span className={styles.badge}>Get In Touch</span>
                        <h1 className={styles.heroTitle}>
                            We're Here to <br />
                            <span className={styles.gradientText}>Help You Trade</span>
                        </h1>
                        <p className={styles.heroDesc}>
                            Have questions about our inventory or interested in selling your car? 
                            Our advisors are available 24/7 to ensure your experience is premium and effortless.
                        </p>
                        <div className={styles.breadcrumb}>
                            <Link to="/">Home</Link>
                            <i className="fas fa-chevron-right"></i>
                            <span>Contact Us</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Cards */}
            <section className={styles.infoSection}>
                <div className={styles.container}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}><i className="fas fa-map-marker-alt"></i></div>
                            <h3>Visit Our Showroom</h3>
                            <p>835 Middle Country Rd, Selden, NY 11784, USA</p>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}><i className="fas fa-phone-alt"></i></div>
                            <h3>Call Us Anytime</h3>
                            <p>+1 (631) 202-0088</p>
                            <p>support@drivedeal.com</p>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}><i className="fas fa-clock"></i></div>
                            <h3>Business Hours</h3>
                            <p>Mon - Sat: 9:00am - 8:00pm</p>
                            <p>Sunday: By Appointment Only</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Area */}
            <section className={styles.contactSection}>
                <div className={styles.container}>
                    <div className={styles.contactGrid}>
                        <div className={styles.formArea}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.subTitle}>Message Us</span>
                                <h2 className={styles.title}>Send a Message</h2>
                                <p>Fill out the form below and our vehicle experts will get back to you shortly.</p>
                            </div>
                            
                            <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
                                <div className={styles.inputGroup}>
                                    <div className={styles.inputWrapper}>
                                        <i className="fas fa-user"></i>
                                        <input type="text" placeholder="Full Name" />
                                    </div>
                                    <div className={styles.inputWrapper}>
                                        <i className="fas fa-envelope"></i>
                                        <input type="email" placeholder="Email Address" />
                                    </div>
                                </div>
                                <div className={styles.inputWrapper}>
                                    <i className="fas fa-car"></i>
                                    <input type="text" placeholder="Interested In (e.g. Buying, Selling, Specific Model)" />
                                </div>
                                <div className={styles.inputWrapper}>
                                    <i className="fas fa-comment-alt"></i>
                                    <textarea placeholder="Your Message" rows="5"></textarea>
                                </div>
                                <button type="submit" className={styles.submitBtn}>
                                    Send Message <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>

                        <div className={styles.mapArea}>
                            <div className={styles.mapCard}>
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.7310056272386!2d89.2286059153658!3d24.00527418490799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fe9b97badc6151%3A0x30b048c9fb2129bc!2sthemeholy!5e0!3m2!1sen!2sbd!4v1651028958211!5m2!1sen!2sbd" 
                                    allowFullScreen="" 
                                    loading="lazy"
                                    title="Our Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
