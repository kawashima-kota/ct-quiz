import React, {useState, useCallback, useEffect} from 'react';
import { db } from "../../firebase/index";
import firebase from "firebase/app";
import TextInput from "./TextInput"

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface PROPS{
  open:boolean;
  handleOpen:any;
  handleClose:any;
}

const AddQuizDialog:React.FC<PROPS>= (props:PROPS) => {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  //const [answers, setAnswers] = useState<any[]>([]);
  const [answer1 , setAnswer1] = useState("");
  const [answer2 , setAnswer2] = useState("");
  const [answer3 , setAnswer3] = useState("");
  const [commentary, setCommentary] = useState("");

  //useCallbackでinput処理
  const inputQuestion = useCallback((e) => {
    setQuestion(e.target.value);
  },[setQuestion]);

  const inputCorrectAnswer = useCallback((e) => {
    setCorrectAnswer(e.target.value);
  },[setCorrectAnswer]);

  const inputAnswer1 = useCallback((e) => {
    setAnswer1(e.target.value);
  },[setAnswer1]);

  const inputAnswer2 = useCallback((e) => {
    setAnswer2(e.target.value);
  },[setAnswer2]);

  const inputAnswer3 = useCallback((e) => {
    setAnswer3(e.target.value);
  },[setAnswer3]);

  // const inputAnswers = useCallback((e) => {
  //   setAnswers([e.target.value,...answers]);
  // },[setAnswers]);

  const inputCommentary = useCallback((e) => {
    setCommentary(e.target.value);
  },[setCommentary]);

  //必須項目に入力があるかをチェック
  const validateRequiredInput = (...args:any[]) => {
    let isBlank = false;
    for (let i = 0; i < args.length; i=(i+1)|0) {
        if (args[i] === "") {
            isBlank = true;
        }
    }
    return isBlank;
};

  //データベースに新規クイズを追加
  const addNewQuiz = () => {

    //必須項目に入力があるかをチェック
    const isBlank = validateRequiredInput(question, correctAnswer, answer1,answer2,answer3);
    if (isBlank) {
      alert('必須入力欄が空白です。');
      return false;
    } 

    db.collection("quizzes").add({
      question: question,
      answers:[correctAnswer,answer1,answer2,answer3],
      correctAnswer:0,
      commentary:commentary,
    });
    setQuestion("");
    setCorrectAnswer("");
    setAnswer1("");
    setAnswer2("");
    setAnswer3("");
    setCommentary("");
    alert("クイズの登録に成功しました。");

    //通知内容
    const payload = {
      text: '新規クイズ\n'
          + '問題: ' +question +'\n'
          + '正解の回答: ' +correctAnswer +'\n'
          + '選択肢の候補1: ' +answer1 +'\n'
          + '選択肢の候補2: ' +answer2 +'\n'
          + '選択肢の候補3: ' +answer3 +'\n'
          + '解説: ' + commentary
    };
    //送信するslackURL
    const WEBHOOK_URL = "https://hooks.slack.com/services/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";

    //slackへクイズ追加の通知
    fetch(WEBHOOK_URL,{
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  return (
      <Dialog open={props.open} onClose={props.handleClose}>
          <DialogTitle>お問い合わせフォーム</DialogTitle>
          <DialogContent>
          <TextInput
              label={"問題(必須)"} multiline={false} rows={1}
              value={question} type={"text"} onChange={inputQuestion}
          />
          <TextInput
              label={"正解の回答(必須)"} multiline={false} rows={1}
              value={correctAnswer} type={"text"} onChange={inputCorrectAnswer}
          />
          <TextInput
              label={"選択肢の候補1(必須)"} multiline={false} rows={1}
              value={answer1} type={"text"} onChange={inputAnswer1}
          />
          <TextInput
              label={"選択肢の候補2(必須)"} multiline={false} rows={1}
              value={answer2} type={"text"} onChange={inputAnswer2}
          />
          <TextInput
              label={"選択肢の候補3(必須)"} multiline={false} rows={1}
              value={answer3} type={"text"} onChange={inputAnswer3}
          />
          <TextInput
              label={"解説(任意)"} multiline={true} rows={5}
              value={commentary} type={"text"} onChange={inputCommentary}
          />
          </DialogContent>
          <DialogActions>
              <Button onClick={props.handleClose} color="primary">
                  キャンセル
              </Button>
              <Button onClick={addNewQuiz} color="primary">
                  クイズを登録
              </Button>
          </DialogActions>
      </Dialog>
  );
}

export default AddQuizDialog
