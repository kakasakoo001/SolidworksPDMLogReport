import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartData2: PropTypes.array,
  // chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, chartData2, ...other }) {
  if (chartData2) {
    chartData = chartData.concat(chartData2);
  }
  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    xaxis: other.xaxis,
    yaxis: other.yaxis,
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} 건`;
          }
          return y.toFixed(0);
        },
      },
    },
    stroke: other.stroke,
    legend: {
      formatter: other.legendformatter,
      markers: other.legendmarker,
    },
    annotations: { points: other.annotations2 },
    chart: { offsetY: other.chartOffsetY },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: 'h5' }}
        subheader={subheader}
        subheaderTypographyProps={{ variant: 'h7' }}
      />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
