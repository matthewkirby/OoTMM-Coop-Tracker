import { Box, Stack } from "@mui/material";
import { LocationsFormat, SettingsFormat } from "../types/dataTypes"
import Checklist from "./Checklist";
import styles from "../css/Tracker.module.css";

interface TrackerProps {
  trackerLayout: LocationsFormat;
  settingsState: SettingsFormat;
}

const Tracker: React.FC<TrackerProps> = ({ trackerLayout }) => {

  const boxSx = {
    flexGrow: 1,
    width: "calc(50%-1px)",
    overflowY: 'auto',
    minWidth: "500px",
    scrollbarWidth: "thin",
    scrollbarColor: "#22a7f0 #313131"
  };

  return (
    <div className={styles.tracker}>
      <Stack direction="row" sx={{width: "100%"}}>
        <Box sx={boxSx}>
          <Checklist
            game="oot"
            locations={trackerLayout}
          />
        </Box>
        <Box sx={boxSx}>
          <Checklist
            game="mm"
            locations={trackerLayout}
          />
        </Box>
      </Stack>
    </div>
  );
};

export default Tracker;