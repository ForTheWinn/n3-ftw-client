import React, { useState } from "react";
import { useWallet } from "../../../../../packages/neo/provider";
import { SmithContract } from "../../../../../packages/neo/contracts/ftw/smith";
import ContractCard from "./ContractCard";
import Pagination from "bulma-pagination-react";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import Banner from "../../Banner";
import PageLayout from "../../../../components/Commons/PageLayout";
import { Link, useLocation } from "react-router-dom";
import { NEO_ROUTES } from "../../../../../consts";

const NEP17Smith = () => {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const { connectedWallet, network } = useWallet();
  const { isLoaded, error, data } = useOnChainData(() => {
    return new SmithContract(network).getNEP17Records(page);
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
                          location.pathname === NEO_ROUTES.SMITH_PATH
                            ? "is-active"
                            : ""
                        }
                      >
                        <Link to={NEO_ROUTES.SMITH_PATH}>Token Showcase</Link>
                      </li>
                      <li
                        className={
                          location.pathname === NEO_ROUTES.SMITH_PATH_NEP11
                            ? "is-active"
                            : ""
                        }
                      >
                        <Link to={NEO_ROUTES.SMITH_PATH_NEP11}>
                          &nbsp; NFT Showcase
                        </Link>
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
                              key={"contact17" + i}
                              className="column is-2-desktop is-6-mobile"
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

export default NEP17Smith;
