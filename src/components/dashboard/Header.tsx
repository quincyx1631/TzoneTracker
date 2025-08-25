"use client";

import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Search,
  Plus,
  Settings,
  User,
  LogOut,
  Edit,
  Moon,
  Sun,
  Clock,
  Home,
} from "lucide-react";
import type { Leader, AppSettings } from "../../types";
import { commonTimezones } from "../../utils/timezone";

interface HeaderProps {
  leader: Leader | null;
  settings: AppSettings;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddMember: () => void;
  onSettingsChange: (settings: AppSettings) => void;
  onLeaderUpdate: (leader: Leader) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  leader,
  settings,
  searchQuery,
  onSearchChange,
  onAddMember,
  onSettingsChange,
  onLeaderUpdate,
  onLogout,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderForm, setShowLeaderForm] = useState(!leader);
  const [leaderForm, setLeaderForm] = useState({
    name: leader?.name || "",
    email: leader?.email || "",
    timezone: leader?.timezone || "America/New_York",
    workingHours: {
      start: leader?.workingHours.start || 9,
      end: leader?.workingHours.end || 17,
    },
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleLeaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeader: Leader = {
      id: leader?.id || crypto.randomUUID(),
      ...leaderForm,
    };
    onLeaderUpdate(newLeader);
    setShowLeaderForm(false);
  };

  const toggleDarkMode = () => {
    onSettingsChange({
      ...settings,
      darkMode: !settings.darkMode,
    });
  };

  const updateDefaultWorkingHours = (start: number, end: number) => {
    onSettingsChange({
      ...settings,
      defaultWorkingHours: { start, end },
    });
  };

  return (
    <>
      <header
        className={`bg-background/95 backdrop-blur-sm shadow-sm border-b border-border transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/"
                className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
                <h1 className="text-base sm:text-lg font-semibold text-foreground">
                  TimezoneTracker
                </h1>
              </Link>

              <div className="hidden sm:flex items-center space-x-2 ml-4 lg:ml-8">
                <div className="text-lg sm:text-2xl font-bold text-foreground">
                  {currentTime}
                </div>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Live
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Mobile time display */}
              <div className="sm:hidden flex flex-col items-end">
                <div className="text-sm font-bold text-foreground">
                  {currentTime}
                </div>
                <div className="px-1 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Live
                </div>
              </div>

              {/* Search - hidden on mobile, shown on larger screens */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border-0 transition-colors w-48 lg:w-64 bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <Link
                to="/"
                className="p-1.5 sm:p-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Home"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <button
                onClick={onAddMember}
                className="p-1.5 sm:p-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Add Member"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 sm:p-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {showSettings && (
                  <div className="absolute right-0 top-12 w-72 sm:w-80 rounded-xl shadow-xl border z-50 bg-card border-border">
                    <div className="p-4">
                      <h3 className="font-semibold mb-4 text-foreground">
                        Settings
                      </h3>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {settings.darkMode ? (
                            <Moon className="w-4 h-4" />
                          ) : (
                            <Sun className="w-4 h-4" />
                          )}
                          <span className="text-muted-foreground">
                            {settings.darkMode ? "Dark Mode" : "Light Mode"}
                          </span>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.darkMode ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-background rounded-full transition-transform ${
                              settings.darkMode
                                ? "translate-x-6"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Default Working Hours */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-muted-foreground">
                          Default Working Hours (for new members)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              className={`block text-xs ${
                                settings.darkMode
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              } mb-1`}
                            >
                              Start
                            </label>
                            <select
                              value={settings.defaultWorkingHours.start}
                              onChange={(e) =>
                                updateDefaultWorkingHours(
                                  Number(e.target.value),
                                  settings.defaultWorkingHours.end
                                )
                              }
                              className={`w-full px-3 py-2 rounded border text-sm ${
                                settings.darkMode
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                            >
                              {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i}>
                                  {i.toString().padStart(2, "0")}:00
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              className={`block text-xs ${
                                settings.darkMode
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              } mb-1`}
                            >
                              End
                            </label>
                            <select
                              value={settings.defaultWorkingHours.end}
                              onChange={(e) =>
                                updateDefaultWorkingHours(
                                  settings.defaultWorkingHours.start,
                                  Number(e.target.value)
                                )
                              }
                              className={`w-full px-3 py-2 rounded border text-sm ${
                                settings.darkMode
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                            >
                              {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i}>
                                  {i.toString().padStart(2, "0")}:00
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {leader && (
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-2 p-1 rounded-full transition-colors hover:bg-muted"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs">
                      {leader.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 top-12 w-64 sm:w-72 rounded-xl shadow-xl border z-50 bg-card border-border">
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                            {leader.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {leader.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {leader.email}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm mb-4 p-3 rounded-lg bg-muted">
                          <div className="flex items-center mb-2">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">
                              Manager Working Hours
                            </span>
                          </div>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>Hours:</span>
                              <span>
                                {leader.workingHours.start
                                  .toString()
                                  .padStart(2, "0")}
                                :00 -{" "}
                                {leader.workingHours.end
                                  .toString()
                                  .padStart(2, "0")}
                                :00
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Timezone:</span>
                              <span>
                                {leader.timezone
                                  .split("/")[1]
                                  ?.replace("_", " ")}
                              </span>
                            </div>
                            <div className="text-primary mt-2">
                              These hours will be converted for all team members
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setShowLeaderForm(true);
                              setShowProfile(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit Profile</span>
                          </button>
                          <button
                            onClick={onLogout}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLeaderForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="rounded-xl shadow-2xl w-full max-w-md bg-card">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {leader ? "Edit Manager Profile" : "Setup Manager Profile"}
              </h2>
            </div>

            <form onSubmit={handleLeaderSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={leaderForm.name}
                  onChange={(e) =>
                    setLeaderForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg transition-colors bg-input border-border text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={leaderForm.email}
                  onChange={(e) =>
                    setLeaderForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg transition-colors bg-input border-border text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Timezone
                </label>
                <select
                  value={leaderForm.timezone}
                  onChange={(e) =>
                    setLeaderForm((prev) => ({
                      ...prev,
                      timezone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg transition-colors bg-input border-border text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {commonTimezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.split("/")[1]?.replace("_", " ") || tz}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Manager Working Hours
                </label>
                <p className="text-xs mb-3 text-muted-foreground">
                  These hours will be automatically converted to each team
                  member's timezone
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Start Time
                    </label>
                    <select
                      value={leaderForm.workingHours.start}
                      onChange={(e) =>
                        setLeaderForm((prev) => ({
                          ...prev,
                          workingHours: {
                            ...prev.workingHours,
                            start: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg transition-colors bg-input border-border text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      End Time
                    </label>
                    <select
                      value={leaderForm.workingHours.end}
                      onChange={(e) =>
                        setLeaderForm((prev) => ({
                          ...prev,
                          workingHours: {
                            ...prev.workingHours,
                            end: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg transition-colors bg-input border-border text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                {leader && (
                  <button
                    type="button"
                    onClick={() => setShowLeaderForm(false)}
                    className="flex-1 py-2 px-4 border rounded-lg transition-colors border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>{leader ? "Update Profile" : "Create Profile"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
