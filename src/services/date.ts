import dayjs from 'dayjs';

export const formatDate = (format: string, datetime: Date | string | null) => datetime ? dayjs(datetime).format(format) : '';

export const dateInPast = (datetime: Date | string | null) => dayjs().isAfter(datetime);
