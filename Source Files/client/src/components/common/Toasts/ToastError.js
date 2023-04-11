import { useState, useRef } from "react";
import { CToast, CToastHeader, CToastBody, CToaster } from "@coreui/react";

const ErrorToast = ({ errorVisible, error }) => {
  const [toast] = useState(0);
  const toaster = useRef();
  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end">
        <CToast
          autohide={false}
          visible={errorVisible}
          className="border border-danger"
        >
          <CToastHeader closeButton>
            <strong className="me-auto">Error</strong>
          </CToastHeader>
          <CToastBody>{error}</CToastBody>
        </CToast>
      </CToaster>
    </>
  );
};

export default ErrorToast;
