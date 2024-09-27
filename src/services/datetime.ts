import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const setTimezone = (timezone: string) => {
  dayjs.tz.setDefault(timezone);
};

const datetime = (dateType?: string | number | Date | Dayjs) => dayjs.utc(dateType);

export const datetimeToLocal = (dateType?: string | number | Date | Dayjs) => datetime(dateType).tz();

export const datetimeFromLocal = (dateType?: string | number | Date | Dayjs) => dayjs(dateType).tz();

export default datetime;
