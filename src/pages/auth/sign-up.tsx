import {Button, ButtonGroup, Link} from '@wishlez/ui';
import NextLink from 'next/link';
import {FunctionComponent, useRef} from 'react';
import {unauthenticated} from '../../services/auth/server-side-auth';
import {PageProps} from '../../types/page';

const SignUp: FunctionComponent = () => {
    const passwordRef = useRef<HTMLInputElement>();
    const confirmRef = useRef<HTMLInputElement>();

    const handleConfirm = (): void => {
        if (passwordRef.current.value !== confirmRef.current.value) {
            confirmRef.current.setCustomValidity('Passwords do not match');
        } else {
            confirmRef.current.setCustomValidity('');
        }
    };

    return (
        <form
            action={'/api/auth/signup'}
            method={'post'}
        >
            <label>
                {'Name: '}
                <input
                    name={'name'}
                    required
                    type={'text'}
                />
            </label>
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
                    onInput={handleConfirm}
                    ref={passwordRef}
                    required
                    type={'password'}
                />
            </label>
            <label>
                {'Confirm Password: '}
                <input
                    name={'confirm'}
                    onInput={handleConfirm}
                    ref={confirmRef}
                    required
                    type={'password'}
                />
            </label>
            <ButtonGroup>
                <NextLink href={'/auth/sign-in'}>
                    <Button as={Link}>
                        {'Sign In'}
                    </Button>
                </NextLink>
                <Button
                    shade={'primary'}
                    type={'submit'}
                >
                    {'Sign Up'}
                </Button>
            </ButtonGroup>
        </form>
    );
};

export default SignUp;

export const getServerSideProps = unauthenticated<PageProps>(async () => ({
    props: {
        title: 'Sign Up'
    }
}));
