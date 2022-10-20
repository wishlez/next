import {ReactElement} from 'react';
import {GetAdjustedOptions, GetOptions} from '../../types/options';

export const getOptions: GetOptions = (items, label, value): ReactElement[] => items.map((item) => (
    <option
        key={`${item[value]}`}
        value={`${item[value]}`}
    >
        {`${item[label]}`}
    </option>
));

export const getSelectedOptions = (node: HTMLSelectElement): number[] => Array.from(node.selectedOptions).map(({value}) => Number(value));

export const getAdjustedOptions: GetAdjustedOptions = (existingOptions, updatedOptions) => ({
    added: updatedOptions.filter((option) => !existingOptions.includes(option)),
    deleted: existingOptions.filter((option) => !updatedOptions.includes(option))
});
