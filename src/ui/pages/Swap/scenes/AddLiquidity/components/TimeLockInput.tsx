import React from "react";
import DatePicker from "react-datepicker";
import { Button, Collapse, Modal, Typography } from "antd";
import moment from "moment";
interface ITimeLockInputProps {
  lockUntil?: Date;
  setLockUntil: (date: Date | undefined) => void;
}
const TimeLockInput = ({ lockUntil, setLockUntil }: ITimeLockInputProps) => {
  const [isLockCalendarOpen, setIsLockCalendarOpen] = React.useState(false);
  const [date, setDate] = React.useState(lockUntil);
  return (
    <div className="mt-1">
      <Collapse
        bordered={false}
        style={{ background: "white" }}
        items={[
          {
            key: "1",
            label: (
              <Typography.Text>
                {lockUntil ? (
                  <>Lock LP until {moment(lockUntil).format("llll")}</>
                ) : (
                  "Lock Setting"
                )}
              </Typography.Text>
            ),
            children: (
              <>
                {lockUntil ? (
                  <>
                    <Typography.Paragraph>
                      You are locking your LP token. Please do it with caution.
                    </Typography.Paragraph>
                    <Button
                      onClick={() => setLockUntil(undefined)}
                      type="primary"
                      danger
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography.Paragraph>
                      FTW's LP token is NFT tokens. You can lock your LP tokens
                      with time settings.
                    </Typography.Paragraph>
                    <Button
                      onClick={() => setIsLockCalendarOpen(true)}
                      type="primary"
                    >
                      Lock
                    </Button>
                  </>
                )}
              </>
            ),
          },
        ]}
      />

      <Modal
        closable={false}
        open={isLockCalendarOpen}
        footer={[
          <Button key="back" onClick={() => setIsLockCalendarOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={date === undefined}
            onClick={() => {
              if (date) {
                setLockUntil(date);
                setIsLockCalendarOpen(false);
              }
            }}
          >
            Lock
          </Button>,
        ]}
      >
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="MM/dd/yyyy h:mm aa"
          minDate={new Date()}
          inline
        />
      </Modal>
    </div>
  );
};

export default TimeLockInput;
