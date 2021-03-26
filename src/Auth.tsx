import React, { useState, useEffect } from "react";
import { auth, storage, provider } from "./firebase/index";
import styles from "./Auth.module.css";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box
} from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage:
      "url(https://i.pinimg.com/originals/b6/4b/6d/b64b6deae5b04d5c40476605da6e2b5b.png)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1)
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10)
  }
}));

const Auth: React.FC = (props: any) => {
  const classes = useStyles();

  //ログイン・サインアップ
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  //パスワードリセット
  const [openModal, setOpenModal] = React.useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
        alert("パスワードの再設定用のメールを送信しました。");
      })
      .catch(err => {
        alert(err.message);
        setResetEmail("");
      });
  };

  //マクレーンさんの呟き
  const [openModal2, setOpenModal2] = useState(false);

  //画像を登録
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  //メールでサインイン
  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
    alert("ログインに成功しました。");
  };

  //メールでサインアップ
  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    let url = "";
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map(n => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage
        .ref("avatars")
        .child(fileName)
        .getDownloadURL();
    }
    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url
    });
    alert("ユーザー情報を登録しました。");
  };

  //googleアカウントでサインアップorログイン
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch(err => alert(err.message));
    props.history.push("/");
    alert("ログインに成功しました。");
  };

  //ユーザー情報を取得した時点でページ遷移
  useEffect(() => {
    const unSub = auth.onAuthStateChanged(user => {
      user && props.history.push("/");
    });
    return () => unSub();
  }, [props.history]);

  return (
    <div>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Typography component="h1" variant="h4" color="primary">
              Welcome to 圏論クイズ
            </Typography>
            <Avatar
              className={classes.avatar}
              src="https://upload.wikimedia.org/wikipedia/commons/2/27/Saunders_MacLane.jpg"
              onClick = {()=>{
                setOpenModal2(true);
              }}
            >
            </Avatar>
            <Typography component="h1" variant="h5">
              {isLogin ? "ログイン" : "登録"}
            </Typography>
            <form className={classes.form} noValidate>
              {!isLogin && (
                <>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <Box textAlign="center">
                    <IconButton>
                      <label>
                        <Avatar
                          className={classes.avatar}
                          src={
                            // ユーザーが画像を選択したらそれを表示させるようにしたい
                            //avatarImageはBooleanではないことに注意
                            avatarImage 
                            ? "https://upload.wikimedia.org/wikipedia/commons/9/93/William_Lawvere.jpg" 
                            : ""
                          }
                        />
                        <input
                          className={styles.login_hiddenIcon}
                          type="file"
                          onChange={onChangeImageHandler}
                        />
                      </label>
                    </IconButton>
                  </Box>
                </>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                }}
              />

              <Button
                disabled={
                  isLogin
                    ? !email || password.length < 6
                    : !username || !email || password.length < 6 || !avatarImage
                }
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                startIcon={<EmailIcon />}
                onClick={
                  isLogin
                    ? async () => {
                        try {
                          await signInEmail();
                        } catch (err) {
                          alert(err.message);
                        }
                      }
                    : async () => {
                        try {
                          await signUpEmail();
                        } catch (err) {
                          alert(err.message);
                        }
                      }
                }
              >
                {isLogin ? "ログイン" : "登録"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <span
                    className={styles.login_reset}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    パスワードをお忘れですか？
                  </span>
                </Grid>
                <Grid item>
                  <span
                    className={styles.login_toggleMode}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "新規アカウント作成" : "ログイン画面へ"}
                  </span>
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<CameraIcon />}
                className={classes.submit}
                onClick={signInGoogle}
              >
                Googleアカウントでログイン
              </Button>
            </form>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <div style={getModalStyle()} className={classes.modal}>
                <div className={styles.login_modal}>
                  <TextField
                    InputLabelProps={{
                      shrink: true
                    }}
                    type="email"
                    name="email"
                    label="Reset E-mail"
                    value={resetEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setResetEmail(e.target.value);
                    }}
                  />
                  <IconButton onClick={sendResetEmail}>
                    <SendIcon />
                  </IconButton>
                </div>
              </div>
            </Modal>
            <Modal open={openModal2} onClose={() => setOpenModal2(false)}>
              <div style={getModalStyle()} className={classes.modal}>
                私の名前はマクレーン。圏論を作った数学者じゃ。
                <br/>
                初めてクイズに挑戦するものは、ユーザー登録をしてくれ。そうじゃないものは、登録したアカウントでログインしてくれ。
                <br/>
                健闘を祈る。
              </div>
            </Modal>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Auth;
