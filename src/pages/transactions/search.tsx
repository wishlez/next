import Link from 'next/link';
import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {Layout} from '../../components/layout';
import {NavContainer} from '../../components/nav-container';
import {TransactionsSearch} from '../../components/transactions/transactions-search';
import {authenticated, getSessionUser} from '../../services/auth/server-side-auth';
import {getAccounts} from '../../services/database/accounts';
import {getTags} from '../../services/database/tags';
import {getTransactions} from '../../services/database/transactions';
import {SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {PageProps} from '../../types/page';
import {WithTags} from '../../types/tags';
import {Transaction, TransactionQuery, WithTransactions} from '../../types/transactions';

type Props = {
    fallback:
        { [k in SwrKeys['accounts']]: WithAccounts } &
        { [k in SwrKeys['transactions']]: WithTransactions } &
        { [k in SwrKeys['tags']]: WithTags }
}

const Search: FunctionComponent<Props> = ({fallback}) => {
    return (
        <Layout>
            <NavContainer>
                <Link href={'list'}>{'View list'}</Link>
            </NavContainer>
            <SWRConfig value={{fallback}}>
                <TransactionsSearch/>
            </SWRConfig>
        </Layout>
    );
};

export default Search;

export const getServerSideProps = authenticated<PageProps<Props>>(async (context) => {
    const user = await getSessionUser(context);
    const query: TransactionQuery = context.query;
    const accounts = await getAccounts(user);
    const tags = await getTags(user);
    let transactions: Transaction[];

    if ([query.description, query.year, query.month, query.tagId, query.accountId].some((value) => value)) {
        transactions = await getTransactions(user, query);
    } else {
        transactions = [];
    }

    return {
        props: {
            fallback: {
                [swrKeys.accounts]: {accounts},
                [swrKeys.transactions]: {transactions},
                [swrKeys.tags]: {tags}
            },
            title: 'Transactions'
        }
    };
});
