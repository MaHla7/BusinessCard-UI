export interface IQrCode{
    id: number;
    url: string;
    qrCode: string;
    createdAt: string;
}

export interface ICreateQrCode{
    url: string;
}