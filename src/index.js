import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  const numOfRows = 3;
  const squaresPerRow = 3;
  const board = [];
  
  for(let i = 0; i < numOfRows; i++) {
    const row = [];
  
    for(let j = 0; j < squaresPerRow; j++) {
      const squareNumber = (i * numOfRows + j);
      row.push(
        <Square 
          key={'square' + squareNumber}
          value={props.squares[squareNumber]}
          onClick={() => props.onClick(squareNumber)} />
      );
    }
    
    board.push(<div className="board-row" key={row + i}>{row}</div>);
  }
  
  return <div>{board}</div>
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        latestEntry: '',
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    };
    this.handleSort = this.handleSort.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        latestEntry: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  location(i) {
    let row = Math.floor(i / 3);
    let col = i % 3;
    return ' (' + row + ', ' + col + ') ';
  }

  handleSort() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move + this.location(step.latestEntry) :
                          'Go to game start';

      return(
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)} 
            className={this.state.stepNumber === move ? 'select' : ''}>
              {desc}
          </button>
        </li>
      );
    })

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const ascending = this.state.isAscending;

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={this.handleSort}>{ascending ? "Descending" : "Ascending"}</button>
          <ol>{!ascending ? moves.reverse() : moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}