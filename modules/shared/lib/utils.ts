import { format } from 'date-fns';

const OUTPUT_FORMAT = 'MMM dd, yyyy';
const NA = '--';

export function formatDate(dateString: string | null | Date): string {
  if (!dateString) return NA;

  if (dateString instanceof Date) {
    return format(dateString, OUTPUT_FORMAT);
  }

  const cleanDateString = dateString.split('T')[0].split(' ')[0];
  const [year, month, day] = cleanDateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  return format(date, OUTPUT_FORMAT);
}
