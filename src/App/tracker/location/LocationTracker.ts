import { Location, EntranceLocation } from "../../../common/locations";
import { LocationTrackerConfig } from "../../../common/types/config.types";
import { AppErrorType, CustomAppError } from "../../../common/types/errors.types";
import { WorldType, EntranceLink, LocationLink, Coordinates, Dimensions } from "../../../common/types/locations.types";
import { EntranceLocationId } from "../../../common/types/mapData.types";
import { DoesEntranceLinkExistMethodSignature } from "../../../redux/selectors";

import { AppErrorTypePriorities } from "../../../common/errors";

interface LocationTrackerUtilityMethods {
  getLocationById: (locationId: EntranceLocationId) => EntranceLocation;
  getLocationsOnScreen: (worldType: WorldType, screenIndex: number) => Array<EntranceLocationId>;
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

  private getEntranceLocation(currentLocation: Location): EntranceLocation {
    const locationsOnScreen = this.utilityMethods.getLocationsOnScreen(
      currentLocation.worldType,
      currentLocation.screenIndex
    );

    for (let locationId of locationsOnScreen) {
      const screenLocation: EntranceLocation = this.utilityMethods.getLocationById(locationId);
      if (this.doCoordinatesCollide(
        currentLocation.coordinates,
        screenLocation.coordinates,
        this.config.entranceTriggerSize
      )) {
        return screenLocation;
      }
    }

    // EntranceLocation was not found
    // TODO (BACKLOG): Handle boss room warps, title screen starts etc.
    const error: CustomAppError = {
      name: AppErrorType.ENTRANCE_LOCATION_NOT_FOUND,
      priority: AppErrorTypePriorities[AppErrorType.ENTRANCE_LOCATION_NOT_FOUND],
      message: `Location provided does not exist on the specified screen: ${JSON.stringify(currentLocation)}`
    };
    throw error;
  }

  /**
   * Collision detection method for one set of 2D coordinates and a 2D target box.
   * Returns true if the current coordinates lie within the target.
   * Returns false otherwise.
   */
  private doCoordinatesCollide(
    currentCoordinates: Coordinates,
    targetCoordinates: Coordinates,
    targetDimensions: Dimensions
  ): boolean {
    if (
      Math.abs(targetCoordinates.x - currentCoordinates.x) < targetDimensions.width &&
      Math.abs(targetCoordinates.y - currentCoordinates.y) < targetDimensions.height
    ) {
      return true;
    }

    return false;
  }
}
