import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [capacity, setCapacity] = useState(0)
  const [numberOfItems, setNumberOfItems] = useState(0)

  function handleKnapsackParameters(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    setCapacity(formJson.capacity);
    setNumberOfItems(formJson.numberOfItems)
  }

  function completelyUselessFunction(){
    
  }

  return (
    <>
      <form method='post' onSubmit={handleKnapsackParameters}>
        <table>
          <thead>
            <tr>
              <th>Max Weight</th>
              <th>Number of Items</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input name='capacity'></input></td>
              <td><input name='numberOfItems'></input></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <div className='flex flex-row-reverse'>
                  <button type='submit'>Create Table</button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </form>

      <br/>
      <table>
        <thead>
          <tr>
            <th>Value</th>
            <th>Weight</th>
          </tr>
        </thead>
          <tbody>
            {Array.from({ length: numberOfItems }).map((empty, index) => 
              <tr>
                <td><input placeholder={'Value of item ' + (index+1)}></input></td>
                <td><input placeholder={'Weight of item ' + (index+1)}></input></td>
              </tr>
            )}
          </tbody>
      </table>
    </>
  )
}

export default App
