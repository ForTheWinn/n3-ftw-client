import neo3Dapi from "neo3-dapi";

export const initO3 = async () => {
  const instance = neo3Dapi;
  const account = await instance.getAccount();
  // const network = await instance.getNetworks();
  return {
    instance,
    account,
  };
};
