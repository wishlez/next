import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {AccountCreate} from '../../components/accounts/account-create';
import {Layout} from '../../components/layout';
import {authenticated} from '../../services/auth/server-side-auth';
import {getAccountTypes} from '../../services/database/account-types';
import {SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {WithAccountTypes} from '../../types/account-types';
import {PageProps} from '../../types/page';

type Props = {
    fallback: { [k in SwrKeys['accountTypes']]: WithAccountTypes }
}

const Add: FunctionComponent<Props> = ({fallback}) => {
    return (
        <Layout>
            <SWRConfig value={{fallback}}>
                <AccountCreate/>
            </SWRConfig>
        </Layout>
    );
};

export default Add;

export const getServerSideProps = authenticated<PageProps<Props>>(async () => {
    const accountTypes = await getAccountTypes();

    return ({
        props: {
            fallback: {
                [swrKeys.accountTypes]: {accountTypes}
            },
            title: 'Add new account'
        }
    });
});
