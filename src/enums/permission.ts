export interface PERMISSION {
    action: ACTION[];
    module: PERMISSION_MODULE;
}

export enum ACTION {
    READ = 'READ',
    WRITE = 'WRITE',
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
    ALL = 'ALL',
}

export enum PERMISSION_MODULE {
    DASHBOARD = 'DASHBOARD',
    USERS = 'USERS',
    PROPERTIES = 'PROPERTIES',
    BUY = 'BUY',
    SALE = 'SALE',
    RENT = 'RENT',
    SETTINGS = 'SETTINGS',
}

const ALL_PERMISSION = [
    ACTION.READ,
    ACTION.WRITE,
    ACTION.DELETE,
    ACTION.UPDATE,
];

export const permissionList = [
    {
        module: PERMISSION_MODULE.DASHBOARD,
        action: [ACTION.READ],
        page: '/',
    },
    {
        module: PERMISSION_MODULE.SETTINGS,
        action: ALL_PERMISSION,
        page: 'settings',
    },
    {
        module: PERMISSION_MODULE.USERS,
        action: ALL_PERMISSION,
        page: 'users',
    },
    {
        module: PERMISSION_MODULE.PROPERTIES,
        action: ALL_PERMISSION,
        page: 'properties',
    },
    {
        module: PERMISSION_MODULE.BUY,
        action: ALL_PERMISSION,
        page: 'buy',
    },
    {
        module: PERMISSION_MODULE.SALE,
        action: ALL_PERMISSION,
        page: 'sale',
    },
    {
        module: PERMISSION_MODULE.RENT,
        action: ALL_PERMISSION,
        page: 'rent',
    },
];
