/**
 * Takes the backend representation of availabilities, and returns
 * our internal representation.
 */
import { SYNCABLE } from '../constants/videoStatusTypes';

// TODO: as the "WHERE" of availabilities is not yet supported, we default it to BE (belgium).
export function transformAvailabilitiesFromApi (availabilities) {
  // console.log('GET', availabilities[0]);
  // No availabilities set (i.e. anywhere anytime availability)?
  if (availabilities.length !== 1) {
    return {
      availabilityFrom: null,
      availabilityTo: null,
      availabilityPlatforms: [],
      availabilityPlannedToMakeInteractive: true,
      availabilityVideoStatusType: SYNCABLE
    };
  }

  // We have exactly one rule.
  const startTimeStamp = availabilities[0].startTimeStamp;
  const endTimeStamp = availabilities[0].endTimeStamp;
  return {
    availabilityFrom: startTimeStamp && new Date(startTimeStamp),
    availabilityTo: endTimeStamp && new Date(endTimeStamp),
    availabilityPlatforms: availabilities[0].platforms ? availabilities[0].platforms.map(({ uuid }) => uuid) : [],
    availabilityPlannedToMakeInteractive: availabilities[0].plannedToMakeInteractive,
    availabilityVideoStatusType: availabilities[0].videoStatus
  };
}
