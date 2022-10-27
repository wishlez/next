import BigNumber from 'bignumber.js';
import {FunctionComponent, useEffect, useState} from 'react';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Transaction, WithTransactions} from '../../types/transactions';
import {Amount} from '../amount';

type Props = {
    accountId: number
    openingBalance: number
}

const getBalance = async (accountId: number, openingBalance: number): Promise<string> => {
    const {transactions} = await doGet<WithTransactions>(swrKeys.transactions, {accountId});

    const Incoming: Transaction[] = transactions.filter((transaction: Transaction) => transaction.toAccountId === accountId);
    const Outgoing: Transaction[] = transactions.filter((transaction: Transaction) => transaction.fromAccountId === accountId);

    const incoming = Incoming.reduce((sum, {amount}) => sum.plus(amount), new BigNumber(0));
    const outgoing = Outgoing.reduce((sum, {amount}) => sum.plus(amount), new BigNumber(0));

    return incoming.plus(openingBalance).minus(outgoing).toFixed(2);
};

export const AccountBalance: FunctionComponent<Props> = (props) => {
    const [balance, setBalance] = useState<string>('0');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);

        getBalance(props.accountId, props.openingBalance)
            .then(setBalance)
            .then(() => setIsLoading(false));
    }, [props.openingBalance, props.accountId]);

    return isLoading ? <>{'...'}</> : <Amount amount={balance}/>;
};
