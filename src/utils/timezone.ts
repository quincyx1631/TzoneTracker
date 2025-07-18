export const isTimezoneSupported = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

export const getTimeInTimezone = (timezone: string): Date => {
  const safeTimezone = isTimezoneSupported(timezone) ? timezone : 'UTC';
  return new Date(new Date().toLocaleString("en-US", { timeZone: safeTimezone }));
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const getHourInTimezone = (timezone: string, hour: number): number => {
  const safeTimezone = isTimezoneSupported(timezone) ? timezone : 'UTC';
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0);
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const targetTime = new Date(utc + (getTimezoneOffset(safeTimezone) * 60000));
  return targetTime.getHours();
};

export const getTimezoneOffset = (timezone: string): number => {
  const safeTimezone = isTimezoneSupported(timezone) ? timezone : 'UTC';
  const now = new Date();
  const utc = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(utc.toLocaleString("en-US", { timeZone: safeTimezone }));
  return (target.getTime() - utc.getTime()) / (1000 * 60);
};

export const findOptimalMeetingTimes = (members: Array<{timezone: string, workingHours: {start: number, end: number}}>) => {
  const hours = Array.from({length: 24}, (_, i) => i);
  const availability = hours.map(hour => {
    const availableMembers = members.filter(member => {
      const memberHour = getHourInTimezone(member.timezone, hour);
      return memberHour >= member.workingHours.start && memberHour < member.workingHours.end;
    });
    
    return {
      hour,
      available: availableMembers.length === members.length,
      memberCount: availableMembers.length,
      percentage: (availableMembers.length / members.length) * 100
    };
  });
  
  return availability;
};

const allTimezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver', 
  'America/Los_Angeles',
  'America/Vancouver',
  'America/Toronto',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Mumbai',
  'Asia/Dubai',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
  'Africa/Cairo',
  'Africa/Lagos',
  'Africa/Johannesburg'
];

export const commonTimezones = allTimezones.filter(isTimezoneSupported);