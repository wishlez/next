import {Amount, ButtonGroup, FlexContainer, IconButton, InputCheckbox, Link, Table} from '@wishlez/ui';
import NextLink from 'next/link';
import {FunctionComponent} from 'react';
import {doDelete} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Transaction} from '../../types/transactions';
import {useSelection} from '../use-selection';
import {TransactionsBulkEditControls} from './transactions-bulk-edit-controls';

type Props = {
    onChange: () => void
    onSelect?: (ids: number[]) => void
    selected?: number[]
    selectable?: boolean
    transactions: Transaction[]
}

export const TransactionsTable: FunctionComponent<Props> = (props) => {
    const {handleSelectAll, handleSelectOne, selectAllRef} = useSelection({
        all: props.transactions,
        onSelectionChange: props.onSelect,
        selected: props.selected
    });

    const handleDelete = async (transaction: Transaction): Promise<void> => {
        const canDelete = confirm(`Do you want to delete ${transaction.description}?`);

        if (canDelete) {
            await doDelete(swrKeys.transactions, {id: transaction.id.toString()});
            await props.onChange();
        }
    };

    // console.log(selectAllRef.current.indeterminate, selectAllRef.current.checked);

    return (
        <>
            {props.selectable && (
                <TransactionsBulkEditControls
                    ids={props.selected}
                    onUpdate={props.onChange}
                />
            )}
            <Table<Transaction>
                columns={[
                    {
                        colId: 'description',
                        fillTable: true,
                        label: (
                            <FlexContainer>
                                {props.selectable && (
                                    <InputCheckbox
                                        label={''}
                                        onChange={handleSelectAll}
                                        ref={selectAllRef}
                                    />
                                )}
                                {'Description'}
                            </FlexContainer>
                        ),
                        renderRow: (transaction: Transaction) => (
                            <FlexContainer>
                                {props.selectable && (
                                    <InputCheckbox
                                        checked={props.selected?.includes(transaction.id)}
                                        label={''}
                                        name={'id'}
                                        onChange={handleSelectOne}
                                        value={transaction.id}
                                    />
                                )}
                                <b>{transaction.description}</b>
                            </FlexContainer>
                        )
                    },
                    {
                        colId: 'amount',
                        contentAlign: 'right',
                        label: 'Amount',
                        renderRow: (transaction: Transaction) => <Amount amount={transaction.amount}/>
                    },
                    {
                        colId: 'date',
                        label: 'Date',
                        rowKey: 'date'
                    },
                    {
                        colId: 'fromAccount',
                        label: 'From Account',
                        renderRow: (transaction: Transaction) => transaction.FromAccount.name
                    },
                    {
                        colId: 'toAccount',
                        label: 'To Account',
                        renderRow: (transaction: Transaction) => transaction.ToAccount.name
                    },
                    {
                        colId: 'tags',
                        label: 'To Account',
                        renderRow: (transaction: Transaction) => transaction.TransactionTag.map(({Tag}) => Tag.name).join(', ')
                    },
                    {
                        colId: 'actions',
                        label: ' ',
                        renderRow: (transaction: Transaction) => (
                            <ButtonGroup>
                                <NextLink href={`edit?id=${transaction.id}`}>
                                    <IconButton
                                        as={Link}
                                        iconName={'edit'}
                                    />
                                </NextLink>
                                <IconButton
                                    iconName={'delete'}
                                    onClick={(): Promise<void> => handleDelete(transaction)}
                                />
                            </ButtonGroup>
                        )
                    }
                ]}
                items={props.transactions || []}
            />
        </>
    );
};
