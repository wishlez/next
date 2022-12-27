import {NextRouter, useRouter} from 'next/router';
import {getAdjustedOptions} from '../services/utils/options';
import {Query, QueryValue, WithQuery} from '../types/query';

type BuildQuery = (query: Query) => WithQuery
type GetQuery = <T extends QueryValue>(queryName: string, fallback?: T) => T;
type PushQuery = (query: Query, shallow?: boolean) => Promise<void>;
type ReplaceQuery = (query: Query, shallow?: boolean) => Promise<void>;
type UpdateQuery = (query: Query) => Promise<void>;

type UseRouterQuery = () => {
    buildQuery: BuildQuery
    getQuery: GetQuery
    pushQuery: PushQuery
    replaceQuery: ReplaceQuery
    router: NextRouter
    updateQuery: UpdateQuery
};

const needUpdate = (existing: Query, updated: Query): boolean =>
    !Object.entries(updated).every(([key, value]) => {
        if (Array.isArray(value)) {
            const {added, deleted} = getAdjustedOptions([].concat(existing[key] || []), value.map(String));

            return !Boolean(added.length || deleted.length);
        }

        return existing[key] === value.toString();
    });

export const useRouterQuery: UseRouterQuery = () => {
    const router = useRouter();

    const getQuery: GetQuery = <T extends QueryValue>(queryName: string, fallback?: T): T => {
        const param = router.query[queryName];
        const value = typeof fallback === 'number' ? Number(param) : param;

        return value as T || fallback;
    };

    const buildQuery: BuildQuery = (query) => ({
        query: {
            ...router.query,
            ...query
        }
    });

    const pushQuery: PushQuery = async (query, shallow) => {
        await router.push({
            pathname: router.pathname,
            ...buildQuery(query)
        }, undefined, {
            shallow
        });
    };

    const replaceQuery: PushQuery = async (query, shallow) => {
        await router.replace({
            pathname: router.pathname,
            ...buildQuery(query)
        }, undefined, {
            shallow
        });
    };

    const updateQuery: UpdateQuery = async (query) => {
        const needsUpdate = needUpdate(router.query, query);

        if (needsUpdate) {
            await replaceQuery(query, true);
        }
    };

    return {
        buildQuery,
        getQuery,
        pushQuery,
        replaceQuery,
        router,
        updateQuery
    };
};
