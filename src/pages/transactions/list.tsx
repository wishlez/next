import Link from 'next/link';
import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {TransactionsList} from '../../components/transactions/transactions-list';
import {Layout} from '../../components/layout';
import {NavContainer} from '../../components/nav-container';
import {authenticated, getSessionUser} from '../../services/auth/server-side-auth';
import {getTransactions} from '../../services/database/transactions';
import {SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {WithTransactions} from '../../types/transactions';
import {PageProps} from '../../types/page';

type Props = {
    fallback: {
        [k in SwrKeys['transactions']]: WithTransactions
    }
}

const List: FunctionComponent<Props> = ({fallback}) => {
    return (
        <Layout>
            <NavContainer>
                <Link href={'add'}>{'Add new'}</Link>
            </NavContainer>
            <SWRConfig value={{fallback}}>
                <TransactionsList/>
            </SWRConfig>
        </Layout>
    );
};

export default List;

export const getServerSideProps = authenticated<PageProps<Props>>(async (context) => {
    const user = await getSessionUser(context);
    const transactions = await getTransactions(user);

    return {
        props: {
            fallback: {
                [swrKeys.transactions]: {transactions}
            },
            title: 'Transactions'
        }
    };
});
