import React,{useState,useEffect,useCallback} from "react";
import {auth,db} from "../firebase/index";
import FormDialog from './Form/FormDialog';
import AddQuizDialog from './AddQuiz/AddQuizDialog';

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    modal: {
      outline: "none",
      position: "absolute",
      height: 400,
      width: 500,
      borderRadius: 10,
      backgroundColor: "white",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(10)
    }
  })
);


interface PROPS{
  isStart:boolean;
}

const MenuBar: React.FC<PROPS> = (props:PROPS) => {
  const classes = useStyles();
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [openForm, setOpenForm] = useState(false);
  // 問い合わせフォーム用モーダルを開くCallback関数
  const openModalForm = useCallback(() => {
      setOpenForm(true)
  },[setOpenForm]);

  // 問い合わせフォーム用モーダルを閉じるCallback関数
  const closeModalForm = useCallback(() => {
      setOpenForm(false)
  },[setOpenForm]);

  const [openAddQuiz, setOpenAddQuiz] = useState(false);
  //クイズ追加メニューを開くCallback関数
  const openAddQuizModal = useCallback(() => {
    if(props.isStart){
      alert("クイズの追加はスタート画面で行ってください。");
      console.log(props.isStart);
    }else{
      setOpenAddQuiz(true);
      console.log(props.isStart);
    }
  },[setOpenAddQuiz]);
  //クイズ追加メニューを閉じるCallback関数
  const closeAddQuizModal = useCallback(() => {
    setOpenAddQuiz(false);
  },[setOpenAddQuiz]);


  //メニューをクリックした時の処理
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
            aria-controls="simple-menu"
            aria-haspopup="true"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={async ()=>{
              //ログアウト
              await auth.signOut();
              handleClose()
            }}>
              ログアウト
            </MenuItem>
            <MenuItem onClick={()=>{
              openAddQuizModal();
              handleClose();
            }}>
              クイズを追加する
            </MenuItem>
            <MenuItem onClick={()=>{
              openModalForm();
              handleClose()
            }}>
              お問い合わせ
            </MenuItem>
          </Menu>
          <Typography variant="h6" color="inherit">
            圏論クイズ
          </Typography>
        </Toolbar>
      </AppBar>
       <FormDialog open={openForm} handleOpen={openModalForm} handleClose={closeModalForm}/>

      <AddQuizDialog open={openAddQuiz} handleOpen={openAddQuizModal} handleClose={closeAddQuizModal} />
    </div>
  );
};

export default MenuBar;