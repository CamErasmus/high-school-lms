import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const DeleteParentModal = ({
  visible,
  onClose,
  parent1FirstName,
  parent1LastName,
  onDelete,
}) => {
  return (
    <>
      <CModal visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>Delete Profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the parent profile belonging to {""}
          {parent1FirstName} {parent1LastName}? The user account linked to this
          profle will remain unaffected. However, all details captured within
          this profile will be lost. This cannot be undone.
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

export default DeleteParentModal;
