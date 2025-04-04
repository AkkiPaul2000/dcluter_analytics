"use client";
import { useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import { PiPresentationChart } from "react-icons/pi";
import { HiOutlineHome } from "react-icons/hi2";
import { MdHelpOutline } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  const selectOptions = ["Test_band", "Test_band2", "Test_band3"];

  return (
    <div
      className={`h-screen sticky top-0 flex flex-col px-4 py-6 transition-all duration-500 bg-white shadow-md ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between">
        {!isCollapsed && (
          <Select defaultValue="Test_band">
            <SelectTrigger className="w-[145px] flex items-center">
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Brand</SelectLabel>
                {selectOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-500 rounded-full text-white">
                        {option[0].toUpperCase()}
                      </span>
                      {option}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {/* Collapse Button (positioned using Flexbox) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md transition-transform duration-500"
          style={{
            transform: isCollapsed ? "translateX(2px)" : "translateX(5px)",
          }}
        >
          {isCollapsed ? (
            <FaAngleDoubleRight size={12} className="text-[#7E8986]" />
          ) : (
            <FaAngleDoubleLeft size={14} className="text-[#7E8986]" />
          )}
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex flex-col flex-1 justify-start gap-6 mt-8">
        <NavItem icon={<HiOutlineHome />} text="Overview" isCollapsed={isCollapsed} />

        {/* Channels Dropdown Item */}
        <div className="flex flex-col gap-1">
          <div
            className={`flex items-center cursor-pointer gap-2 px-3 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
            onClick={() => setIsChannelOpen(!isChannelOpen)}
          >
            <div className={`flex items-center gap-4 ${isCollapsed ? "justify-center" : ""}`}>
              <span className={`text-[#7E8986] ${isCollapsed ? "text-2xl" : "text-lg"}`}>
                <PiPresentationChart />
              </span>
              {!isCollapsed && <span className="whitespace-nowrap">Channels</span>}
            </div>
            {!isCollapsed && <FaAngleDown size={12} className="text-[#7E8986]" />}
          </div>

          {/* Dropdown Items */}
          {!isCollapsed && isChannelOpen && (
            <div className="pl-11 mt-1 text-sm space-y-2 text-[#7E8986]">
              <div className="cursor-pointer text-sm font-medium hover:text-black">Meta Ads</div>
              <div className="cursor-pointer text-sm font-medium hover:text-black">Google Ads</div>
              <div className="cursor-pointer text-sm font-medium hover:text-black">Quick Commerce</div>
            </div>
          )}
        </div>

        <NavItem icon={<GrGallery />} text="Creatives" isCollapsed={isCollapsed} />
      </div>

      {/* Bottom Menu */}
      <div className="flex flex-col gap-6 mb-8">
        <NavItem icon={<MdHelpOutline />} text="Help" isCollapsed={isCollapsed} />
        <NavItem icon={<IoSettingsOutline />} text="Settings" isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}

// Reusable NavItem Component
const NavItem = ({
  icon,
  text,
  isCollapsed,
}: {
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
}) => {
  return (
    <div
      className={`flex items-center gap-4 transition-all px-3 ${
        isCollapsed ? "justify-center" : "justify-start"
      }`}
    >
      <span className={`text-[#7E8986] ${isCollapsed ? "text-2xl" : "text-lg"}`}>
        {icon}
      </span>
      {!isCollapsed && <span className="whitespace-nowrap">{text}</span>}
    </div>
  );
};
