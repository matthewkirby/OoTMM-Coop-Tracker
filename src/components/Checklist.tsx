import { LocationsFormat } from "../types/dataTypes";
import Region from "./Region";


interface ChecklistProps {
  game: "oot" | "mm"
  locations: LocationsFormat;
}


const Checklist: React.FC<ChecklistProps> = ({ game, locations }) => {
  const regionList = Object.keys(locations);

  return(
    <div className="">
      {regionList.map((region) => {
        if (locations[region].game === game) {
          return (
            <Region
              key={region}
              regionName={region}
              regionData={locations[region]}
            />
          );
        } else {
          return "";
        }
      })}
    </div>
  );
};


export default Checklist;