import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section / Breadcrumb */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlow}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Our Story</span>
            <h1 className={styles.heroTitle}>
              Redefining Premium <br />
              <span className={styles.gradientText}>Car Marketplace</span>
            </h1>
            <p className={styles.heroDesc}>
              Drive Deal is the world's most trusted destination for buying and selling 
              premium vehicles, combining cutting-edge technology with unparalleled service.
            </p>
            <div className={styles.breadcrumb}>
              <Link to="/">Home</Link>
              <i className="fas fa-chevron-right"></i>
              <span>About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fas fa-car"></i></div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>12k+</span>
                <span className={styles.statLabel}>Cars Sold</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fas fa-handshake"></i></div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Verified Dealers</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fas fa-users"></i></div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>80k+</span>
                <span className={styles.statLabel}>Happy Clients</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fas fa-certificate"></i></div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Inspection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className={styles.visionSection}>
        <div className={styles.container}>
          <div className={styles.visionGrid}>
            <div className={styles.visionImageArea}>
              <div className={styles.visionGlow}></div>
              <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000" alt="Vision" className={styles.visionImg} />
              <div className={styles.experienceBox}>
                <span className={styles.expYears}>15+</span>
                <span className={styles.expText}>Years Expertise</span>
              </div>
            </div>
            <div className={styles.visionContent}>
              <span className={styles.subTitle}>Our Vision</span>
              <h2 className={styles.sectionTitle}>The Future of Car Trading</h2>
              <p className={styles.visionDesc}>
                We believe that trading a premium vehicle should be as exhilarating as driving one. 
                Drive Deal was created to bring absolute transparency, security, and convenience 
                to the luxury automotive marketplace.
              </p>
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <i className="fas fa-check-circle"></i>
                  <span>AI-Driven Market Value Valuation</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check-circle"></i>
                  <span>250-Point Technical Inspection</span>
                </div>
                <div className={styles.featureItem}>
                  <i className="fas fa-check-circle"></i>
                  <span>Secure Escrow & Doorstep Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.headerCentered}>
            <span className={styles.subTitle}>Our Team</span>
            <h2 className={styles.sectionTitle}>The Experts Behind Drive Deal</h2>
          </div>
          <div className={styles.teamGrid}>
            {[
              { name: 'David Chen', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
              { name: 'Sarah Jenkins', role: 'Head of Valuation', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
              { name: 'Marcus Thorne', role: 'CTO', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
              { name: 'Elena Rodriguez', role: 'Experience Director', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' }
            ].map((member, idx) => (
              <div key={idx} className={styles.teamCard}>
                <div className={styles.teamImgWrapper}>
                  <img src={member.img} alt={member.name} className={styles.teamImg} />
                  <div className={styles.teamOverlay}>
                    <div className={styles.teamSocials}>
                      <a href="#"><i className="fab fa-linkedin-in"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
                </div>
                <div className={styles.teamInfo}>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Find Your Dream Car?</h2>
              <p>Explore thousands of certified premium vehicles or list your car for the best market price.</p>
              <div className={styles.ctaActions}>
                <Link to="/cars" className={styles.btnPrimary}>Browse Market</Link>
                <Link to="/contact" className={styles.btnSecondary}>Get in Touch</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
