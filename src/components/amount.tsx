import {FunctionComponent} from 'react';
import {formatNumber} from '../services/utils/number';

type Props = {
    amount: number | string
};

export const Amount: FunctionComponent<Props> = (props) => (
    <>
        {formatNumber(Number(props.amount))}
    </>
);
