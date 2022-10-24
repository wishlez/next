import {useRouter} from 'next/router';
import {Query, QueryValue, WithQuery} from '../types/query-value';

type BuildQuery = (query: Query) => WithQuery
type GetQuery = <T extends QueryValue>(queryName: string, fallback?: T) => T;
type PushQuery = (query: Query, shallow?: boolean) => Promise<void>;
type UpdateDuery = (query: Query) => Promise<void>;

type UseRouterQuery = () => {
    buildQuery: BuildQuery
    getQuery: GetQuery
    pushQuery: PushQuery
    updateQuery: UpdateDuery
};

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

    const updateQuery: UpdateDuery = async (query) => {
        const existingKeys = Object.keys(router.query);
        const needsUpdate = !Object.keys(query).every((key) => existingKeys.includes(key));

        if (needsUpdate) {
            await pushQuery(query, true);
        }
    };

    return {
        buildQuery,
        getQuery,
        pushQuery,
        updateQuery
    };
};
