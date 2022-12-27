import {Button, ButtonGroup, Link} from '@wishlez/ui';
import {getCsrfToken} from 'next-auth/react';
import NextLink from 'next/link';
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
        <ButtonGroup>
            <NextLink href={'/auth/sign-up'}>
                <Button as={Link}>
                    {'Sign Up'}
                </Button>
            </NextLink>
            <Button
                shade={'primary'}
                type={'submit'}
            >
                {'Sign In'}
            </Button>
        </ButtonGroup>
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
