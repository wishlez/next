import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {Layout} from '../../components/layout';
import {TransactionUpdate} from '../../components/transactions/transaction-update';
import {authenticated, getSessionUser} from '../../services/auth/server-side-auth';
import {getAccounts} from '../../services/database/accounts';
import {getTags} from '../../services/database/tags';
import {getTransaction} from '../../services/database/transactions';
import {Parameterized, SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {PageProps} from '../../types/page';
import {WithTags} from '../../types/tags';
import {WithTransaction} from '../../types/transactions';

type Props = {
    fallback:
        { [k in Parameterized<SwrKeys['transactions']>]: WithTransaction } &
        { [k in SwrKeys['accounts']]: WithAccounts } &
        { [k in SwrKeys['tags']]: WithTags }
}

const Edit: FunctionComponent<Props> = ({fallback}) => {
    return (
        <Layout>
            <SWRConfig value={{fallback, revalidateOnMount: true}}>
                <TransactionUpdate/>
            </SWRConfig>
        </Layout>
    );
};

export default Edit;

export const getServerSideProps = authenticated<PageProps<Props>>(async (context) => {
    const id = Number(context.query.id);
    const transaction = await getTransaction(id);
    const user = await getSessionUser(context);
    const accounts = await getAccounts(user);
    const tags = await getTags(user);

    return ({
        props: {
            fallback: {
                [`${swrKeys.transactions}/${id}`]: {transaction},
                [swrKeys.accounts]: {accounts},
                [swrKeys.tags]: {tags}
            },
            title: `Edit #${transaction.id}`
        }
    });
});
