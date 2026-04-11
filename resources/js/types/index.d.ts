export interface User {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    role: "admin" | "pengguna" | "pengajar";
    npwp?: string;
    address?: string;
    institution?: string;
    max_class?: number;
    last_login_at?: string;
    last_logout_at?: string;
    email_verified_at?: string;
    access_rights?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
