import React, { useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import { SmithContract } from "../../../../../packages/neo/contracts/ftw/smith";
import ContractCard from "./ContractCard";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import Pagination from "bulma-pagination-react";
import Banner from "../../Banner";
import PageLayout from "../../../../components/Commons/PageLayout";
import { SMITH_PATH, SMITH_PATH_NEP11 } from "../../../../../consts";
import { Link, useLocation } from "react-router-dom";
const NEP11Smith = () => {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const { connectedWallet, network } = useWallet();
  const { isLoaded, error, data } = useOnChainData(() => {
    return new SmithContract(network).getNEP11Records(page);
  }, [connectedWallet, network, page]);
  return (
    <>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-8">
            <div className="">
              <Banner />
              <div className="box is-shadowless">
                <nav className="tabs">
                  <div className="container">
                    <ul>
                      <li
                        className={
                          location.pathname === SMITH_PATH ? "is-active" : ""
                        }
                      >
                        <Link to={SMITH_PATH}>Token Showcase</Link>
                      </li>
                      <li
                        className={
                          location.pathname === SMITH_PATH_NEP11
                            ? "is-active"
                            : ""
                        }
                      >
                        <Link to={SMITH_PATH_NEP11}>&nbsp; NFT Showcase</Link>
                      </li>
                    </ul>
                  </div>
                </nav>

                {!isLoaded ? (
                  <div>Loading..</div>
                ) : error ? (
                  <div>{error}</div>
                ) : (
                  <div className="">
                    {data && (
                      <>
                        <div className="columns is-multiline is-mobile">
                          {data.items.map((item, i) => (
                            <div
                              key={"contact11" + i}
                              className="column is-3-desktop is-6-mobile"
                            >
                              <div className="box is-hoverable ">
                                <ContractCard data={item} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {data.totalPages > 1 && (
                          <>
                            <hr />
                            <Pagination
                              pages={data.totalPages}
                              currentPage={page}
                              onChange={(v) => {
                                if (page !== v) {
                                  setPage(v);
                                }
                              }}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default NEP11Smith;
