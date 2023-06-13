function App() {
  const [initial, setInitial] = React.useState([
    [-1, 5, -1, 9, -1, -1, -1, -1, -1],
    [8, -1, -1, -1, 4, -1, 3, -1, -1],
    [-1, -1, -1, 2, 8, -1, 1, 9, -1],
    [5, 3, 8, 6, -1, 7, 9, 4, -1],
    [-1, 2, -1, 3, -1, 1, -1, -1, -1],
    [1, -1, 9, 8, -1, 4, 6, 2, 3],
    [9, -1, 7, 4, -1, -1, -1, -1, -1],
    [-1, 4, 5, -1, -1, -1, 2, -1, 9],
    [-1, -1, -1, -1, 3, -1, -1, 7, -1],
  ]);

  const [selectedOption, setSelectedOption] = React.useState(3);
  const [sudokuArr, setSudokuArr] = React.useState(getDeepCopy(initial));
  const [solutionArr, setSolutionArr] = React.useState([
    [4, 5, 1, 9, 7, 3, 8, 6, 2],
    [8, 9, 2, 1, 4, 6, 3, 5, 7],
    [7, 6, 3, 2, 8, 5, 1, 9, 4],
    [5, 3, 8, 6, 2, 7, 9, 4, 1],
    [6, 2, 4, 3, 9, 1, 7, 8, 5],
    [1, 7, 9, 8, 5, 4, 6, 2, 3],
    [9, 8, 7, 4, 1, 2, 5, 3, 6],
    [3, 4, 5, 7, 6, 8, 2, 1, 9],
    [2, 1, 6, 5, 3, 9, 4, 7, 8],
  ]);
  const [messageType, setMessageType] = React.useState('onTrack');

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  function onInputChange(e, row, col) {
    let val = parseInt(e.target.value);
    let grid = getDeepCopy(sudokuArr);
    if (val === -1 || (val >= 1 && val <= 9)) {
      grid[row][col] = val;
    }
    setSudokuArr(grid);
  }

  // NUMBER IN GRID SHOULD BE UNIQUE PER EACH ROW AND FILLED (e.g. NOT EQUAL TO -1)
  function checkRow(grid, row, num) {
    return grid[row].indexOf(num) === -1;
  }

  // NUMBER IN GRID SHOULD BE UNIQUE PER EACH ROW AND FILLED (e.g. NOT EQUAL TO -1)
  function checkCol(grid, col, num) {
    return grid.map((row) => row[col]).indexOf(num) === -1;
  }

  // NUMBER IN GRID SHOULD BE UNIQUE PER EACH ROW AND FILLED (e.g. NOT EQUAL TO -1)
  function checkBox(grid, row, col, num) {
    let boxArr = [];
    let rowStart = row - (row % 3);
    let colStart = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boxArr.push(grid[rowStart + i][colStart + j]);
      }
    }
    return boxArr.indexOf(num) === -1;
  }

  function checkValid(grid, row, col, num) {
    return (
      checkRow(grid, row, num) &&
      checkCol(grid, col, num) &&
      checkBox(grid, row, col, num)
    );
  }

  function getNext(row, col) {
    return col != 8 ? [row, col + 1] : row != 8 ? [row + 1, 0] : [0, 0];
  }

  function solver(grid, row = 0, col = 0) {
    // IF THE CELL IS NOT EMPTY (i.e. NOT EQUALS TO -1), MOVE TO THE NEXT
    if (grid[row][col] !== -1) {
      let isLast = row >= 8 && col >= 8;
      if (!isLast) {
        let [newRow, newCol] = getNext(row, col);
        return solver(grid, newRow, newCol);
      }
    }
    // OTHERWISE FILL THE GRID WITH NUMBER AFTER ENSURE IT IS VALID
    for (let num = 1; num <= 9; num++) {
      if (checkValid(grid, row, col, num)) {
        grid[row][col] = num;
        let [newRow, newCol] = getNext(row, col);
        // IF ROW AND COL EQUAL TO 0, MEANING ALL GRID CELLS HAVE BEEN UPDATED
        if (!newRow && !newCol) return true;
        if (solver(grid, newRow, newCol)) return true;
      }
    }
    // IF THE GRID CELL IS EMPTY, FILL THE CELL WITH '-1'
    grid[row][col] = -1;
    // FALSE INDICATING THAT THE GRID IS STILL UNCOMPLETED
    return false;
  }

  function solveSudoku() {
    setSudokuArr(solutionArr);
  }

  // TO RESET SUDOKU
  function setSudoku() {
    let sudoku = getDeepCopy(initial);
    setSudokuArr(sudoku);
  }

  // TO COMPARE SUDOKUS
  function compareSudokus(currentSudoku, solvedSudoku) {
    let res = {
      isComplete: true,
      isSolvable: true,
    };
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentSudoku[i][j] != solvedSudoku[i][j]) {
          // IF THERE IS NO CELLS WITH VALUE OF -1, INDICATING THE SODUKU IS NOT SOLVED
          if (currentSudoku[i][j] != -1) {
            res.isSolvable = false;
          }
          // IF THERE ARE CELLS WITH VALUE OF -1, INDICATING THE SODUKU IS NOT COMPLETE
          res.isComplete = false;
        }
      }
    }
    return res;
  }

  // TO CHECK IF SUDOKU IS VALID
  function checkSudoku(e) {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);

    let compare = compareSudokus(sudokuArr, sudoku);
    if (compare.isComplete) {
      // alert("Congratulations! You have solved sudoku.");
      setMessageType('success');     
    } else if (compare.isSolvable) {
      // alert("Keep going, you are on the right track!");
      setMessageType('onTrack');
    } else {
      // alert("Sudoku cannot be solved. Please reset to try again!");
      setMessageType('error');
    }

    let statusElement = e.target.parentNode.previousSibling.firstChild;
    statusElement.classList.add(messageType);
    statusElement.classList.add('visible');

  }
  // TO RANDOMLY REPLACE ARRAY ELEMENT WITH DEFINED NUMBER OF -1;
  function randomone(array, count) {
    const indices = new Set();
    do {
      indices.add(Math.floor(Math.random() * array.length));
    } while (indices.size < count);
    return array.map((v, i) => (indices.has(i) ? -1 : v));
  }

  function generateRandomGrid(selectedOption) {
    // DIFFICULTY LEVEL NEEDS TO BE BETWEEN 1 AND 9 * 9 = 81

    // STEP 1 TO SET UP RANDOMLY GENERATED ARRAY AND -1 ARRAY
    // NUMBER OF ROWS / COLUMNS FOR THE GRID
    const n = 9;

    // INITIAL EMPTY ARRAY
    const arr = [];

    do {
      // TO GENERATE RANDOM NUMBER BETWEEN 1 AND 9
      const randomNumber = Math.floor(Math.random() * 9) + 1;

      // PUSH RANDOM NUMBER TO THE ARRAY IF THERE IS NO DUPLICATE
      if (!arr.includes(randomNumber)) {
        arr.push(randomNumber);
      }
    } while (arr.length < n);

    // TO GENERATE ROW WITH -1
    const emptyArr = [];
    for (let i = 0; i < 9; i++) {
      emptyArr.push(-1);
    }

    // STEP 2 TO SET UP 9 * 9 GRID

    // BY INSERTING ABOVE RANDOMLY GENERATED ARRAY INTO RANDOM ROW
    // TO GENERATE AN EMPTY ARRAY FOR THE 9 * 9 GRID
    const initialArray = [];
    // TO GENERATE RANDOM ROW NUMBER
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    // TO INSERT -1 ROWS INTO THE GRID EXCEPT THE RANDOM ROW
    for (let i = 0; i < randomNumber; i++) {
      initialArray.push(emptyArr);
    }
    // TO INSER RANDOMLY GENERATED ARRAY INTO RANDOM ROW
    initialArray.push(arr);
    // TO INSERT -1 ROWS INTO THE GRID EXCEPT THE RANDOM ROW
    for (let i = randomNumber + 1; i < 9; i++) {
      initialArray.push(emptyArr);
    }

    // STEP 3 TO SOLVE THE RANDMLY GENERATED SUDOKU
    const sudokuArray = getDeepCopy(initialArray);
    solver(sudokuArray, 0, 0);
    setSolutionArr(getDeepCopy(sudokuArray));

    // STEP 4 TO RANDOMLY REPLACE ELEMENT IN THE ARRAY WITH -1
    let result = [];
    for (let i = 0; i < 9; i++) {
      result[i] = randomone(sudokuArray[i], selectedOption);
    }

    return result;
  }

  function handleChange(e) {
    setSelectedOption(e.target.value);
  }

  function handleStart() {
    const original = Array.from(generateRandomGrid(selectedOption));

    setInitial(getDeepCopy(original));

    setSudokuArr(getDeepCopy(original));
  }

  function getMessage(messageType) {
    let result;
    switch (messageType) {
      case "success":
        result = "Congratulations! You solved sudoku.";
        break;
      case "onTrack":
        result = "You are on the right track!";
        break;
      case "error":
        result = ":( Sudoku cannot be solved.";
        break;
      default:
        return;
    }
    return result;
  }

  function getNextStep(messageType) {
    let result;
    switch (messageType) {
      case "success":
        result = 'Click "Start New Game" to start a new Game! ';
        break;
      case "onTrack":
        result = "Keep going~~~";
        break;
      case "error":
        result = "Please reset to try again or start a new game!";
        break;
      default:
        return;
    }
    return result;
  }

  function close(e) {
    let parent = e.target.parentNode.parentNode;
    parent.style.display = "none";
  }

  function Grid() {
    return (
      <table>
        <tbody>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
            return (
              <tr key={rIndex} className={(row + 1) % 3 === 0 ? "rBorder" : ""}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                  return (
                    <td
                      key={rIndex + cIndex}
                      className={(col + 1) % 3 === 0 ? "cBorder" : ""}
                    >
                      <input
                        onChange={(e) => onInputChange(e, row, col)}
                        className="cellInput"
                        type="text"
                        value={
                          sudokuArr[row][col] === -1 ? "" : sudokuArr[row][col]
                        }
                        disabled={initial[row][col] !== -1}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  function Message({ messageType, getMessage, getNextStep }) {
    return (
      <section className={`message`}>
        <h3>{getMessage(messageType)}</h3>
        <p>{getNextStep(messageType)}</p>
        <span onClick={close}>
          <i class="large material-icons">close</i>
        </span>
      </section>
    );
  }

  return (
    <div>
      <div className="main-header">
        <h1>Play Sudoku</h1>
        <p>
          The goal of Sudoku is to fill a 9×9 grid with numbers so that each
          row, column and 3×3 section contain all of the digits between 1 and 9.
        </p>
      </div>
      <section className="game-container">
        <section className="btns">
          <section className="level">
            <label htmlFor="levelOfDifficulty">Level of Difficulty</label>
            <select
              name="levelOfDifficulty"
              id="levelOfDifficulty"
              onBlur={handleChange}
            >
              <option value="3">Easy</option>
              <option value="5">Medium</option>
              <option value="7">Hard</option>
            </select>
          </section>
          <button className="btn-large start" onClick={handleStart}>
            Start New Game
          </button>
          <section className="grid-container">
            <Grid />
          </section>
          <div className="game-status">
            <Message
              messageType={messageType}
              getMessage={getMessage}
              getNextStep={getNextStep}
            />
          </div>
          <section className="btns-reset">
            <button className="btn-small reset" onClick={setSudoku}>
              Reset
            </button>
            <button className="btn-small check" onClick={checkSudoku}>
              Check
            </button>
            <button className="btn-small solve" onClick={solveSudoku}>
              Solve
            </button>
          </section>
        </section>
      </section>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
