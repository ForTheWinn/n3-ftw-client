import React, { useState } from "react";
import PageLayout from "../../../../components/Commons/PageLayout";
import SelectTokenContract from "../../../Locker/Create/SelectTokenContract";
import { ITokenState } from "../../../Swap/scenes/Swap/interfaces";
import NumberFormat from "react-number-format";
import Level from "../../../../components/Level";
import Modal from "../../../../components/Modal";
import NewWalletGenerator from "./NewWalletGenerator";
import writeXlsxFile from "write-excel-file";
import { toolsRouter } from "../../../../../common/routers";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { useApp } from "../../../../../common/hooks/use-app";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import TruncatedAddress from "../../../../components/TruncatedAddress";
import { Space } from "antd";

export interface IExcelData {
  type: any;
  value: any;
}
const Airdrop = () => {
  const { connectedWallet } = useNeoWallets();
  const { chain, network, setTxid } = useApp();
  const { isConnected } = useWalletRouter(chain);

  const [modalType, setModalType] = useState<string | undefined>();
  const [tokenIndex, setTokenIndex] = useState<number | undefined>();
  const [amountIndex, setAmountIndex] = useState<number | undefined>();
  const [list, setList] = useState<IExcelData[][]>([]);

  const onSubmit = async () => {
    // try {
    //   const addresses = list.map((v) => v[0].value);
    //   const txid = await toolsRouter.massTransfers(
    //     chain,
    //     network,
    //     token as ITokenState,
    //     amount as number,
    //     addresses,
    //     connectedWallet
    //   );
    //   setTxid(txid);
    // } catch (e) {}
  };

  const onNewWallets = (addresses: IExcelData[][]) => {
    const list: IExcelData[][] = [];
    addresses.forEach((row) => {
      const item: IExcelData[] = [];
      item.push(row[0]);
      item.push({
        type: Number,
        value: 0
      });
      item.push({
        type: String,
        value: "--"
      });
      item.push({
        type: String,
        value: ""
      });
      item.push(row[1]);
      list.push(item);
    });
    setList(list);
    setModalType(undefined);
  };

  const onExport = async () => {
    await writeXlsxFile(list, {
      fileName: "airdrop.xlsx"
    });
  };

  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <h1 className="title is-5 is-marginless">Bath Transfer</h1>
            {/* <hr /> */}
            {/* <SelectTokenContract contract={token} onContractChange={setToken} /> */}
            <hr />
            {/* <div className="field">
              <label className="label">Amount</label>
              <div className="control">
                <NumberFormat
                  //   disabled={!token}
                  allowLeadingZeros={false}
                  suffix={token ? ` ${token.symbol}` : undefined}
                  thousandSeparator={true}
                  allowNegative={false}
                  decimalScale={token ? token.decimals : 0}
                  inputMode="decimal"
                  className="input is-shadowless"
                  placeholder={"Amount"}
                  value={amount}
                  onValueChange={(value) => {
                    console.log(value);
                    setAmount(value.floatValue);
                  }}
                />
              </div>
            </div>

            <hr /> */}
            <label className="label">Targets</label>
            <div className="buttons">
              <button
                onClick={() => setModalType("new")}
                className="button is-small"
              >
                New wallets
              </button>
            </div>
            {list.length > 0 ? (
              <div className="table-container">
                <table className="table is-fullwidth">
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>
                        <Space>
                          <div>Amount</div>
                          <button className="button is-small">Batch</button>
                        </Space>
                      </th>
                      <th colSpan={2}>
                        {" "}
                        <Space>
                          <div>Token</div>
                          <button className="button is-small">Batch</button>
                        </Space>
                      </th>
                    </tr>
                  </thead>
                  {list.map((row, i) => {
                    return (
                      <tr key={"row" + i}>
                        {row.map((r, ri) => {
                          if (ri > 3) return <></>;
                          return (
                            <td key={r.value}>
                              {ri === 3 ? (
                                <TruncatedAddress address={r.value as string} />
                              ) : (
                                r.value
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </table>
              </div>
            ) : (
              <></>
            )}
            <hr />

            <Level
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
                <button
                  onClick={onExport}
                  disabled={list.length === 0}
                  className="button is-light"
                >
                  Export
                </button>
              }
            />

            {modalType ? (
              <Modal onClose={() => setModalType(undefined)}>
                <>
                  {modalType === "new" && (
                    <NewWalletGenerator onSubmit={onNewWallets} />
                  )}
                </>
              </Modal>
            ) : (
              <></>
            )}

            {modalType ? (
              <Modal onClose={() => setModalType(undefined)}>
                <>
                  {modalType === "new" && (
                    <NewWalletGenerator onSubmit={onNewWallets} />
                  )}
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
