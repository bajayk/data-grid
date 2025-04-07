# Data Grid

## Demo Link 
### [Click Here](https://components.ajaybadgujar.in/data-grid/).

## Installation

```
npm install @bajayk/data-grid
```

## How to use.

```js
import { useEffect, useRef, useState } from 'react';
import DataGrid from '@bajayk/data-grid';

function App() {
  
  const dataGrid = useRef();


  const loadData = async() =>{

    let response = await fetch('https://components.ajaybadgujar.in/data-grid/all-countries.json');
    
    if(response.ok){
        let json = await response.json();
        setData(json);
    }else{
        console.log(response.status);
    }
}

const setData = (json) => {

    let columnDefs = [
        {label:'Name', field:'name'},
        {label:'Capital', field:'capital'},
        {label:'Region', field:'region'}        
    ];

    let data = {
        columnDefs:columnDefs,
        rowData:json
    }
    dataGrid.current.data = data;
}


  useEffect(() => {

    loadData();

  }, [])

  return (
    <>
    <h1>Data Grid Demo</h1>
    <h2>All Countries</h2>
      <data-grid ref={dataGrid}></data-grid>
    </>
  )
}

export default App
```


