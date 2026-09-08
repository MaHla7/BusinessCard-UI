import api from "../lib/api";
import {
  BusinessCard,
  CreateBusinessCard,
} from "../types/businessCard";

export async function getBusinessCard(id: number): Promise<BusinessCard> {
  const response = await api.get<BusinessCard>(`/BusinessCards/${id}`);

  return response.data;
}



export async function createBusinessCard(data: CreateBusinessCard): Promise<number> {
  debugger
  const response = await api.post<{ id: number }>(
    "/BusinessCards",
    data
  );

  return response.data.id;
}

export async function uploadBusinessCardImage(id: number, file: File): Promise<void>{
  const formData = new FormData();
  formData.append("file", file);
  await api.post(`BusinessCards/${id}/image`, formData);
}