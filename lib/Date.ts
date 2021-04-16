export default {
  getFormattedDate: getFormattedDate,
  getFormattedTime: getFormattedTime,
  getAMPMHours: getAMPMHours,
  getMonthString: getMonthString,
  getMonthStringAbr: getMonthStringAbr,
}

function getFormattedDate(eventDateParam: Date | number | string): string {
  const eventDate =
    eventDateParam instanceof Date ? eventDateParam : new Date(eventDateParam);
  return (
    getMonthStringAbr(eventDate.getMonth()) + " " +
    eventDate.getDate() + ", " + eventDate.getFullYear() +
    " at " + getFormattedTime(eventDate)
  );
}

function getFormattedTime(eventDateParam: Date): string {
  const eventDate =
    eventDateParam instanceof Date ? eventDateParam : new Date(eventDateParam);
  return (
    `${getAMPMHours(eventDate)}:` +
    `${
      eventDate.getMinutes() >= 10
        ? eventDate.getMinutes()
        : '0' + eventDate.getMinutes()
    } ` +
    `${eventDate.getHours() < 12 ? 'AM' : 'PM'}`
  );
}

function getAMPMHours(eventDateParam: Date | number | string): string {
  const eventDate =
    eventDateParam instanceof Date ? eventDateParam : new Date(eventDateParam);
  let militaryHour: number = eventDate.getHours();
  if (militaryHour === 0) {
    return '12';
  } else if (militaryHour > 12) {
    return String(militaryHour - 12);
  } else {
    return String(militaryHour);
  }
}

export function getMonthString(month: number) {
  const monthStrings = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthStrings[month];
}

export function getMonthStringAbr(month: number) {
  const monthStrings = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return monthStrings[month];
}