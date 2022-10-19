import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {AccountUpdate} from '../../components/accounts/account-update';
import {Layout} from '../../components/layout';
import {authenticated} from '../../services/auth/server-side-auth';
import {getAccountTypes} from '../../services/database/account-types';
import {getAccount} from '../../services/database/accounts';
import {Parameterized, SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {WithAccountTypes} from '../../types/account-types';
import {WithAccount} from '../../types/accounts';
import {PageProps} from '../../types/page';

type Props = {
    fallback:
        { [k in Parameterized<SwrKeys['accounts']>]: WithAccount } &
        { [k in SwrKeys['accountTypes']]: WithAccountTypes }
}

const Edit: FunctionComponent<Props> = ({fallback}) => {
    return (
        <Layout>
            <SWRConfig value={{fallback, revalidateOnMount: true}}>
                <AccountUpdate/>
            </SWRConfig>
        </Layout>
    );
};

export default Edit;

export const getServerSideProps = authenticated<PageProps<Props>>(async (context) => {
    const id = Number(context.query.id);
    const account = await getAccount(id);
    const accountTypes = await getAccountTypes();

    return ({
        props: {
            fallback: {
                [`${swrKeys.accounts}/${id}`]: {account},
                [swrKeys.accountTypes]: {accountTypes}
            },
            title: 'Add new account'
        }
    });
});
