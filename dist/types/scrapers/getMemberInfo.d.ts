type MemberInfo = {
    name?: string;
    profileLink?: string;
    gender?: string;
    birthDate?: string;
    address?: string;
};
export declare function getMemberInfo(): Promise<MemberInfo[]>;
export {};
