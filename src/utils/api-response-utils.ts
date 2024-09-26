export interface ApiResponseInterface {
    message?: string;
    status?: boolean;
    data?: any;
}

class ApiResponse {
    private status: number;
    private data?: any;

    constructor(data: any, status: number) {
        this.status = 200;
        this.data = data;

        this.formattedData();
    }

    private formattedData() {
        return {
            status: this.status,
            data: this.data,
        };
    }
}

export default ApiResponse;
