import moment from "moment";

export const checkIfDateRangeOverlaps = (
  leftStart: number,
  leftEnd: number,
  rightStart: number,
  rightEnd: number
): boolean => {
  if (leftStart < rightStart && rightStart < leftEnd) return true;
  if (leftStart < rightEnd && rightEnd < leftEnd) return true;
  if (rightStart < leftStart && leftEnd < rightEnd) return true;
  return false;
};

export const checkIfDateEntriesOverlap = (
  entries: Array<{ from: Date; to: Date }>
): boolean => {
  console.log(entries);

  let j = 0;
  for (let i = 0; i < entries.length - 1; i += 1) {
    for (j = i + 1; j < entries.length; j += 1) {
      if (
        checkIfDateRangeOverlaps(
          entries[i].from.getTime(),
          entries[i].to.getTime(),
          entries[j].from.getTime(),
          entries[j].to.getTime()
        )
      ) {
        return true;
      }
    }
  }

  return false;
};

export const formatDate = (date: Date | null) =>
  date === null ? "-" : moment(date).format("D MMMM y, hh:mm");

export const formatHours = () => {};
