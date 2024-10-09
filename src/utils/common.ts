import { Role } from "src/schema/role.schema"

export const AGENCY_OWNER = "66f66549a0298ee1b1e94c42";

export function constructAgencyOwnerRole() {
    return {
        name: 'Owner',
        permissions: [{
            module: "DASHBOARD",
            action: [
                "READ", "WRITE", "DELETE", "UPDATE"
            ]
        },
        {
            module: "SETTINGS",
            action: [
                "READ", "WRITE", "DELETE", "UPDATE"
            ]
        }]
    }
}
