import { iClientTeamMapping } from "./Team"
export interface iPostGiveCredential
{
    domain: string | null | undefined,
    username: string | null | undefined,
    password: string | null | undefined,
    email: string | null | undefined,
    remote: string | null | undefined,
    note: string | null | undefined,
    teamids: string[] | null | undefined,
    userids: string[] | null | undefined
}