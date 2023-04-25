import React, { useEffect, useState } from "react";
import PageLayout from "../../../../components/Commons/PageLayout";
import { SpinnerRoundFilled } from "spinners-react";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { useApp } from "../../../../../common/hooks/use-app";
import { swapRouter } from "../../../../../common/routers";
import { ISwapLPToken } from "../../../../../common/routers/swap/interfaces";
import LPTokenCard from "../../../../components/LPTokenCard";
import { WENT_WRONG } from "../../../../../consts/messages";
import { CONFIGS } from "../../../../../consts/chains";
import { Avatar, Divider, Space } from "antd";

const LPTokens = () => {
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(location.search);
  const { chain, network } = useApp();
  const [id, setId] = useState<any>(
    params && params.id ? params.id : undefined
  );
  const [token, setToken] = useState<ISwapLPToken | undefined>();
  const [error, setError] = useState("");
  const [isSearching, setSearching] = useState(false);

  const onSearch = async (tokenId) => {
    try {
      setSearching(true);
      setError("");
      const token: ISwapLPToken = await swapRouter.getLPToken(
        chain,
        network,
        tokenId
      );
      setToken(token);
      let search = `?id=${id}`;
      history.push(search);
    } catch (e: any) {
      setError(e.message ? e.message : WENT_WRONG);
    }
    setSearching(false);
  };

  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <Space>
              <Avatar src={CONFIGS[chain].icon} />
              <div>
                <h1 className="title is-5">LP Value Finder</h1>
                <p className="subtitle is-7">
                  Enter LP token ID to find the token value.
                </p>
              </div>
            </Space>
            <Divider />
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  value={id}
                  onChange={(e: any) => setId(e.target.value)}
                  className="input is-shadowless"
                  type="text"
                  placeholder="Enter LP token ID"
                />
              </div>
              <div className="control">
                <button
                  onClick={() => onSearch(id)}
                  disabled={!id}
                  className={`button is-primary ${
                    isSearching ? "is-loading" : ""
                  }`}
                >
                  Search
                </button>
              </div>
            </div>
            {error ? <p className="help is-danger">{error}</p> : <></>}
          </div>

          {isSearching ? (
            <div className="box is-shadowless">
              <div className="level is-mobile">
                <div className="level-left">
                  <div className="level-item">
                    <SpinnerRoundFilled size={15} color="#ccc" />
                  </div>
                  <div className="level-item">Searching..</div>
                </div>
              </div>
            </div>
          ) : token && id ? (
            <div className="box is-shadowless">
              <LPTokenCard {...token} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default LPTokens;
