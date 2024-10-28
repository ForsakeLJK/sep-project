import React from 'react';
import ResponsiveAppBar from '../components/AppBar';

const HomePage: React.FC = () => {
    return (
        <div>
            <ResponsiveAppBar />
            <h1>Home Page</h1>
            <p>Welcome to the homepage!</p>
        </div>
    );
};

export default HomePage;