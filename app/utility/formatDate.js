
export function formatDate(date) {
  if (!date) return "-";
  try {
    const d = new Date(date);
    return d.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return String(date);
  }
}