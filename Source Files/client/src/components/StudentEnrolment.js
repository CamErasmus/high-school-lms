import { useEffect, useState } from "react";
import api from "../services/api";
import { CRow, CCol, CWidgetStatsA } from "@coreui/react";

const StudentEnrolment = () => {
  const [students, setStudents] = useState("");
  const token = localStorage.getItem("x-auth-token");

  useEffect(() => {
    const config = {
      headers: { "x-auth-token": token },
    };
    api.get("/students/count", config).then((response) => {
      setStudents(response.data[0].count);
    });
  }, [students, token]);

  if (students) {
    return (
      <CRow>
        <CCol>
          <CWidgetStatsA
            color="gradient-primary"
            value={students ? students : 0}
            title={<p>Students Enrolled (LIVE DATA)</p>}
          ></CWidgetStatsA>
        </CCol>
      </CRow>
    );
  } else {
    return null;
  }
};

export default StudentEnrolment;
