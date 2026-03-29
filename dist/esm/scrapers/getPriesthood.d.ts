type PriesthoodInfo = {
    name: string;
    priesthood: string;
};
export declare function getPriesthood(): PriesthoodInfo[];
export declare function toCsv(data: PriesthoodInfo[]): string;
export {};
