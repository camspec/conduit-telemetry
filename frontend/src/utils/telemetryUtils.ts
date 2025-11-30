export function formatShortTimestamp(timestamp: number | string) {
  return new Date(timestamp).toLocaleString("en-CA", {
    hour12: false,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatLongTimestamp(timestamp: number | string) {
  return new Date(timestamp).toLocaleString("en-CA", {
    hour12: false,
  });
}
