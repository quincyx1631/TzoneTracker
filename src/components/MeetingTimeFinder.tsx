import React from "react";
import { Calendar, Users, Clock } from "lucide-react";
import type { TeamMember, AppSettings } from "../types";
import { findOptimalMeetingTimes } from "../utils/timezone";

interface MeetingTimeFinderProps {
  members: TeamMember[];
  settings: AppSettings;
}

export const MeetingTimeFinder: React.FC<MeetingTimeFinderProps> = ({
  members,
  settings,
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

  const availability = findOptimalMeetingTimes(members);
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
      className={`rounded-xl shadow-lg p-6 ${
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
            Find optimal times when everyone is available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="grid grid-cols-12 gap-1">
          {availability.map((slot) => (
            <div
              key={slot.hour}
              className={`h-8 rounded ${getTimeColor(
                slot.percentage
              )} relative group cursor-pointer`}
              title={`${slot.hour}:00 - ${slot.memberCount}/${
                members.length
              } available (${slot.percentage.toFixed(0)}%)`}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
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
