import { iClient } from "./Client";
import { iTeam } from "./Team";
import { iUser } from "./user";

export interface iAdminTableData{
    clients: iClient[],
    users: iUser[],
    teams: iTeam[]
}