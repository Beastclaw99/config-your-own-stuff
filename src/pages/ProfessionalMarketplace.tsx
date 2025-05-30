import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProfessionalListings from '@/components/marketplace/ProfessionalListings';
import ProfessionalSearchFilters from '@/components/marketplace/ProfessionalSearchFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ProfessionalMarketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    location: '',
    skills: [],
    rating: '',
    availability: '',
    experience: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Find Trade Professionals</h1>
              <p className="text-gray-600">
                Connect with skilled trade professionals across Trinidad & Tobago
              </p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search professionals..."
                  className="pl-10 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProfessionalSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
            <div className="lg:col-span-3">
              <ProfessionalListings
                viewMode={viewMode}
                filters={filters}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfessionalMarketplace;
