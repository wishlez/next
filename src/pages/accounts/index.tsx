import {GetServerSideProps} from 'next';
import {FunctionComponent} from 'react';

const Accounts: FunctionComponent = () => null;

export default Accounts;

export const getServerSideProps: GetServerSideProps = async () => ({
    redirect: {
        destination: '/accounts/list',
        permanent: true
    }
});
