import React, { useState, useEffect } from "react";
import Navigation from "./Header/Navigation";
import GroupsList from "./Groups/GroupsList";
import BookmarksList from "./Bookmarks/BookmarksList";
import MostVisited from "./MostVisited/MostVisited";
import Settings from "./Settings/Settings";
import { ThemeProvider } from "../context/ThemeContext";

const TabManagerPopup = () => {
  const [activeTab, setActiveTab] = useState("groups");
  const [searchTerm, setSearchTerm] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case "groups":
        return (
          <>
            <StatsBar />
            <GroupsList searchTerm={searchTerm} />
          </>
        );
      case "bookmarks":
        return <BookmarksList searchTerm={searchTerm} />;
      case "mostVisited":
        return <MostVisited />;
      case "settings":
        return <Settings />;
      default:
        return <GroupsList searchTerm={searchTerm} />;
    }
  };

  const SupportLink = () => (
    <a
      href="https://buymeacoffee.com/anjan50"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ffdd00] hover:bg-[#ffdd00]/90 text-black font-medium text-sm rounded-md border-b border-[#d4b800]"
    >
      <img
        src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
        alt="Buy me a coffee"
        className="h-4 w-4"
      />
      Support this project
    </a>
  );

  const StatsBar = () => {
    const [stats, setStats] = useState({
      totalTabs: 0,
      groups: 0,
      memory: "0 MB",
    });

    useEffect(() => {
      updateStats();
      const interval = setInterval(updateStats, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }, []);

    const updateStats = () => {
      chrome.tabs.query({}, (tabs) => {
        const domains = new Set(
          tabs.map((tab) => {
            try {
              return new URL(tab.url).hostname;
            } catch {
              return "other";
            }
          })
        );

        setStats({
          totalTabs: tabs.length,
          groups: domains.size,
          memory: `~${tabs.length * 50}MB`, // Rough estimation
        });
      });
    };

    return (
      <div className="px-4 py-2 border-b bg-gray-50 flex justify-between">
        <div className="flex-1 text-center">
          <div className="text-lg font-semibold text-blue-600">
            {stats.totalTabs}
          </div>
          <div className="text-xs text-gray-600">Open Tabs</div>
        </div>
        <div className="flex-1 text-center border-x">
          <div className="text-lg font-semibold text-green-600">
            {stats.groups}
          </div>
          <div className="text-xs text-gray-600">Groups</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-lg font-semibold text-purple-600">
            {stats.memory}
          </div>
          <div className="text-xs text-gray-600">Memory</div>
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider>
      <div className="w-[350px] bg-white hide-scrollbar">
        <div className="flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search tabs..."
              className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Navigation */}
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content Area */}
          <div className="flex-1 max-h-[430px] overflow-y-auto hide-scrollbar">
            {renderContent()}
          </div>
          {/* Support Link */}
          <div className="p-3 border-t bg-gray-50 hide-scrollbar">
            <SupportLink />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default TabManagerPopup;
