import {NextApiResponse} from 'next';
import {getAccountTypes} from '../../../services/database/account-types';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {internalServerError} from '../../../services/utils/handle-error';
import {WithAccountTypes} from '../../../types/account-types';

export default buildApiHandler({
    async get(req, res: NextApiResponse<WithAccountTypes>) {
        try {
            const accountTypes = await getAccountTypes();

            return res.send({
                accountTypes
            });
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve accounts');
        }
    }
});
