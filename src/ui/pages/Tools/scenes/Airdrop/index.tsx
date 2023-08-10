import React, { useState } from "react";
import PageLayout from "../../../../components/Commons/PageLayout";
import SelectTokenContract from "../../../Locker/Create/SelectTokenContract";
import { ITokenState } from "../../../Swap/scenes/Swap/interfaces";
import NumberFormat from "react-number-format";
import Level from "../../../../components/Level";
import Modal from "../../../../components/Modal";
import NewWalletGenerator from "./NewWalletGenerator";
import writeXlsxFile from "write-excel-file";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { useApp } from "../../../../../common/hooks/use-app";
import TruncatedAddress from "../../../../components/TruncatedAddress";
import { Space } from "antd";
import BatchAmount from "./BatchAmount";
import ImportAddresses from "./ImportAddresses";
import { toolsRouter } from "../../../../../common/routers";
import { WENT_WRONG } from "../../../../../consts/messages";
import toast from "react-hot-toast";
import { IMassTransaferList } from "../../../../../common/routers/tools/interfaces";
import { ethers } from "ethers";

export interface IExcelData {
  type: any;
  value: any;
}
const Airdrop = () => {
  const { chain, network, setTxid } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [modalType, setModalType] = useState<
    "gernerate" | "import" | undefined
  >();
  const [tokenIndex, setTokenIndex] = useState<number | undefined>();
  const [batchAmountModal, setBatchAmountModal] = useState<boolean>(false);
  const [list, setList] = useState<IExcelData[][]>([]);

  const onSubmit = async () => {
    try {
      const transferItems: IMassTransaferList[] = [];
      list.forEach((item: any) => {
        const address = item[0].value;
        const amount = ethers
          .parseUnits(item[1].value.toString(), item[4].value)
          .toString();
        const hash = item[3].value;
        transferItems.push({
          address,
          amount,
          hash,
        });
      });

      const txid = await toolsRouter.massTransfers(
        chain,
        network,
        transferItems,
        connectedWallet
      );
      setTxid(txid);
    } catch (e: any) {
      toast.error(e && e.message ? e.message : WENT_WRONG);
    }
  };

  const onAddNewAddress = () => {};

  const onImportFile = (addresses: { address: string; amount: number }[]) => {
    const newList: IExcelData[][] = [];
    if (!addresses || addresses.length === 0) {
      toast.error("Failed");
    }
    addresses.forEach((row) => {
      const item: IExcelData[] = [];
      item.push({
        type: String,
        value: row.address,
      });
      item.push({
        type: Number,
        value: row.amount,
      });
      // symbol
      item.push({
        type: String,
        value: "",
      });
      // hash
      item.push({
        type: String,
        value: "",
      });
      // decimals
      item.push({
        type: Number,
        value: "",
      });
      newList.push(item);
    });
    setList([...list, ...newList]);
    setModalType(undefined);
  };

  const onNewWallets = (addresses: IExcelData[][]) => {
    const newList: IExcelData[][] = [];
    if (!addresses || addresses.length === 0) {
      toast.error("Failed to import. Please check your excel file.");
    }
    addresses.forEach((row) => {
      const item: IExcelData[] = [];
      item.push(row[0]);
      item.push({
        type: Number,
        value: 0,
      });
      item.push({
        type: String,
        value: "",
      });
      item.push({
        type: String,
        value: "",
      });
      // decimals
      item.push({
        type: Number,
        value: "",
      });
      // privatekey
      item.push(row[1]);
      newList.push(item);
    });
    setList([...list, ...newList]);
    setModalType(undefined);
  };

  const onBatchAmount = (amount: number) => {
    const newList = [...list];

    setList(
      newList.map((item, i) => {
        item[1].value = amount;
        return item;
      })
    );

    setBatchAmountModal(false);
  };

  const onExport = async () => {
    await writeXlsxFile(list, {
      fileName: "wallets.xlsx",
    });
  };

  const onTokenChange = (token: ITokenState | undefined) => {
    if (!token) return false;

    const newList = [...list];
    if (tokenIndex === -1) {
      setList(
        newList.map((item, i) => {
          item[2].value = token.symbol;
          item[3].value = token.hash;
          item[4].value = token.decimals;
          return item;
        })
      );
    } else {
      setList(
        newList.map((item, i) => {
          if (i === tokenIndex) {
            item[2].value = token.symbol;
            item[3].value = token.hash;
            item[4].value = token.decimals;
          }

          return item;
        })
      );
    }

    setList(newList);
    setTokenIndex(undefined);
  };

  const onAmountChange = (value: number, index: number) => {
    const newList = [...list];
    setList(
      newList.map((item, i) => {
        if (i === index) {
          item[1].value = value;
        }
        return item;
      })
    );
  };

  const onReset = () => {
    if (window.confirm("Do you want to reset all addresses?")) {
      setList([]);
    }
  };

  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="notification is-warning is-light">
            This is an experimental product. Please use with caution.
          </div>
          <div className="box is-shadowless">
            <h1 className="title is-5">Batch Transfer</h1>
            <p className="subtitle is-6">
              This tool helps multiple token transfers in one transaction.
            </p>
            <hr />

            <label className="label">Targets</label>
            <div className="buttons">
              {/* <button
                onClick={() => setModalType("new")}
                className="button is-small"
              >
                Add receivers
              </button> */}
              <button
                onClick={() => setModalType("import")}
                className="button is-small"
              >
                Import file
              </button>
              <button
                onClick={() => setModalType("gernerate")}
                className="button is-small"
              >
                Generate wallets
              </button>
            </div>
            {list.length > 0 ? (
              <>
                <hr />
                <div className="table-container">
                  <table className="table is-fullwidth">
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>
                          <Space>
                            <div>Amount</div>
                            <button
                              onClick={() => setBatchAmountModal(true)}
                              className="button is-small is-light"
                            >
                              Batch
                            </button>
                          </Space>
                        </th>
                        <th colSpan={2}>
                          {" "}
                          <Space>
                            <div>Token</div>
                            <button
                              onClick={() => setTokenIndex(-1)}
                              className="button is-small is-light"
                            >
                              Batch
                            </button>
                          </Space>
                        </th>
                      </tr>
                    </thead>
                    {list.map((row, i) => {
                      return (
                        <tr key={"row" + i}>
                          {row.map((r, ri) => {
                            if (ri > 2) return <></>;
                            if (ri === 1)
                              return (
                                <td key={"walletindex" + ri}>
                                  <NumberFormat
                                    value={r.value}
                                    allowLeadingZeros={false}
                                    thousandSeparator={true}
                                    allowNegative={false}
                                    inputMode="decimal"
                                    className="input is-shadowless is-small"
                                    placeholder={"Amount"}
                                    onValueChange={(value) => {
                                      onAmountChange(
                                        value.floatValue as number,
                                        i
                                      );
                                    }}
                                  />
                                </td>
                              );
                            if (ri === 2)
                              return (
                                <td key={"walletindex" + ri}>
                                  <Space>
                                    <span>{r.value}</span>
                                    <button
                                      onClick={() => setTokenIndex(i)}
                                      className="button is-small is-light"
                                    >
                                      Change
                                    </button>
                                  </Space>
                                </td>
                              );
                            if (ri === 3)
                              return (
                                <td key={"walletindex" + ri}>
                                  <TruncatedAddress
                                    address={r.value as string}
                                  />
                                </td>
                              );
                            return <td key={"walletindex" + ri}>{r.value}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </table>
                </div>
                <hr />

                <Level
                  isMobile
                  left={
                    <button
                      // disabled={
                      //   !token || list.length === 0 || !amount || !isConnected
                      // }
                      onClick={onSubmit}
                      className="button is-primary"
                    >
                      Send
                    </button>
                  }
                  right={
                    <div className="buttons">
                      {list && list.length > 0 && (
                        <button
                          onClick={onReset}
                          disabled={list.length === 0}
                          className="button is-danger is-light"
                        >
                          Reset
                        </button>
                      )}

                      <button
                        onClick={onExport}
                        disabled={list.length === 0}
                        className="button is-light"
                      >
                        Export
                      </button>
                    </div>
                  }
                />
              </>
            ) : (
              <></>
            )}

            {modalType ? (
              <Modal onClose={() => setModalType(undefined)}>
                <>
                  {modalType === "gernerate" && (
                    <NewWalletGenerator onSubmit={onNewWallets} />
                  )}

                  {modalType === "import" && (
                    <ImportAddresses onSubmit={onImportFile} />
                  )}
                </>
              </Modal>
            ) : (
              <></>
            )}

            {tokenIndex !== undefined ? (
              <Modal onClose={() => setTokenIndex(undefined)}>
                <>
                  <SelectTokenContract onContractChange={onTokenChange} />
                </>
              </Modal>
            ) : (
              <></>
            )}

            {batchAmountModal ? (
              <Modal onClose={() => setBatchAmountModal(false)}>
                <>
                  <BatchAmount onSubmit={onBatchAmount} />
                </>
              </Modal>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Airdrop;
