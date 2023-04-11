// import { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import {
  cilCalendar,
  cilSchool,
  cilChart,
  cilSpeedometer,
  cilUser,
  cilEducation,
  cilInstitution,
  cilWc,
  cilClock,
  cilBook,
  cilCalendarCheck,
  cilClearAll,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

// _nav.js

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    roles: ["superAdmin", "admin", "teacher", "student", "parent"],
  },
  // Teacher Timetable
  {
    component: CNavItem,
    name: "Timetable",
    to: "/auth/timetable",
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
    roles: ["superAdmin", "admin", "teacher"],
  },
  // Student Timetable
  {
    component: CNavItem,
    name: "Timetable",
    to: "/auth/studenttimetable",
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
    roles: ["student"],
  },
  {
    component: CNavItem,
    name: "School Calendar",
    to: "/auth/calendar",
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    roles: ["superAdmin", "admin", "teacher", "student", "parent"],
  },
  {
    component: CNavTitle,
    name: "Student Lounge",
    roles: ["student"],
  },
  {
    component: CNavItem,
    name: "Lesson Entry",
    to: "/auth/lessonentry",
    icon: <CIcon icon={cilClearAll} customClassName="nav-icon" />,
    roles: ["student"],
  },
  {
    component: CNavTitle,
    name: "Teacher Lounge",
    roles: ["superAdmin", "admin", "teacher"],
  },
  {
    component: CNavGroup,
    name: "Classes",
    icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "View My Classes",
        to: "/auth/classes",
      },
      {
        component: CNavItem,
        name: "Create A Class",
        to: "/auth/classes/add",
      },
      {
        component: CNavItem,
        name: "View Scheduled Classes",
        to: "/auth/classes/scheduletable",
      },
      {
        component: CNavItem,
        name: "Schedule A Class",
        to: "/auth/classes/schedule",
      },
    ],
    roles: ["superAdmin", "admin", "teacher"],
  },
  {
    component: CNavGroup,
    name: "Subjects",
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "View My Subjects",
        to: "/auth/subjects",
      },
      {
        component: CNavItem,
        name: "Create A Subject",
        to: "/auth/subjects/add",
      },
    ],
    roles: ["superAdmin", "admin", "teacher"],
  },
  {
    component: CNavGroup,
    name: "Lessons",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "View Lessons",
        to: "/auth/lessons",
      },
      {
        component: CNavItem,
        name: "Create A Lesson",
        to: "/auth/lessons/add",
      },
    ],
    roles: ["superAdmin", "admin", "teacher"],
  },
  {
    component: CNavTitle,
    name: "Admin Lounge",
    roles: ["superAdmin", "admin"],
  },
  {
    component: CNavItem,
    name: "School Attendance",
    to: "/auth/attendance",
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
    roles: ["superAdmin", "admin"],
  },
  {
    component: CNavGroup,
    name: "School Calendar",
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "View Calendar Events",
        to: "/auth/calendar/events",
      },
      {
        component: CNavItem,
        name: "Create A New Event",
        to: "/auth/calendar/add",
      },
    ],
    roles: ["superAdmin", "admin"],
  },
  {
    component: CNavGroup,
    name: "Teacher Profiles",
    icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "View Teacher Profiles",
        to: "/auth/teachers",
      },
      {
        component: CNavItem,
        name: "Create A Teacher Profile",
        to: "/auth/teachers/add",
      },
    ],
    roles: ["superAdmin", "admin"],
  },
  {
    component: CNavGroup,
    name: "Student Profiles",
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "View Student Profiles",
        to: "/auth/students",
      },
      {
        component: CNavItem,
        name: "Create A Student Profile",
        to: "/auth/students/add",
      },
    ],
    roles: ["superAdmin", "admin"],
  },
  {
    component: CNavGroup,
    name: "Parent Profiles",
    icon: <CIcon icon={cilWc} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "View Parent Profiles",
        to: "/auth/parents",
      },
      {
        component: CNavItem,
        name: "Add A Parent Profile",
        to: "/auth/parents/add",
      },
    ],
    roles: ["superAdmin", "admin"],
  },
  {
    component: CNavTitle,
    name: "Super Admin Lounge",
    roles: ["superAdmin"],
  },
  {
    component: CNavGroup,
    name: "User Access",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "View Users",
        to: "/auth/users",
      },
      {
        component: CNavItem,
        name: "Create A User",
        to: "/auth/users/add",
      },
    ],
    roles: ["superAdmin"],
  },
];

export default _nav;
