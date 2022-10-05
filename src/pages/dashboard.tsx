import {FunctionComponent} from 'react';
import {Layout} from '../components/layout';
import {authenticated} from '../services/auth/server-side-auth';
import {PageProps} from '../types/page';

const Dashboard: FunctionComponent = () => (
    <Layout>
        {'Dashboard'}
    </Layout>
);

export default Dashboard;

export const getServerSideProps = authenticated<PageProps>(async () => ({
    props: {
        title: 'Dashboard'
    }
}));
