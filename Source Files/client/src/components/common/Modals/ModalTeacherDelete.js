import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const DeleteTeacherModal = ({
  visible,
  onClose,
  userFirstName,
  userLastName,
  onDelete,
}) => {
  return (
    <>
      <CModal visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>Delete Student</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the teacher profile belonging to {""}
          {userFirstName} {userLastName}? The user account linked to this profle
          will remain unaffected. However, all details captured within this
          profile will be lost. This cannot be undone.
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

export default DeleteTeacherModal;
