import React, { useState } from "react";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import { useWallet } from "../../../../packages/neo/provider";
import { toast } from "react-hot-toast";
import { ILocker } from "../../../../packages/neo/contracts/ftw/locker/interface";

const SearchLockerModal = (props) => {
  const { network } = useWallet();
  const [lockerNo, setLockerNo] = useState("");
  const [locker, setLocker] = useState<ILocker | undefined>();
  const [isLoading, setLoading] = useState(false);
  const handleLookup = async () => {
    setLoading(true);
    try {
      const res = await new LockerContract(network).getLockerByNo(lockerNo);
      if (res) {
        setLocker(res);
      }
      setLoading(false);
    } catch (e: any) {
      toast.error("We cannot find the locker with the locker number");
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="title is-5">Enter locker number</h1>
      <hr />
      <div className="field">
        <input
          placeholder={"Locker number"}
          className="input"
          value={lockerNo}
          onChange={(e) => setLockerNo(e.target.value)}
        />
        {/*{error && <p className="help is-danger">{error}</p>}*/}
      </div>
      <hr />
      <button
        onClick={handleLookup}
        disabled={!lockerNo}
        className={`button is-primary ${isLoading ? "is-loading" : ""}`}
      >
        Search
      </button>
    </div>
  );
};

export default SearchLockerModal;
