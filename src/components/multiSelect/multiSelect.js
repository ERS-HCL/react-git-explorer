import React from 'react';
import Select from 'react-select';
import * as Animated from 'react-select/lib/animated';

const colourOptions = [
  { value: 'java', label: 'Java' },
  { value: 'Scala', label: 'Scala' },
  { value: 'Swift', label: 'Swift' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'Python', label: 'Python' },
  { value: 'PHP', label: 'PHP' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'Rust', label: 'Rust' },
  { value: 'HTML', label: 'HTML' },
  { value: 'C#', label: 'C#' },
  { value: 'C++', label: 'C++' },
  { value: 'F#', label: 'F#' },
  { value: 'Go', label: 'Go' },
  { value: 'OCaml', label: 'OCAML' },
  { value: 'Shell', label: 'Shell' },
  { value: 'PowerShell', label: 'PowerShell' },
  { value: 'Puppet', label: 'Puppet' },
  { value: 'R', label: 'R' },
  { value: 'Objective-C', label: 'Objective-C' },
  { value: 'Objective-C++', label: 'Objective-C++' },
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
