import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const DeleteClassModal = ({ visible, onClose, onDelete, subjectTitle }) => {
  return (
    <>
      <CModal visible={visible} onClose={onClose} backdrop={false}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>Delete Class</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this {subjectTitle} class? It will no
          longer be visible to you or the students who are currently part of it.
          All student lesson data for the class will also be erased. However,
          your lesson planner will remain untouched. This cannot be undone.
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

export default DeleteClassModal;
