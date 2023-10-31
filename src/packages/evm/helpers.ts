export const getReadContractConfig = ({
  chainId,
  contractAddress,
  abi,
  args,
  functionName,
}) => {
  return {
    abi,
    address: contractAddress,
    chainId,
    args,
    functionName,
  };
};
