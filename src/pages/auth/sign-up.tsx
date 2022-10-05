import Link from 'next/link';
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
            <div>
                <Link href={'/auth/sign-in'}>
                    {'Sign In'}
                </Link>
                <button type={'submit'}>
                    {'Sign Up'}
                </button>
            </div>
        </form>
    );
};

export default SignUp;

export const getServerSideProps = unauthenticated<PageProps>(async () => ({
    props: {
        title: 'Sign Up'
    }
}));
