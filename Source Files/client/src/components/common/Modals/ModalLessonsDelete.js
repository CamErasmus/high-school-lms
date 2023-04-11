import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const DeleteLessonsModal = ({
  visible,
  onClose,
  onDelete,
  subjectTitle,
  subjectLevel,
}) => {
  return (
    <>
      <CModal visible={visible} onClose={onClose}>
        <CModalHeader onClose={onClose}>
          <CModalTitle>Delete Lessons</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete ALL {subjectTitle} {subjectLevel}{" "}
          lessons? They will no longer be accessible by you or any students you
          teach. WARNING: This cannot be undone!
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

export default DeleteLessonsModal;
