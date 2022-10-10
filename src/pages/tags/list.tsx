import {FunctionComponent} from 'react';
import {SWRConfig} from 'swr';
import {Layout} from '../../components/layout';
import {TagsList} from '../../components/tags/tags-list';
import {authenticated, getSessionUser} from '../../services/auth/server-side-auth';
import {getTags} from '../../services/database/tags';
import {SwrKeys, swrKeys} from '../../services/utils/swr-keys';
import {PageProps} from '../../types/page';
import {WithTags} from '../../types/tags';

type Props = {
    fallback: {
        [k in SwrKeys['tags']]: WithTags
    }
}

const List: FunctionComponent<Props> = ({fallback}) => {
    return (
        <Layout>
            <SWRConfig value={{fallback}}>
                <TagsList/>
            </SWRConfig>
        </Layout>
    );
};

export default List;

export const getServerSideProps = authenticated<PageProps<Props>>(async (context) => {
    const user = await getSessionUser(context);
    const tags = await getTags(user);

    return {
        props: {
            fallback: {
                [swrKeys.tags]: {tags}
            },
            title: 'Tags'
        }
    };
});
