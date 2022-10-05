import NextAuth, {NextAuthOptions} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {getUser} from '../../../services/users';

const options: NextAuthOptions = {
    pages: {
        signIn: '/auth/sign-in',
        signOut: '/auth/sign-out'
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                return await getUser(credentials);
            },
            credentials: {
                login: {label: 'Username', type: 'text'},
                password: {label: 'Password', type: 'password'}
            },
            name: 'Credentials'
        })
    ],
    secret: process.env.JWT_SECRET
};

export default NextAuth(options);
