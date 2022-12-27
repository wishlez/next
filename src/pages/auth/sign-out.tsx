import {Button, ButtonGroup} from '@wishlez/ui';
import {getCsrfToken} from 'next-auth/react';
import {useRouter} from 'next/router';
import {FunctionComponent} from 'react';
import {authenticated} from '../../services/auth/server-side-auth';

type Props = {
    csrfToken: string
}

const SignOut: FunctionComponent<Props> = ({csrfToken}) => {
    const router = useRouter();

    return (
        <>
            {'You are about to sign out.'}
            <form
                action={'/api/auth/signout'}
                method={'post'}
            >
                <input
                    name={'csrfToken'}
                    required
                    type={'hidden'}
                    value={csrfToken}
                />
                <ButtonGroup>
                    <Button onClick={(): void => router.back()}>
                        {'Go back'}
                    </Button>
                    <Button
                        shade={'primary'}
                        type={'submit'}
                    >
                        {'Continue'}
                    </Button>
                </ButtonGroup>
            </form>
        </>
    );
};

export default SignOut;

export const getServerSideProps = authenticated<Props>(async (context) => {
    const csrfToken = await getCsrfToken(context);

    return {
        props: {
            csrfToken,
            title: 'Sign Out'
        }
    };
});
