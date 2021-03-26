import { StylesProvider } from '@material-ui/styles'
import React,{useState} from 'react'
import Quiz from './Quiz'
import Result from './Result'
import styles from "./QuizContainer.module.css"
import StartButton from './StartButton'

interface PROPS{
  isStart:boolean;
  setIsStart:any;
}

const QuizContainer:React.FC<PROPS> = (props:PROPS) => {
  const [time , setTime] = useState(0);

  return (
    <>
    {props.isStart ? (
      <div className={styles.container}>
        <Quiz time={time}/>
        <br/>
        <br/>
        <a href="">スタート画面に戻る</a>
      </div>
    ): (
        <StartButton setIsStart={props.setIsStart} time={time} setTime={setTime}/>
    )}
    </>
  )
}

export default QuizContainer
