import { sc } from "@cityofzion/neon-core";

export interface INotification {
  contract: string;
  eventName: string;
  state: sc.StackItem;
}
