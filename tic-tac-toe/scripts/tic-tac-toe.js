const USER = 'user';
const COMPUTER = 'computer';
let gameBoard, winPosition, stopPosition, randomPosition, isTie;

initializeData();

addAllEventListeners();

function initializeData() {
	gameBoard = [
		['', '', ''],
		['', '', ''],
		['', '', ''],
	];

	winPosition = { row: -1, column: -1 };
	stopPosition = { row: -1, column: -1 };
	randomPosition = { row: -1, column: -1 };
	isTie = false;
}

function addAllEventListeners() {
	// add event listener for play button
	document.querySelector('.js-play-button').addEventListener('click', () => {
		document.querySelector('.js-welcome-container').classList.add('hide');
	});

	// add event listeners for game cells
	document.querySelectorAll('.js-cell').forEach((cell) => {
		cell.addEventListener('click', () => {
			const row = Number(cell.dataset.row);
			const column = Number(cell.dataset.column);
			if (gameBoard[row][column] === '') {
				gameBoard[row][column] = USER;
				updateMoveHTML(row, column, USER);

				const isGameOver = checkGameOver(row, column, USER);
				if (isGameOver) {
					handleGameOver(USER);
					return;
				}
				computerMove();
			}
		});
	});

	// add event listener for play again button
	document.querySelector('.js-play-again').addEventListener('click', () => {
		initializeData();
		initializeGameBoard();
		document.querySelector('.js-result-container').classList.remove('show-result');
	});
}

function initializeGameBoard() {
	document.querySelectorAll('.js-cell').forEach((cell) => {
		cell.classList.remove('occupied');
		cell.classList.remove('user');
		cell.classList.remove('computer');
	});
}

function handleGameOver(role) {
	setTimeout(() => {
		let display;
		if (role === COMPUTER) {
			display = 'You Lose.';
		} else if (isTie) {
			display = 'Tie.';
		} else {
			display = 'You Win!';
		}
		document.querySelector('.js-result').innerHTML = display;
		document.querySelector('.js-result-container').classList.add('show-result');
	}, 800);
}

function checkGameOver(row, column, role) {
	if (checkRow(row, role)) return true;
	if (checkColumn(column, role)) return true;
	if (checkDiagonal(role)) return true;
	if (checkTie()) return true;
	return false;
}

function checkRow(row, role) {
	let count = 0;
	gameBoard[row].forEach((cell) => {
		if (cell === role) {
			count++;
		}
	});

	return count === 3;
}

function checkColumn(column, role) {
	let count = 0;
	for (let i = 0; i < 3; i++) {
		if (gameBoard[i][column] === role) {
			count++;
		}
	}
	return count === 3;
}

function checkDiagonal(role) {
	if (gameBoard[0][0] === role && gameBoard[1][1] === role && gameBoard[2][2] === role) return true;
	if (gameBoard[0][2] === role && gameBoard[1][1] === role && gameBoard[2][0] === role) return true;
	return false;
}

function checkTie() {
	let count = 0;
	gameBoard.forEach((row) => {
		row.forEach((cell) => {
			if (cell === '') {
				count++;
			}
		});
	});
	isTie = count === 0;
	return count === 0;
}

function computerMove() {
	resetWinOrStopPositions();
	findWinOrStopUser();
	let row, column;
	if (winPosition.row != -1) {
		row = winPosition.row;
		column = winPosition.column;
		gameBoard[row][column] = COMPUTER;
		updateMoveHTML(row, column, COMPUTER);
		handleGameOver(COMPUTER);
		return;
	} else if (stopPosition.row != -1) {
		row = stopPosition.row;
		column = stopPosition.column;
		gameBoard[row][column] = COMPUTER;
		updateMoveHTML(row, column, COMPUTER);
		return;
	}

	goRandom();
	row = randomPosition.row;
	column = randomPosition.column;
	gameBoard[row][column] = COMPUTER;
	updateMoveHTML(row, column, COMPUTER);
}

function updateMoveHTML(row, column, role) {
	document.querySelector(`.js-cell${row}${column}`).classList.add(`occupied`);
	document.querySelector(`.js-cell${row}${column}`).classList.add(`${role}`);
}

function resetWinOrStopPositions() {
	winPosition.row = -1;
	winPosition.column = -1;

	stopPosition.row = -1;
	stopPosition.column = -1;
}

function findWinOrStopUser() {
	let countUser, countComputer, p;

	for (let i = 0; i < 3; i++) {
		countUser = 0;
		countComputer = 0;
		p = -1;
		for (let j = 0; j < 3; j++) {
			if (gameBoard[i][j] === USER) {
				countUser++;
			} else if (gameBoard[i][j] === COMPUTER) {
				countComputer++;
			} else {
				p = j;
			}
		}
		if (countComputer === 2 && p != -1) {
			winPosition.row = i;
			winPosition.column = p;
			return true;
		}
		if (countUser === 2 && p != -1) {
			stopPosition.row = i;
			stopPosition.column = p;
		}
	}

	for (let i = 0; i < 3; i++) {
		countUser = 0;
		countComputer = 0;
		p = -1;
		for (let j = 0; j < 3; j++) {
			if (gameBoard[j][i] === USER) {
				countUser++;
			} else if (gameBoard[j][i] === COMPUTER) {
				countComputer++;
			} else {
				p = j;
			}
		}
		if (countComputer === 2 && p != -1) {
			winPosition.row = p;
			winPosition.column = i;
			return true;
		}
		if (countUser === 2 && p !== -1) {
			stopPosition.row = p;
			stopPosition.column = i;
		}
	}

	countUser = 0;
	countComputer = 0;
	let i = -1;
	let j = -1;
	for (let index = 0; index < 3; index++) {
		if (gameBoard[index][index] === USER) {
			countUser++;
		} else if (gameBoard[index][index] === COMPUTER) {
			countComputer++;
		} else {
			i = index;
			j = index;
		}
	}
	if (countComputer === 2 && i !== -1) {
		winPosition.row = i;
		winPosition.column = j;
		return true;
	}
	if (countUser === 2 && i !== -1) {
		stopPosition.row = i;
		stopPosition.column = j;
	}

	countUser = 0;
	countComputer = 0;
	i = -1;
	j = -1;
	for (let index = 0; index < 3; index++) {
		if (gameBoard[index][2 - index] === USER) {
			countUser++;
		} else if (gameBoard[index][2 - index] === COMPUTER) {
			countComputer++;
		} else {
			i = index;
			j = 2 - index;
		}
	}
	if (countComputer === 2 && i !== -1) {
		winPosition.row = i;
		winPosition.column = j;
		return true;
	}
	if (countUser === 2 && i !== -1) {
		stopPosition.row = i;
		stopPosition.column = j;
	}

	return stopPosition.row === -1;
}

function goRandom() {
	let availableRows = [];
	let availableColumns = [];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (gameBoard[i][j] === '') {
				availableRows.push(i);
				availableColumns.push(j);
			}
		}
	}
	const random = Math.floor(Math.random() * (availableRows.length - 1));
	randomPosition.row = availableRows[random];
	randomPosition.column = availableColumns[random];
}
