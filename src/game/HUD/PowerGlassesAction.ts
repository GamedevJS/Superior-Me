import { PlayerSettings } from "../Domain/PlayerSettings";
import { PlayerHability } from "./PlayerHability";

/**
 * NOT IN USE YET
 */
export class PowerGlassesAction extends PlayerHability
{
    playerSettings:PlayerSettings;
    enemySettings:PlayerSettings;
    /**
     *
     */
    constructor(playerSettings:PlayerSettings, enemySettings:PlayerSettings) {
        super();
        this.playerSettings = playerSettings;
        this.enemySettings = enemySettings;
    }

    ExecuteAction(): void {
        throw new Error("Method not implemented.");
    }
    
}