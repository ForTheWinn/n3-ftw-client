import React, { useEffect, useState } from "react";
import { ILocker } from "../../../../packages/neo/contracts/ftw/locker/interface";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import LockerCard from "./LockerCard";
import { useApp } from "../../../../common/hooks/use-app";
import PageLayout from "../../../components/Commons/PageLayout";

const LockerSearch = () => {
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(location.search);
  const { network } = useApp();
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
      } catch (e: any) {
        setError("We cannot find the locker with the locker number");
      }
      setLoading(false);
    }
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
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <h1 className="title is-5">Locker Value Finder</h1>
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
            {error ? <p className="help is-danger">{error}</p> : <></>}
          </div>

          {isLoading ? (
            <div className="box is-shadowless">
              <div className="level is-mobile">
                <div className="level-left">
                  <div className="level-item">Searching..</div>
                </div>
              </div>
            </div>
          ) : locker ? (
            <div className="box is-shadowless">
              <div className="table-container">
                <table className="table is-fullwidth">
                  <thead>
                    <tr>
                      <th>Locker no</th>
                      <th>Key Owner</th>
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
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default LockerSearch;
