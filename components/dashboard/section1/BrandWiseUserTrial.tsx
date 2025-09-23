import React from 'react';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BrandWiseUserTrial = ({ data, filters }) => {
  const getChartData = () => {
    const brandData = data.reduce((acc, item) => {
      if (!acc[item.brand]) {
        acc[item.brand] = 0;
      }
      acc[item.brand] += item.trialAchievement;
      return acc;
    }, {});

    return {
      series: Object.values(brandData) as number[],
      labels: Object.keys(brandData),
    };
  };

  const chartData = getChartData();

  const options = {
    chart: {
      type: 'pie' as const,
      height: 350,
    },
    labels: chartData.labels,
    colors: [ '#8b5cf6', '#c4b5fd'],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '100%',
            height: 280,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
            height: 250,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px',
          },
          dataLabels: {
            enabled: false,
          },
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-3 lg:p-6 border border-gray-200 w-full overflow-hidden">
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4">Brand Wise User Trial - Till Date</h3>
      <div className="w-full overflow-hidden">
        <ApexChart
          options={options}
          series={chartData.series}
          type="pie"
          height={350}
        />
      </div>
    </div>
  );
};

export default BrandWiseUserTrial;
