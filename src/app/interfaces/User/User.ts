import { iClientTeamMapping, iTeamClientPar } from "../Team/Team";

export interface iGetUserForAdminPage{
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    username: string,
    rolename: string | null,
    createdate: string,
    updatedate: string
}

export interface iGetUserForTeamModal{
    id: string,
    fullname: string,
    username: string
}

export interface iPostUser
{
    firstname: string | null | undefined,
    lastname: string | null | undefined,
    email: string | null | undefined,
    username: string | null | undefined,
    clientTeamPairs: iTeamClientPar[] | null | undefined
}

export interface iPostAdmin
{
    firstname: string,
    lastname: string,
    email: string,
    username: string
}

export interface iPostUpdateUser
{
    id: string | null | undefined,
    firstname: string | null | undefined,
    lastname: string | null | undefined,
    email: string | null | undefined,
    username: string | null | undefined,
    clientTeamPairs: iTeamClientPar[] | null | undefined
}


export interface iUpdateUser
{
    id: string,
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    clientTeamMapping: iClientTeamMapping[]

}