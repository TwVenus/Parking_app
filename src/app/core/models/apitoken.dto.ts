export interface ApiToken {
    access_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
    expire_time: Date;
}
