import {FunctionComponent} from 'react';

type Props = {
    amount: number | string
};

const format = new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
});

export const Amount: FunctionComponent<Props> = (props) => (
    <>
        {format.format(Number(props.amount))}
    </>
);
