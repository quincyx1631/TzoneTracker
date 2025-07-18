export interface TeamMember {
  id: string;
  name: string;
  role: string;
  timezone: string;
  workingHours: {
    start: number; // 0-23 hours
    end: number; // 0-23 hours
  };
  avatar?: string;
}

export interface Leader {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  timezone: string;
  workingHours: {
    start: number;
    end: number;
  };
}

export interface AppSettings {
  darkMode: boolean;
  defaultWorkingHours: {
    start: number;
    end: number;
  };
}

export interface TimeSlot {
  hour: number;
  available: boolean;
  memberCount: number;
}