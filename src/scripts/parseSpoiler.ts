import { CheckFormat, LocationsFormat, SettingsFormat, TrackerSetupData } from "../types/dataTypes";

interface FullLocationsFormat {
  [region: string]: { [itemLocation: string]: string };
}


async function loadSpoilerFile(path: string) {
  const response = await fetch(path);
  return response.text();
}


/**
 * Extract the settings data from the spoiler log in json format
 * @param {string[]} lines OoTMM Spoiler Log as a string split in \n characters
 * @returns {SettingsFormat} Settings data as an object
 */
const extractSettingsObject = (lines: string[]): SettingsFormat => {
  const settings: SettingsFormat = {};
  const settingsStart = lines.findIndex((line) => line === "Settings");
  if (settingsStart < 1) {
    console.error("Settings block not found in spoiler log!");
    return settings;
  }

  for (let i=settingsStart+1; i<lines.length; i++) {
    if (lines[i] === "") break;
    const [setting, value] = lines[i].split(":").map(part => part.trim());
    settings[setting] = value;
  }

  return settings;
};


/**
 * Extract the full locations data from the spoiler log in json format
 * @param {string[]} lines OoTMM spoiler log as a string split on \n characters
 * @returns {FullLocationsFormat} Location data as a json object
 */
const extractFullLocationObject = (lines: string[]): FullLocationsFormat => {
  const locations: FullLocationsFormat = {};
  const locationStart = lines.findIndex((line) => line.startsWith("Location List"));
  if (locationStart < 1) {
    console.error("Location List block not found in spoiler log!");
    return locations;
  }

  let currentRegion = "noRegionSelected";
  for (const line of lines.slice(locationStart+1)) {
    if (line === "") {
      continue;
    } else if (line.startsWith("    ")) {
      const [loc, item] = line.split(":").map(part => part.trim());
      locations[currentRegion][loc] = item;
    } else if (line.startsWith("  ")) {
      currentRegion = line.split("(")[0].trim();
      if (!(currentRegion in locations)) {
        locations[currentRegion] = {};
      }
    }
  }

  return locations;
};


const sortLocationList = (unsorted: LocationsFormat): LocationsFormat => {
  const sortedLocations = Object.keys(unsorted).sort().reduce(
    (accumulatedObject, key) => {
      accumulatedObject[key] = unsorted[key];
      return accumulatedObject;
    }, {} as LocationsFormat
  );
  return sortedLocations;
}


const summarizeLocationList = (fullLocationList: FullLocationsFormat): LocationsFormat => {
  const locations: LocationsFormat = {};

  let checkId = -1;
  Object.entries(fullLocationList).forEach(([region, fullCheckList]) => {
    // Collect checks with similar names, such as each of the grasses in a grass patch
    const regionCheckList: {[check: string]: string[]} = {};
    Object.entries(fullCheckList).forEach(([rawCheckName, reward]) => {
      let checkName = rawCheckName.replace(/^OOT|^MM/, '').trim();
      checkName = checkName.replace(region, '').trim();
      checkName = checkName.replace(/\d+$/, '');
      if (checkName in regionCheckList) {
        regionCheckList[checkName].push(reward);
      } else {
        regionCheckList[checkName] = [reward];
      }
    });

    // use regionCheckList to build the region's list of checks
    const regionEntry = {
      game: Object.keys(fullCheckList)[0].toLowerCase().startsWith("oot") ? "oot" : "mm" as "oot" | "mm",
      nChecks: Object.keys(fullCheckList).length,
      checks: Object.entries(regionCheckList).map(([checkName, rewards]) => {
        const numChecks = rewards.length;
        const name = numChecks > 1 ? `${numChecks} ${checkName}` : checkName;
        checkId += 1;
        return {
          name: name,
          checkId: checkId,
          numChecks: rewards.length,
          rewards: rewards
        } as CheckFormat;
      })
    };

    locations[region] = regionEntry;
  });

  const sortedLocations = sortLocationList(locations);

  return sortedLocations;
};


/**
 * Take the spoiler data as a big string and convert it to a js object with the required data
 * @param {string} rawFile - The file data loaded as a multiline string
 * @returns {TrackerSetupData} The parsed data with settings and locations
 */
async function parseSpoiler(rawFile: string): Promise<TrackerSetupData | null> {
  // If no spoiler is given, we are testing, use the example file.
  if (rawFile === "")
    rawFile = await loadSpoilerFile("OoTMM-Spoiler-Aim6vgTU.txt");
  const lines = rawFile.split("\n");

  // Extract relevant info from the log in a more useful format
  const seedSummary:TrackerSetupData = { settings: {}, locations: {}};
  seedSummary.settings = extractSettingsObject(lines);
  const fullLocations = extractFullLocationObject(lines);
  seedSummary.locations = summarizeLocationList(fullLocations);

  return seedSummary;
}


export { parseSpoiler };