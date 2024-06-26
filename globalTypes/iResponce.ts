

export type StatusType = "success" | "info" | "warning" | "error";

export interface IResponse {
    status: "success" | "info" | "warning" | "error";
    display: boolean;
    error: object | null;
    message: string;
    devmessage: string;
    data: object | object[] | null;
}