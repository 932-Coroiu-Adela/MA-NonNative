export type Entity = {
    id: number;
    date: string;
    amount: number;
    type: string;
    category: string;
    description: string;
}

export type EntityState = {
    entityList: Entity[];
}

