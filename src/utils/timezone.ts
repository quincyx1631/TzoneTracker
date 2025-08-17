export const commonTimezones = [

  // North America
  "America/New_York",      // EST/EDT - Eastern US
  "America/Chicago",       // CST/CDT - Central US
  "America/Denver",        // MST/MDT - Mountain US
  "America/Los_Angeles",   // PST/PDT - Pacific US
  "America/Vancouver",     // PST/PDT - Western Canada
  "America/Toronto",       // EST/EDT - Eastern Canada
  "America/Mexico_City",   // CST/CDT - Mexico
  "America/Sao_Paulo",     // BRT - Brazil (major remote work hub)
  
  // Europe
  "Europe/London",         // GMT/BST - UK
  "Europe/Paris",          // CET/CEST - France
  "Europe/Berlin",         // CET/CEST - Germany
  "Europe/Amsterdam",      // CET/CEST - Netherlands
  "Europe/Zurich",         // CET/CEST - Switzerland
  "Europe/Stockholm",      // CET/CEST - Sweden 
  "Europe/Warsaw",         // CET/CEST - Poland
  "Europe/Istanbul",       // TRT - Turkey
  "Europe/Kiev",           // EET/EEST - Ukraine
  
  // Asia-Pacific
  "Asia/Tokyo",            // JST - Japan
  "Asia/Shanghai",         // CST - China
  "Asia/Seoul",            // KST - South Korea
  "Asia/Singapore",        // SGT - Singapore
  "Asia/Kolkata",          // IST - India (huge remote workforce)
  "Asia/Manila",           // PHT - Philippines
  "Asia/Bangkok",          // ICT - Thailand
  "Asia/Dubai",            // GST - UAE 
  "Asia/Tel_Aviv",         // IST - Israel 
  
  // Oceania
  "Australia/Sydney",      // AEST/AEDT - Australia East
  "Australia/Melbourne",   // AEST/AEDT - Australia Southeast
  "Pacific/Auckland",      // NZST/NZDT - New Zealand
  
  // Africa 
  "Africa/Lagos",          // WAT - Nigeria
  "Africa/Cairo",          // EET - Egypt
  "Africa/Johannesburg",   // SAST - South Africa
]

export const businessHoursPresets = {
  "standard": { start: 9, end: 17 },    
  "tech": { start: 10, end: 18 },        
  "early": { start: 8, end: 16 },      
  "flexible": { start: 9, end: 15 },      
  "european": { start: 8, end: 16 },       
  "asian": { start: 9, end: 18 },        
  "freelancer": { start: 10, end: 22 },    
} as const

export const timezoneGroups = {
  americas: [
    "America/New_York",
    "America/Chicago", 
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "America/Sao_Paulo",
  ],
  europe: [
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Amsterdam",
    "Europe/Stockholm",
  ],
  asia: [
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Kolkata",
    "Asia/Manila",
  ],
  oceania: [
    "Australia/Sydney",
    "Australia/Melbourne",
    "Pacific/Auckland",
  ]
} as const

export function isTimezoneSupported(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

export function getTimeInTimezone(timezone: string, date?: Date): Date {
  const targetDate = date || new Date()
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

    const parts = formatter.formatToParts(targetDate)
    const year = Number.parseInt(parts.find((p) => p.type === "year")?.value || "0")
    const month = Number.parseInt(parts.find((p) => p.type === "month")?.value || "1") - 1
    const day = Number.parseInt(parts.find((p) => p.type === "day")?.value || "1")
    const hour = Number.parseInt(parts.find((p) => p.type === "hour")?.value || "0")
    const minute = Number.parseInt(parts.find((p) => p.type === "minute")?.value || "0")
    const second = Number.parseInt(parts.find((p) => p.type === "second")?.value || "0")

    return new Date(year, month, day, hour, minute, second)
  } catch {
    return targetDate
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function getTimezoneOffset(timezone: string): string {
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    })

    const parts = formatter.formatToParts(now)
    const offsetPart = parts.find((part) => part.type === "timeZoneName")

    if (offsetPart && offsetPart.value.includes("GMT")) {
      return offsetPart.value.replace("GMT", "UTC")
    }

    // Fallback calculation
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
    const target = getTimeInTimezone(timezone, now)
    const offset = (target.getTime() - utc.getTime()) / (1000 * 60 * 60)

    const sign = offset >= 0 ? "+" : "-"
    const hours = Math.floor(Math.abs(offset))
    const minutes = Math.round((Math.abs(offset) - hours) * 60)

    return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  } catch {
    return "UTC+00:00"
  }
}

export function getTimezoneAbbreviation(timezone: string): string {
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "short",
    })

    const parts = formatter.formatToParts(now)
    const abbr = parts.find((part) => part.type === "timeZoneName")?.value
    return abbr || timezone.split("/")[1]?.replace("_", " ") || timezone
  } catch {
    return timezone.split("/")[1]?.replace("_", " ") || timezone
  }
}

// Convert manager's working hours to team member's timezone
export function convertWorkingHoursToTimezone(
  managerWorkingHours: { start: number; end: number },
  managerTimezone: string,
  memberTimezone: string,
): { start: number; end: number; nextDay: boolean } {
  try {
    // Create a reference date (today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Create start time in manager's timezone
    const managerStartTime = new Date(today)
    managerStartTime.setHours(managerWorkingHours.start, 0, 0, 0)

    // Create end time in manager's timezone
    const managerEndTime = new Date(today)
    managerEndTime.setHours(managerWorkingHours.end, 0, 0, 0)

    // Convert to UTC first, then to member's timezone
    const startInMemberTz = convertTimeToTimezone(managerStartTime, managerTimezone, memberTimezone)
    const endInMemberTz = convertTimeToTimezone(managerEndTime, managerTimezone, memberTimezone)

    const startHour = startInMemberTz.getHours()
    const endHour = endInMemberTz.getHours()
    let nextDay = false

    if (endHour < startHour) {
      nextDay = true
    }

    return {
      start: startHour,
      end: endHour,
      nextDay,
    }
  } catch (error) {
    console.error("Error converting working hours:", error)
    return {
      start: managerWorkingHours.start,
      end: managerWorkingHours.end,
      nextDay: false,
    }
  }
}

function convertTimeToTimezone(date: Date, fromTimezone: string, toTimezone: string): Date {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: fromTimezone,
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })
    
    const parts = formatter.formatToParts(date)
    const year = Number.parseInt(parts.find((p) => p.type === "year")?.value || "0")
    const month = Number.parseInt(parts.find((p) => p.type === "month")?.value || "1") - 1
    const day = Number.parseInt(parts.find((p) => p.type === "day")?.value || "1")
    const hour = Number.parseInt(parts.find((p) => p.type === "hour")?.value || "0")
    const minute = Number.parseInt(parts.find((p) => p.type === "minute")?.value || "0")
    const second = Number.parseInt(parts.find((p) => p.type === "second")?.value || "0")
    
    // Create a date representing the time in the source timezone
    const sourceDate = new Date(year, month, day, hour, minute, second)
    
    // Now convert to the target timezone
    return getTimeInTimezone(toTimezone, sourceDate)
  } catch {
    return date
  }
}

// Helper function to check if a specific hour falls within working hours
export function isWithinWorkingHours(
  hour: number,
  workingHours: { start: number; end: number; nextDay?: boolean },
): boolean {
  // Handle cases where end time is next day (e.g., 22:00 to 06:00)
  if (workingHours.nextDay || workingHours.end < workingHours.start) {
    return hour >= workingHours.start || hour < workingHours.end
  }
  return hour >= workingHours.start && hour < workingHours.end
}

interface TeamMember {
  timezone: string
  workingHours: {
    start: number
    end: number
  }
}

export function findOptimalMeetingTimes(members: TeamMember[]) {
  const availability = []

  for (let hour = 0; hour < 24; hour++) {
    let availableMembers = 0

    members.forEach((member) => {
      const baseDate = new Date()
      baseDate.setHours(hour, 0, 0, 0)
      const timeInTimezone = getTimeInTimezone(member.timezone, baseDate)
      const hourInTimezone = timeInTimezone.getHours()

      if (isWithinWorkingHours(hourInTimezone, member.workingHours)) {
        availableMembers++
      }
    })

    availability.push({
      hour,
      available: availableMembers === members.length,
      memberCount: availableMembers,
      percentage: (availableMembers / members.length) * 100,
    })
  }

  return availability
}

export function getMeetingTimeSuggestions(members: TeamMember[], minimumAttendance = 0.7) {
  const availability = findOptimalMeetingTimes(members)
  
  return availability
    .filter(slot => slot.percentage >= minimumAttendance * 100)
    .map(slot => {
      const timeDate = new Date()
      timeDate.setHours(slot.hour, 0, 0, 0)
      return {
        ...slot,
        timeSlot: formatTime(timeDate),
        quality: slot.percentage === 100 ? 'perfect' : 
                 slot.percentage >= 80 ? 'good' : 'acceptable',
        description: `${slot.memberCount}/${members.length} members available (${slot.percentage.toFixed(0)}%)`
      }
    })
    .sort((a, b) => b.percentage - a.percentage)
}

export function findConsecutiveMeetingSlots(members: TeamMember[], durationHours = 2, minimumAttendance = 0.7) {
  const availability = findOptimalMeetingTimes(members)
  const consecutiveSlots = []
  
  for (let startHour = 0; startHour <= 24 - durationHours; startHour++) {
    const slots = []
    let validSlot = true
    
    for (let hour = startHour; hour < startHour + durationHours; hour++) {
      const slot = availability[hour % 24]
      if (slot.percentage < minimumAttendance * 100) {
        validSlot = false
        break
      }
      slots.push(slot)
    }
    
    if (validSlot) {
      const avgPercentage = slots.reduce((sum, slot) => sum + slot.percentage, 0) / slots.length
      const startTimeDate = new Date()
      startTimeDate.setHours(startHour, 0, 0, 0)
      const endTimeDate = new Date()
      endTimeDate.setHours(startHour + durationHours, 0, 0, 0)
      
      consecutiveSlots.push({
        startHour,
        endHour: startHour + durationHours,
        duration: durationHours,
        averageAttendance: avgPercentage,
        startTime: formatTime(startTimeDate),
        endTime: formatTime(endTimeDate),
        slots
      })
    }
  }
  
  return consecutiveSlots.sort((a, b) => b.averageAttendance - a.averageAttendance)
}

export function convertMeetingTimeToAllTimezones(meetingHour: number, memberTimezones: string[]) {
  const baseDate = new Date()
  baseDate.setHours(meetingHour, 0, 0, 0)
  
  return memberTimezones.map(timezone => {
    const localTime = getTimeInTimezone(timezone, baseDate)
    return {
      timezone,
      localTime: formatTime(localTime),
      localDate: formatDate(localTime),
      hour: localTime.getHours(),
      isNextDay: localTime.getDate() !== baseDate.getDate(),
      isPreviousDay: localTime.getDate() < baseDate.getDate(),
      abbreviation: getTimezoneAbbreviation(timezone),
      offset: getTimezoneOffset(timezone)
    }
  })
}

export function isReasonableMeetingTime(hour: number): boolean {
  return hour >= 8 && hour <= 22
}

export function getTimezoneFriendlyMeetings(members: TeamMember[]) {
  const suggestions = getMeetingTimeSuggestions(members, 0.6)
  
  return suggestions.map(suggestion => {
    const allTimezones = convertMeetingTimeToAllTimezones(
      suggestion.hour, 
      members.map(m => m.timezone)
    )
    
    const reasonableCount = allTimezones.filter(tz => 
      isReasonableMeetingTime(tz.hour)
    ).length
    
    return {
      ...suggestion,
      allTimezones,
      reasonableTimeCount: reasonableCount,
      reasonableTimePercentage: (reasonableCount / allTimezones.length) * 100,
      recommendation: reasonableCount === allTimezones.length ? 'excellent' :
                     reasonableCount >= allTimezones.length * 0.8 ? 'good' :
                     reasonableCount >= allTimezones.length * 0.6 ? 'fair' : 'poor'
    }
  })
}
