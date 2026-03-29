export declare function getNewMembersAfterPerson(allMembers: MemberInfo[]): MemberInfo[];
type MemberInfo = {
    name?: string;
    moveInDate?: string;
};
export declare function getNewMembers(): MemberInfo[];
export declare function toCsv(data: MemberInfo[]): string;
export {};
