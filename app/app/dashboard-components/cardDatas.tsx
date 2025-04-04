import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchCubeData } from '@/lib/cubeApi';
import LineChart from '@/components/mine/charts/LineChart';
import DonutChartWithLegends from '@/components/mine/charts/DonutChartWithLegends';
import { AiOutlineQuestionCircle } from "react-icons/ai";
import hiringTask from '@/public/data/hiring-task.json';
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton loader

function CardDatas() {
  const [salesTotal, setSalesTotal] = useState<number | null>(null);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [qtyTotal, setQtyTotal] = useState<number | null>(null);
  const [qtyTrend, setQtyTrend] = useState<any[]>([]);
  const [topCities, setTopCities] = useState<any[]>([]);

  const cards = (hiringTask as any).cards;

  const salesCard = cards.find((card: any) => card.id === "blinkit-insights-sku-sales_mrp");
  const qtyCard = cards.find((card: any) => card.id === "blinkit-insights-sku-qty_sold");
  const topCitiesCard = cards.find((card: any) => card.id === "blinkit-insights-city-sales_mrp_sum");

  const salesTotalQuery = JSON.parse(salesCard.query)[0];
  const salesTrendQuery = JSON.parse(salesCard.query)[1];
  const qtyTotalQuery = JSON.parse(qtyCard.query)[0];
  const qtyTrendQuery = JSON.parse(qtyCard.query)[1];
  const topCitiesQuery = JSON.parse(topCitiesCard.query)[0];

  useEffect(() => {
    (async () => {
      try {
        const salesTotalRes = await fetchCubeData(salesTotalQuery);
        const salesTotalRows = salesTotalRes?.results?.[0]?.data || [];
        const salesTotalValue = salesTotalRows[0]?.["blinkit_insights_sku.sales_mrp_sum"] || 0;
        setSalesTotal(salesTotalValue);

        const salesTrendRes = await fetchCubeData(salesTrendQuery);
        const salesTrendRows = salesTrendRes?.results?.[0]?.data || [];
        setSalesTrend(salesTrendRows);
      } catch (error) {
        console.error("Error fetching Sales (MRP) data:", error);
      }
    })();

    (async () => {
      try {
        const qtyTotalRes = await fetchCubeData(qtyTotalQuery);
        const qtyTotalRows = qtyTotalRes?.results?.[0]?.data || [];
        const qtyTotalValue = qtyTotalRows[0]?.["blinkit_insights_sku.qty_sold"] || 0;
        setQtyTotal(qtyTotalValue);

        const qtyTrendRes = await fetchCubeData(qtyTrendQuery);
        const qtyTrendRows = qtyTrendRes?.results?.[0]?.data || [];
        setQtyTrend(qtyTrendRows);
      } catch (error) {
        console.error("Error fetching Total Quantity Sold data:", error);
      }
    })();

    (async () => {
      try {
        const topCitiesRes = await fetchCubeData(topCitiesQuery);
        const topCitiesRows = topCitiesRes?.results?.[0]?.data || [];
        setTopCities(topCitiesRows);
      } catch (error) {
        console.error("Error fetching Top Cities data:", error);
      }
    })();
  }, []);

  const getLastDayDiff = (trend: any[], key: string): number => {
    if (!trend.length) return 0;
    const first = Number(trend[0]?.[key]) || 0;
    const last = Number(trend[trend.length - 1]?.[key]) || 0;
    return last - first;
  };

  const computePercentageChange = (current: number, delta: number) => {
    const previous = current - delta;
    if (!previous) return 0;
    return (((delta) / previous) * 100).toFixed(1);
  };

  const renderTrendHeader = (
    value: number | null,
    delta: number,
    unitDivider: number,
    unitLabel: string
  ) => {
    const percentage = computePercentageChange(value || 0, delta);
    const trendUp = parseFloat(Number(percentage).toFixed(2)) >= 0;
    const displayVal = value !== null ? (value / unitDivider).toFixed(2) : 'Loading...';
    const lastVal = ((value || 0) - delta) / unitDivider;
    return (
      <div className='flex flex-row gap-1 justify-between'>
        <div className='text-3xl font-bold'>{displayVal} {unitLabel}</div>
        <div className='text-sm flex flex-col items-end justify-end gap-2'>
          <span className={`font-semibold ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {Math.abs(Number(percentage))}%
          </span>
          <span className='text-gray-500'>vs {lastVal.toFixed(2)} {unitLabel} last month</span>
        </div>
      </div>
    );
  };

  const salesDelta = getLastDayDiff(salesTrend, "blinkit_insights_sku.sales_mrp_sum");
  const qtyDelta = getLastDayDiff(qtyTrend, "blinkit_insights_sku.qty_sold");

  return (
    <div className='flex flex-row gap-4'>
      {/* Sales (MRP) */}
      <Card className='w-full'>
        <CardHeader className='border-b border-gray-200 pb-2'>
          <CardTitle className='flex items-center justify-between text-sm font-semibold'>
            Sales (MRP) <AiOutlineQuestionCircle className='text-gray-500' />
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          {/* Render Skeleton if salesTotal not loaded */}
          {salesTotal === null ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            renderTrendHeader(salesTotal, salesDelta, 100000, 'L')
          )}
          <div style={{ height: '200px' }}>
            {salesTrend.length === 0 ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <LineChart
                data={salesTrend}
                valueKey="blinkit_insights_sku.sales_mrp_sum"
                datasetLabel="Sales (MRP)"
                noDot={true}
                yAxisFormat={(val: number) => Number(val / 100000).toFixed(1)}
                xAxisFormat={(label: string) => new Date(label).getDate().toString()}
                xTickInterval={2}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Quantity Sold */}
      <Card className='w-full'>
        <CardHeader className='border-b border-gray-200 pb-2'>
          <CardTitle className='flex items-center justify-between text-sm font-semibold'>
            Total Quantity Sold <AiOutlineQuestionCircle className='text-gray-500' />
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          {qtyTotal === null ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            renderTrendHeader(qtyTotal, qtyDelta, 1000, 'K')
          )}
          <div style={{ height: '200px' }}>
            {qtyTrend.length === 0 ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <LineChart
                data={qtyTrend}
                valueKey="blinkit_insights_sku.qty_sold"
                datasetLabel="Total Quantity Sold"
                noDot={true}
                yAxisFormat={(val: number) => Number(val / 1000).toFixed(1)}
                xAxisFormat={(label: string) => new Date(label).getDate().toString()}
                xTickInterval={2}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Cities Pie Chart */}
      <Card className='w-full'>
        <CardHeader className='border-b border-gray-200 pb-2'>
          <CardTitle className='flex items-center justify-between text-sm font-semibold'>
            Top Cities <AiOutlineQuestionCircle className='text-gray-500' />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '300px' }}>
            {topCities.length === 0 ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <DonutChartWithLegends
                data={topCities}
                valueKey="blinkit_insights_city.sales_mrp_sum"
                nameKey="blinkit_insights_city.name"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CardDatas;
