export declare function getMemberInfo(): Promise<{
    name: string | undefined;
    profileLink: string | undefined;
    gender: string;
    birthDate: string;
    address: string;
}[]>;
