import each_ from 'lodash/each';
import map_ from 'lodash/map';
import reduce_ from 'lodash/reduce';
import sortBy_ from 'lodash/sortBy';
import values_ from 'lodash/values';

import {HttpProxiesState, ProxyInfo, RoleGroup} from '../../store/reducers/system/proxies';

// @ts-expect-error
export function extractRpcProxy(data: FIX_ME) {
    return map_(data, (value, key) => {
        return {
            name: key,
            role: value.$attributes?.role,
            state: value.$value?.alive || value?.alive ? 'online' : 'offline',
            effectiveState: value.$value?.alive || value?.alive ? 'online' : 'offline',
        } as unknown;
    });
}

export function extractRoleGroups(proxies: Array<ProxyInfo>): Array<RoleGroup> {
    const roleGroups = reduce_(
        proxies,
        (roles, proxy) => {
            const roleName = proxy.role || 'default';
            let role = roles[roleName];
            if (!role) {
                role = roles[roleName] = {
                    total: 0,
                    items: [],
                    name: roleName,
                };
            }

            role.total++;
            role.items.push(proxy);

            return roles;
        },
        {} as Record<string, RoleGroup>,
    );

    const roles = values_(roleGroups);

    return sortBy_(roles, 'name');
}

function incrementKeyCounter<K extends string>(counters: Record<K, number>, key: K) {
    counters[key] = counters[key] ?? 0;
    ++counters[key];
}

export function extractProxyCounters(proxies: Array<ProxyInfo>) {
    const counters: HttpProxiesState['counters'] = {
        total: proxies.length,
        states: {},
        effectiveStates: {},
    };

    each_(proxies, (proxy) => {
        incrementKeyCounter(counters.states, proxy.state);
        incrementKeyCounter(counters.effectiveStates, proxy.effectiveState);
    });

    return counters;
}