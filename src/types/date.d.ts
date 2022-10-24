import {DateTime} from 'luxon';

export type DateParts = {
    year: number
    month: number
    day?: number
};

export interface NormalizeDate {
    (date: Date): DateTime;

    (milliseconds: number): DateTime;

    (dateParts: DateParts): DateTime;
}

export interface ToDateObject {
    (date: string, month?: never, day?: never): Date;

    (year: number, month: number, day: number): Date;
}

export interface ToDateString {
    (date: Date, month?: never, day?: never): string;

    (year: number, month: number, day: number): string;
}
