import { useState } from 'react';

const EditableCell = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleDoubleClick = () => setIsEditing(true);
  const handleChange = (e) => setInputValue(e.target.value);
  const handleBlur = () => {
    setIsEditing(false);
    onSave(inputValue);
  };

  return isEditing ? (
    <input className={"w-full px-4 py-2"} type="text" value={inputValue} onChange={handleChange} onBlur={handleBlur} autoFocus />
  ) : (
	  <div className={"w-full px-4 py-2"} onDoubleClick={handleDoubleClick}>
	    <span className={"w-full"}>{value}</span>
	  </div>
  );
}

export default EditableCell;
