import { Location, WorldType, EntranceLinks } from "../../common/locations";
import { LocationTrackerConfig } from "../../common/config";

type TrackLocationDataParam = {
  source: { current: Location, backup: Location | null },
  destination: { current: Location, backup: Location | null }
}
type TrackLocationReturnValue = { source: string; destination: string; } | null;

interface LocationTrackerUtilityMethods {
  getLocationById: Function;
  getLocationsOnScreen: Function;
  doesEntranceLinkExist: Function;
}

interface UtilityFunctionsUpdateType {
  doesEntranceLinkExist?: Function;
}

interface LocationTrackerConstructorParams {
  utilityMethods: LocationTrackerUtilityMethods;
  config: LocationTrackerConfig;
}

export class LocationTracker {
  coupledEntrances: boolean;
  utilityMethods: LocationTrackerUtilityMethods;
  config: LocationTrackerConfig;

  constructor(params: LocationTrackerConstructorParams) {
    // TODO: Push to config/settings
    this.coupledEntrances = true;
    this.utilityMethods = params.utilityMethods;
    this.config = params.config;
  }

  getNewEntranceLinks(locations: Array<Location>): EntranceLinks {
    let newEntranceLinks: EntranceLinks = {};

    for (let i = 1; i < locations.length; i++) {
      let destinationLocation = locations[i];
      let sourceLocation = locations[i - 1];

      if (destinationLocation.worldType === sourceLocation.worldType) {
        // Nothing to track
        continue;
      }

      // Assign backups
      let sourceBackup = null, destinationBackup = null;
      if (i !== 1) {
        sourceBackup = locations[i - 2];
      }
      if (i !== locations.length - 1) {
        destinationBackup = locations[i + 1];
      }

      // Get connection data
      let entranceConnectionData = this.getEntranceLink(
        {
          source: {
            current: sourceLocation,
            backup: sourceBackup
          },
          destination: {
            current: destinationLocation,
            backup: destinationBackup
          }
        },
        Object.assign({}, newEntranceLinks)
      );

      if (entranceConnectionData === null) {
        // No new data
        continue;
      }

      // TODO: Stop coupling entrances here
      newEntranceLinks[entranceConnectionData.source] = entranceConnectionData.destination;
      if (this.coupledEntrances) {
        newEntranceLinks[entranceConnectionData.destination] = entranceConnectionData.source;
      }
    }

    return newEntranceLinks;
  }

  updateUtilityFunctions(updatedFunctions: UtilityFunctionsUpdateType): void {
    this.utilityMethods = {
      ...this.utilityMethods,
      ...updatedFunctions
    };
  }

  /**
   * Backups are provided to this method because sometimes when reading data from the
   *   USB2SNES server, incorrect values are returned. The next read seems to give correct results.
   * Having backups during a `getEntranceLink` call may cause locations to get processed twice
   *   but can prevent data from being lost.
   */
  private getEntranceLink(locationData: TrackLocationDataParam, currentEntranceLinks: EntranceLinks): TrackLocationReturnValue {
    let startLocationId = this.getLocation(locationData.source.current);
    if (startLocationId === "" && locationData.source.backup !== null) {
      startLocationId = this.getLocation(locationData.source.backup);
    }

    let endLocationId = this.getLocation(locationData.destination.current);
    if (endLocationId === "" && locationData.destination.backup !== null) {
      endLocationId = this.getLocation(locationData.destination.backup);
    }

    if (startLocationId === "" || endLocationId === "") {
      // TODO (BACKLOG): Be more specific. Handle boss room warps and title screen starts.
      console.warn("Unable to determine EntranceLink");
      return null;
    }

    if (this.utilityMethods.doesEntranceLinkExist(startLocationId, endLocationId, currentEntranceLinks)) {
      return null;
    }

    return {
      source: startLocationId,
      destination: endLocationId
    };
  }

  private getLocation(currentLocation: Location): string {
    let worldType: WorldType, screenIndex: number;

    if (currentLocation.worldType === WorldType.OVERWORLD) {
      worldType = WorldType.OVERWORLD;
      screenIndex = currentLocation.overworldIndex;
    } else {
      worldType = WorldType.UNDERWORLD;
      screenIndex = currentLocation.underworldIndex;
    }

    const locationsOnScreen = this.utilityMethods.getLocationsOnScreen(worldType, screenIndex);
    let requiredLocationId = "";

    if (locationsOnScreen === undefined) {
      console.warn("Incorrect Location received:", currentLocation);
      return requiredLocationId;
    }

    let currentX = currentLocation.coordinates.x;
    let currentY = currentLocation.coordinates.y;

    try {
      for (let locationId of locationsOnScreen) {
        const location = this.utilityMethods.getLocationById(locationId);
        if (
          Math.abs(location.coordinates.x - currentX) < this.config.entranceTriggerWidth &&
          Math.abs(location.coordinates.y - currentY) < this.config.entranceTriggerHeight
        ) {
          requiredLocationId = locationId;
          break;
        }
      }
    } catch (error) {
      console.log(currentLocation);
      console.warn(error);
    }

    return requiredLocationId;
  }
}
