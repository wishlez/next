import {ParseQueryNumber, ParseQueryNumbers} from '../../types/query';

const format = new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
});

export const formatNumber = (number: number): string => format.format(number);

export const parseQueryNumber: ParseQueryNumber = (number) => {
    if (number === undefined || !String(number).length) {
        return NaN;
    }

    return Number(number);
};

export const parseQueryNumbers: ParseQueryNumbers = (numbers: string[]) => {
    if (!numbers) {
        return [];
    }

    if (!Array.isArray(numbers)) {
        return [parseQueryNumber(numbers)];
    }

    return numbers.map(parseQueryNumber);
};
