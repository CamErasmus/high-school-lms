import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const DeleteSubjectModal = ({ visible, onClose, subjectTitle, onDelete }) => {
  return (
    <>
      <CModal visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>Delete Subject</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the subject called {subjectTitle}? You
          will no longer be able to create classes for this subject. This cannot
          be undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="dark" onClick={onClose}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={onDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DeleteSubjectModal;
