/**
 * Returns a list of cities for a given timezone offset
 */
export function getCitiesForTimezone(offset: number): string[] {
  const timezoneMap: Record<string, string[]> = {
    "-12": ["Baker Island"],
    "-11": ["Pago Pago"],
    "-10": ["Honolulu"],
    "-9": ["Anchorage"],
    "-8": ["Los Angeles", "Vancouver"],
    "-7": ["Denver", "Phoenix"],
    "-6": ["Chicago", "Mexico City"],
    "-5": ["New York", "Toronto"],
    "-4": ["Santiago", "Halifax"],
    "-3": ["São Paulo", "Buenos Aires"],
    "-2": ["Fernando de Noronha"],
    "-1": ["Praia"],
    "0": ["London", "Lisbon"],
    "1": ["Berlin", "Paris"],
    "2": ["Helsinki", "Cairo"],
    "3": ["Moscow", "Istanbul"],
    "4": ["Dubai", "Baku"],
    "5": ["Karachi", "Tashkent"],
    "6": ["Dhaka", "Almaty"],
    "7": ["Bangkok", "Jakarta"],
    "8": ["Singapore", "Beijing"],
    "9": ["Tokyo", "Seoul"],
    "10": ["Sydney", "Melbourne"],
    "11": ["Noumea"],
    "12": ["Auckland", "Fiji"],
  };

  return timezoneMap[offset.toString()] || ["UTC"];
}

/**
 * Returns the default timezone based on the user's browser settings
 */
export function getDefaultTimezone(): string {
  const offset = -(new Date().getTimezoneOffset() / 60);
  const cities = getCitiesForTimezone(offset);
  return `(GMT${offset >= 0 ? "+" : ""}${offset}:00) ${cities[0]}`;
}