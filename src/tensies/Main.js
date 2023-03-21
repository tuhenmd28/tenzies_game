import React, { useEffect, useState } from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function Main() {
    const [dies,setDies]=useState(getDiesArray());
    const [win,setWin]=useState(false);
    const [Time,setTime]=useState(0);
    const [lessTime,setLessTime] = useState(
        localStorage.getItem('lessTime')?localStorage.getItem('lessTime'):0
        );
    const [ForTime, setForTime] = useState({
        count:0,
        start:false,
        firstClick:false
    });
    // console.log(lessTime);
    useEffect(
        () => {
            const timer = () => {
                setForTime(pre=>pre.firstClick?{...ForTime,count:ForTime.count+1}:pre);
            }
            
            const id = setInterval(timer, 1000);
            return () => clearInterval(id);
        },
        [ForTime]
        );
        console.log(Time);
        useEffect(() => {
            // console.log(ForTime.count);
            console.log(Number(localStorage.getItem("lessTime")));
            if(ForTime.count<Number(localStorage.getItem("lessTime")) ||Number(localStorage.getItem("lessTime"))===0 ){
                localStorage.setItem('lessTime', Time);
            }
        }, [ForTime]);

        useEffect(()=>{
            let holdCheck = dies.every(die=>die.isHold);
            let firstNumber = dies[0].value;
            let checkSame = dies.every(die=>die.value===firstNumber);            
            if(holdCheck && checkSame){
                setWin(true);
                setTime(ForTime.count<lessTime?ForTime.count:lessTime)
                setTime(ForTime.count)
            setForTime({
                count:0,
                start:false,
                firstClick:false
            })
        }

    },[dies])

    function getNewDie(){
        return {value:Math.ceil(Math.random()*6),id:nanoid(),isHold:false};
    }
    function getDiesArray(){
        const diesArray = [];
        for (let index = 0; index < 10; index++) {
            diesArray.push(getNewDie())
        }
        return diesArray;
    }
    function rollNumber(){
        if(!win){
            setDies(oldDie=>oldDie.map(die=>{
                return die.isHold? die:getNewDie();
            }))
        }else{
            setWin(false)
            setDies(getDiesArray())
        }
    }

    function holdFunction(id){
        setDies(oldDie=>(oldDie.map(Die=>(
             Die.id===id?{...Die,isHold:!Die.isHold}:Die
        ))))
        setForTime({...ForTime,start:true,firstClick:true})
    }
  return (
    <div className='main_contain'>
        {win && <Confetti/>}
        <h1 className='title'>Tenzies </h1>
        <span>{}</span>
        <p className='text'>Roll until all dice are the same. Click each die
        to freeze it at its current value between rolls.</p>

        {ForTime.start&& !win && <h4 className='text'>
             {`Time:-${Math.floor(ForTime.count/60).toString().length>1?Math.floor(ForTime.count/60):'0'+Math.floor(ForTime.count/60)}:${(ForTime.count%60).toString().length>1?Math.floor(ForTime.count%60):'0'+Math.floor(ForTime.count%60)}`}
        </h4>}
        {win && <h4 className='text'>{`Time:-${Math.floor((lessTime/60)).toString().length>1?Math.floor(lessTime/60):'0'+Math.floor(lessTime/60)}:${Math.floor((lessTime % 60)).toString().length>1?(lessTime%60):'0'+(lessTime%60)}`}</h4>}

      <div className="dies_wrap">
        {dies.map((die)=>(
            <Die 
            key={die.id}
            value={die.value}
            isHold={die.isHold} 
            holdFunction={()=>holdFunction(die.id)}
            />
        ))}
      </div>
    <button onClick={rollNumber} className='roll'> {win?"New Game":"Roll"} </button>
    </div>
  )
}
