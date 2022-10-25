import {useRouter} from 'next/router';
import {ComponentProps, FunctionComponent} from 'react';
import {Transaction} from '../../types/transactions';
import {NavContainer} from '../nav-container';
import styles from '../table.module.css';
import {useSelection} from '../use-selection';
import {TransactionItem} from './transaction-item';
import {TransactionsBulkEditDescription} from './transactions-bulk-edit-description';

type Props = {
    onChange: ComponentProps<typeof TransactionItem>['onChange']
    onSelect?: (ids: number[]) => void
    selected?: number[]
    selectable?: boolean
    transactions: Transaction[]
}

export const TransactionsTable: FunctionComponent<Props> = (props) => {
    const router = useRouter();
    const {handleSelectAll, handleSelectOne, selectAllRef} = useSelection({
        all: props.transactions,
        onSelectionChange: props.onSelect,
        selected: props.selected
    });

    return (
        <>
            {props.selectable && (
                <NavContainer>
                    <span style={{paddingLeft: '1.5em'}}>{'\u21B1 With selected, update:'}</span>
                    <TransactionsBulkEditDescription
                        ids={props.selected}
                        onUpdate={router.reload}
                    />
                </NavContainer>
            )}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>
                            {props.selectable && (
                                <input
                                    onChange={handleSelectAll}
                                    ref={selectAllRef}
                                    type={'checkbox'}
                                />
                            )}
                            {'Description'}
                        </th>
                        <th>{'From Account'}</th>
                        <th>{'To Account'}</th>
                        <th>{'Date'}</th>
                        <th>{'Tags'}</th>
                        <th style={{textAlign: 'right'}}>{'Amount'}</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {(props.transactions || []).map((transaction: Transaction) => (
                        <TransactionItem
                            isSelected={props.selected?.includes(transaction.id)}
                            key={transaction.id}
                            onChange={props.onChange}
                            onSelect={handleSelectOne}
                            selectable={props.selectable}
                            transaction={transaction}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
};
