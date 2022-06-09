import React, { useState } from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { DAO_CHANNEL_PATH } from "../../../../../../consts";
import { useWallet } from "../../../../../../packages/provider";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { DaoContract } from "../../../../../../packages/neo/contracts/ftw/dao";
import Modal from "../../../../../components/Modal";
import toast from "react-hot-toast";
import AfterTransactionSubmitted from "../../../../../../packages/ui/AfterTransactionSubmitted";
import VoteList from "./VoteList";
import VotingPeriod from "./components/VotingPeriod";
import VotingProgress from "./components/VotingProgress";
import VoteModal from "./components/VoteModal";
import UserVotes from "./components/UserVotes";

const ProposalView = () => {
  const params = useParams();
  const { contractHash, proposalNo } = params as any;
  const { network, connectedWallet } = useWallet();
  const [isVoteModalActive, setVoteModalActive] = useState(false);
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [vote, setVote] = useState({
    vote: "",
    voteIndex: "",
    amount: "",
  });

  const onVoteOptionClick = (op, i) => {
    setVote({
      vote: op,
      voteIndex: i,
      amount: vote.amount,
    });
    setVoteModalActive(true);
  };

  const handleVoteAmount = (v) => {
    setVote({
      ...vote,
      amount: v,
    });
  };

  const onSuccess = () => {
    setRefresh(refresh + 1);
    setTxid("");
    setVote({
      vote: "",
      voteIndex: "",
      amount: "",
    });
  };

  const { isLoaded, error, data } = useOnChainData(() => {
    return new DaoContract(network).getProposal(
      contractHash,
      proposalNo,
      connectedWallet
    );
  }, [refresh, network, connectedWallet]);

  const handleVote = async () => {
    if (connectedWallet) {
      const res = await new DaoContract(network).vote(
        connectedWallet,
        contractHash,
        data.channel.decimals,
        proposalNo,
        vote.voteIndex,
        vote.amount
      );
      setVoteModalActive(false);
      setTxid(res);
    } else {
      toast.error("Connect your wallet");
    }
  };

  const handleWithdrawProposalFund = async () => {
    if (connectedWallet) {
      const res = await new DaoContract(network).withdrawProposalFund(
        connectedWallet,
        contractHash,
        proposalNo
      );
      setTxid(res);
    } else {
      toast.error("Connect your wallet");
    }
  };


  if (!isLoaded) return <div></div>;
  if (error) return <div></div>;
  const now = moment().valueOf();
  const end = data.proposal.end;
  const isActive = now < end;
  return (
    <div className="columns">
      <div className="column is-8 is-offset-2">
        <Link
          to={`${DAO_CHANNEL_PATH}/${contractHash}`}
          className="button is-rounded is-small mb-3"
        >
          Back to list
        </Link>
        <div className="columns">
          <div className="column is-8">
            <div className="box is-shadowless">
              <div className="block">
                <div className="media">
                  <div className="media-content">
                    <h5 className="title is-5">
                      #{data.proposal.no} {data.proposal.title}
                    </h5>
                  </div>
                  <div className="media-right">
                    <div
                      className={`tag ${isActive ? "is-success" : "is-light"}`}
                    >
                      {isActive ? "Active" : "End"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="block">
                <p>{data.proposal.description}</p>
              </div>
            </div>
            <div className="box is-shadowless">
              {data.proposal.options.map((op, i) => {
                return (
                  <div
                    key={`op-btn--${i}`}
                    className={
                      data.proposal.options.length - 1 !== i ? "mb-2" : ""
                    }
                    onClick={() => {
                      onVoteOptionClick(op, i);
                    }}
                  >
                    <button
                      disabled={!isActive}
                      className="button is-fullwidth is-rounded"
                    >
                      {op}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="box is-shadowless">
              <VoteList
                refresh={refresh}
                contractHash={contractHash}
                symbol={data.channel.symbol}
                decimals={data.channel.decimals}
                proposalNo={proposalNo}
                network={network}
                options={data.proposal.options}
              />
            </div>
            {connectedWallet && (
              <div className="box is-shadowless">
                <UserVotes
	                voteOptions={data.proposal.options}
                  contractHash={contractHash}
                  proposalNo={proposalNo}
                  network={network}
                  connectedWallet={connectedWallet}
                  refresh={refresh}
                  isVoteActive={isActive}
	                setTxid={setTxid}
                />
              </div>
            )}
          </div>

          <div className="column is-4">
            <div className="box is-shadowless">
              <VotingPeriod
                start={data.proposal.start}
                end={data.proposal.end}
              />
              <hr />
              <VotingProgress data={data} />
            </div>

            {connectedWallet &&
            !isActive &&
            !data.proposal.hasWithdrew &&
            data.proposal.creator === connectedWallet.account.address ? (
              <div className="box">
                <p>
                  <strong>Voting is over</strong>. Withdraw your fund
                </p>
                <br />
                <button
                  onClick={handleWithdrawProposalFund}
                  className="button is-primary"
                >
                  Withdraw deposit
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      {isVoteModalActive && (
        <VoteModal
          voteObj={vote}
          onVoteAmountChange={handleVoteAmount}
          data={data}
          onVoteSubmit={handleVote}
          onClose={() => setVoteModalActive(false)}
        />
      )}

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={onSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProposalView;
