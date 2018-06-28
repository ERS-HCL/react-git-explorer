import React from 'react';
import Select from 'react-select';
import * as Animated from 'react-select/lib/animated';

const colourOptions = [
  { value: 'java', label: 'Java' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'Python', label: 'Python' },
  { value: 'HTML', label: 'HTML' },
  { value: 'C#', label: 'C#' },
  { value: 'Shell', label: 'Shell' },
  { value: 'Jupyter Notebook', label: 'Jupyter Notebook' },
  { value: 'CSS', label: 'CSS' },
  { value: 'NA', label: 'Unknown' }
];

const MultiSelect = props => {
  return (
    <Select
      closeMenuOnSelect={false}
      components={Animated}
      defaultValue={[]}
      placeholder="Filter by Language"
      isMulti
      options={colourOptions}
      onChange={props.onChange}
    />
  );
};

export default MultiSelect;
