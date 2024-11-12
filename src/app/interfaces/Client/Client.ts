export interface iGetClientsForAdminPage {
    id: string,
    name: string,
    createdate: Date,
    updatedate: Date
}

export interface iGetClientsForUser
{
    id: string,
    name: string
}

export interface iPostClient{
    name: string;
}