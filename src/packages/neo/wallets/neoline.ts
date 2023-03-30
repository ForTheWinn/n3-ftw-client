export const initNeoLine = async () => {
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
    network,
  };
};
