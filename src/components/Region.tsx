import { Accordion } from "@mui/material";
import { RegionFormat } from "../types/dataTypes";
import ItemLocation from "./ItemLocation";
import { AccordionSummary, AccordionDetails } from "./styled/Accordion";
import { useContext, useEffect, useState } from "react";
import { TrackerStateContext } from "../App";

interface RegionProps {
  regionName: string;
  regionData: RegionFormat;
}

const Region: React.FC<RegionProps> = ({ regionName, regionData }) => {
  const [nDone, setNDone] = useState<number>(0);
  const nChecks = regionData.nChecks;
  const trackerState = useContext(TrackerStateContext);

  useEffect(() => {
    let newNDone = 0;
    for (const check of regionData.checks) {
      newNDone += check.checkId in trackerState ? check.numChecks : 0;
    }
    setNDone(newNDone)
  }, [trackerState]);


  return (
    <Accordion disableGutters={true} >
      <AccordionSummary>
        {`${regionName} - ${nDone}/${nChecks}`}
      </AccordionSummary>
      <AccordionDetails>
        {regionData.checks.map((check, i) => (
          <ItemLocation key={i} check={check} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default Region;