import React from "react";
import { Link } from "react-router-dom";
import { LOCKER_CREATE_PATH, LOCKER_USER_PATH } from "../../../../consts";
import { wallet } from "@cityofzion/neon-core";
import { LOCKER_SCRIPT_HASH } from "../../../../packages/neo/contracts/ftw/locker/consts";
import { FaKey, FaSearch } from "react-icons/fa";
const LockerInfoPage = ({ network }) => {
  return (
    <div>
      <h5 className="title is-5">FTW locker</h5>
      <div className="content">
        <p>
          FTW locker allows sending tokens with time-lock. A receiver receives a
          key; it is NFT and transferable.
        </p>
        <h6>How to lock</h6>
        <p>
          Go to <Link to={LOCKER_CREATE_PATH}>Create page</Link> and fill out
          the form.
        </p>
        <h6>How to unlock</h6>
        <ul>
          <li>
            Go to <Link to={LOCKER_USER_PATH}>Key page</Link>. It displays all
            keys that the connected wallet has.
          </li>
          <li>
            Or, send your key to the locker contract. Address is{" "}
            <strong>
              {wallet.getAddressFromScriptHash(LOCKER_SCRIPT_HASH[network])}
            </strong>
          </li>
        </ul>
        <i>
          Note that lockers only can be unlocked when it meets the release
          timestamp.
        </i>
        <br />
        <br />
        <h6>How to browse lockers</h6>
        <ul>
          <li>
            By locker no: <FaSearch /> button on the header.
          </li>
          <li>
            key list by your wallet: <FaKey /> button on the header.
          </li>
        </ul>
        <h6>Locker contract hash</h6>
        <p>0x{LOCKER_SCRIPT_HASH[network]} [<a href={`https://explorer.onegate.space/contractinfo/0x${LOCKER_SCRIPT_HASH[network]}`} target="_blank">Browse</a>]</p>
      </div>
    </div>
  );
};

export default LockerInfoPage;
