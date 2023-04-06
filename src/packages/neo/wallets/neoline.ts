import { BaseDapi } from "@neongd/neo-dapi";

export const initNeoLine = async () => {
  try {
    // @ts-ignore
    const instance = new NEOLineN3.Init();
    // @ts-ignore
    // NEOLineN3 doesn't have getNetworks function
    const instance2 = new NEOLine.Init();
    const network = await instance2.getNetworks();
    const account = await instance.getAccount();
    return {
      instance,
      account,
      network
    };
  } catch (e) {
    throw new Error("Failed to connect NeoLine.");
  }
};

export const initNeoLineMobile = async () => {
  try {
    // @ts-ignore
    const instance = new BaseDapi(window.NeoLineMobile);
    const network = await instance.getNetworks();
    const account = await instance.getAccount();
    return {
      instance,
      account,
      network
    };
  } catch (e) {
    throw new Error("Failed to connect NeoLine Mobile.");
  }
};
