export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Converts 0 to 12 for midnight
  return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
}
