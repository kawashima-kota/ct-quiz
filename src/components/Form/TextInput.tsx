import React from 'react'
import TextField from "@material-ui/core/TextField";

interface PROPS{
  label:any,
  multiline:any,
  rows:any,
  value:any,
  type:any,
  onChange:any
}

const TextInput:React.FC<PROPS> = (props:PROPS) => {
  return (
    <TextField
    fullWidth
    label={props.label}
    margin="dense"
    multiline={props.multiline}
    rows={props.rows}
    value={props.value}
    type={props.type}
    onChange={props.onChange}
    />
  )
}

export default TextInput
