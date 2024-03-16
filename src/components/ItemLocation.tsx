import { CheckFormat } from "../types/dataTypes";
import styles from "../css/ItemLocation.module.css";
import { useContext } from "react";
import { TrackerStateContext } from "../App";
import { firebaseSetValue } from "../scripts/firebase";

interface ItemLocationProps {
  check: CheckFormat;
}

const ItemLocation: React.FC<ItemLocationProps> = ({ check }) => {

  const trackerState = useContext(TrackerStateContext);
  const isDone = trackerState[check.checkId] ?? false;

  const classNames = [
    styles.location,
    isDone ? styles.checkDone : ""
  ].join(' ');

  return (
    <div
      className={classNames}
      onClick={() => {
        firebaseSetValue(check.checkId, !isDone, trackerState);
      }}
    >
      {check.name}
    </div>
  )
}

export default ItemLocation;