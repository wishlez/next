import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/react';
import {Auth} from '../../types/auth';

const defaultServerSideProps: GetServerSideProps<any, any, any> = async () => ({
    props: {}
});

const auth: Auth = (shouldRedirect, getRedirect) => (getServerSideProps = defaultServerSideProps) => async (context) => {
    const session = await getSession({req: context.req});

    if (shouldRedirect(session)) {
        return {
            redirect: getRedirect(context)
        };
    }

    const serverSideProps = await getServerSideProps(context);
    const props = 'props' in serverSideProps ? serverSideProps.props : {};

    return {
        ...serverSideProps,
        props: {
            ...props,
            session
        }
    } as any;
};

export const authenticated = auth(
    (session) => !Boolean(session),
    () => ({
        destination: '/auth/sign-in',
        permanent: false
    })
);

export const unauthenticated = auth(
    (session) => Boolean(session),
    () => ({
        destination: '/dashboard',
        permanent: false
    })
);
