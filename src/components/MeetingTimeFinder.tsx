import type React from "react";
import { Calendar, Users, Clock } from "lucide-react";
import type { TeamMember, AppSettings, Leader } from "../types";
import {
  convertWorkingHoursToTimezone,
  isWithinWorkingHours,
  getTimeInTimezone,
} from "../utils/timezone";

interface MeetingTimeFinderProps {
  members: TeamMember[];
  settings: AppSettings;
  leader?: Leader | null;
}

export const MeetingTimeFinder: React.FC<MeetingTimeFinderProps> = ({
  members,
  settings,
  leader,
}) => {
  if (members.length === 0) {
    return (
      <div
        className={`rounded-xl shadow-lg p-8 text-center ${
          settings.darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3
          className={`text-lg font-semibold mb-2 ${
            settings.darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          No Team Members
        </h3>
        <p className={settings.darkMode ? "text-gray-400" : "text-gray-600"}>
          Add team members to find optimal meeting times
        </p>
      </div>
    );
  }

  // Calculate availability using manager's converted working hours
  const availability = [];

  for (let hour = 0; hour < 24; hour++) {
    let availableMembers = 0;
    const memberDetails: Array<{
      member: TeamMember;
      isAvailable: boolean;
      localTime: number;
    }> = [];

    // Group members by timezone and calculate availability
    const timezoneGroups = new Map<string, TeamMember[]>();

    members.forEach((member) => {
      if (!timezoneGroups.has(member.timezone)) {
        timezoneGroups.set(member.timezone, []);
      }
      timezoneGroups.get(member.timezone)!.push(member);
    });

    timezoneGroups.forEach((membersInTimezone, timezone) => {
      // Calculate time for this hour in the timezone
      const baseDate = new Date();
      baseDate.setHours(hour, 0, 0, 0);
      const timeInTimezone = getTimeInTimezone(timezone, baseDate);
      const hourInTimezone = timeInTimezone.getHours();

      // Get working hours for this timezone
      let workingHours: { start: number; end: number; nextDay: boolean };
      if (leader) {
        workingHours = convertWorkingHoursToTimezone(
          leader.workingHours,
          leader.timezone,
          timezone
        );
      } else {
        workingHours = { start: 9, end: 17, nextDay: false };
      }

      // Check if members in this timezone are available
      membersInTimezone.forEach((member: TeamMember) => {
        const isAvailable = isWithinWorkingHours(hourInTimezone, workingHours);
        if (isAvailable) {
          availableMembers++;
        }
        memberDetails.push({
          member,
          isAvailable,
          localTime: hourInTimezone,
        });
      });
    });

    availability.push({
      hour,
      available: availableMembers === members.length,
      memberCount: availableMembers,
      percentage: (availableMembers / members.length) * 100,
      memberDetails,
    });
  }

  const optimalTimes = availability.filter((slot) => slot.available);
  const goodTimes = availability.filter(
    (slot) => slot.percentage >= 75 && !slot.available
  );

  const getTimeColor = (percentage: number) => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 75) return "bg-yellow-500";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div
      className={`rounded-xl shadow-lg p-4 sm:p-6 ${
        settings.darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3
            className={`text-lg font-semibold ${
              settings.darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Meeting Time Finder
          </h3>
          <p
            className={`text-sm ${
              settings.darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {leader
              ? `Based on ${leader.name}'s working hours (${leader.workingHours.start}:00-${leader.workingHours.end}:00) converted to all timezones`
              : "Find optimal times when everyone is available"}
          </p>
        </div>
      </div>

      {leader && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            settings.darkMode
              ? "bg-blue-900/20 border-blue-800"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4
                className={`text-sm font-medium ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Manager's Working Hours Applied
              </h4>
              <p
                className={`text-xs mt-1 ${
                  settings.darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {leader.name} (
                {leader.timezone.split("/")[1]?.replace(/_/g, " ")}):{" "}
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
              Auto-converted
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h4
            className={`font-medium mb-3 flex items-center ${
              settings.darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <Users className="w-4 h-4 mr-2 text-green-600" />
            Perfect Times (Everyone Available)
          </h4>
          {optimalTimes.length > 0 ? (
            <div className="space-y-2">
              {optimalTimes.map((slot) => (
                <div
                  key={slot.hour}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    settings.darkMode ? "bg-green-900/20" : "bg-green-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span
                      className={`text-sm font-medium ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {slot.hour}:00 - {slot.hour + 1}:00
                    </span>
                  </div>
                  <div className="text-xs text-green-700 font-medium">
                    {members.length}/{members.length} available
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-8 ${
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No perfect overlap found</p>
            </div>
          )}
        </div>

        <div>
          <h4
            className={`font-medium mb-3 flex items-center ${
              settings.darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <Users className="w-4 h-4 mr-2 text-yellow-600" />
            Good Times (75%+ Available)
          </h4>
          {goodTimes.length > 0 ? (
            <div className="space-y-2">
              {goodTimes.map((slot) => (
                <div
                  key={slot.hour}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    settings.darkMode ? "bg-yellow-900/20" : "bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span
                      className={`text-sm font-medium ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {slot.hour}:00 - {slot.hour + 1}:00
                    </span>
                  </div>
                  <div className="text-xs text-yellow-700 font-medium">
                    {slot.memberCount}/{members.length} available
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-8 ${
                settings.darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No good times found</p>
            </div>
          )}
        </div>
      </div>

      <div
        className={`mt-6 pt-6 border-t ${
          settings.darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h4
          className={`font-medium mb-3 ${
            settings.darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          24-Hour Availability Overview
        </h4>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
          {availability.map((slot) => (
            <div
              key={slot.hour}
              className={`h-6 sm:h-8 rounded ${getTimeColor(
                slot.percentage
              )} relative group cursor-pointer`}
              title={`${slot.hour}:00 - ${slot.memberCount}/${
                members.length
              } available (${slot.percentage.toFixed(0)}%)`}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {slot.hour}:00 - {slot.memberCount}/{members.length}
              </div>
            </div>
          ))}
        </div>
        <div
          className={`flex items-center justify-between text-xs mt-2 ${
            settings.darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <span>0:00</span>
          <span>12:00</span>
          <span>23:00</span>
        </div>
      </div>
    </div>
  );
};
