import React from "react";
import { ISwapLPToken } from "../../common/routers/swap/interfaces";
import { formatAmount } from "../../common/helpers";
import { Card, Typography } from "antd";
import Meta from "antd/es/card/Meta";

const LPTokenCard = (props: ISwapLPToken) => {
  const isLocked = props.lock && props.lock > new Date().getTime();
  return (
    <>
      <Card
        cover={
          props.image ? (
            <div style={{ position: "relative", textAlign:"center" }}>
              <img src={props.image} style={{ margin: "0 auto" }} />
              <Typography.Title
                level={3}
                style={{ position: "absolute", top: 10, left: 10 }}
              >
                #{props.tokenId}
              </Typography.Title>
            </div>
          ) : null
        }
      >
        <Meta
          description={
            <>
              <Typography.Text>{`${parseFloat(
                formatAmount(props.amountA, props.decimalsA)
              ).toLocaleString()} `}</Typography.Text>
              <Typography.Text strong>{`${props.symbolA}`}</Typography.Text>
              <br />
              <Typography.Text>{`${parseFloat(
                formatAmount(props.amountB, props.decimalsB)
              ).toLocaleString()} `}</Typography.Text>
              <Typography.Text strong>{`${props.symbolB}`}</Typography.Text>
              <br />
              <Typography.Text>
                {parseFloat(props.sharesPercentage) / 100}%
              </Typography.Text>
              {isLocked && props.lock && (
                <>
                  <br />
                  <Typography.Text>
                    Locked until {new Date(props.lock).toLocaleString()}
                  </Typography.Text>
                </>
              )}
            </>
          }
        />
      </Card>
    </>
  );
};

export default LPTokenCard;
