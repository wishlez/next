import BigNumber from 'bignumber.js';
import {FunctionComponent, useEffect, useState} from 'react';
import {doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {AccountTypes} from '../../types/account-types';
import {Account} from '../../types/accounts';
import {Transaction, WithTransactions} from '../../types/transactions';
import {Amount} from '../amount';

const getBalance = async (id: number, accountType: AccountTypes, openingBalance: number, maximumAmountOwed: number): Promise<string> => {
    const {transactions} = await doGet<WithTransactions>(swrKeys.transactions, {accountId: id});

    const Incoming: Transaction[] = transactions.filter((transaction: Transaction) => transaction.toAccountId === id);
    const Outgoing: Transaction[] = transactions.filter((transaction: Transaction) => transaction.fromAccountId === id);

    const incoming = Incoming.reduce((sum, {amount}) => sum.plus(amount), new BigNumber(0));
    const outgoing = Outgoing.reduce((sum, {amount}) => sum.plus(amount), new BigNumber(0));

    const liabilityBalance = new BigNumber(maximumAmountOwed);
    const transactionBalance = incoming.plus(openingBalance).minus(outgoing);

    return (accountType === 'Liability' ? liabilityBalance.minus(transactionBalance) : transactionBalance).toFixed();
};

export const AccountBalance: FunctionComponent<Account> = (props) => {
    const [balance, setBalance] = useState<string>('0');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);

        getBalance(props.id, props.accountType, props.openingBalance, props.maximumAmountOwed)
            .then(setBalance)
            .then(() => setIsLoading(false));
    }, [props.id, props.accountType, props.openingBalance, props.maximumAmountOwed]);

    return isLoading ? <>{'...'}</> : <Amount amount={balance}/>;
};
