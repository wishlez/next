import {NextApiResponse} from 'next';
import {authenticatedApi, authorizedApi} from '../../../services/auth/server-side-auth';
import {createTag, deleteTag, getTag, getTags, updateTag} from '../../../services/database/tags';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {badRequest, forbidden, internalServerError, notFound} from '../../../services/utils/handle-error';
import {Tag, TagRequest, WithTags} from '../../../types/tags';

export default authenticatedApi((user) => buildApiHandler({
    async delete(req, res: NextApiResponse<Record<string, never>>) {
        const id = Number(req.query.id);

        if (isNaN(id)) {
            return badRequest(res);
        }

        const tag = await getTag(id);

        if (!tag) {
            return notFound(res);
        }

        if (!await authorizedApi(req, tag.userId)) {
            return forbidden(res);
        }

        try {
            await deleteTag(id);

            return res.send({});
        } catch (err) {
            return internalServerError(res, err, 'Failed to delete tag');
        }
    },
    async get(req, res: NextApiResponse<WithTags>) {
        try {
            const tags = await getTags(user);

            return res.send({
                tags
            });
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve tags');
        }
    },
    async post(req, res: NextApiResponse<Tag>) {
        try {
            const tagRequest: TagRequest = req.body;

            return res.send(await createTag({
                name: tagRequest.name,
                userId: user.id
            }));
        } catch (err) {
            return internalServerError(res, err, 'Failed to create tag');
        }
    },
    async put(req, res: NextApiResponse<Tag>) {
        const tag = await getTag(req.body.id);

        if (!tag) {
            return notFound(res);
        }

        if (!await authorizedApi(req, tag.userId)) {
            return forbidden(res);
        }

        try {
            const tagRequest: TagRequest = req.body;

            return res.send(await updateTag({
                id: tagRequest.id,
                name: tagRequest.name
            }));
        } catch (err) {
            return internalServerError(res, err, 'Failed to update tag');
        }
    }
}));
