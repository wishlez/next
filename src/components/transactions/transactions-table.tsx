import {ComponentProps, FunctionComponent} from 'react';
import {Transaction} from '../../types/transactions';
import styles from '../table.module.css';
import {TransactionItem} from './transaction-item';

type Props = Omit<ComponentProps<typeof TransactionItem>, 'transaction'> & {
    transactions: Transaction[]
}

export const TransactionsTable: FunctionComponent<Props> = ({transactions, ...props}) => (
    <table className={styles.table}>
        <thead>
            <tr>
                <th>{'Description'}</th>
                <th>{'From Account'}</th>
                <th>{'To Account'}</th>
                <th>{'Date'}</th>
                <th>{'Tags'}</th>
                <th style={{textAlign: 'right'}}>{'Amount'}</th>
                <th/>
            </tr>
        </thead>
        <tbody>
            {(transactions || []).map((transaction: Transaction) => (
                <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    {...props}
                />
            ))}
        </tbody>
    </table>
);
