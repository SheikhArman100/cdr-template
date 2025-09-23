import React from 'react';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BrandWiseUserContact = ({ data, filters }) => {
  const getChartData = () => {
    const brandData = data.reduce((acc, item) => {
      if (!acc[item.brand]) {
        acc[item.brand] = 0;
      }
      acc[item.brand] += item.contactAchievement;
      return acc;
    }, {});

    return {
      series: Object.values(brandData),
      labels: Object.keys(brandData),
    };
  };

  const chartData = getChartData();

  const options = {
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: chartData.labels,
    colors: ['#3B82F6', '#6366F1', '#818CF8'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-3 lg:p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Brand Wise User Contact - Till Date</h3>
      <ApexChart
        options={options}
        series={chartData.series}
        type="pie"
        height={350}
      />
    </div>
  );
};

export default BrandWiseUserContact;