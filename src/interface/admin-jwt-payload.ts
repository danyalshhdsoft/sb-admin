export interface AdminJWTPayload {
    id: string;
    sub?: string;
    username: string;
    fullname: string;
    email: string;
    role: string;
}
