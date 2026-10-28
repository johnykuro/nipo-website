const ukTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
  hour: "2-digit",
  hourCycle: "h23",
});

// Hide from Friday 17:00 through Saturday; resume at Sunday 00:00 UK time.
export function isSetMenuPromoAllowed(now = new Date()): boolean {
  const parts = ukTime.formatToParts(now);
  const day = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  return day !== "Sat" && !(day === "Fri" && hour >= 17);
}
