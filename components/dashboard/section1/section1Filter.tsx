import React, { useState } from 'react';
import { chartData } from '../../../data/chartData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterChangeData {
  campaign: FilterOption | null;
  region: FilterOption | null;
  area: FilterOption | null;
  distributionHouse: FilterOption | null;
  territory: FilterOption | null;
  point: FilterOption | null;
}

// Utility functions to generate options from chartData
const getUniqueValues = (data: any[], key: string): FilterOption[] => {
  const unique = Array.from(new Set(data.map(item => item[key])));
  return unique.map(value => ({ value: String(value), label: String(value) }));
};

const getFilteredOptions = (data: any[], filterKey: string, filterValue: string, optionKey: string): FilterOption[] => {
  const filtered = data.filter(item => item[filterKey] === filterValue);
  return getUniqueValues(filtered, optionKey);
};

interface Section1FilterProps {
  onFilterChange: (filters: FilterChangeData) => void;
}

const Section1Filter: React.FC<Section1FilterProps> = ({ onFilterChange }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDistributionHouse, setSelectedDistributionHouse] = useState('');
  const [selectedTerritory, setSelectedTerritory] = useState('');
  const [selectedPoint, setSelectedPoint] = useState('');

  // Generate options from chartData
  const campaignOptions = getUniqueValues(chartData, 'campaign');
  const regionOptions = selectedCampaign
    ? getFilteredOptions(chartData, 'campaign', selectedCampaign, 'region')
    : getUniqueValues(chartData, 'region');
  const areaOptions = selectedRegion
    ? getFilteredOptions(chartData, 'region', selectedRegion, 'area')
    : [];
  const distributionHouseOptions = selectedArea
    ? getFilteredOptions(chartData, 'area', selectedArea, 'distributionHouse')
    : [];
  const territoryOptions = selectedDistributionHouse
    ? getFilteredOptions(chartData, 'distributionHouse', selectedDistributionHouse, 'territory')
    : [];
  const pointOptions = selectedTerritory
    ? getFilteredOptions(chartData, 'territory', selectedTerritory, 'point')
    : [];

  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value);
    setSelectedRegion('');
    setSelectedArea('');
    setSelectedDistributionHouse('');
    setSelectedTerritory('');
    setSelectedPoint('');
    onFilterChange({
      campaign: value ? { value, label: value } : null,
      region: null,
      area: null,
      distributionHouse: null,
      territory: null,
      point: null,
    });
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedArea('');
    setSelectedDistributionHouse('');
    setSelectedTerritory('');
    setSelectedPoint('');
    onFilterChange({
      campaign: selectedCampaign ? { value: selectedCampaign, label: selectedCampaign } : null,
      region: value ? { value, label: value } : null,
      area: null,
      distributionHouse: null,
      territory: null,
      point: null,
    });
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    setSelectedDistributionHouse('');
    setSelectedTerritory('');
    setSelectedPoint('');
    onFilterChange({
      campaign: selectedCampaign ? { value: selectedCampaign, label: selectedCampaign } : null,
      region: selectedRegion ? { value: selectedRegion, label: selectedRegion } : null,
      area: value ? { value, label: value } : null,
      distributionHouse: null,
      territory: null,
      point: null,
    });
  };

  const handleDistributionHouseChange = (value: string) => {
    setSelectedDistributionHouse(value);
    setSelectedTerritory('');
    setSelectedPoint('');
    onFilterChange({
      campaign: selectedCampaign ? { value: selectedCampaign, label: selectedCampaign } : null,
      region: selectedRegion ? { value: selectedRegion, label: selectedRegion } : null,
      area: selectedArea ? { value: selectedArea, label: selectedArea } : null,
      distributionHouse: value ? { value, label: value } : null,
      territory: null,
      point: null,
    });
  };

  const handleTerritoryChange = (value: string) => {
    setSelectedTerritory(value);
    setSelectedPoint('');
    onFilterChange({
      campaign: selectedCampaign ? { value: selectedCampaign, label: selectedCampaign } : null,
      region: selectedRegion ? { value: selectedRegion, label: selectedRegion } : null,
      area: selectedArea ? { value: selectedArea, label: selectedArea } : null,
      distributionHouse: selectedDistributionHouse ? { value: selectedDistributionHouse, label: selectedDistributionHouse } : null,
      territory: value ? { value, label: value } : null,
      point: null,
    });
  };

  const handlePointChange = (value: string) => {
    setSelectedPoint(value);
    onFilterChange({
      campaign: selectedCampaign ? { value: selectedCampaign, label: selectedCampaign } : null,
      region: selectedRegion ? { value: selectedRegion, label: selectedRegion } : null,
      area: selectedArea ? { value: selectedArea, label: selectedArea } : null,
      distributionHouse: selectedDistributionHouse ? { value: selectedDistributionHouse, label: selectedDistributionHouse } : null,
      territory: selectedTerritory ? { value: selectedTerritory, label: selectedTerritory } : null,
      point: value ? { value, label: value } : null,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Select value={selectedCampaign} onValueChange={handleCampaignChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Campaign" />
        </SelectTrigger>
        <SelectContent>
          {campaignOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedRegion} onValueChange={handleRegionChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Region" />
        </SelectTrigger>
        <SelectContent>
          {regionOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedArea}
        onValueChange={handleAreaChange}
        disabled={!selectedRegion}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Area" />
        </SelectTrigger>
        <SelectContent>
          {areaOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedDistributionHouse}
        onValueChange={handleDistributionHouseChange}
        disabled={!selectedArea}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Distribution House" />
        </SelectTrigger>
        <SelectContent>
          {distributionHouseOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedTerritory}
        onValueChange={handleTerritoryChange}
        disabled={!selectedDistributionHouse}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Territory" />
        </SelectTrigger>
        <SelectContent>
          {territoryOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedPoint}
        onValueChange={handlePointChange}
        disabled={!selectedTerritory}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Point" />
        </SelectTrigger>
        <SelectContent>
          {pointOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Section1Filter;
