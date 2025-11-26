// Utility to format dates as: 26, nov 2025 2:05 PM
export default function formatDateTime(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (!d || isNaN(d.getTime())) return "";

  const day = d.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[d.getMonth()] || "";
  const year = d.getFullYear();

  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  return `${day} ${month}, ${year} | ${hour12}:${minutes} ${ampm}`;
}
