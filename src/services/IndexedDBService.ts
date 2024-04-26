export class IndexedDBService {
    private static instance: IDBRequest | null = null;

    public static getInstance(): IDBRequest {
        if (!IndexedDBService.instance) {
            IndexedDBService.instance = indexedDB.open('superiorDb', 1);
        }
        return IndexedDBService.instance;
    }
}