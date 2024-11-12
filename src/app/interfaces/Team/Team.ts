import { iGetUserForTeamModal } from "../User/User"

export interface iGetTeamForAdminPage {
    id: string,
    name: string,
    clientid: string,
    clientname: string,
    createdate: Date,
    updatedate: Date
}

export interface iPostTeam
{
    name: string | null | undefined,
    clientid: string | null | undefined,
    userids: string[] | null | undefined
}

export interface iClientTeamMapping
{
    teamname: string,
    teamid: string,
    clientname: string,
    clientid: string
}

export interface iTeamClientPar
{
    teamid: string,
    clientid: string
}

export interface iGetUpdateTeam
{
    id: string,
    name: string,
    users: iGetUserForTeamModal[]
}

export interface iPostUpdateTeam
{
    Id: string,
    name: string,
    userIds: string[] | null
}