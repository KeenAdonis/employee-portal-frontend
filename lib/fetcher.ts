import api from "@/services/api";

export const fetcher = async <T = any>(url: string): Promise<T> => {
    const res = await api.get(url);
    return res.data;
};