import React, { useState } from "react";
import DatePicker from "react-datepicker";
import MDEditor from "@uiw/react-md-editor";
import { useNeoWallets } from "../../../../../../common/hooks/use-neo-wallets";
import { Link, useHistory, useParams } from "react-router-dom";
import { DaoContract } from "../../../../../../packages/neo/contracts/ftw/dao";
import toast from "react-hot-toast";
import moment from "moment";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { withDecimal } from "../../../../../../packages/neo/utils";
import ChannelCard from "../../../components/ChannelCard";
import { useApp } from "../../../../../../common/hooks/use-app";
import { DAO_CHANNEL_PATH } from "../../../../../../consts/routes";

const Create = () => {
  const params = useParams();
  const history = useHistory();
  const { contractHash } = params as any;
  const { network, setTxid } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [title, setTile] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["Yes", "No"]);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date(Date.now() + 3600 * 1000 * 24));

  const handleOptionChange = (val, i) => {
    const array = [...options];
    array[i] = val;
    setOptions(array);
  };

  const handleMoreOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (i) => {
    if (options.length > 2) {
      const array = [...options];
      array.splice(i, 1);
      setOptions(array);
    }
  };

  const onSubmit = async () => {
    if (connectedWallet) {
      const res = await new DaoContract(network).createProposal(
        connectedWallet,
        contractHash,
        title,
        description,
        options,
        moment(start).valueOf(),
        moment(end).valueOf()
      );
      setTxid(res);
    } else {
      toast.error("Connect your wallet");
    }
  };

  const onSuccess = () => {
    history.push(`${DAO_CHANNEL_PATH}/${contractHash}`);
  };

  const { data } = useOnChainData(() => {
    return new DaoContract(network).getChannel(contractHash);
  }, []);

  let hasEmptyOption = false;
  options.forEach((op) => {
    if (op === "") {
      hasEmptyOption = true;
    }
  });
  // const hasEmoji = useMemo(() => {
  //   return emojiRegexExp.test(description);
  // }, [description]);
  return (
    <div className="columns">
      <div className="column is-8 is-offset-2">
        <Link
          to={`${DAO_CHANNEL_PATH}/${contractHash}`}
          className="button is-rounded is-small mb-3"
        >
          Back to list
        </Link>

        <div className="columns">
          <div className="column is-8">
            <div className="box is-shadowless">
              <h5 className="title is-5">Create a new proposal</h5>

              <hr />
              <div className="field">
                <label className="label">Title</label>
                <div className="control">
                  <input
                    placeholder="About treasury"
                    onChange={(e) => setTile(e.target.value)}
                    className="input"
                    type="text"
                    value={title}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <MDEditor
                    value={description}
                    onChange={(value, event, state) => {
                      setDescription(value ? value : "");
                    }}
                    // @ts-ignore
                    // rehypePlugins={[[rehypeSanitize]]}
                  />
                  <MDEditor.Markdown
                    source={description}
                    // rehypePlugins={[[rehypeSanitize]]}
                  />
                </div>
              </div>

              <hr />

              <div className="field">
                <label className="label">Voting options</label>
                {options.map((op, i) => {
                  return (
                    <div key={`vop-${i}`} className="field is-horizontal">
                      <div
                        onClick={() => handleRemoveOption(i)}
                        className="field-label is-normal"
                        style={{ maxWidth: "20px" }}
                      >
                        {i + 1}.
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              value={op}
                              onChange={(e) =>
                                handleOptionChange(e.target.value, i)
                              }
                            />{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="field is-horizontal">
                  <div
                    className="field-label is-normal"
                    style={{ maxWidth: "20px" }}
                  ></div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <div className="buttons">
                          <button
                            onClick={handleMoreOption}
                            className="button is-small is-light"
                          >
                            Add more option
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div className="field">
                <label className="label">Voting period</label>

                <div className="level">
                  <div className="level-left">
                    <div className="level-item is-block">
                      <div className="heading">Start</div>
                      <DatePicker
                        selected={start}
                        onChange={(date) => setStart(date)}
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeInput
                        minDate={start}
                      />
                    </div>
                    <div className="level-item">
                      <div className="level-item is-block">
                        <label className="heading">End</label>
                        <DatePicker
                          selected={end}
                          onChange={(date) => setEnd(date)}
                          timeInputLabel="Time:"
                          dateFormat="MM/dd/yyyy h:mm aa"
                          showTimeInput
                          minDate={start}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <button
                  disabled={!title || !description || hasEmptyOption}
                  onClick={onSubmit}
                  className="button is-primary"
                >
                  Create a proposal
                </button>
              </div>
            </div>
          </div>
          <div className="column is-4">
            {data && (
              <>
                <div className="box is-shadowless">
                  <ChannelCard
                    symbol={data.symbol}
                    logo={DaoContract.getMetadata(data.manifest).logo}
                  />
                </div>
                <div className="box is-shadowless">
                  <div className="content is-small">
                    <li>
                      You are creating a new proposal of{" "}
                      <strong>{data.symbol} channel</strong>.
                    </li>
                    <li>
                      You will deposit{" "}
                      <strong>
                        {withDecimal(data.minTokens, data.decimals, true)}{" "}
                        {data.symbol}
                      </strong>
                      .
                    </li>
                    <li>
                      You will get your tokens back after{" "}
                      <strong>proposal expired</strong>.
                    </li>
                    <li>
                      Do not use <strong>Emojis</strong>.
                    </li>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
