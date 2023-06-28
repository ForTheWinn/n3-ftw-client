import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "bulma-pagination-react";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import {
  ILockerContract,
  ILockersByToken
} from "../../../../packages/neo/contracts/ftw/locker/interface";
import { FaPlus } from "react-icons/fa";
import LockerCard from "./LockerCard";
import { useApp } from "../../../../common/hooks/use-app";
import { LOCKER_CREATE_PATH } from "../../../../consts/routes";

const LockersByContract = () => {
  const { network } = useApp();
  const [page, setPage] = useState(1);
  const params = useParams();
  const { contractHash } = params as any;
  const [data, setData] = useState<{
    contract: ILockerContract;
    items: ILockersByToken;
  }>();

  useEffect(() => {
    async function fetch() {
      try {
        const contract = await new LockerContract(network).getContract(
          contractHash
        );
        const items = await new LockerContract(network).getLockersByContract(
          contractHash,
          page
        );
        setData({
          contract,
          items
        });
      } catch (e: any) {
        console.error(e);
      }
    }
    fetch();
  }, [network, page]);
  return (
    <div>
      <div className="columns is-centered">
        <div className="column is-8">
          <div className="box is-shadowless">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  <h1 className="title is-5 is-marginless">
                    {data ? `${data.contract.symbol} lockers` : ""}
                  </h1>
                </div>
              </div>
              {data ? (
                <div className="level-right">
                  <div className="level-item">
                    <div className="buttons">
                      <Link
                        to={`${LOCKER_CREATE_PATH}?contractHash=${data.contract.contractHash}`}
                        className="button is-white"
                      >
                        <FaPlus />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="table-container">
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Locker no</th>
                    <th>Amount</th>
                    <th>Release at</th>
                    <th>Created at</th>
                    <th>Time left</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data ? (
                    <>
                      {data.items.items.map((locker) => (
                        <LockerCard contract={data.contract} locker={locker} />
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </tbody>
                {data && data.items.totalPages > 1 ? (
                  <tfoot>
                    <tr>
                      <td colSpan={6}>
                        <Pagination
                          pages={data.items.totalPages}
                          currentPage={page}
                          onChange={(v) => {
                            if (page !== v) {
                              setPage(v);
                            }
                          }}
                        />
                      </td>
                    </tr>
                  </tfoot>
                ) : (
                  <></>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockersByContract;
