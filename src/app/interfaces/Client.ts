export interface iClient {
    id: string,
    name: string,
    createdate: Date,
    updatedate: Date
}

export interface iPostClient{
    name: string | null | undefined
}