import React from "react";

import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
const { Panel } = Collapse;

interface IPriceComparisonProps {
  errors: string[];
}

const SwapErrors = ({ errors }: IPriceComparisonProps) => {
  return (
    <div className="mt-1">
      <Collapse
        size="small"
        bordered={false}
        defaultActiveKey={[]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className={"has-background-danger-light"}
      >
        <Panel header={errors[0]} key="1">
          <>
            {errors.map((error, i) => (
              <span key={"error" + i}>{error}</span>
            ))}
          </>
        </Panel>
      </Collapse>
    </div>
  );
};

export default SwapErrors;
