import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {Layout} from '../../components/layout';
import {TransactionCreate} from '../../components/transactions/transaction-create';
import {authenticated, getSessionUser} from '../../services/auth/server-side-auth';
import {getAccounts} from '../../services/database/accounts';
import {getTags} from '../../services/database/tags';
import {getTransactions} from '../../services/database/transactions';
import {SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {PageProps} from '../../types/page';

type Props = {
    fallback: { [k in SwrKeys['accounts']]: WithAccounts }
}

const Add: FunctionComponent<Props> = ({fallback}) => {
    return (
        <Layout>
            <SWRConfig value={{fallback}}>
                <TransactionCreate/>
            </SWRConfig>
        </Layout>
    );
};

export default Add;

export const getServerSideProps = authenticated<PageProps<Props>>(async (context) => {
    const user = await getSessionUser(context);
    const accounts = await getAccounts(user);
    const tags = await getTags(user);
    const transactions = await getTransactions(user);

    return ({
        props: {
            fallback: {
                [swrKeys.accounts]: {accounts},
                [swrKeys.tags]: {tags},
                [swrKeys.transactions]: {transactions}
            },
            title: 'Add new transaction'
        }
    });
});
