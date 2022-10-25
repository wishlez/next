import {NextApiResponse} from 'next';
import {authenticatedApi} from '../../../services/auth/server-side-auth';
import {createAccount, deleteAccount, getAccount, getAccounts, updateAccount} from '../../../services/database/accounts';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {badRequest, forbidden, internalServerError, notFound} from '../../../services/utils/handle-error';
import {Account, AccountRequest, WithAccounts} from '../../../types/accounts';

export default authenticatedApi((user) => buildApiHandler({
    async delete(req, res: NextApiResponse<Record<string, never>>) {
        const id = Number(req.query.id);

        if (isNaN(id)) {
            return badRequest(res);
        }

        const account = await getAccount(id);

        if (!account) {
            return notFound(res);
        }

        if (user.id !== account.userId) {
            return forbidden(res);
        }

        try {
            await deleteAccount(id);

            return res.send({});
        } catch (err) {
            return internalServerError(res, err, 'Failed to delete account');
        }
    },
    async get(req, res: NextApiResponse<WithAccounts>) {
        try {
            const accounts = await getAccounts(user);

            return res.send({
                accounts
            });
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve accounts');
        }
    },
    async post(req, res: NextApiResponse<Account>) {
        try {
            const accountRequest: AccountRequest = req.body;

            return res.send(await createAccount({
                accountType: accountRequest.accountType,
                builtIn: false,
                maximumAmountOwed: accountRequest.maximumAmountOwed,
                name: accountRequest.name,
                openingBalance: accountRequest.openingBalance,
                userId: user.id
            }));
        } catch (err) {
            return internalServerError(res, err, 'Failed to create account');
        }
    },
    async put(req, res: NextApiResponse<Account>) {
        const account = await getAccount(req.body.id);

        if (!account) {
            return notFound(res);
        }

        if (user.id !== account.userId) {
            return forbidden(res);
        }

        try {
            const accountRequest: AccountRequest = req.body;

            return res.send(await updateAccount({
                accountType: accountRequest.accountType,
                id: accountRequest.id,
                maximumAmountOwed: accountRequest.maximumAmountOwed,
                name: accountRequest.name,
                openingBalance: accountRequest.openingBalance
            }));
        } catch (err) {
            return internalServerError(res, err, 'Failed to update account');
        }
    }
}));
