import { iGetClientsForAdminPage } from "../Client/Client";
import { iGetTeamForAdminPage } from "../Team/Team";
import { iGetUserForAdminPage } from "../User/User";

export interface iAdminTableData{
    clients: iGetClientsForAdminPage[],
    users: iGetUserForAdminPage[],
    teams: iGetTeamForAdminPage[]
}