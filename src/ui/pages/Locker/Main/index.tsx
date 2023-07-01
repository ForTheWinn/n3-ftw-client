import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useOnChainData } from "../../../../common/hooks/use-onchain-data";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import LockerTokenCard from "./LockerTokenCard";
import { FaInfoCircle, FaKey, FaPlus, FaSearch } from "react-icons/fa";
import SearchLockerModal from "./SearchLockerModal";
import ModalCard from "../../../components/Modal";
import LockerInfoPage from "../InfoPage";
import { useApp } from "../../../../common/hooks/use-app";
import {
  LOCKER_CREATE_PATH,
  LOCKER_SEARCH_PATH,
  LOCKER_USER_PATH,
} from "../../../../consts/routes";
import Level from "../../../components/Level";

const LockerMain = () => {
  const { chain, network } = useApp();
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
            <Level
              left={
                <div>
                  <h1 className="title is-5">Lockers</h1>
                  <p className="subtitle is-7">
                    With Locker, set a timelock on your tokens, making them
                    accessible only when the pre-set time has elapsed. This
                    feature allows for a controlled distribution of tokens based
                    on your desired timeline.
                  </p>
                </div>
              }
              right={
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
              }
            />
          </div>
          {!isLoaded ? (
            <div>Loading..</div>
          ) : (
            <div className="columns is-multiline">
              {data &&
                data.items.reverse().map((item) => {
                  return (
                    <div key={item.contractHash} className="column is-3">
                      <LockerTokenCard
                        {...item}
                        chain={chain}
                        network={network}
                      />
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
