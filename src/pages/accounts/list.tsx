import Link from 'next/link';
import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {AccountsList} from '../../components/accounts/accounts-list';
import {Layout} from '../../components/layout';
import {NavContainer} from '../../components/nav-container';
import {authenticated, getSessionUser} from '../../services/auth/server-side-auth';
import {getAccounts} from '../../services/database/accounts';
import {SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {WithAccounts} from '../../types/accounts';
import {PageProps} from '../../types/page';

type Props = {
    fallback: {
        [k in SwrKeys['accounts']]: WithAccounts
    }
}

const List: FunctionComponent<Props> = ({fallback}) => {
    return (
        <Layout>
            <NavContainer>
                <Link href={'add'}>{'Add new'}</Link>
            </NavContainer>
            <SWRConfig value={{fallback}}>
                <AccountsList/>
            </SWRConfig>
        </Layout>
    );
};

export default List;

export const getServerSideProps = authenticated<PageProps<Props>>(async (context) => {
    const user = await getSessionUser(context);
    const accounts = await getAccounts(user);

    return {
        props: {
            fallback: {
                [swrKeys.accounts]: {accounts}
            },
            title: 'Accounts'
        }
    };
});
