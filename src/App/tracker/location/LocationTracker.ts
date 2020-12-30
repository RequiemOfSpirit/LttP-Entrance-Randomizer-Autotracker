import { Location, EntranceLocation } from "../../../common/locations";
import { LocationTrackerConfig } from "../../../common/types/config.types";
import { AppErrorType, CustomAppError } from "../../../common/types/errors.types";
import { WorldType, EntranceLink, LocationLink } from "../../../common/types/locations.types";
import { DoesEntranceLinkExistMethodSignature } from "../../../redux/selectors";

import { AppErrorTypePriorities } from "../../../common/errors";

interface LocationTrackerUtilityMethods {
  getLocationById: (locationId: string) => EntranceLocation;
  getLocationsOnScreen: (worldType: WorldType, screenIndex: number) => Array<string>;
  doesEntranceLinkExist: DoesEntranceLinkExistMethodSignature;
}

interface LocationTrackerConstructorParams {
  utilityMethods: LocationTrackerUtilityMethods;
  config: LocationTrackerConfig;
}

export class LocationTracker {
  utilityMethods: LocationTrackerUtilityMethods;
  config: LocationTrackerConfig;

  constructor(params: LocationTrackerConstructorParams) {
    this.utilityMethods = params.utilityMethods;
    this.config = params.config;
  }

  /**
   * Backups are provided to this method because sometimes when reading data from the
   *   USB2SNES server, incorrect values are returned. The next read seems to give correct results.
   * See the comment in the `AppState` interface in `src/App/index.ts` for more details.
   */
  processLocationLink(locationLink: LocationLink, backupLocations: LocationLink): EntranceLink | null {
    // No change in world type
    if (!this.hasWorldTypeChanged(locationLink.source, locationLink.destination)) {
      return null;
    }

    let startLocation: EntranceLocation = this.getEntranceLocationWrapper(
      locationLink.source,
      backupLocations.source
    );
    let endLocation: EntranceLocation = this.getEntranceLocationWrapper(
      locationLink.destination,
      backupLocations.destination
    );

    // Entrance Link already exists
    if (this.utilityMethods.doesEntranceLinkExist(startLocation.id, endLocation.id)) {
      return null;
    }

    return {
      source: startLocation,
      destination: endLocation
    };
  }

  private hasWorldTypeChanged(source: Location, destination: Location): boolean {
    return source.worldType !== destination.worldType;
  }

  /**
   * Wrapper method around `this.getEntranceLocation` that accepts backup locations and handles errors
   */
  private getEntranceLocationWrapper(location: Location, backupLocation: Location): EntranceLocation {
    let mainLocationError: CustomAppError, backupLocationError : CustomAppError;

    try {
      return this.getEntranceLocation(location);
    } catch (error1) {
      mainLocationError = error1;

      try {
        return this.getEntranceLocation(backupLocation);
      } catch (error2) {
        backupLocationError = error2;
      }
    }

    // Both attempts to determine the entrance location failed
    if (mainLocationError.priority >= backupLocationError.priority) {
      throw mainLocationError;
    }

    throw backupLocationError;
  }

  // TODO (BACKLOG): Handle boss room warps, title screen starts etc.
  private getEntranceLocation(currentLocation: Location): EntranceLocation {
    const locationsOnScreen = this.utilityMethods.getLocationsOnScreen(
      currentLocation.worldType,
      currentLocation.screenIndex
    );

    if (locationsOnScreen === undefined) {
      const error: CustomAppError = {
        name: AppErrorType.INVALID_SCREEN_INDEX,
        priority: AppErrorTypePriorities[AppErrorType.INVALID_SCREEN_INDEX],
        message: `Incorrect Location screenIndex received: ${JSON.stringify(currentLocation)}`
      };
      throw error;
    }

    let currentX = currentLocation.coordinates.x;
    let currentY = currentLocation.coordinates.y;

    try {
      for (let locationId of locationsOnScreen) {
        const location = this.utilityMethods.getLocationById(locationId);
        // TODO (BACKLOG): Move collision check to another method?
        if (
          Math.abs(location.coordinates.x - currentX) < this.config.entranceTriggerWidth &&
          Math.abs(location.coordinates.y - currentY) < this.config.entranceTriggerHeight
        ) {
          return location;
        }
      }
    } catch (error) {
      /**
       * This error should not occur.
       * This error would only occur if the locationId in the loop above is not valid
       *   which would cause an NPE when looking for `location.coordinates.x`
       */
      console.warn(
        error, "\n",
        "Discrepency between `getLocationsOnScreen` and `getLocationById` helper methods", "\n",
        "Current Location:", currentLocation
      );
    }

    // EntranceLocation was not found
    const error: CustomAppError = {
      name: AppErrorType.ENTRANCE_LOCATION_NOT_FOUND,
      priority: AppErrorTypePriorities[AppErrorType.ENTRANCE_LOCATION_NOT_FOUND],
      message: `Location provided does not exist on the specified screen: ${JSON.stringify(currentLocation)}`
    };
    throw error;
  }
}
