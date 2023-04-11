import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";
import {
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
  MarkAsRead,
} from "@knocklabs/react-notification-feed";
import "@knocklabs/react-notification-feed/dist/index.css";
import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import jwt from "jwt-decode";

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const token = localStorage.getItem("x-auth-token");
  const decoded = jwt(token);
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const person = decoded.email;
  const newPerson = person.toString().toLowerCase();

  return (
    <>
      <CHeader position="sticky" className="mb-4">
        <CContainer fluid>
          <CHeaderToggler
            className="ps-1"
            onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderNav className="d-none d-md-flex me-auto"></CHeaderNav>
          <CHeaderNav>
            <KnockFeedProvider
              apiKey={"pk_test_5lp9Gc_iXYOOY7pcgFnkAfWigGt7X-rrmLWnnHuqgcc"}
              feedId={"8acf5fea-43b7-4739-a26d-98544d96a5e8"}
              userId={`${newPerson}`}
            >
              <NotificationIconButton
                ref={notifButtonRef}
                onClick={(e) => setIsVisible(!isVisible)}
              />

              <NotificationFeedPopover
                buttonRef={notifButtonRef}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                onNotificationClick={() => MarkAsRead}
              />
            </KnockFeedProvider>
          </CHeaderNav>
          <CHeaderNav className="ms-3">
            <AppHeaderDropdown />
          </CHeaderNav>
        </CContainer>
        <CHeaderDivider />
        <CContainer fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
    </>
  );
};

export default AppHeader;
