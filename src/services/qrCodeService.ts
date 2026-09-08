import api from "../lib/api";
import { ICreateQrCode, IQrCode } from "../types/qrCode";

export async function createQrCode(
  data: ICreateQrCode
): Promise<IQrCode> {
  const response = await api.post<IQrCode>(
    "/QrCodes",
    data
  );

  return response.data;
}

export async function getQrCodes(): Promise<IQrCode[]> {
  const response = await api.get<IQrCode[]>(
    "/QrCodes"
  );

  return response.data;
}