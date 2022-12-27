import {Button} from '@wishlez/ui';
import {signIn, useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {FunctionComponent, useEffect} from 'react';
import {unauthenticated} from '../services/auth/server-side-auth';
import {PageProps} from '../types/page';

const Home: FunctionComponent<PageProps> = () => {
    const {status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [router, status]);

    return (
        <>
            {'Welcome! '}
            <Button onClick={(): Promise<any> => signIn()}>{'Sign In'}</Button>
            {' to continue...'}
        </>
    );
};

export default Home;

export const getServerSideProps = unauthenticated<PageProps>(async () => ({
    props: {
        title: 'Dashboard'
    }
}));
