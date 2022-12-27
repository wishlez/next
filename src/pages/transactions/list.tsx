import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {Layout} from '../../components/layout';
import {NavContainer} from '../../components/nav-container';
import {NavLink} from '../../components/nav-link';
import {TransactionsList} from '../../components/transactions/transactions-list';
import {authenticated, getSessionUser} from '../../services/auth/server-side-auth';
import {getStartingDate} from '../../services/database/transactions';
import {SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {PageProps} from '../../types/page';
import {WithStartingDate} from '../../types/transactions';

type Props = {
    fallback: {
        [k in SwrKeys['startingDate']]: WithStartingDate
    }
}

const List: FunctionComponent<Props> = ({fallback}) => {
    return (
        <Layout>
            <NavContainer>
                <NavLink href={'add'}>{'Add new'}</NavLink>
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
    const startingDate = await getStartingDate(user, context.query);

    return {
        props: {
            fallback: {
                [swrKeys.startingDate]: {startingDate}
            },
            title: 'Transactions'
        }
    };
});
