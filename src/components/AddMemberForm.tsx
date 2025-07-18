import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import type { TeamMember, AppSettings } from "../types";
import { commonTimezones } from "../utils/timezone";

interface AddMemberFormProps {
  onAdd: (member: Omit<TeamMember, "id">) => void;
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({
  onAdd,
  isOpen,
  onClose,
  settings,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    timezone: "America/New_York",
    workingHours: {
      start: settings.defaultWorkingHours.start,
      end: settings.defaultWorkingHours.end,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.role.trim()) {
      onAdd(formData);
      setFormData({
        name: "",
        role: "",
        timezone: "America/New_York",
        workingHours: {
          start: settings.defaultWorkingHours.start,
          end: settings.defaultWorkingHours.end,
        },
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-xl shadow-2xl w-full max-w-md ${
          settings.darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${
            settings.darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              settings.darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Add Team Member
          </h2>
          <button
            onClick={onClose}
            className={`transition-colors ${
              settings.darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                settings.darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                settings.darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-200`}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                settings.darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                settings.darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-200`}
              placeholder="e.g., Frontend Developer"
              required
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                settings.darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, timezone: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                settings.darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-200`}
            >
              {commonTimezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  settings.darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Start Time
              </label>
              <select
                value={formData.workingHours.start}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workingHours: {
                      ...prev.workingHours,
                      start: Number(e.target.value),
                    },
                  }))
                }
                className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                  settings.darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-200`}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}:00
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  settings.darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                End Time
              </label>
              <select
                value={formData.workingHours.end}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workingHours: {
                      ...prev.workingHours,
                      end: Number(e.target.value),
                    },
                  }))
                }
                className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                  settings.darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-200`}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}:00
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 px-4 border rounded-lg transition-colors ${
                settings.darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
