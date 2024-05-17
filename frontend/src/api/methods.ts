export const postData = async (axiosInstance: any, endpoint: string, data: any, headers: any) => {
    try{
        return await axiosInstance.post(endpoint, data, {headers});
    } catch (error) {
        throw error;    
    }
}

export const getData = async (axiosInstance: any, endpoint: string, headers: any) => {
    try{
        return await axiosInstance.get(endpoint, {headers: headers});
    } catch (error) {
        throw error;
    }
}

export const putData = async (axiosInstance: any, endpoint: string, data: any, headers: any) => {
    try{
        return await axiosInstance.put(endpoint, data, {headers});
    } catch (error) {
        throw error;
    }
}

export const deleteData = async (axiosInstance: any, endpoint: string, headers: any) => {
    try{
        return await axiosInstance.delete(endpoint, {headers});
    } catch (error) {
        throw error;
    }
}
