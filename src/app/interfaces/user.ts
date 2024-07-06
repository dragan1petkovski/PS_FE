export interface iUser{
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    username: string,
    password: string,
    createdate: string,
    updatedate: string
}

export interface iPartUser{
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

export interface iTeamClientPar
{
    teamid: string,
    clientid: string
}