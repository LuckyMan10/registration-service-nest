export interface UserData<T> {
    accessToken: string;
    refreshToken: string;
    user: T;
}