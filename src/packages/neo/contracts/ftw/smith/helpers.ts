import { ApplicationLogJson } from "@cityofzion/neon-core/lib/rpc";
import { base64ToHash160 } from "../../../utils";

export const getTokenContractHashNotifications = (
  json: ApplicationLogJson
): string => {
  let contractHash;
  console.log(json);
  try {
    json.executions[0].notifications.forEach((log) => {
      if (log.eventname === "TokenCreated" && log.state.value) {
        contractHash = base64ToHash160(log.state.value[0].value);
      }
    });
  } catch (e) {
    throw Error("Can't find contract hash from the txid.");
  }
  if (contractHash) {
    return contractHash;
  } else {
    throw Error("Can't find contract hash from the txid.");
  }
};
