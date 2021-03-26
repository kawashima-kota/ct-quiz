import React ,{useState, useEffect} from 'react';
import styles from './App.module.css';
import MenuBar from './components/MenuBar';
import QuizContainer from './components/QuizContainer';
import { db, auth } from "./firebase";
import { GlobalStyle, Wrapper } from './App.styles';

const App:React.FC = (props:any) => {
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    const unSub = auth.onAuthStateChanged(user => {
      !user && props.history.push("/login");
    });
    return () => unSub();
  }, []);

  return (
    <>
    <GlobalStyle />
    <div className={styles.App}>
      {isStart 
      ? <div></div>
      :<MenuBar isStart={isStart} />
      }
      <QuizContainer isStart={isStart} setIsStart={setIsStart} />
    </div>
    </>
  );
}

export default App;
