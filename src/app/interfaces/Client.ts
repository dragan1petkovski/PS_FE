export interface iClient {
    id: string,
    name: string,
    createdate: Date | null,
    updatedate: Date | null
}

export interface iPostClient{
    name: string | null | undefined
}