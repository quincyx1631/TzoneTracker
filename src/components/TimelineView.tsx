"use client";

import type React from "react";
import { useState } from "react";
import { Clock, MapPin, Users, AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { TeamMember, AppSettings, Leader } from "../types";
import {
  getTimeInTimezone,
  formatTime,
  convertWorkingHoursToTimezone,
  isWithinWorkingHours,
  getTimezoneOffset,
  getTimezoneAbbreviation,
} from "../utils/timezone";

interface TimelineViewProps {
  members: TeamMember[];
  settings: AppSettings;
  leader?: Leader | null;
}

interface TimezoneData {
  timezone: string;
  location: string;
  members: TeamMember[];
  currentTime: string;
  availableCount: number;
  workingHours: {
    start: number;
    end: number;
    nextDay: boolean;
    display: string;
    originalDisplay: string;
  };
  timezoneInfo: {
    offset: string;
    abbreviation: string;
  };
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  members,
  settings,
  leader,
}) => {
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());

  const goToCurrentTime = () => {
    const now = new Date();
    setSelectedHour(now.getHours());
  };

  const goToManagerTime = () => {
    if (leader) {
      const managerTime = getTimeInTimezone(leader.timezone);
      setSelectedHour(managerTime.getHours());
    }
  };

  if (members.length === 0) {
    return (
      <div
        className={`rounded-xl shadow-lg p-12 text-center ${
          settings.darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3
          className={`text-lg font-semibold mb-2 ${
            settings.darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          No Team Members
        </h3>
        <p className={settings.darkMode ? "text-gray-400" : "text-gray-600"}>
          Add team members to see the timeline view
        </p>
      </div>
    );
  }

  // Group members by timezone
  const timezoneGroups: TimezoneData[] = [];
  const processedTimezones = new Set<string>();

  members.forEach((member) => {
    if (!processedTimezones.has(member.timezone)) {
      const membersInTimezone = members.filter(
        (m) => m.timezone === member.timezone
      );

      // Calculate time for selected hour
      const baseDate = new Date();
      baseDate.setHours(selectedHour, 0, 0, 0);
      const timeInTimezone = getTimeInTimezone(member.timezone, baseDate);
      const hourInTimezone = timeInTimezone.getHours();

      // Convert manager's working hours to this timezone if leader exists
      let workingHours: {
        start: number;
        end: number;
        nextDay: boolean;
        display: string;
        originalDisplay: string;
      };
      if (leader) {
        const converted = convertWorkingHoursToTimezone(
          leader.workingHours,
          leader.timezone,
          member.timezone
        );
        const displayText = converted.nextDay
          ? `${converted.start.toString().padStart(2, "0")}:00 - ${converted.end
              .toString()
              .padStart(2, "0")}:00 (+1 day)`
          : `${converted.start.toString().padStart(2, "0")}:00 - ${converted.end
              .toString()
              .padStart(2, "0")}:00`;
        const originalDisplayText = `${leader.workingHours.start
          .toString()
          .padStart(2, "0")}:00 - ${leader.workingHours.end
          .toString()
          .padStart(2, "0")}:00`;

        workingHours = {
          start: converted.start,
          end: converted.end,
          nextDay: converted.nextDay,
          display: displayText,
          originalDisplay: originalDisplayText,
        };
      } else {
        // Use default working hours
        workingHours = {
          start: 9,
          end: 17,
          nextDay: false,
          display: "09:00 - 17:00",
          originalDisplay: "09:00 - 17:00",
        };
      }

      // Count available members at selected time
      const availableCount = membersInTimezone.filter(() =>
        isWithinWorkingHours(hourInTimezone, workingHours)
      ).length;

      timezoneGroups.push({
        timezone: member.timezone,
        location: getLocationName(member.timezone),
        members: membersInTimezone,
        currentTime: formatTime(timeInTimezone),
        availableCount,
        workingHours,
        timezoneInfo: {
          offset: getTimezoneOffset(member.timezone),
          abbreviation: getTimezoneAbbreviation(member.timezone),
        },
      });

      processedTimezones.add(member.timezone);
    }
  });

  // Sort by timezone offset
  timezoneGroups.sort((a, b) => {
    const offsetA = parseUtcOffset(a.timezoneInfo.offset);
    const offsetB = parseUtcOffset(b.timezoneInfo.offset);
    return offsetA - offsetB;
  });

  const totalMembers = members.length;
  const totalAvailable = timezoneGroups.reduce(
    (sum, group) => sum + group.availableCount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div
        className={`rounded-xl shadow-lg p-4 sm:p-6 ${
          settings.darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h2
                className={`text-xl sm:text-2xl font-bold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {selectedHour.toString().padStart(2, "0")}:00
              </h2>
              <p
                className={`text-xs sm:text-sm ${
                  settings.darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {totalAvailable} of {totalMembers} team members available
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentTime}
              className="flex items-center gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm px-2 sm:px-3"
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Current Time</span>
              <span className="sm:hidden">Now</span>
            </Button>
            {leader && (
              <Button
                variant="outline"
                size="sm"
                onClick={goToManagerTime}
                className="flex items-center gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm px-2 sm:px-3"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Manager Time</span>
                <span className="sm:hidden">Manager</span>
              </Button>
            )}
          </div>
        </div>

        {/* Manager Working Hours Info */}
        {leader ? (
          <div
            className={`mb-4 p-4 rounded-lg border ${
              settings.darkMode
                ? "bg-blue-900/20 border-blue-800"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4
                  className={`text-sm font-medium ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Manager's Working Hours
                </h4>
                <p
                  className={`text-xs mt-1 ${
                    settings.darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {leader.name} in {getLocationName(leader.timezone)}:{" "}
                  {leader.workingHours.start.toString().padStart(2, "0")}:00 -{" "}
                  {leader.workingHours.end.toString().padStart(2, "0")}:00
                </p>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded ${
                  settings.darkMode
                    ? "bg-blue-800 text-blue-200"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                Auto-converted to all timezones
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`mb-4 p-4 rounded-lg border ${
              settings.darkMode
                ? "bg-yellow-900/20 border-yellow-800"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
              <span
                className={`text-sm ${
                  settings.darkMode ? "text-yellow-200" : "text-yellow-800"
                }`}
              >
                Set up manager profile to define working hours for all team
                members
              </span>
            </div>
          </div>
        )}

        {/* Time Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:00</span>
          </div>
          <Slider
            value={[selectedHour]}
            onValueChange={(value) => setSelectedHour(value[0])}
            max={23}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-center">
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
              Selected Time: {selectedHour.toString().padStart(2, "0")}:00
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div
        className={`rounded-xl shadow-lg p-6 ${
          settings.darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="space-y-6">
          {timezoneGroups.map((group) => (
            <div
              key={group.timezone}
              className={`p-3 sm:p-4 rounded-lg border ${
                settings.darkMode
                  ? "border-gray-700 bg-gray-750"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div>
                    <h3
                      className={`text-base sm:text-lg font-semibold ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {group.location}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm ${
                        settings.darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {group.timezoneInfo.abbreviation} (
                      {group.timezoneInfo.offset}) • {group.members.length}{" "}
                      members
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mt-1">
                      <p
                        className={`text-xs ${
                          settings.darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        Working hours: {group.workingHours.display}
                      </p>
                      {group.workingHours.nextDay && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded w-fit ${
                            settings.darkMode
                              ? "bg-orange-900/30 text-orange-300"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          Spans midnight
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div
                    className={`text-lg sm:text-xl font-bold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {group.currentTime}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      group.availableCount > 0
                        ? "text-green-600"
                        : settings.darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {group.availableCount} available
                  </div>
                </div>
              </div>

              {/* Availability Bar */}
              <div className="mb-4">
                <div
                  className={`h-3 rounded-full ${
                    settings.darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (group.availableCount / group.members.length) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-500">
                  <span>0</span>
                  <span>{group.members.length} members</span>
                </div>
              </div>

              {/* Team Members */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {group.members.map((member) => {
                  const baseDate = new Date();
                  baseDate.setHours(selectedHour, 0, 0, 0);
                  const timeInTimezone = getTimeInTimezone(
                    member.timezone,
                    baseDate
                  );
                  const hourInTimezone = timeInTimezone.getHours();

                  const isAvailable = isWithinWorkingHours(
                    hourInTimezone,
                    group.workingHours
                  );

                  return (
                    <div
                      key={member.id}
                      className="flex flex-col items-center space-y-1"
                    >
                      <div className="relative">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm transition-all duration-300 ${
                            isAvailable
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 scale-110 shadow-lg"
                              : "bg-gradient-to-br from-gray-400 to-gray-500"
                          }`}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-300 ${
                            settings.darkMode
                              ? "border-gray-800"
                              : "border-white"
                          } ${isAvailable ? "bg-green-500" : "bg-gray-400"}`}
                        />
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-xs font-medium ${
                            isAvailable
                              ? "text-green-600"
                              : settings.darkMode
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {member.name.split(" ")[0]}
                        </div>
                        <div
                          className={`text-xs ${
                            settings.darkMode
                              ? "text-gray-500"
                              : "text-gray-500"
                          }`}
                        >
                          {member.role}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getLocationName(timezone: string): string {
  const parts = timezone.split("/");
  if (parts.length >= 2) {
    return parts[1].replace(/_/g, " ");
  }
  return timezone;
}

function parseUtcOffset(offset: string): number {
  const match = offset.match(/UTC([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;

  const sign = match[1] === "+" ? 1 : -1;
  const hours = Number.parseInt(match[2], 10);
  const minutes = Number.parseInt(match[3], 10);

  return sign * (hours + minutes / 60);
}
