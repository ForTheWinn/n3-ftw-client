import React, { useEffect, useState } from "react";
import { ILocker } from "../../../../packages/neo/contracts/ftw/locker/interface";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import { useWallet } from "../../../../packages/neo/provider";
import { FaSearch } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { LOCKER_SEARCH_PATH } from "../../../../consts";
import LockerCard from "./LockerCard";

const LockerSearch = () => {
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(location.search);
  const { network } = useWallet();
  const [lockerNo, setLockerNo] = useState<any>(
    params && params.lockerNo ? params.lockerNo : ""
  );
  const [locker, setLocker] = useState<ILocker | undefined>();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleLookup = async () => {
    if (lockerNo) {
      setError("");
      setLoading(true);
      try {
        const res = await new LockerContract(network).getLockerByNo(lockerNo);
        if (res) {
          let search = `?lockerNo=${lockerNo}`;
          history.push(search);
          setLocker(res);
        }
        setLoading(false);
      } catch (e: any) {
        setError("We cannot find the locker with the locker number");
        setLoading(false);
      }
    }
  };
  const handleReset = () => {
    setLocker(undefined);
    history.push(LOCKER_SEARCH_PATH);
  };

  useEffect(() => {
    async function fetch(lockerNo) {
      setLoading(true);
      try {
        const res = await new LockerContract(network).getLockerByNo(lockerNo);
        if (res) {
          setLocker(res);
        }
        setLoading(false);
      } catch (e: any) {
        setError("We cannot find the locker with the locker number");
        setLoading(false);
      }
    }
    if (params.lockerNo) {
      fetch(params.lockerNo);
    }
  }, [network]);
  return (
    <>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            {locker ? (
              <>
                <div className="level is-mobile">
                  <div className="level-left">
                    <div className="level-item">
                      <h1 className="title is-5 is-marginless">
                        Locker number: {locker.lockerNo}
                      </h1>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item">
                      <div className="buttons">
                        <button
                          onClick={handleReset}
                          className="button is-white"
                        >
                          <FaSearch />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-container">
                  <table className="table is-fullwidth">
                    <thead>
                      <tr>
                        <th>Locker no</th>
                        <th>Contract hash</th>
                        <th>Symbol</th>
                        <th>Amount</th>
                        <th>Release at</th>
                        <th>Created at</th>
                        <th>Time left</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <LockerCard {...locker} />
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <h1 className="title is-5">Search locker</h1>
                <p className="subtitle is-7">
                  Find FTWLocker key values by entering a locker no
                </p>
                <div className="field has-addons">
                  <div className="control  is-expanded">
                    <input
                      value={lockerNo}
                      onChange={(e: any) => setLockerNo(e.target.value)}
                      className="input"
                      type="text"
                      placeholder="Enter a locker number"
                    />
                    {error ? <p className="help is-danger">{error}</p> : <></>}
                  </div>
                  <div className="control">
                    <button
                      onClick={handleLookup}
                      disabled={!lockerNo}
                      className={`button is-primary ${
                        isLoading ? "is-loading" : ""
                      }`}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LockerSearch;
