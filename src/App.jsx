import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [capacity, setCapacity] = useState(0)
  const [numberOfItems, setNumberOfItems] = useState(0)
  const [itemList, setItemList] = useState([])
  const [valueTable, setValueTable] = useState([])
  const [solutionArray, setSolutionArray] = useState([])
  const [solutionList, setSolutionList] = useState([])
  const [hoveredCell, setHoveredCell] = useState([])
  const [comparisonCell, setComparisonCell] = useState([])
  const [lessCell, setLessCell] = useState([])
  const [moreCell, setMoreCell] = useState([])

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
    createEmptyItemList(numberOfItems);
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
    fillValueTable(list);
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
  }

  function createEmptyItemList(numberOfItems) {
    var list = []
    for(let i = 0; i < numberOfItems; i++) {
      list[i] = {"weight": 0, "value": 0}
    }
    setItemList(list);
  }

  function fillValueTable(itemList) {
    //fill table cells
    let table = valueTable;
    for (let j = 0; j < numberOfItems+1; j++) {
      for (let i = 0; i < capacity+1; i++) {
        fillValueTableCell(i, j, itemList, table);
      }
    }
    setValueTable(table)
    
    //set solution array
    let w = capacity
    let array = []
    for (let i = numberOfItems; i > 0; i--) {
      if (table[i][w] > table[i-1][w]) {
        array.push(1)
        w = w - itemList[i - 1].weight
        continue
      }
      array.push(0)
    }
    array = array.reverse();
    setSolutionArray(array)

    //set solution list
    let list = []
    for (let i = 0; i < numberOfItems; i++) {
      if (array[i] == 1) {
        list.push(String.fromCharCode(65 + i))
      }
    }
    setSolutionList(list)
  }

  //w = current weight
  //i = current item
  //vTable = the value table
  function fillValueTableCell(w, index, itemList, table) {
    if (index <= 0 || w <= 0)
      return 0;
    if (itemList[index-1].weight > w)
      return table[index][w] = fillValueTableCell(w, index - 1, itemList, table);
    return table[index][w] = Math.max(
      (parseInt(itemList[index-1].value) + fillValueTableCell(w - itemList[index-1].weight, index - 1, itemList, table)), 
      fillValueTableCell(w, index - 1, itemList, table));            
  }

  function hoverValueCell(e) {
    let rowindex = parseInt(e._targetInst.key.split("-")[0])
    let colindex = parseInt(e._targetInst.key.split("-")[1])

    setHoveredCell([rowindex, colindex])
    if (rowindex <= 0 || itemList[rowindex - 1].weight > colindex) {
      setComparisonCell([])
      setLessCell([])
      setMoreCell([])
      return;
    }

    let comparisonCell = [rowindex-1, colindex - itemList[rowindex - 1].weight]
    setComparisonCell(comparisonCell)
    
    if ((parseInt(valueTable[rowindex-1][colindex - itemList[rowindex - 1].weight])
      + parseInt(itemList[rowindex-1].value))
      < parseInt(valueTable[rowindex-1][colindex])) {
      setLessCell(comparisonCell)
      setMoreCell([rowindex-1, colindex])
      return;
    }
    setLessCell([rowindex-1, colindex])
    setMoreCell(comparisonCell)
  }

  function VectorEquals(a, b) {
    if (a[0] == b[0] && a[1] == b[1]) {
      return true
    }
    return false
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
                  <ItemInputRow key={index} index={index}/>
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
                  <td className='header-numbers' key={colindex}>{colindex}</td>
                )}
              </tr>
              {Array.from({ length: (numberOfItems+1) }).map((value, rowindex) => 
                <tr key={rowindex}>
                  {rowindex == 0 ? <th rowSpan={(numberOfItems+1)} className='header-items'>{"Items"}</th> : null}
                  <td className='header-numbers'>{rowindex}</td>
                  {Array.from({ length: (capacity+1) }).map((value, colindex) => 
                    <td 
                      key={rowindex + "-" + colindex}
                      onMouseEnter={(e) => hoverValueCell(e)} 
                      className={
                        (VectorEquals(lessCell, [rowindex, colindex]) ? "less-cell " : 
                        (VectorEquals(moreCell, [rowindex, colindex]) ? "more-cell " : "")) +
                        (VectorEquals(comparisonCell, [rowindex, colindex]) ? "comparison-cell" :
                        (VectorEquals(hoveredCell, [rowindex, colindex]) ? "hovered-cell" :
                        (VectorEquals(hoveredCell, [rowindex+1, colindex]) ? "above-cell" : "")))
                      }
                    >
                      {VectorEquals(comparisonCell, [rowindex, colindex]) ? 
                        (parseInt(valueTable[rowindex][colindex]) + parseInt(itemList[hoveredCell[0] - 1].value)) : 
                        valueTable[rowindex][colindex]}
                    </td>
                  )}
                </tr>
              )}
            </tbody>
            {solutionArray.length == 0 ? null :
              <tfoot>
                <tr>
                  <td colSpan={capacity+3}>
                    {"Solution: [" + solutionArray.toString() + "] or [" + solutionList.toString() + "]"}
                  </td>
                </tr>
              </tfoot>
            }
          </table>
        }
        <br/>
        <p>
          A Dynamic Programming approach to 0/1 Knapsack, is done by considering each and every subset of the problem, from the least amount of items and capacity, up until the upper bounds of the problem, which is the entire item list and the maximum capacity. This is done by considering whether taking an item is worth more than the benefit of skipping it. We use a memoization table to so that we could know those two values. The number on the last row and the last column would be the global optimum to the problem.
        </p>
        <p>
          The values or cells are evaluated by considering 2 other cells. The cell immediately above it, which is the value of the highest possible value of that weight count plus the value of skipping the item (which is zero), and the cell some distance to the left of it, which is the value of the highest possible value of a previous weight count plus the value of the item taken. If the item could not be taken, it simply picks the value above it, the last known optimal value.
        </p>
        <p>
          To see the algorithm in effect, you could hover over a cell on the table. The green cell is the cell that has more value, while the blue is one that has less value. If there's only one value considered, it's highlighted in grey. For ease of learning, the value to the left is also added by the value of the item taken.
        </p>
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
  return <tr>
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