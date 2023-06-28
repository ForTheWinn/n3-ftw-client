import React from "react";
import { Link } from "react-router-dom";
import ChannelCard from "../../components/ChannelCard";
import { DaoContract } from "../../../../../packages/neo/contracts/ftw/dao";
import { DAO_CHANNEL_PATH } from "../../../../../consts/routes";

interface IListProps {
  isLoaded: boolean;
  error?: string;
  data: any;
}

const List = ({ isLoaded, error, data }: IListProps) => {
  return (
    <div>
      {!isLoaded ? (
        <div>Loading..</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="columns is-multiline">
          {data.items.length > 0 ? (
            data.items.map((item) => {
              const manifest = DaoContract.getMetadata(item.manifest);
              if (!manifest.logo) return <></>;
              return (
                <div key={item.contractHash} className="column is-6">
                  <Link to={`${DAO_CHANNEL_PATH}/${item.contractHash}`}>
                    <ChannelCard symbol={item.symbol} logo={manifest.logo} />
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="column is-12">
              <div className="box is-shadowless">No channels</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default List;
