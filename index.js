const main_button00 = document.getElementById('main_button00');
const main_button01 = document.getElementById('main_button01');
const main_button02 = document.getElementById('main_button02');
const main_button10 = document.getElementById('main_button10');
const main_button11 = document.getElementById('main_button11');
const main_button12 = document.getElementById('main_button12');
const main_button20 = document.getElementById('main_button20');
const main_button21 = document.getElementById('main_button21');
const main_button22 = document.getElementById('main_button22');
const main_buttons = [main_button00, main_button01, main_button02, main_button10, main_button11, main_button12, main_button20, main_button21, main_button22];
const main_message = document.getElementById('main_message');
const main_board = document.getElementById('main_board');

const sub_button00 = document.getElementById('sub_button00');
const sub_button01 = document.getElementById('sub_button01');
const sub_button02 = document.getElementById('sub_button02');
const sub_button10 = document.getElementById('sub_button10');
const sub_button11 = document.getElementById('sub_button11');
const sub_button12 = document.getElementById('sub_button12');
const sub_button20 = document.getElementById('sub_button20');
const sub_button21 = document.getElementById('sub_button21');
const sub_button22 = document.getElementById('sub_button22');
const sub_buttons = [sub_button00, sub_button01, sub_button02, sub_button10, sub_button11, sub_button12, sub_button20, sub_button21, sub_button22];
const sub_message = document.getElementById('sub_message');
const sub_board = document.getElementById('sub_board');

let current_cell;
const reset = document.getElementById('reset_button');

let main_x_turn = true;
let sub_x_turn = true;
let sub_x_turn_reset = true;

function checkWinner(buttons) {
    const board = [
        [buttons[0].textContent, buttons[1].textContent, buttons[2].textContent],
        [buttons[3].textContent, buttons[4].textContent, buttons[5].textContent],
        [buttons[6].textContent, buttons[7].textContent, buttons[8].textContent]
    ];

    for (let i = 0; i < 3; i++) {
        // Check rows
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return board[i][0];
        }
        // Check columns
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            return board[0][i];
        }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
    }

    // Tie check
    if (buttons.every(button => button.textContent !== '')) {
        return '/';
    }

    return '-';
}

function button_click(button, buttons, message, is_main_board) {
    let x_turn = is_main_board ? main_x_turn : sub_x_turn;
    if (x_turn) {
        button.textContent = 'X';
        message.textContent = 'Player O\'s turn';
    }
    else {
        button.textContent = 'O';
        message.textContent = 'Player X\'s turn';
    }
    if (is_main_board) {
        main_x_turn = !main_x_turn;
    }
    else {
        sub_x_turn = !sub_x_turn;
    }
    button.disabled = true;
    button.style.backgroundColor = x_turn ? 'hsl(10, 100%, 80%)' : 'hsl(63, 100.00%, 80%)';
    button.style.transition = 'background-color 0.5s ease';

    let winner = checkWinner(buttons);
    if (winner == '/') {
        message.textContent = 'Tie! Resetting the sub-board in 3 seconds...';
        setTimeout(() => {
            resetSubBoard();
            sub_x_turn = sub_x_turn_reset;
            if (sub_x_turn) {
                sub_message.textContent = 'Player X\'s turn';
            }
            else {
                sub_message.textContent = 'Player O\'s turn';
            }
        }, 3000);
    }
    else if (winner != '-') {
        message.textContent = winner + ' wins!';
        buttons.forEach(button => button.disabled = true);
        reset.style.display = 'block';
        if(!is_main_board) {
            toMainBoard(winner);
            resetSubBoard();
        }
        else {
            main_message.textContent = winner + ' wins!';
            main_buttons.forEach(button => button.disabled = true);
            reset.style.display = 'block';
        }
    }
}

function resetMainBoard() {
    main_buttons.forEach(button => {
        button.textContent = '';
        button.disabled = false;
        button.style.backgroundColor = '';
        button.style.transition = 'background-color 0.5s ease';
    });
    main_x_turn = true;
    reset.style.display = 'none';
    main_message.textContent = 'Player X, choose a cell';
}

function resetSubBoard() {
    sub_buttons.forEach(button => {
        button.textContent = '';
        button.disabled = false;
        button.style.backgroundColor = '';
        button.style.transition = 'background-color 0.5s ease';
    });
    sub_x_turn = true;
    sub_message.textContent = 'Player X\'s turn';
}

function toMainBoard(sub_winner) {
    sub_board.style.display = 'none';
    main_board.style.display = 'block';
    current_cell.textContent = sub_winner;
    current_cell.disabled = true;
    current_cell.style.backgroundColor = current_cell.textContent === 'X' ? 'hsl(10, 100%, 80%)' : 'hsl(63, 100.00%, 80%)';
    current_cell.style.transition = 'background-color 0.5s ease';
    main_x_turn = !main_x_turn;
    if (main_x_turn) {
        main_message.textContent = 'Player X, choose a cell';
    }
    else {
        main_message.textContent = 'Player O, choose a cell';
    }
    let winner = checkWinner(main_buttons);
    if (winner == '/') {
        main_message.textContent = 'Tie!';
        reset.style.display = 'block';
    }
    else if (winner != '-') {
        main_message.textContent = winner + ' wins!';
        main_buttons.forEach(button => button.disabled = true);
        reset.style.display = 'block';
    }
}

function toSubBoard(button) {
    sub_board.style.display = 'block';
    main_board.style.display = 'none';
    current_cell = button;
    sub_x_turn = main_x_turn;
    sub_x_turn_reset = sub_x_turn;
    if (sub_x_turn) {
        sub_message.textContent = 'Player X\'s turn';
    }
    else {
        sub_message.textContent = 'Player O\'s turn';
    }
}

main_buttons.forEach(button => {
    button.onclick = function() {toSubBoard(button); };
});

sub_buttons.forEach(button => {
    button.onclick = function() {button_click(button, sub_buttons, sub_message, false); };
});

reset.onclick = function() {resetMainBoard(); }

