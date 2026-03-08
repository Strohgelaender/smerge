import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

import "./Layout.css";
import { useTranslation } from "react-i18next";
import httpService from "./services/HttpService";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "./services/TeacherAuthService";

// function Layout() {

const drawerWidth = 240;
const navItems = [
  {
    name: "main.nav_howto",
    foo: () => {
      window.location.href = "/howto";
    },
  },
  {
    name: "main.nav_impressum",
    foo: () => {
      window.location.href = "/impressum";
    },
  },
  {
    name: "main.nav_back",
    foo: () => {
      window.history.back();
    },
  },
  {
    name: getCurrentUser()? "Teacher-View" : "main.nav_teacherlogin",
    foo: () => {
        // TODO remove /ext once migration is finished
      const destination = getCurrentUser()? "ext/teacher_view" : "ext/teacher_login";
      if(window.location.href.includes("/ext")){
        window.location.href = window.location.href.split("ext")[0] + destination;
      }
      else {
        window.location.href = destination
      }
    }
  },
  {
    name: getCurrentUser()? "Logout" : "",
    foo: () => {
      if(window.location.href.includes("/ext") && getCurrentUser()){
        logout();
        window.location.href = window.location.href.split("ext")[0] + "ext/teacher_login";
      }
    }
  }
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const { t } = useTranslation();

  // check if csfr token was set and redirect to missing page if not
  const navigate = useNavigate();

  // TODO: New mechnaism to enuse security when full client is in react (no token)

  /*useEffect(() => {
    if (
      httpService.csrftoken === "" &&
      !location.href.includes("csfr_missing")
    ) {
      // react router to missing page
      console.log(
        location.href.split("/")[location.href.split("/").length - 1]
      );
      const lastPart =
        location.href.split("/")[location.href.split("/").length - 1];
      if (lastPart.includes("csfr_missing")) {
        navigate("/ext/csfr_missing");
      } else {
        navigate("/ext/csfr_missing/" + lastPart);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);*/
  navItems.push();
  const container = window.document.body;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} onClick={item.foo}>
              <ListItemText primary={t(item.name)} className="nav_text" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", paddingLeft: "0px", height: "64px" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{ pl: "0px" }}
        style={{ height: "64px", background: "rgb(15,3,3)" }}
      >
        <Toolbar
          sx={{
            width: "100%",
            paddingLeft: "0px !important",
            paddingRight: "1.8% !important",
            background: "rgb(15,3,3);",
          }}
        >
          <a href="/" className="logo">
            {document.title.includes("DEV")
              ? "SMERGE (DEV)"
              : document.title.includes("BETA")
              ? "SMERGE (BETA)"
              : "SMERGE"}
          </a>
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                sm: "flex",
                paddingRight: "11px",
                paddingBottom: "0px",
              },
              justifyContent: "end",
            }}
          >
            {navItems.map((item) => (
              <Button
                className="nav_text"
                key={item.name}
                sx={{ color: "#fff" }}
                onClick={item.foo}
              >
                {t(item.name)}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", sm: "none" },
              justifyContent: "end",
            }}
            style={{ height: "64px" }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon fontSize={"large"} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default Layout;
