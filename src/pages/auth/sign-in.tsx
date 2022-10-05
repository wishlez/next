import {getCsrfToken} from 'next-auth/react';
import Link from 'next/link';
import {FunctionComponent} from 'react';
import {unauthenticated} from '../../services/auth/server-side-auth';
import {PageProps} from '../../types/page';

type Props = PageProps<{
    csrfToken: string
}>

const SignIn: FunctionComponent<Props> = ({csrfToken}) => (
    <form
        action={'/api/auth/callback/credentials'}
        method={'post'}
    >
        <input
            name={'csrfToken'}
            required
            type={'hidden'}
            value={csrfToken}
        />
        <label>
            {'Username: '}
            <input
                name={'login'}
                required
                type={'text'}
            />
        </label>
        <label>
            {'Password: '}
            <input
                name={'password'}
                required
                type={'password'}
            />
        </label>
        <div>
            <Link href={'/auth/sign-up'}>
                {'Sign Up'}
            </Link>
            <button type={'submit'}>
                {'Sign In'}
            </button>
        </div>
    </form>
);

export default SignIn;

export const getServerSideProps = unauthenticated<Props>(async (context) => {
    const csrfToken = await getCsrfToken(context);

    return {
        props: {
            csrfToken,
            title: 'Sign In'
        }
    };
});
