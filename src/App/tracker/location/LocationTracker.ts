import {
  Location,
  NamedLocation,
  WorldType,
  LocationLinkWithBackups,
  NewEntranceLinkType
} from "../../../common/locations";
import { LocationTrackerConfigType } from "../../../common/config";
import { DoesEntranceLinkExistMethodSignature } from "../../../redux/selectors";

interface LocationTrackerUtilityMethods {
  getLocationById: (locationId: string) => NamedLocation;
  getLocationsOnScreen: (worldType: WorldType, screenIndex: number) => Array<string>;
  doesEntranceLinkExist: DoesEntranceLinkExistMethodSignature;
}

interface LocationTrackerConstructorParams {
  utilityMethods: LocationTrackerUtilityMethods;
  config: LocationTrackerConfigType;
}

export class LocationTracker {
  utilityMethods: LocationTrackerUtilityMethods;
  config: LocationTrackerConfigType;

  constructor(params: LocationTrackerConstructorParams) {
    this.utilityMethods = params.utilityMethods;
    this.config = params.config;
  }

  /**
   * Backups are provided to this method because sometimes when reading data from the
   *   USB2SNES server, incorrect values are returned. The next read seems to give correct results.
   */
  processLocationLink(locationLink: LocationLinkWithBackups): NewEntranceLinkType {
    let entranceLink: NewEntranceLinkType = {
      source: "",
      destination: "",
      doesExist: false
    };

    // No change in world type
    if (!this.hasWorldTypeChanged(locationLink.previous.main, locationLink.next.main)) {
      return entranceLink;
    }

    let startLocationId = this.getLocation(locationLink.previous.main);
    if (startLocationId === "") {
      startLocationId = this.getLocation(locationLink.previous.backup);
    }

    let endLocationId = this.getLocation(locationLink.next.main);
    if (endLocationId === "") {
      endLocationId = this.getLocation(locationLink.next.backup);
    }

    // Unable to process location
    if (startLocationId === "" || endLocationId === "") {
      // TODO (BACKLOG): Be more specific. Handle boss room warps, title screen starts etc.
      console.warn("Unable to determine EntranceLink");
      return entranceLink;
    }

    // Entrance Link already exists
    if (this.utilityMethods.doesEntranceLinkExist(startLocationId, endLocationId)) {
      return entranceLink;
    }

    // Write new entrance link info
    entranceLink.source = startLocationId;
    entranceLink.destination = endLocationId;
    entranceLink.doesExist = true;

    return entranceLink;
  }

  private hasWorldTypeChanged(source: Location, destination: Location): boolean {
    return source.worldType !== destination.worldType;
  }

  private getLocation(currentLocation: Location): string {
    let worldType: WorldType, screenIndex: number;

    // TODO: Extend screenindex to the class varaibles as well and don't split ow and uw indices?
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
        // TODO (BACKLOG): Move collision check to another method?
        if (
          Math.abs(location.coordinates.x - currentX) < this.config.entranceTriggerWidth &&
          Math.abs(location.coordinates.y - currentY) < this.config.entranceTriggerHeight
        ) {
          requiredLocationId = locationId;
          break;
        }
      }
    } catch (error) {
      /**
       * This error should not occur.
       * This error would only occur if the locationId in the loop above is not valid
       */
      console.log(currentLocation);
      console.warn(error);
    }

    return requiredLocationId;
  }
}
