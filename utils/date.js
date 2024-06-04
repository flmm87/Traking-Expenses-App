export function getFormattedDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getDateMinusDays(date, numDays) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - numDays
  );
}
