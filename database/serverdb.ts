import { Drug } from "@/redux/features/drug/drug"
import { SERVER_IP, SERVER_PORT } from "@/constants/Constants"
import axios, { Axios, AxiosResponse } from "axios"
import { TempDrug } from "./localdb";

export const insertDrugServer = async (drug: Drug) => {
    console.log(`Inserting drug ${drug}`);
    const response: AxiosResponse<Drug> = await axios.post(`http://${SERVER_IP}:${SERVER_PORT}/drug`, drug);
    if (response.status === 201) {
        return response.data;
    }
    throw new Error("Failed to insert drug");
}

export const getDrugsServer = async () => {
    const response: AxiosResponse<Drug[]> = await axios.get(`http://${SERVER_IP}:${SERVER_PORT}/drug`);
    if (response.status === 200) {
        return response.data;
    }
    throw new Error("Failed to fetch drugs");
}

export const editDrugServer = async (drug: Drug) => {
    console.log(`Editing drug ${drug}`);
    const response: AxiosResponse<Drug> = await axios.put(`http://${SERVER_IP}:${SERVER_PORT}/drug?id=${drug.id}`, drug);
    if (response.status === 200) {
        return response.data;
    }
    throw new Error("Failed to edit drug");
}

export const deleteDrugServer = async (id: number) => {
    console.log(`Deleting drug with id ${id}`);
    const response: AxiosResponse = await axios.delete(`http://${SERVER_IP}:${SERVER_PORT}/drug?id=${id}`);
    if (response.status === 204) {
        return;
    }
    throw new Error("Failed to delete drug");
}

export const syncOfflineData = async (offlineData: TempDrug[]) => {
    const idCounts: Record<number, number> = offlineData.reduce((acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const filteredArray: TempDrug[] = offlineData.filter(item => idCounts[item.id] !== 2);

    const tasks = [];
    for (const item of filteredArray) {
        if (item.type === 1) {
            tasks.push(insertDrugServer(item.drug!));
        } else {
            tasks.push(deleteDrugServer(item.id));
        }
    }
    await Promise.all(tasks);
}