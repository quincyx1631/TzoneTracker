// For better timezone handling, you should install: npm install date-fns date-fns-tz
// This provides more accurate timezone conversions and handles DST properly

export const commonTimezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Asia/Manila", // Philippines
  "Australia/Sydney",
  "Pacific/Auckland",
]

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
    // Create a date object representing the time in the target timezone
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

    // Check if the working hours span to the next day
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
    // Return original hours as fallback
    return {
      start: managerWorkingHours.start,
      end: managerWorkingHours.end,
      nextDay: false,
    }
  }
}

function convertTimeToTimezone(date: Date, fromTimezone: string, toTimezone: string): Date {
  try {
    // Get the time as it would be in the source timezone
    const sourceTime = new Date(
      date.toLocaleString("en-US", {
        timeZone: fromTimezone,
      }),
    )

    // Calculate the offset difference
    const sourceOffset = getTimezoneOffsetInMinutes(fromTimezone)
    const targetOffset = getTimezoneOffsetInMinutes(toTimezone)
    const offsetDiff = targetOffset - sourceOffset

    // Apply the offset difference
    const convertedTime = new Date(date.getTime() + offsetDiff * 60 * 1000)
    return convertedTime
  } catch {
    return date
  }
}

function getTimezoneOffsetInMinutes(timezone: string): number {
  try {
    const now = new Date()
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
    const target = new Date(utc.toLocaleString("en-US", { timeZone: timezone }))
    return (target.getTime() - utc.getTime()) / (1000 * 60)
  } catch {
    return 0
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
