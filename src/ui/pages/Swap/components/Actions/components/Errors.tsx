import { Alert } from "antd";
import React from "react";

interface IErrorsProps {
  errorMessages: string;
  onClose: () => void;
}
const Errors = ({ errorMessages, onClose }: IErrorsProps) => {
  return <Alert message="Error" description={errorMessages} type="error" />;
};

export default Errors;
