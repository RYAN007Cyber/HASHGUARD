export function safeDateParse(dateString: string): Date | null {
  if (!dateString) return null;
  
  // Try ISO format first
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) return isoDate;

  // Common log formats to try
  const formats = [
    // US format: 7/1/2023, 2:30:45 PM
    /(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/,
    // ISO-like: 2023-07-01 14:30:45
    /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/,
    // European format: 01-07-2023 14:30:45
    /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
  ];

  for (const regex of formats) {
    const match = dateString.match(regex);
    if (match) {
      let year, month, day, hours, minutes, seconds;
      
      if (match[7]) { // AM/PM format
        hours = parseInt(match[4]);
        if (match[7] === 'PM' && hours < 12) hours += 12;
        if (match[7] === 'AM' && hours === 12) hours = 0;
        
        return new Date(
          parseInt(match[3]), // year
          parseInt(match[1]) - 1, // month
          parseInt(match[2]), // day
          hours,
          parseInt(match[5]), // minutes
          parseInt(match[6]) // seconds
        );
      } else if (match[6]) { // 24-hour format
        return new Date(
          parseInt(match[1] || match[3]), // year
          parseInt(match[2]) - 1, // month
          parseInt(match[3] || match[1]), // day
          parseInt(match[4]), // hours
          parseInt(match[5]), // minutes
          parseInt(match[6]) // seconds
        );
      }
    }
  }

  return null;
}