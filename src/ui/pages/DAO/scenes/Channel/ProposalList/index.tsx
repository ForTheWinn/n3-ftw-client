import React, { useState } from "react";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { DaoContract } from "../../../../../../packages/neo/contracts/ftw/dao";
import { Link, NavLink, useParams } from "react-router-dom";
import { useWallet } from "../../../../../../packages/neo/provider";
import moment from "moment";
import TextTruncate from "react-text-truncate";
import { DAO_CHANNEL_PATH } from "../../../../../../consts";
import ChannelCard from "../../../components/ChannelCard";
import removeMd from "remove-markdown";
const ProposalList = () => {
  const params = useParams();
  const { contractHash } = params as any;
  const { network, connectedWallet } = useWallet();
  const [page] = useState("1");
  const { isLoaded, error, data } = useOnChainData(() => {
    return new DaoContract(network).getProposals(contractHash, "30", page);
  }, [page, network]);
  return (
    <div className="columns">
      <div className="column is-8 is-offset-2">
        <div className="columns">
          <div className="column is-8">
            <div className="box is-shadowless">
              <h1 className="title is-5">Proposals</h1>
              <div>
                {!isLoaded ? (
                  <div>Loading..</div>
                ) : error ? (
                  <div>{error}</div>
                ) : (
                  <div className="panel has-background-white is-shadowless">
                    {data.proposals.items.length > 0 ? (
                      data.proposals.items.map((item, i) => {
                        const now = moment().valueOf();
                        const end = item.end;
                        const isActive = now < end;
                        const desc = removeMd(item.description);
                        return (
                          <Link
                            to={`${DAO_CHANNEL_PATH}/${contractHash}/proposal/${item.no}`}
                            className="panel-block is-block"
                            key={`proposal-${i}`}
                          >
                            <div className="media">
                              <div className="media-content content">
                                <h5>
                                  #{item.no} {item.title}
                                </h5>
                                <TextTruncate
                                  line={1}
                                  element="span"
                                  truncateText="…"
                                  text={desc}
                                  // textTruncateChild={<a href="#">Read on</a>}
                                />
                                {/*<p>{item.description}</p>*/}
                              </div>
                              <div className="media-right">
                                <div
                                  className={`tag ${
                                    isActive ? "is-success" : "is-light"
                                  }`}
                                >
                                  {isActive ? "Active" : "End"}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <div>No proposals</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="column is-4">
            {isLoaded && data && (
              <ChannelCard
                symbol={data.channel.symbol}
                logo={DaoContract.getMetadata(data.channel.manifest).logo}
              />
            )}
            <div className="box  is-shadowless">
              <aside className="menu">
                <ul className="menu-list">
                  <li className="is-active">
                    <NavLink
                      exact={true}
                      activeClassName={"is-active"}
                      to={`${DAO_CHANNEL_PATH}/${contractHash}`}
                    >
                      Proposals
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      activeClassName={"is-active"}
                      to={`${DAO_CHANNEL_PATH}/${contractHash}/create`}
                    >
                      New proposal
                    </NavLink>
                  </li>
                  {connectedWallet &&
                  data &&
                  data.channel.owner === connectedWallet.account.address ? (
                    <li>
                      <NavLink
                        activeClassName={"is-active"}
                        to={`${DAO_CHANNEL_PATH}/${contractHash}/edit`}
                      >
                        Edit channel
                      </NavLink>
                    </li>
                  ) : (
                    <></>
                  )}
                  {/*<li>*/}
                  {/*	<NavLink*/}
                  {/*		activeClassName={"is-active"}*/}
                  {/*		to={PROPOSALS_ABOUT_PATH}*/}
                  {/*	>*/}
                  {/*		About*/}
                  {/*	</NavLink>*/}
                  {/*</li>*/}
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalList;
