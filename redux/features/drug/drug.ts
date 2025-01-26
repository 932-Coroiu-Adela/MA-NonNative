export type Drug = {
    id: number;
    name: string;
    category: string;
    price: number;
    numberOfUnits: number;
    manufacturer: string;
}

export type DrugState = {
    drugList: Drug[];
}

