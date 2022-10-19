import {GetServerSideProps} from 'next';
import {FunctionComponent} from 'react';

const Transactions: FunctionComponent = () => null;

export default Transactions;

export const getServerSideProps: GetServerSideProps = async () => ({
    redirect: {
        destination: '/transactions/list',
        permanent: true
    }
});
