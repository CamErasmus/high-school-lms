import { useState, useRef } from "react";
import { CToast, CToastHeader, CToastBody, CToaster } from "@coreui/react";

const SuccessToast = ({ successVisible, response }) => {
  const [toast] = useState(0);
  const toaster = useRef();
  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end">
        <CToast
          autohide={true}
          visible={successVisible}
          className="border border-success"
        >
          <CToastHeader closeButton>
            <strong className="me-auto">Success Notification</strong>
          </CToastHeader>
          <CToastBody>{response}</CToastBody>
        </CToast>
      </CToaster>
    </>
  );
};

export default SuccessToast;
