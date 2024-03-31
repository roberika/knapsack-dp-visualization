import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [capacity, setCapacity] = useState(0)
  const [numberOfItems, setNumberOfItems] = useState(0)
  const [itemList, setItemList] = useState([])
  const [valueTable, setValueTable] = useState([])

  function handleKnapsackParameters(e) {
    e.preventDefault();
    const formJson = Object.fromEntries(new FormData(e.target).entries());
    if (formJson.capacity.empty){
      formJson.capacity = "0";
    }

    let capacity = parseInt(formJson.capacity);
    let numberOfItems = parseInt(formJson.numberOfItems);

    setCapacity(capacity);
    setNumberOfItems(numberOfItems);
    createEmptyValueTable(capacity, numberOfItems);
  }

  function handleKnapsackItems(e) {
    e.preventDefault();
    const formJson = Object.fromEntries(new FormData(e.target).entries());
    var list = []
    Object.keys(formJson).filter((e) => e.includes("weight")).map((weight, index) => {
      list[index] = {"weight": formJson[weight]}
    })
    Object.keys(formJson).filter((e) => e.includes("value")).map((value, index) => {
      list[index]["value"] = formJson[value]
    })

    setItemList(list);
  }

  function createEmptyValueTable(capacity, numberOfItems) {
    var table = []
    for (let j = 0; j < numberOfItems+1; j++) {
      var row = [];
      for (let i = 0; i < capacity+1; i++) {
        row.push(0);
      }
      table.push(row);
    }
    setValueTable(table);
    console.log(table)
  }

  return (
    <div className='panel-view'>
      <div className='left-panel'>
        <form method='post' onSubmit={handleKnapsackParameters}>        
          <table className='parameter-table'>
            <thead>
              <tr className='header-row'>
                <th>Max Weight</th>
                <th>Number of Items</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input className='cell-input' name='capacity'></input></td>
                <td><input className='cell-input' name='numberOfItems'></input></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>
                  <SubmitButton>Create Item List</SubmitButton>
                </td>
              </tr>
            </tfoot>
          </table>
        </form>

        <br/>

        <form method='post' onSubmit={handleKnapsackItems}>   
          <table className='list-table'>
            <thead>
              <tr className='header-row'>
                <th>Item</th>
                <th>Value</th>
                <th>Weight</th>
              </tr>
            </thead>
              <tbody>
                {numberOfItems == 0 ? <ItemInputRow index={-1}/> : ""}
                {Array.from({ length: numberOfItems }).map((empty, index) => 
                  <ItemInputRow index={index}/>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>
                    <SubmitButton>Solve</SubmitButton>
                  </td>
                </tr>
              </tfoot>
          </table>
        </form>
      </div>
      <div className='right-panel'>
        {valueTable.length == 0 ? null : 
          <table className='value-table'>
            <tbody>
              <tr>
                <th colSpan="2" rowSpan="2"></th>
                <th rowSpan="1" colSpan={capacity+1}>Weight</th>
              </tr>
              <tr>
                {Array.from({ length: (capacity+1) }).map((value, colindex) => 
                  <td key={colindex}>{colindex}</td>
                )}
              </tr>
              {Array.from({ length: (numberOfItems+1) }).map((value, rowindex) => 
                <tr key={rowindex}>
                  {rowindex == 0 ? <th rowSpan={(numberOfItems+1)} className='header-items'>{"Items"}</th> : null}
                  <td>{rowindex}</td>
                  {Array.from({ length: (capacity+1) }).map((value, colindex) => 
                    <td key={colindex}>{valueTable[rowindex][colindex]}</td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        }
      </div>
    </div>
  )
}

export default App

function SubmitButton({children}) {
  return <div className='flex flex-row-reverse'>
    <button type='submit'>{children}</button>
  </div>
}

function ItemInputRow({index}) {
  return <tr key={index}>
    <td className='text-center'>{index + 1}</td>
    <ItemInputCell index={index} text="Value" disabled={index == -1}/>
    <ItemInputCell index={index} text="Weight" disabled={index == -1}/>
  </tr>
}

function ItemInputCell({index, text, disabled}) {
  if (disabled) {
    return <td>
      <input 
        className='cell-input cell-input-disabled'
        name={text.toLowerCase()+(index+1)} 
        disabled>
      </input>
    </td>
  }
  return <td>
    <input 
      className='cell-input'
      name={text.toLowerCase()+'-'+(index+1)} 
      placeholder={text+' ' + (index+1)}>
    </input>
  </td>
}