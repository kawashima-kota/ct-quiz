import { StylesProvider } from "@material-ui/styles";
import React, { useState, useEffect } from "react";
import { auth,db } from "../firebase/index";
import styles from "./Quiz.module.css";
import Result from "./Result";
import { Wrapper, ButtonWrapper } from "./Quiz.styles";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

interface PROPS{
  time:number;
}

const Quiz: React.FC<PROPS> = (props:PROPS) => {
  const [quizzes, setQuizzes] = useState([
    {
      id: "",
      question: "",
      answers: [],
      shuffledAnswers: [],
      correctAnswer: 100,
      commentary:""
    }
  ]);
  const [questionNum, setQuestionNum] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctNum, setCorrectNum] = useState(0);
  const [isResult, setIsResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState(100);
  const [time , setTime] = useState(0);
  let timer = 0;

  const [username,setUsername] = useState<string | null | undefined>("");

  //ユーザーの名前を取得
  useEffect(() => {
    const unSub = auth.onAuthStateChanged(user => {
      setUsername(user?.displayName);
    });
    return () => unSub();
  }, []);

  //データベースからクイズ情報を取得
  useEffect(() => {
    //マウント時の処理
    const unSub = db.collection("quizzes").onSnapshot(snapshot => {
      setQuizzes( 
        shuffle(snapshot.docs.map(doc => ({
            id: doc.id,
            question: doc.data().question,
            answers: doc.data().answers,
            shuffledAnswers: shuffle([...doc.data().answers]),
            correctAnswer: doc.data().correctAnswer,
            commentary:doc.data().commentary,
          })))
      );
    });
    //アンマウント時の処理
    return () => unSub();
  }, []);

  //並び替え処理
  const shuffle = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      //入れ替え
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  };

  //正誤判定
  const checkAnswer = (e: any) => {
    
    if (isAnswered) {
      return;
    }
    setIsAnswered(true);
    setUserAnswer(
      quizzes[questionNum].answers.indexOf(e.target.value as never)
    );
    // console.log(e.target.value);
    // console.log(quizzes[questionNum].correctAnswer);

    //型キャストしなくても良いようにするには？
    if (
      quizzes[questionNum].answers.indexOf(e.target.value as never) ==
      quizzes[questionNum].correctAnswer
    ) {
      console.log("正解");
      //e.target.classList.add("Quiz_correct__3bYnT");
      alert("正解");
      setCorrectNum(correctNum + 1);
    } else {
      console.log("不正解");
      //e.target.classList.add("Quiz_wrong__R0gTr");
      alert("不正解");
    }
  };

  //次へボタン
  const next = () => {
    if (!isAnswered) {
      alert("問題に回答してください");
      return;
    }
    setQuestionNum(questionNum + 1);
    setIsAnswered(false);
    setUserAnswer(100);
  };

  //やり直すボタン
  const back = () => {
    setQuestionNum(0);
    setCorrectNum(0);
    setUserAnswer(100);
    setIsResult(false);
    setIsAnswered(false)
  };

  //結果を表示
  const result = () => {
    if (!isAnswered) {
      alert("問題に回答してください");
      return;
    }
    //経過時間
    timer = props.time;
    setTime(timer); 
    setIsResult(true);

    //結果をデータベースに送信
    db.collection("results").doc(username!).collection(username!).add({
      score: (correctNum/(questionNum+1))*100,
      time:props.time,
    })
  };

  return (
    <Wrapper>
      {isResult ? (
        <Result correctNum={correctNum} questionNum={quizzes.length} time={time} username={username} />
      ) : (
        <div>
          <h3 className={styles.question}>
            問題{questionNum + 1} {quizzes[questionNum].question}
          </h3>
          <div className={styles.answers}>
            {quizzes[questionNum].shuffledAnswers.map((ans, ansIndex) => {
              return (
                <ButtonWrapper
                  key={ansIndex}
                  correct={
                    quizzes[questionNum].correctAnswer ==
                      quizzes[questionNum]?.answers.indexOf(ans) && isAnswered
                  }
                  userClicked={
                    userAnswer == quizzes[questionNum]?.answers.indexOf(ans)
                  }
                >
                  <button
                    key={ansIndex}
                    value={ans}
                    onClick={(e: any) => {
                      checkAnswer(e);
                      //console.log(quizzes[questionNum].answers.indexOf(ans));
                      //console.log(quizzes[questionNum].correctAnswer);
                    }}
                  >
                    {ans}
                  </button>
                </ButtonWrapper>
              );
            })}
            <br />

            {!isAnswered ? (
              <div className={styles.container}>
                <Button onClick={back} className={styles.back} variant="contained">
                  やり直す
                </Button>
                <div className={styles.trans}>※回答してください</div>
                <div className={styles.dummy}>やり直すぜ</div>
              </div>
            ) : quizzes.length - 1 !== questionNum ? (
              <div className={styles.container}>
                <Button onClick={back} className={styles.back} variant="contained">
                  やり直す
                </Button>
                <Button onClick={next} variant="contained" color="primary">
                <ArrowForwardIcon />
                  次へ
                </Button>
                <div className={styles.dummy}>やり直すぜ</div>
              </div>
            ) : (
              <div className={styles.container}>
                <Button onClick={back} className={styles.back} variant="contained">
                  やり直す
                </Button>
                <Button onClick={result} className={styles.next}
                variant="contained"
                >
                  スコアを表示する
                </Button>
                <div className={styles.dummy}>やり直すぜ</div>
              </div>
            )}
          </div>
          <br/>

          {isAnswered 
          ?
          <div className={styles.content}>
            <h3>解説</h3>
            <span>
            {
            quizzes[questionNum].commentary == "" 
            ? "この問題に対する解説はありません。スタート画面のメニューバーにある「お問い合わせ」から解説文を送って頂けると嬉しいです。"
            : 
            quizzes[questionNum].commentary
            }
            </span>
          </div>
          :
          <div></div> 
          }
        </div>
      )}
    </Wrapper>
  );
};

export default Quiz;
