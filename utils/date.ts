import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale("pt-br");

export const formatDate = (date: string | Date, format: string = "DD/MM/YYYY") => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format("DD/MM/YYYY [às] HH:mm");
};

export const formatDateTimeShort = (date: string | Date) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

export const formatDateOnly = (date: string | Date) => {
  return dayjs(date).format("DD/MM/YYYY");
};

export const isDateAfter = (date1: string | Date, date2: string | Date) => {
  return dayjs(date1).isAfter(dayjs(date2));
};

export const isDateBefore = (date1: string | Date, date2: string | Date) => {
  return dayjs(date1).isBefore(dayjs(date2));
};

export const isDateBetween = (date: string | Date, startDate: string | Date, endDate: string | Date) => {
  const d = dayjs(date);
  return d.isAfter(dayjs(startDate).startOf('day')) && d.isBefore(dayjs(endDate).endOf('day'));
};

export const startOfDay = (date: string | Date) => {
  return dayjs(date).startOf('day').toDate();
};

export const endOfDay = (date: string | Date) => {
  return dayjs(date).endOf('day').toDate();
};

export const parseDate = (dateString: string) => {
  return dayjs(dateString);
};

export const toISOString = (date: string | Date) => {
  return dayjs(date).toISOString();
};