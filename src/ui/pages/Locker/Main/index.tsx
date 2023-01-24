import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LOCKER_CREATE_PATH,
  LOCKER_SEARCH_PATH,
  LOCKER_USER_PATH,
} from "../../../../consts";
import { useOnChainData } from "../../../../common/hooks/use-onchain-data";
import { useWallet } from "../../../../packages/provider";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import LockerTokenCard from "./LockerTokenCard";
import { FaInfoCircle, FaKey, FaPlus, FaSearch } from "react-icons/fa";
import SearchLockerModal from "./SearchLockerModal";
import ModalCard from "../../../components/Modal";
import LockerInfoPage from "../InfoPage";

const LockerMain = () => {
  const { network } = useWallet();
  const [isSearchModalActive, setSearchModalActive] = useState(false);
  const [isInfoModalActive, setInfoModalActive] = useState(false);
  const { isLoaded, data } = useOnChainData(() => {
    return new LockerContract(network).getContracts();
  }, [network]);
  return (
    <>
      <div className="columns is-centered">
        <div className="column is-8">
          <div className="box is-shadowless">
            <div className="level is-mobile">
              <div className="level-left">
                <div className="level-item">
                  <div className="is-block">
                    <h1 className="title is-5 is-marginless">Lockers</h1>
                    <p>Send your tokens with a timelock</p>
                  </div>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <div className="buttons">
                    <Link to={LOCKER_CREATE_PATH} className="button is-white">
                      <FaPlus />
                    </Link>
                    <Link to={LOCKER_SEARCH_PATH} className="button is-white">
                      <FaSearch />
                    </Link>
                    <Link to={LOCKER_USER_PATH} className="button is-white">
                      <FaKey />
                    </Link>
                    <button
                      onClick={() => setInfoModalActive(true)}
                      className="button is-white"
                    >
                      <FaInfoCircle />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!isLoaded ? (
            <div>Loading..</div>
          ) : (
            <div className="columns is-multiline">
              {data &&
                data.items.reverse().map((item) => {
                  return (
                    <div key={item.contractHash} className="column is-3">
                      <LockerTokenCard {...item} network={network} />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
      {isSearchModalActive && (
        <ModalCard onClose={() => setSearchModalActive(false)}>
          <SearchLockerModal />
        </ModalCard>
      )}
      {isInfoModalActive && (
        <ModalCard onClose={() => setInfoModalActive(false)}>
          <LockerInfoPage network={network} />
        </ModalCard>
      )}
    </>
  );
};

export default LockerMain;
