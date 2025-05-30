import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProfessionalListings from '@/components/marketplace/ProfessionalListings';
import ProfessionalSearchFilters from '@/components/marketplace/ProfessionalSearchFilters';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

const ProfessionalMarketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<{
    skills?: string[];
    rating?: number;
  }>({});

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProfessionalSearchFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Find Trade Professionals</h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ProfessionalListings
              viewMode={viewMode}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfessionalMarketplace;
