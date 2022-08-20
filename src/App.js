import {useRef, useEffect, useReducer} from "react";
import Char from "./components/Char";
import "./global.css";

const text = () => `My name is al imam, I'm student in lakshmipur politechnic institute.`.split("");

const ACTIONS = {
	INIT: "INIT",
	INPUT_CHANGE: "INPUT_CHANGE",
	RESET: "RESET",
	TIME: "TIME",
}

const initState = {
	activeIndex: 0,
	inputText: "",
	time: 0,
	testText: null,
	correctWord: 0
}

function reducer(prevState, action) {
	switch(action.type) {
		case ACTIONS.INPUT_CHANGE:
			const {text} = action.payload;
			const textArray = text.split(" ");
			const correctWord = prevState.testText.filter((item) => textArray.indexOf(item) !== -1).length;

			return {
				...prevState,
				inputText: text,
				activeIndex: text.length,
				correctWord: correctWord
			}
			
		case ACTIONS.RESET:
			return {
				...action.payload,
				testText: prevState.testText
			}
			
		case ACTIONS.TIME:
			return {
				...prevState,
				time: prevState.time + 1
			}
			
		case ACTIONS.INIT:
			return {
				...prevState,
				testText: action.payload
			}
			
		default: return prevState;
	}
}


function App() {
	const [state, dispatch] = useReducer(reducer, initState);
	const {current} = useRef(text());
	const inputRef = useRef(null);
	const id = useRef(null);

	const proccesInput = (value) => {
		dispatch({type: ACTIONS.INPUT_CHANGE, payload: {text: value}})

		if (value.length >= current.length) {
			inputRef.current.disabled = true;
			clearInterval(id.current)
			return;
		}
	}

	const handleStart = (e) => {
		clearInterval(id.current)
		dispatch({type: ACTIONS.RESET, payload: initState})
		inputRef.current.disabled = false;
		inputRef.current.focus();
		
		id.current = setInterval(() => {
			dispatch({type: ACTIONS.TIME})
		}, 1000)
	}

	useEffect(() => {
	
		dispatch({type: ACTIONS.INIT, payload: current.join("").split(" ")})
		inputRef.current.disabled = true;
		
	}, [current])
	
  	return (
    	<div>
			<div>
				<p>Time Ellepsed: {`${Math.floor(state.time / 60)}`.padStart("2", "0")}:{`${state.time % 60}`.padStart("2", "0")}</p>
				<p>Word Per Minute: {((state.correctWord / (state.time / 60)) || 0).toFixed(2)}</p>
			</div>
    		<p>{current.map((char, index) => <Char active={index === state.activeIndex} char={char} correct={char === state.inputText[index] ? true : state.activeIndex < index ? null : false } />)}</p>
    		<input ref={inputRef} value={state.inputText} onChange={(e) => proccesInput(e.target.value)} type="text" />
    		<button type="button" onClick={handleStart}>{state.inputText === "" ? "Start Test" : "Restart Test"}</button>
    	</div>
  	);
}

export default App;
