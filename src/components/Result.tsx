import React,{useState, useEffect} from 'react';
import styles from './Result.module.css';
import {auth, db} from "../firebase/index"

interface PROPS{
  correctNum: number;
  questionNum: number;
  time: number;
  username:string | null | undefined;
}

const Result:React.FC<PROPS>= (props:PROPS) => {

  const answerRate :number = (props.correctNum/props.questionNum) * 100;

  const [scores, setScores] = useState([{
    score:0,
    time:0,
  }]);
  //データベースから過去の結果を取得
  useEffect(() => {
    const unSub = db.collection("results").doc(props.username!).collection(props.username!).onSnapshot(snapshot => {
      setScores(
        snapshot.docs.map(doc=>({
          score: doc.data().score,
          time: doc.data().time,
        }))
      )
    });
    //アンマウント時の処理
    return () => unSub();
  }, []);

  let scoreNum = 0;

  return (
    <div>
      今回の結果は、
      問題数{props.questionNum}で、
      {props.username}さんの正解数は{props.correctNum}でした。
      <br/>
      正答率は{answerRate}%です。
      <br/>
      {props.time}秒かかりました。
      <br/>

      {props.username}さんの過去の結果は次の通りです。
      <div>
      {
        scores.map(result=>{
          scoreNum ++;
          return(           
        <li key={result.score}>{scoreNum}回目... 正答率: {result.score}, タイム: {result.time}</li>
        )})
      }
      </div>
    </div>
  )
}

export default Result
