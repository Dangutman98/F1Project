import React from 'react';
import Standings from './Standings';

const Home: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">F1 Championship Standings</h1>
            <div className="mb-8">
                <Standings />
            </div>
        </div>
    );
};

export default Home; 