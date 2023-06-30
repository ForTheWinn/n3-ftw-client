import React from "react";
import { useOnChainData } from "../../../../../../../common/hooks/use-onchain-data";
import { DaoContract } from "../../../../../../../packages/neo/contracts/ftw/dao";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { IConnectedWallet } from "../../../../../../../packages/neo/wallets/interfaces";
interface IUserVotesProps {
  contractHash: string;
  proposalNo: string;
  network: INetworkType;
  connectedWallet: IConnectedWallet;
  refresh: number;
  isVoteActive: boolean;
  voteOptions: string[];
  setTxid: (tx: string) => void;
}
const UserVotes = ({
  voteOptions,
  contractHash,
  proposalNo,
  network,
  connectedWallet,
  refresh,
  isVoteActive,
  setTxid
}: IUserVotesProps) => {
  const { isLoaded, error, data } = useOnChainData(() => {
    return new DaoContract(network).getUserVotes(
      connectedWallet,
      contractHash,
      proposalNo,
      "10",
      "1"
    );
  }, [refresh, network, connectedWallet]);

  const handleWithdrawUserVoteFunds = async () => {
    const res = await new DaoContract(network).withdrawVoteFund(
      connectedWallet,
      contractHash,
      proposalNo
    );
    setTxid(res);
  };

  let hasVoteToWithdraw = false;
  if (data) {
    data.items.forEach((i) => {
      if (!i.hasWithdrew) {
        hasVoteToWithdraw = true;
      }
    });
  }

  return (
    <div>
      {isLoaded ? (
        error ? (
          <div></div>
        ) : (
          <div>
            {data.items.length ? (
              <div className="box is-shadowless">
                <div className="table-container">
                  <h1 className="title is-7">
                    My votes{" "}
                    {data && <span className="tag">{data.totalItems}</span>}{" "}
                  </h1>
                  <table className="table is-bordered is-fullwidth">
                    {data.items.map((item, i) => (
                      <tr key={`myvote-${i}`}>
                        <td>{voteOptions[item.optionIndex]}</td>
                        <td>{item.amount}</td>
                        <td>{item.createdAt}</td>
                        <td>
                          {item.hasWithdrew ? (
                            <span>Ended</span>
                          ) : (
                            <span>Active</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </table>
                  <button
                    onClick={handleWithdrawUserVoteFunds}
                    disabled={isVoteActive || !hasVoteToWithdraw}
                    className="button is-primary"
                  >
                    Withdraw funds
                  </button>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserVotes;
