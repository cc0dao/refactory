import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Router, { useRouter } from "next/router";
import PropTypes from "prop-types";
import cn from "classnames";
import Link from "next/link";
import Button from "@components/buttons/button";
import SmallPhotoWithText from "@components/small-photo-with-text";
import { getUser, getAccount } from "@selectors/user.selectors";
import { openConnectMetamaskModal } from "@actions/modals.actions";
import accountActions from "@actions/user.actions";
import api from "@services/api/espa/api.service";
import styles from "./styles.module.scss";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const HeaderTopLine = ({ className, buttonText }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);
  const [isDesigner, setIsDesigner] = useState(false);
  const [designerInfo, setDesignerInfo] = useState(null);

  const screenWidth = useWindowDimensions().width;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    screenWidth > 472 ? setIsMobile(false) : setIsMobile(true);
  }, [screenWidth]);

  const checkIfDesigner = async (wallet) => {
    const designers =
      (await api.getDesignerByWallet(wallet?.toLowerCase())) || [];
    if (designers.length > 0) {
      setDesignerInfo(designers[0]);
      setIsDesigner(true);
    }
  };

  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const account = useSelector(getAccount);

  if (!user) {
    dispatch(accountActions.checkStorageAuth());
  }

  useEffect(() => {
    if (account) {
      checkIfDesigner(account);
    }
  }, [account]);

  const handleClick = () => dispatch(openConnectMetamaskModal());
  const onIconHander = () => {
    setIsCollapse(!isCollapse);
  };

  const [isShowMenu, setIsShowMenu] = useState(false);

  const router = useRouter();
  const pathname = router.pathname;

  const isResidentProfilePage = pathname.includes("resident");

  const handleProfileClick = () => {
    setIsShowMenu(false);
    Router.push("/profile");
  };
  const handleLogoutClick = () => {
    setIsShowMenu(false);
    dispatch(accountActions.logout());
  };

  const handleEditDesignerPageClick = () => {
    setIsShowMenu(false);
    Router.push("/edit-designer-profile");
  };

  const handleViewDesignerPageClick = () => {
    setIsShowMenu(false);
    Router.push(`/designers/${designerInfo.designerId}`);
  };

  return (
    <div
      className={cn(
        className,
        styles.wrapper,
        hasScrolled ? styles.floatingNav : "",
        isResidentProfilePage ? styles.residentProfile : ""
      )}
    >
      <div className={styles.leftBox}>
        <div className={styles.logo}>CC:0</div>
      </div>
      <div className={styles.rightBox}>
        <div
          className={cn(styles.links, isCollapse ? styles.expandedMenu : "")}
        >
          <div className={styles.linksWrapper}>
            <Link href="https://fashion.digitalax.xyz">
              <a className={styles.link} target="_blank">
                Web3 CC0 Creative Residents
              </a>
            </Link>
            <Link href="/global">
              <a className={styles.link}>Bid in Daily Auctions</a>
            </Link>
            <Link href="https://digitalax.xyz/look">
              <a className={styles.link} target="_blank">
                Read the Documentation
              </a>
            </Link>
            <Link href="/opensourcelibraries">
              <a className={styles.link}>Contribute CC0</a>
            </Link>
            <Link href="/getdressed">
              <a className={styles.link}>Join the DAO</a>
            </Link>
          </div>
          {isMobile && !user && (
            <a className={styles.link} onClick={() => handleClick()}>
              {buttonText}
            </a>
          )}
          <div className={styles.signBtn}>
            {user ? (
              <div className={styles.buttonWrapper}>
                <SmallPhotoWithText
                  photo={
                    user.get("avatar")
                      ? user.get("avatar")
                      : "./images/user-photo.svg"
                  }
                  address={user.get("username")}
                  className={styles.hashAddress}
                >
                  <button
                    className={styles.arrowBottom}
                    onClick={() => setIsShowMenu(!isShowMenu)}
                  >
                    <img
                      className={styles.arrowBottomImg}
                      src="./images/icons/arrow-bottom.svg"
                      alt="arrow-bottom"
                    />
                  </button>
                </SmallPhotoWithText>
                {isShowMenu && (
                  <div className={styles.menuWrapper}>
                    <button
                      onClick={() => handleProfileClick()}
                      className={styles.menuButton}
                    >
                      Profile
                    </button>
                    {isDesigner && (
                      <button
                        onClick={() => handleViewDesignerPageClick()}
                        className={styles.menuButton}
                      >
                        View Designer Page
                      </button>
                    )}
                    {isDesigner && (
                      <button
                        onClick={() => handleEditDesignerPageClick()}
                        className={styles.menuButton}
                      >
                        Edit Designer Page
                      </button>
                    )}
                    <button
                      onClick={() => handleLogoutClick()}
                      className={styles.menuButton}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => handleClick()}
                className={styles.signButton}
              >
                {buttonText}
              </Button>
            )}
          </div>
          <a className={styles.collapseIcon} onClick={onIconHander}>
            <div></div>
            <div></div>
            <div></div>
          </a>
        </div>
      </div>
    </div>
  );
};

HeaderTopLine.propTypes = {
  className: PropTypes.string,
  buttonText: PropTypes.string,
};

HeaderTopLine.defaultProps = {
  className: "",
  buttonText: "SIGN IN",
};

export default HeaderTopLine;
