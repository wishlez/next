import {FunctionComponent} from 'react';
import {authenticated} from '../services/auth/server-side-auth';
import {PageProps} from '../types/page';

const Dashboard: FunctionComponent = () => (
    <>
        {'Dashboard'}
    </>
);

export default Dashboard;

export const getServerSideProps = authenticated<PageProps>(async () => ({
    props: {
        title: 'Dashboard'
    }
}));
