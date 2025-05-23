import moment from 'moment';


export function calculateCurrentAge(arrivalDate, arrivalAge) {
  const today = moment();
  const arrival = moment(arrivalDate);
  const daysSinceArrival = today.diff(arrival, 'days');
  const totalDays = arrivalAge + daysSinceArrival -1;

  return {
    days: totalDays,
    weeks: parseFloat((totalDays / 7).toFixed(2)),
    months: parseFloat((totalDays / 30).toFixed(2)),
  };
}

export function formatDateReadable(date) {
  return moment(date).format('DD-MM-YYYY');
}