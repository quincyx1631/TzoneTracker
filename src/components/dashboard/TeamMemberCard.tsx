"use client";

import type React from "react";
import { Clock, MapPin, Briefcase, X } from "lucide-react";
import type { TeamMember, AppSettings } from "../../types";
import {
  getTimeInTimezone,
  formatTime,
  formatDate,
} from "../../utils/timezone";

interface TeamMemberCardProps {
  member: TeamMember;
  onRemove: (id: string) => void;
  settings: AppSettings;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onRemove,
  settings,
}) => {
  const currentTime = getTimeInTimezone(member.timezone);
  const currentHour = currentTime.getHours();
  const isWorkingHours =
    currentHour >= member.workingHours.start &&
    currentHour < member.workingHours.end;

  return (
    <div
      className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border ${
        settings.darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3
              className={`text-base sm:text-lg font-semibold ${
                settings.darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {member.name}
            </h3>
            <div
              className={`flex items-center text-xs sm:text-sm ${
                settings.darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {member.role}
            </div>
          </div>
        </div>
        <button
          onClick={() => onRemove(member.id)}
          className={`transition-colors p-1 rounded-full ${
            settings.darkMode
              ? "text-gray-500 hover:text-red-400 hover:bg-red-900/20"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div
          className={`flex items-center ${
            settings.darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{member.timezone.replace("_", " ")}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock
              className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${
                settings.darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
            <span
              className={`text-xs sm:text-sm ${
                settings.darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Current Time
            </span>
          </div>
          <div className="text-right">
            <div
              className={`text-lg sm:text-xl font-bold ${
                settings.darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {formatTime(currentTime)}
            </div>
            <div
              className={`text-xs sm:text-sm ${
                settings.darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        <div
          className={`flex items-center justify-between pt-2 border-t ${
            settings.darkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <span
            className={`text-sm ${
              settings.darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Working Hours
          </span>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                settings.darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {member.workingHours.start}:00 - {member.workingHours.end}:00
            </span>
            <div
              className={`w-2 h-2 rounded-full ${
                isWorkingHours ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
