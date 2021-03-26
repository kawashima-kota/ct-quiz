import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styles from "./StartButton.module.css"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

interface PROPS{
  setIsStart :any;
  time:number;
  setTime: any ;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

const StartButton:React.FC<PROPS>=(props:PROPS) => {
  const classes = useStyles();

  let time:number= 0;
  const startTimer = () => {
    setInterval(() => {
      props.setTime(time ++);
    }, 1000);
  }

  return (
    <div className={classes.root}>
      <div className={styles.container}>
      <div className={styles.title}>
        <h2>圏論クイズ</h2>
      </div>
      <div className={styles.content}>
        <p>
        クイズ形式で圏論に関する問題が出題されます。
        </p>
        <p>
        回答時間と正答率に応じてあなたの圏論力を測定します。
        </p>
        <br/>
        <p>
        さあ、あなたの圏論力を試してみましょう！
        </p>
      </div>
      <br/>
      <div className={styles.button}>
      <Button variant="contained" color="primary" onClick={()=>{
        props.setIsStart(true);
        startTimer();
      }}>
      <ArrowForwardIcon/>
       圏論クイズを始める
      </Button>
      </div>
      <br/>
      <div>
      <div className={styles.content}>
        <h3>圏論とは？</h3>
        <p>
        圏論は1945年にマクレーンによって創始されて以来，あらゆる数学理論へ応用されてきた.2020 年 4 月 には ABC 予想を解決したとされる望月新一の IUT 理論に関する論文が専門誌に受理されたことで世界中を 賑わせたが，IUC 理論においても圏論は重要な役割を果たしている.近年では，数学理論への応用に留まらず，物理学や計算機科学をはじめとする科学分野への応用が目覚しく，幅広い学問分野における研究者から 関心の的となっている.また，圏論を用いた科学を統一するプロジェクト「圏論的統一科学」というものもある.圏論は諸学問へ応用されると共にそれらを統合する機能を持っているようである.実際，2015年にはDeepMind社が開発したAlpha Go がプロ囲碁棋士に勝利して以来，人工知能(AI)が学術界・産業界のトレンドとなっているが，圏論を用いた記号的 AI と統計的 AI というAIの二つの側面を統合する試みも成されている.
        </p>

        <h3>圏論の応用先</h3>
        <ul>
          <li>物理学：圏論的量子力学や量子トポスなど、特に量子力学へ応用されている</li>
          <li>計算機科学：計算論の基礎やプログラミング言語理論、近年では人工知能やビッグデータ解析などにも応用されている</li>
          <li>論理学：論理学全般へ応用されている。各論理体系に対応する圏構造が存在する。例えば、直観主義命題論理の体系はカルテシアン閉圏に、直観主義線形論理の体系は対称モノイダル閉圏に、一階述語論理はハイパードクトリンに、高階論理はトポスやトライポスに対応する。
          </li>
        </ul>

        <h3>圏論を学習するメリット</h3>
        <ol>
          <li>物理学と計算機科学と論理学の間の深い対応関係（カリー・ハワード・ランベック対応やアブラムスキー・クッカ対応）を知ることができる。</li>
          <li>公理的集合論に代わる数学を記述する言語を習得できる。（科学一般の言語にもなり得るので科学を記述する言語を習得できるとも言える。）</li>
          <li>関数型プログラミング言語でよく出てくる概念を数学的に理解できる。（例：関手、モナドなど）</li>
        </ol>

        <h3>まずはやってみよう！</h3>
        <div className={styles.button}>
        <Button variant="contained" color="primary" onClick={()=>{
        props.setIsStart(true);
        startTimer();
        }}>
      <ArrowForwardIcon/>
       圏論クイズを始める
      </Button>
      </div>
      <br/>
      </div>
      </div>
      </div>
    </div>
  );
}

export default StartButton;