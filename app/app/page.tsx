"use client"
import React, { useState } from "react";
import blinkitJSON from "../public/data/hiring-task.json";
import {
  Card,

} from "@/components/ui/card";
import { NextPage } from "next";
import Header from "./dashboard-components/header";
import DataContent from "./dashboard-components/dataContent";

const Home: NextPage = () => {
  const quickCommerceBrands = ["Blinkit", "Zepto", "Instamart"];

  // Track the selected brand (default can be the first one or null)
  const [selectedBrand, setSelectedBrand] = useState<string>("Blinkit");

  return (
    <main className="flex flex-1 overflow-hidden flex-col border border-[#EBEBEB] rounded-md m-5">
      <Header />
      <div className="flex h-20 items-center px-4 border border-[#EBEBEB] ">
        <div className="flex gap-4 border border-[#EBEBEB] rounded-md p-2">
        {quickCommerceBrands.map((brand) => {
          const isSelected = brand === selectedBrand;
          return (
            <Card
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`cursor-pointer h-8 p-2 flex flex-row items-center gap-2 rounded-md transition-all ${
                isSelected
                  ? "bg-[#DFEAE8]" // Active brand background
                  : "bg-white border-0 shadow-none"  // Disabled style for non-selected
              }`}
            >
              <img
                src={`/icons/quick_comm/${brand}.svg`}
                alt={brand}
                className={`w-4 h-4 ${
                  isSelected ? "opacity-100" : "opacity-50"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-black" : "text-gray-500"
                }`}
              >
                {brand}
              </span>
            </Card>
          );
        })}
        </div>
      </div>
      <DataContent />
    </main>
  );
};

export default Home;
