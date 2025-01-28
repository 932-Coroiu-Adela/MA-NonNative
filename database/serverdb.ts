import { Entity } from "@/redux/features/entity/entity"
import { SERVER_IP, SERVER_PORT } from "@/constants/Constants"
import axios, { Axios, AxiosResponse } from "axios"
import { TempEntity } from "./localdb";

export const insertEntityServer = async (entity: Entity) => {
    console.log(`Inserting entity ${entity}`);
    const response: AxiosResponse<Entity> = await axios.post(`http://${SERVER_IP}:${SERVER_PORT}/transaction`, entity);
    if (response.status === 201) {
        return response.data;
    }
    throw new Error("Failed to insert entity");
}

export const getEntitiesServer = async () => {
    const response: AxiosResponse<Entity[]> = await axios.get(`http://${SERVER_IP}:${SERVER_PORT}/transactions`);
    if (response.status === 200) {
        return response.data;
    }
    throw new Error("Failed to fetch entities");
}

export const editEntityServer = async (entity: Entity) => {
    console.log(`Editing entity ${entity}`);
    const response: AxiosResponse<Entity> = await axios.put(`http://${SERVER_IP}:${SERVER_PORT}/vehicle/${entity.id}`, entity);
    if (response.status === 200) {
        return response.data;
    }
    throw new Error("Failed to edit entity");
}

export const deleteEntityServer = async (id: number) => {
    console.log(`Deleting entity with id ${id}`);
    const response: AxiosResponse = await axios.delete(`http://${SERVER_IP}:${SERVER_PORT}/transaction/${id}`);
    if (response.status === 200) {
        return;
    }
    throw new Error("Failed to delete entity");
}

export const syncOfflineData = async (offlineData: TempEntity[]) => {
    const idCounts: Record<number, number> = offlineData.reduce((acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const filteredArray: TempEntity[] = offlineData.filter(item => idCounts[item.id] !== 2);

    const tasks = [];
    for (const item of filteredArray) {
        if (item.type === 1) {
            tasks.push(insertEntityServer(item.entity!));
        } else {
            tasks.push(deleteEntityServer(item.id));
        }
    }
    await Promise.all(tasks);
}