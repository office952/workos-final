import { SessionedApp } from "../../runtime/SessionedApp";
import { Ui20Shell } from "../shell/Ui20Shell";
import { Ui20Routes } from "./Ui20Routes";

export function Ui20App() {
  return (
    <SessionedApp>
      <Ui20Shell>
        <Ui20Routes />
      </Ui20Shell>
    </SessionedApp>
  );
}
