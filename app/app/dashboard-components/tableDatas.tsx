import React, { useEffect, useState } from 'react';
import { fetchCubeData } from '@/lib/cubeApi';
import hiringTask from '@/public/data/hiring-task.json';
import { GoGraph } from 'react-icons/go';
import { FaAngleDown } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableDatas() {
  const [tableData, setTableData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Record<string, number[]>>({});
  const [sortConfig, setSortConfig] = useState<Record<string, { key: string, direction: 'asc' | 'desc' }>>({});

  const tableCards = (hiringTask as any).cards.filter(
    (card: any) => card.visualizationType === 'table' && card.active
  );

  useEffect(() => {
    async function fetchDataForTables() {
      const newData: Record<string, any[]> = {};
      for (const card of tableCards) {
        try {
          const queries = JSON.parse(card.query);
          const queryObj = queries[0];
          const response = await fetchCubeData(queryObj);
          const rows = response?.results?.[0]?.data || [];
          newData[card.id] = rows;
        } catch (error) {
          console.error(`Error fetching data for card ${card.id}:`, error);
        }
      }
      setTableData(newData);
      setLoading(false);
    }

    if (tableCards.length > 0) {
      fetchDataForTables();
    }
  }, [tableCards]);

  const toggleRowSelection = (cardId: string, rowIndex: number) => {
    setSelectedRows((prev) => {
      const current = prev[cardId] || [];
      if (current.includes(rowIndex)) {
        return { ...prev, [cardId]: current.filter((idx) => idx !== rowIndex) };
      } else {
        return { ...prev, [cardId]: [...current, rowIndex] };
      }
    });
  };

  const calculateColumnTotal = (rows: any[], col: string) => {
    return rows.reduce((sum, row) => {
      const value = Number(row[col]);
      return !isNaN(value) ? sum + value : sum;
    }, 0);
  };

  const handleSort = (cardId: string, key: string) => {
    setSortConfig((prev) => {
      const current = prev[cardId];
      const direction = current?.key === key && current.direction === 'asc' ? 'desc' : 'asc';
      return { ...prev, [cardId]: { key, direction } };
    });
  };

  const getSortedRows = (rows: any[], cardId: string) => {
    const config = sortConfig[cardId];
    if (!config) return rows;
    return [...rows].sort((a, b) => {
      const valA = Number(a[config.key]) || a[config.key];
      const valB = Number(b[config.key]) || b[config.key];
      if (valA < valB) return config.direction === 'asc' ? -1 : 1;
      if (valA > valB) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // While loading, show skeleton loaders for each table card
  if (loading) {
    return (
      <div className="p-4 space-y-8">
        {tableCards.map((card: any) => (
          <div key={card.id}>
            <div className="mb-4">
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="overflow-x-auto">
              <Skeleton className="h-10 w-full mb-1" />
              <Skeleton className="h-10 w-full mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      {tableCards.map((card: any) => {
        const rows = getSortedRows(tableData[card.id] || [], card.id);
        if (!rows || rows.length === 0) return null;

        const isCityTable = card.id.includes('city');
        const nameKey = isCityTable ? "blinkit_insights_city.name" : "blinkit_insights_sku.name";
        const salesKey = isCityTable ? "blinkit_insights_city.sales_mrp_sum" : "blinkit_insights_sku.sales_mrp_sum";
        const inventoryKey = isCityTable ? "blinkit_insights_city.inv_qty" : "blinkit_insights_sku.inv_qty";
        const outOfStockKey = isCityTable ? "blinkit_insights_city.be_inv_qty" : "blinkit_insights_sku.be_inv_qty";
        const rankKey = "blinkit_scraping_stream.rank_avg";

        const selected = selectedRows[card.id] || [];
        return (
          <div key={card.id}>
            <div className="mb-4">
              <p className="text-2xl font-bold flex items-center gap-2">
                <GoGraph className="text-2xl" /> {card.title}
              </p>
              <p className="text-gray-600">{card.description}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-200">
                    <th rowSpan={2} className="p-3 border bg-white rounded-lg rounded-br-none cursor-pointer" onClick={() => handleSort(card.id, nameKey)}>
                      <div className='flex items-center gap-2'><GoGraph className='text-2xl'/> {isCityTable ? 'City Name' : 'SKU Name'}</div>
                    </th>
                    <th colSpan={3} className="p-3 border bg-white text-center">
                      Availability
                    </th>
                    <th colSpan={3} className="p-3 border bg-white text-center">
                      Visibility
                    </th>
                  </tr>
                  <tr className="border-b bg-gray-200">
                    <th className="p-3 border bg-white cursor-pointer" onClick={() => handleSort(card.id, salesKey)}>
                      <div className='flex items-center justify-between'>
                        Sales <FaAngleDown className='text-sm'/>
                      </div>
                    </th>
                    <th className="p-3 border bg-white cursor-pointer" onClick={() => handleSort(card.id, outOfStockKey)}>
                      <div className='flex items-center justify-between'>
                        Out of Stock <FaAngleDown className='text-sm'/>
                      </div>
                    </th>
                    <th className="p-3 border bg-white cursor-pointer" onClick={() => handleSort(card.id, inventoryKey)}>
                      <div className='flex items-center justify-between'>
                        Total Inventory <FaAngleDown className='text-sm'/>
                      </div>
                    </th>
                    <th className="p-3 border bg-white cursor-pointer" onClick={() => handleSort(card.id, rankKey)}>
                      <div className='flex items-center justify-between'>
                        Average Rank <FaAngleDown className='text-sm'/>
                      </div>
                    </th>
                    <th className="p-3 border bg-white">
                      <div className='flex items-center justify-between'>
                        Est. Traffic <FaAngleDown className='text-sm'/>
                      </div>
                    </th>
                    <th className="p-3 border bg-white">
                      <div className='flex items-center justify-between'>
                        Est. Impressions <FaAngleDown className='text-sm'/>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => {
                    const isSelected = selected.includes(idx);
                    const name = row[nameKey] || `${isCityTable ? 'City' : 'SKU'} #${idx + 1}`;
                    const sales = row[salesKey] || 0;
                    const outOfStock = row[outOfStockKey] === "0" ? "Yes" : "No";
                    const totalInventory = row[inventoryKey] || 0;
                    const avgRank = row[rankKey] || "-";
                    const estTraffic = 1234;
                    const estImpressions = 2345;

                    return (
                      <tr key={idx} className={`border-b ${isSelected ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-3 border flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRowSelection(card.id, idx)}
                          />
                          <span>{name}</span>
                        </td>
                        <td className="p-3 border">{Number(sales).toLocaleString()}</td>
                        <td className="p-3 border">{outOfStock}</td>
                        <td className="p-3 border">{Number(totalInventory).toLocaleString()}</td>
                        <td className="p-3 border">{avgRank}</td>
                        <td className="p-3 border">{estTraffic}</td>
                        <td className="p-3 border">{estImpressions}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-semibold border-t">
                    <td className="p-3 border">Total</td>
                    <td className="p-3 border">{Number(calculateColumnTotal(rows, salesKey)).toLocaleString()}</td>
                    <td className="p-3 border"></td>
                    <td className="p-3 border">{Number(calculateColumnTotal(rows, inventoryKey)).toLocaleString()}</td>
                    <td className="p-3 border">{calculateColumnTotal(rows, rankKey) || ''}</td>
                    <td className="p-3 border"></td>
                    <td className="p-3 border"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

