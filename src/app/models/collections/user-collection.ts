export interface UserCollection {
    id: string;
    publishedat: Date | null;
    name: string;
    emIds: string[];
    thumbnail: string | null;
}
