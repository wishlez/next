import {ButtonGroup, Icon, IconButton, Link, Table} from '@wishlez/ui';
import NextLink from 'next/link';
import {FunctionComponent} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {doDelete, doGet} from '../../services/utils/fetch';
import {swrKeys} from '../../services/utils/swr-keys';
import {Account, WithAccounts} from '../../types/accounts';
import {AccountBalance} from './account-balance';

const canShowBalance = (account: Account): boolean => !account.builtIn && account.accountType !== 'Revenue';

export const AccountsList: FunctionComponent = () => {
    const {data, error} = useSWR<WithAccounts>(swrKeys.accounts, doGet);
    const {mutate} = useSWRConfig();

    const handleDelete = async (account: Account): Promise<void> => {
        const canDelete = confirm(`Do you want to delete ${account.name}?`);

        if (canDelete) {
            await doDelete(swrKeys.accounts, {id: account.id.toString()});
            await mutate(swrKeys.accounts);
        }
    };

    return (
        <>
            {error && 'Failed to load accounts'}
            <Table<Account>
                columns={[
                    {
                        colId: 'name',
                        fillTable: true,
                        label: 'Name',
                        renderRow: (account: Account) => (
                            <>
                                <b>{account.name}</b>
                                {' ('}
                                <i>{account.accountType}</i>
                                {')'}
                            </>
                        )
                    },
                    {
                        colId: 'balance',
                        contentAlign: 'right',
                        label: 'Balance',
                        renderRow: (account: Account) => canShowBalance(account) ? <AccountBalance {...account}/> : null
                    },
                    {
                        colId: 'actions',
                        label: ' ',
                        renderRow: (account: Account) => account.builtIn ? (
                            <Icon name={'lock'}/>
                        ) : (
                            <ButtonGroup>
                                <NextLink href={`edit?id=${account.id}`}>
                                    <IconButton
                                        as={Link}
                                        iconName={'edit'}
                                    />
                                </NextLink>
                                <IconButton
                                    iconName={'delete'}
                                    onClick={(): Promise<void> => handleDelete(account)}
                                />
                            </ButtonGroup>
                        )
                    }
                ]}
                items={data?.accounts || []}
            />
        </>
    );
};
