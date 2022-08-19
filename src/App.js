import { useReducer } from "react";
import DigitButton from "./Components/DigitButton";
import OperationButton from "./Components/OperationButton";

export const ACTION = {
ADD_DIGIT: 'addDigit',
CHOOSE_OPERATION: 'chooseOperation',
DELETE_DIGIT: 'deleteDigit',
CLEAR: 'clear',
EVALUATE: 'evaluate'
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state, 
          currentOutput: payload.digit,
          overwrite: false
        }
      }

      if(payload.digit === '0' && state.currentOutput === '0') {
        return state
      }

      if(payload.digit === '.' && state.currentOutput === '.') {
        return state
      }

      return {
        ...state,
        currentOutput: `${state.currentOutput || ''}${payload.digit}`,
      }

    case ACTION.CHOOSE_OPERATION:
      if(state.currentOutput == null && state.previousOutput == null) {
        return state
      }

      if(state.previousOutput == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOutput: state.currentOutput,
          currentOutput: null         
        }
      }
      return {
        ...state,
        previousOutput: evaluate(state),
        operation: payload.operation,
        currentOutput: null
      }

    case ACTION.CLEAR:
      return {}

    case ACTION.DELETE_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOutput: null,
        }
      }

      if (state.currentOutput == null) return state
      if (state.currentOutput.length === 1) {
        return { ...state, currentOutput: null }
      }

      return {
        ...state,
        currentOutput: state.currentOutput.slice(0, -1)
      }
       
    case ACTION.EVALUATE:
      if( state.operation == null || state.currentOutput == null || state.previousOutput == null)
      return {
        state
      }
      return {
        ...state,
        overwrite: true,
        previousOutput: null,
        operation: null,
        currentOutput: evaluate(state)
      }
  }
}

const evaluate = ({currentOutput, previousOutput, operation}) => {
  const prev = parseFloat(previousOutput)
  const current = parseFloat(currentOutput)
  if(isNaN(prev) || isNaN(current)) return ''

  let calculation = ''

  switch (operation) {
    case '+':
      calculation = prev + current
      break;
    case '-':
      calculation = prev - current
      break;
    case 'x':
      calculation = prev * current
      break;
    case '÷':
      calculation = prev / current
      break;
  }
    return calculation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0
})

function formatOutput(output) {
  if (output == null) return
  const [integer, decimal] = output.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {

  const [{currentOutput, previousOutput,operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator">
      <div className="outputField">
        <div className="previousOutput">
        {formatOutput(previousOutput)} {operation}
        </div>
        <div className="currentOutput">
          {formatOutput(currentOutput)}
        </div>
      </div>
      <button className="spanButton" onClick={()=>{dispatch({type: ACTION.CLEAR})}}>AC</button>
          <button onClick={()=>{dispatch({type: ACTION.DELETE_DIGIT})}}>DEL</button>
          <OperationButton operation={'+'} dispatch={dispatch}/>
          <DigitButton digit={'7'} dispatch={dispatch}/>
          <DigitButton digit={'8'} dispatch={dispatch}/>
          <DigitButton digit={'9'} dispatch={dispatch}/>
          <OperationButton operation={'-'} dispatch={dispatch}/>
          <DigitButton digit={'4'} dispatch={dispatch}/>
          <DigitButton digit={'5'} dispatch={dispatch}/>
          <DigitButton digit={'6'} dispatch={dispatch}/>
          <OperationButton operation={'x'} dispatch={dispatch}/>
          <DigitButton digit={'3'} dispatch={dispatch}/>
          <DigitButton digit={'2'} dispatch={dispatch}/>
          <DigitButton digit={'1'} dispatch={dispatch}/>
          <OperationButton operation={'÷'} dispatch={dispatch}/>
          <DigitButton digit={'.'} dispatch={dispatch}/>
          <DigitButton digit={'0'} dispatch={dispatch}/>
          <button className="spanButton" onClick={()=>{dispatch({type: ACTION.EVALUATE})}}>=</button>
    </div>
  );
}

export default App;
