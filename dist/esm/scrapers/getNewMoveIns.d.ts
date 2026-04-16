export declare function waitForNewMoveInsTable(): Promise<void>;
export declare function getNewMembersAfterPerson(allMembers: MemberInfo[], name: string, moveInDate: string): MemberInfo[];
export type MemberInfo = {
    name?: string;
    moveInDate?: string;
};
export declare function getNewMembers(): MemberInfo[];
export declare function toCsv(data: MemberInfo[]): string;
