import React from 'react';
import SideBar from './SideBar';
import Header from './Header';
import Footer from './Footer';
import FeedForm from './FeedForm'; // Importe o novo componente
import './HomePage.css';

function HomePage() {
    return (
        <div className="page-container">
            <SideBar />
            <div className="main-content">
                <Header />
                <FeedForm /> {/* Adicione o componente FeedForm aqui */}
                <Footer />
            </div>
        </div>
    );
}

export default HomePage;
