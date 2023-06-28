import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import PageLayout from "../../../../components/Commons/PageLayout";
import { DaoContract } from "../../../../../packages/neo/contracts/ftw/dao";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import List from "./List";
import { Link } from "react-router-dom";
import { useApp } from "../../../../../common/hooks/use-app";
import { DAO_CHANNEL_CREATE_PATH } from "../../../../../consts/routes";

const DAOChannelList = () => {
  const { network } = useApp();
  const [page, setPage] = useState("1");

  const { isLoaded, error, data } = useOnChainData(() => {
    return new DaoContract(network).getChannels("30", page);
  }, [network]);

  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="level box  is-shadowless">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title is-5 is-marginless">Channels</h1>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <Link
                  to={DAO_CHANNEL_CREATE_PATH}
                  className="button is-white"
                >
                  <FaPlus />
                </Link>
              </div>
            </div>
          </div>

          <List isLoaded={isLoaded} data={data} error={error} />
        </div>
      </div>
    </PageLayout>
  );
};

export default DAOChannelList;
