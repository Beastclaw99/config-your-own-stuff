
import React from 'react';
import Layout from '@/components/layout/Layout';

const TradeProfessionalMarketplace: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Find Trade Professionals</h1>
          <p className="text-gray-600 mb-8">
            Connect with skilled trade professionals across Trinidad & Tobago
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Professional Marketplace</h2>
            <p className="text-gray-600 mb-4">
              Browse through our network of verified professionals including plumbers, 
              electricians, carpenters, and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-ttc-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-ttc-blue-700 mb-2">Verified Professionals</h3>
                <p className="text-sm text-gray-600">All professionals are background checked and certified</p>
              </div>
              <div className="bg-ttc-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-ttc-blue-700 mb-2">Real Reviews</h3>
                <p className="text-sm text-gray-600">Read authentic reviews from previous clients</p>
              </div>
              <div className="bg-ttc-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-ttc-blue-700 mb-2">Instant Booking</h3>
                <p className="text-sm text-gray-600">Book appointments directly through the platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TradeProfessionalMarketplace;
