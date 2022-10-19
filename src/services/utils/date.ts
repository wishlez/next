import {DateTime} from 'luxon';

const dateOptions = {zone: 'utc'};

export const toDateString = (date: Date): string => DateTime.fromJSDate(date, dateOptions).toSQLDate();

export const toDateObject = (date: string): Date => DateTime.fromSQL(date, dateOptions).toJSDate();
