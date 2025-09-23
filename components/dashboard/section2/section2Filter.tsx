import React, { useState } from 'react';
import { chartData } from '../../../data/chartData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterChangeData {
  campaign: FilterOption | null;
}

// Utility functions to generate options from chartData
const getUniqueValues = (data: any[], key: string): FilterOption[] => {
  const unique = Array.from(new Set(data.map(item => item[key])));
  return unique.map(value => ({ value: String(value), label: String(value) }));
};

interface Section2FilterProps {
  onFilterChange: (filters: FilterChangeData) => void;
}

const Section2Filter: React.FC<Section2FilterProps> = ({ onFilterChange }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');

  // Generate options from chartData
  const campaignOptions = getUniqueValues(chartData, 'campaign');

  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value);
    onFilterChange({
      campaign: value ? { value, label: value } : null,
    });
  };

  const handleCampaignClear = () => {
    setSelectedCampaign('');
    onFilterChange({
      campaign: null,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="relative">
        <Select value={selectedCampaign} onValueChange={handleCampaignChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Campaign" />
            {selectedCampaign && (
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCampaignClear();
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-sm z-10"
              >
                <X className="h-3 w-3 text-gray-500" />
              </button>
            )}
          </SelectTrigger>
          <SelectContent>
            {campaignOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Section2Filter;
