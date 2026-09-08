import api from "../lib/api";
import { Theme } from "../types/theme";

export async function getThemes(): Promise<Theme[]> {
  const response = await api.get<Theme[]>("/Themes");

  return response.data;
}