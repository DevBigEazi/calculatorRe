import { ACTION } from '../App'
import React from 'react'

export default function OperationButton({dispatch, operation}) {
  return (
    <button onClick={() => {dispatch({type: ACTION.CHOOSE_OPERATION, payload: {operation}})}}>{operation}</button>
  )
}
