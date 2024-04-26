import { PlayerSettings } from "../game/Domain/PlayerSettings";

export class UserDataStorage {

    readonly dataIndentifier:string = 'superiorData';

    upsertLocal(settings:PlayerSettings) {
        const jsonString = JSON.stringify(settings);

        localStorage.setItem(this.dataIndentifier, jsonString);
    }

    readLocal() {
        const jsonString = localStorage.getItem(this.dataIndentifier);
        if (jsonString) {
            
            const userData:PlayerSettings = JSON.parse(jsonString?.toString());
            
            return userData;
        }
        return null;
    }


}