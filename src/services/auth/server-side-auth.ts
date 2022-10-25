import {GetServerSideProps, GetServerSidePropsContext, NextApiHandler, NextApiRequest} from 'next';
import {getSession} from 'next-auth/react';
import {Auth} from '../../types/auth';
import {User} from '../../types/users';
import {unauthorized} from '../utils/handle-error';

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

export const getSessionUser = async (context: GetServerSidePropsContext | { req: NextApiRequest }): Promise<User> => {
    const session = await getSession(context);

    return session?.user as User;
};

export const authenticatedApi = (handler: (user: User) => NextApiHandler): NextApiHandler => async (req, res, ...rest) => {
    const user = await getSessionUser({req});

    if (user) {
        return handler(user)(req, res, ...rest);
    }

    return unauthorized(res);
};
