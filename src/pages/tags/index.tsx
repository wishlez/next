import {GetServerSideProps} from 'next';
import {FunctionComponent} from 'react';

const Tags: FunctionComponent = () => null;

export default Tags;

export const getServerSideProps: GetServerSideProps = async () => ({
    redirect: {
        destination: '/tags/list',
        permanent: true
    }
});
