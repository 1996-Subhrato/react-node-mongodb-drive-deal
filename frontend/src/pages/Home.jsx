import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import FeaturedCars from '../components/home/FeaturedCars';

const Home = () => {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <FeaturedCars />
        </>
    );
};

export default Home;
