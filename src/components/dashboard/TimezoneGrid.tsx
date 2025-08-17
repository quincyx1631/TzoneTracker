import type React from "react";
import { Clock, Globe } from "lucide-react";
import type { TeamMember, AppSettings } from "../../types";
import { getTimeInTimezone, formatTime } from "../../utils/timezone";

interface TimezoneGridProps {
  members: TeamMember[];
  settings: AppSettings;
}

interface TimezoneGroup {
  timezone: string;
  location: string;
  time: string;
  utcOffset: string;
  members: TeamMember[];
  isWorkingHours: boolean;
}

export const TimezoneGrid: React.FC<TimezoneGridProps> = ({
  members,
  settings,
}) => {
  if (members.length === 0) {
    return (
      <div
        className={`rounded-xl shadow-lg p-12 text-center ${
          settings.darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3
          className={`text-lg font-semibold mb-2 ${
            settings.darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          No Team Members
        </h3>
        <p className={settings.darkMode ? "text-gray-400" : "text-gray-600"}>
          Add team members to see their timezone overview
        </p>
      </div>
    );
  }

  // Group members by timezone
  const timezoneGroups: TimezoneGroup[] = [];
  const processedTimezones = new Set<string>();

  members.forEach((member) => {
    if (!processedTimezones.has(member.timezone)) {
      const currentTime = getTimeInTimezone(member.timezone);
      const currentHour = currentTime.getHours();
      const membersInTimezone = members.filter(
        (m) => m.timezone === member.timezone
      );

      // Check if any member in this timezone is currently working
      const isWorkingHours = membersInTimezone.some(
        (m) =>
          currentHour >= m.workingHours.start &&
          currentHour < m.workingHours.end
      );

      // Get UTC offset
      const utcOffset = getUtcOffset(member.timezone);

      timezoneGroups.push({
        timezone: member.timezone,
        location: getLocationName(member.timezone),
        time: formatTime(currentTime),
        utcOffset,
        members: membersInTimezone,
        isWorkingHours,
      });

      processedTimezones.add(member.timezone);
    }
  });

  // Sort by UTC offset
  timezoneGroups.sort((a, b) => {
    const offsetA = parseUtcOffset(a.utcOffset);
    const offsetB = parseUtcOffset(b.utcOffset);
    return offsetA - offsetB;
  });

  return (
    <div
      className={`rounded-xl shadow-lg ${
        settings.darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3
                className={`text-lg font-semibold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Team Timezone Overview
              </h3>
              <p
                className={`text-sm ${
                  settings.darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {members.length} team members across {timezoneGroups.length}{" "}
                timezones
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span
              className={`text-sm ${
                settings.darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Now
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Timezone Groups */}
      <div className="p-4 sm:p-6">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {timezoneGroups.map((group, index) => (
            <div
              key={group.timezone}
              className="flex-shrink-0 w-64 sm:w-72 space-y-4"
              style={{ minWidth: "280px" }}
            >
              {/* Timezone Header */}
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {group.time}
                </div>
                <div
                  className={`text-base font-semibold ${
                    group.location.includes("United States")
                      ? "text-blue-600"
                      : group.location.includes("United Kingdom")
                      ? "text-purple-600"
                      : group.location.includes("France")
                      ? "text-red-600"
                      : group.location.includes("Asia") ||
                        group.location.includes("Manila") ||
                        group.location.includes("Jakarta")
                      ? "text-orange-600"
                      : settings.darkMode
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {group.location}
                </div>
                <div
                  className={`text-sm ${
                    settings.darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {group.utcOffset}
                </div>
                <div
                  className={`text-sm mt-1 font-medium ${
                    settings.darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {group.members.length} member
                  {group.members.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Member Avatars - Stacked Rows */}
              <div className="space-y-3">
                {/* Create rows of members, max 4 per row */}
                {Array.from(
                  { length: Math.ceil(group.members.length / 4) },
                  (_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex justify-center gap-3 flex-wrap"
                    >
                      {group.members
                        .slice(rowIndex * 4, (rowIndex + 1) * 4)
                        .map((member) => {
                          const currentTime = getTimeInTimezone(
                            member.timezone
                          );
                          const currentHour = currentTime.getHours();
                          const isWorking =
                            currentHour >= member.workingHours.start &&
                            currentHour < member.workingHours.end;

                          return (
                            <div
                              key={member.id}
                              className="flex flex-col items-center space-y-2 group cursor-pointer"
                              title={`${member.name} - ${member.role} (${
                                isWorking ? "Working" : "Off Hours"
                              })`}
                            >
                              <div className="relative">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-200 group-hover:scale-110 ${
                                    isWorking
                                      ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-200 shadow-lg"
                                      : "bg-gradient-to-br from-gray-400 to-gray-500"
                                  }`}
                                >
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                                {/* Status indicator */}
                                <div
                                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                                    settings.darkMode
                                      ? "border-gray-800"
                                      : "border-white"
                                  } ${
                                    isWorking ? "bg-green-500" : "bg-gray-400"
                                  }`}
                                />
                              </div>
                              <div className="text-center">
                                <div
                                  className={`text-xs font-semibold truncate max-w-[60px] ${
                                    settings.darkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {member.name.split(" ")[0]}
                                </div>
                                <div
                                  className={`text-xs truncate max-w-[60px] ${
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
                  )
                )}
              </div>

              {/* Working Hours Info */}
              <div
                className={`text-center p-3 rounded-lg transition-all duration-200 ${
                  group.isWorkingHours
                    ? settings.darkMode
                      ? "bg-green-900/20 border border-green-700/30"
                      : "bg-green-50 border border-green-200"
                    : settings.darkMode
                    ? "bg-gray-700/50 border border-gray-600/30"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`text-sm font-semibold ${
                    group.isWorkingHours
                      ? "text-green-600 dark:text-green-400"
                      : settings.darkMode
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  {group.isWorkingHours ? "🟢 Working Hours" : "🔴 Off Hours"}
                </div>
              </div>

              {/* Vertical separator line (except for last item) */}
              {index < timezoneGroups.length - 1 && (
                <div
                  className={`absolute top-0 right-0 w-px h-full ${
                    settings.darkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}
                  style={{ transform: "translateX(12px)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        {timezoneGroups.length > 0 && (
          <div className="flex justify-center mt-4">
            <div
              className={`text-xs flex items-center gap-2 ${
                settings.darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <span>←</span>
              <span>Scroll horizontally to see all timezones</span>
              <span>→</span>
            </div>
          </div>
        )}
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

function getUtcOffset(timezone: string): string {
  try {
    const now = new Date();
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const target = new Date(
      utc.toLocaleString("en-US", { timeZone: timezone })
    );
    const offset = (target.getTime() - utc.getTime()) / (1000 * 60 * 60);

    const sign = offset >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offset));
    const minutes = Math.round((Math.abs(offset) - hours) * 60);

    return `${sign}${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  } catch {
    return "+00:00";
  }
}

function parseUtcOffset(offset: string): number {
  const match = offset.match(/([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;

  const sign = match[1] === "+" ? 1 : -1;
  const hours = Number.parseInt(match[2], 10);
  const minutes = Number.parseInt(match[3], 10);

  return sign * (hours + minutes / 60);
}
