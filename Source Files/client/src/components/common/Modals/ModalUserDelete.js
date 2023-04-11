import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const DeleteUserModal = ({
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
          <CModalTitle>Delete User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the user account belonging to {""}
          {userFirstName} {userLastName}? All related data will also be purged
          and the user will no longer have access to your Synaptic system. This
          cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="dark" variant="outline" onClick={onClose}>
            Cancel
          </CButton>
          <CButton className="bg-danger" onClick={onDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DeleteUserModal;
