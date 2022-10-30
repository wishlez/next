import Link from 'next/link';
import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {Layout} from '../../components/layout';
import {NavContainer} from '../../components/nav-container';
import {TransactionsSearch} from '../../components/transactions/transactions-search';
import {authenticated, getSessionUser} from '../../services/auth/server-side-auth';
import {getAccounts} from '../../services/database/accounts';
import {getTags} from '../../services/database/tags';
import {SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {PageProps} from '../../types/page';
import {WithTags} from '../../types/tags';

type Props = {
    fallback:
        { [k in SwrKeys['accounts']]: WithAccounts } &
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
    const accounts = await getAccounts(user);
    const tags = await getTags(user);

    return {
        props: {
            fallback: {
                [swrKeys.accounts]: {accounts},
                [swrKeys.tags]: {tags}
            },
            title: 'Transactions'
        }
    };
});
