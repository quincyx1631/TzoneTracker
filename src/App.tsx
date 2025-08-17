"use client";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Users, Globe, Clock, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeamMember, Leader, AppSettings } from "./types";
import { isTimezoneSupported } from "./utils/timezone";
import { Header } from "./components/dashboard/Header";
import { TeamMemberCard } from "./components/dashboard/TeamMemberCard";
import { AddMemberForm } from "./components/dashboard/AddMemberForm";
import { MeetingTimeFinder } from "./components/dashboard/MeetingTimeFinder";
import { TimezoneGrid } from "./components/dashboard/TimezoneGrid";
import { TimelineView } from "./components/dashboard/TimelineView";
import { LandingPage } from "./components/landing-page/LandingPage";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [members, setMembers] = useLocalStorage<TeamMember[]>(
    "team-members",
    []
  );
  const [leader, setLeader] = useLocalStorage<Leader | null>(
    "team-leader",
    null
  );
  const [settings, setSettings] = useLocalStorage<AppSettings>("app-settings", {
    darkMode: false,
    defaultWorkingHours: { start: 9, end: 17 },
  });

  // Apply dark mode to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              members={members}
              setMembers={setMembers}
              leader={leader}
              setLeader={setLeader}
              settings={settings}
              setSettings={setSettings}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Dashboard component
function Dashboard({
  members,
  setMembers,
  leader,
  setLeader,
  settings,
  setSettings,
}: {
  members: TeamMember[];
  setMembers: (
    members: TeamMember[] | ((prev: TeamMember[]) => TeamMember[])
  ) => void;
  leader: Leader | null;
  setLeader: (leader: Leader | null) => void;
  settings: AppSettings;
  setSettings: (
    settings: AppSettings | ((prev: AppSettings) => AppSettings)
  ) => void;
}) {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const addMember = (memberData: Omit<TeamMember, "id">) => {
    const newMember: TeamMember = {
      ...memberData,
      id: crypto.randomUUID(),
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleLogout = () => {
    setLeader(null);
    setMembers([]);
  };

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen transition-colors ${
        settings.darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <Header
        leader={leader}
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddMember={() => setIsAddFormOpen(true)}
        onSettingsChange={setSettings}
        onLeaderUpdate={setLeader}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-10 sm:h-auto sm:w-[400px]">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Team</span>
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="meetings"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              Meetings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <div
                className={`rounded-xl shadow-lg p-6 ${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Team Members
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {members.length}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`rounded-xl shadow-lg p-6 ${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Active Now
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {
                        members.filter((member) => {
                          const safeTimezone = isTimezoneSupported(
                            member.timezone
                          )
                            ? member.timezone
                            : "UTC";
                          const hour = new Intl.DateTimeFormat("en", {
                            timeZone: safeTimezone,
                            hour: "numeric",
                            hour12: false,
                          })
                            .formatToParts(currentTime)
                            .find((part) => part.type === "hour")?.value;
                          const currentHour = hour
                            ? Number.parseInt(hour, 10)
                            : 0;
                          return (
                            currentHour >= member.workingHours.start &&
                            currentHour < member.workingHours.end
                          );
                        }).length
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`rounded-xl shadow-lg p-6 ${
                  settings.darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Timezones
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {new Set(members.map((m) => m.timezone)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timezone Grid */}
            <TimezoneGrid members={members} settings={settings} />

            {/* Team Members */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-semibold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Team Members
                </h2>
                {searchQuery && (
                  <p
                    className={`text-sm ${
                      settings.darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Showing {filteredMembers.length} of {members.length} members
                  </p>
                )}
              </div>
              {filteredMembers.length === 0 ? (
                <div
                  className={`rounded-xl shadow-lg p-12 text-center ${
                    settings.darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {searchQuery ? "No Members Found" : "No Team Members Yet"}
                  </h3>
                  <p
                    className={`mb-6 ${
                      settings.darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "Add your first team member to get started tracking timezones"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setIsAddFormOpen(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Users className="w-4 h-4" />
                      <span>Add First Member</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredMembers.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      onRemove={removeMember}
                      settings={settings}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-8">
            <TimelineView
              members={members}
              settings={settings}
              leader={leader}
            />
          </TabsContent>

          <TabsContent value="meetings" className="space-y-8">
            <MeetingTimeFinder
              members={members}
              settings={settings}
              leader={leader}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Member Form */}
      <AddMemberForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={addMember}
        settings={settings}
      />
    </div>
  );
}
