import {DateTime} from 'luxon';
import {DateParts, ToDateObject, ToDateString} from '../../types/date';

const dateOptions = {zone: 'utc'};

export const normalizeDate = (date: DateParts | Date | number): DateTime => {
    if (typeof date === 'number') {
        return DateTime.fromMillis(date, dateOptions);
    } else if (date instanceof Date) {
        return DateTime.fromJSDate(date, dateOptions);
    } else {
        return DateTime.fromMillis(Date.UTC(date.year, date.month - 1, date.day || 1, 0, 0, 0, 0), dateOptions);
    }
};

export const toDateString: ToDateString = (date, month, day): string => {
    if (typeof date === 'number') {
        return normalizeDate({
            day,
            month,
            year: date
        }).toSQLDate();
    }

    return DateTime.fromJSDate(date, dateOptions).toSQLDate();
};

export const toDateObject: ToDateObject = (year, month, day) => {
    if (typeof year === 'number') {
        return normalizeDate({
            day,
            month,
            year
        }).toJSDate();
    }

    return DateTime.fromSQL(year, dateOptions).toJSDate();
};
