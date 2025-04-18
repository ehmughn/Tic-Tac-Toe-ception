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

const background = document.getElementById('background');

let current_cell;
const reset = document.getElementById('reset_button');

const leftSidebar = document.getElementById('left-sidebar');
const rightSidebar = document.getElementById('right-sidebar');

let main_x_turn = true;
let sub_x_turn = true;
let sub_x_turn_reset = true;
let x_horizontal_winnable = true;
let x_vertical_winnable = true;
let x_diagonal_winnable = true;
let o_horizontal_winnable = true;
let o_vertical_winnable = true;
let o_diagonal_winnable = true;
let x_overprotective = false;
let o_overprotective = false;
let x_first_turn_rounds = 0;
let o_first_turn_rounds = 0;
let overprotective_activated = false;
let x_underinfluence = false;
let o_underinfluence = false;
let high_stakes_activated = false;

const powerups = [
    { id: 'powerup-save-current-turn', name: 'Save Current Turn', description: 'Skip your current turn to have an extra turn at your next turn.' },
    { id: 'powerup-eraser', name: 'Eraser', description: 'Choose a cell to erase any occupants.' },
    { id: 'powerup-ctrl-a-del', name: 'Ctrl + A + Del', description: 'Remove all of the text in the cell. You will have the turn first.' },
    { id: 'powerup-block-horizontal', name: 'Block Horizontal', description: 'Your opponent can\'t win on horizontal match.' },
    { id: 'powerup-block-vertical', name: 'Block Vertical', description: 'Your opponent can\'t win on vertical match.' },
    { id: 'powerup-block-diagonal', name: 'Block Diagonal', description: 'Your opponent can\'t win on diagonal match.' },
    { id: 'powerup-milk-bucket', name: 'Milk Bucket', description: 'Remove all of your buffs and debuffs.' },
    { id: 'powerup-override', name: 'Override', description: 'For your turn, you can override any occupied cell.' },
    { id: 'powerup-automatic-win', name: 'Automatic Win', description: 'Automatically win the current round, opponent will have their turn first in the next round.' },
    { id: 'powerup-thievery', name: 'Thievery', description: 'Steal an opponent\'s random powerup.' },
    { id: 'powerup-over-protective', name: 'Over Protective', description: 'For the whole match, you can\'t be affected by debuffs. For the first 3 rounds, your opponents will start first. For the current round, you can\'t use any powerups.' },
    { id: 'powerup-high-stakes', name: 'High Stakes', description: 'After using this powerup, both players will remove their debuffs and be granted a "Milk Bucket". The winner of the current round will be granted 3 additional powerups and will have their turn first at the next round. "Automatic Win" and another "High Stakes" powerup will be banned during the high stakes round. You can\'t get more "High Stakes" with this powerup.' },
    { id: 'powerup-forced-alcohol', name: 'Forced Alcohol', description: 'During the round, the opponent has a 75% chance to choose the wrong cell.' }
];

function grantPowerups() {
    const playerXPowerups = getRandomPowerups();
    const playerOPowerups = getRandomPowerups();

    // Display Player X's power-ups
    const leftSidebar = document.getElementById('left-sidebar');
    leftSidebar.innerHTML = '<p>Player X</p>';
    playerXPowerups.forEach(powerup => {
        const button = document.createElement('button');
        button.classList.add('powerup-button');
        button.id = powerup.id;
        button.setAttribute('data-description', powerup.description); // Set the description
        button.innerHTML = `<img src="res/${powerup.id}.png" alt="${powerup.name}"><span>${powerup.name}</span>`;
        leftSidebar.appendChild(button);
    });

    // Display Player O's power-ups
    const rightSidebar = document.getElementById('right-sidebar');
    rightSidebar.innerHTML = '<p>Player O</p>';
    playerOPowerups.forEach(powerup => {
        const button = document.createElement('button');
        button.classList.add('powerup-button');
        button.id = powerup.id;
        button.setAttribute('data-description', powerup.description); // Set the description
        button.innerHTML = `<img src="res/${powerup.id}.png" alt="${powerup.name}"><span>${powerup.name}</span>`;
        rightSidebar.appendChild(button);
    });

    // Re-attach event listeners to all power-up buttons
    attachPowerupEventListeners();
}

// Helper function to get 3 random power-ups
function getRandomPowerups(count = 3, exclude = []) {
    const filteredPowerups = powerups.filter(powerup => !exclude.includes(powerup.id));
    const shuffled = filteredPowerups.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count); // Return the specified number of power-ups
}

function attachPowerupEventListeners() {
    document.querySelectorAll('.powerup-button').forEach(button => {
        button.onclick = () => {
            const powerupId = button.id;
            const player = button.closest('#left-sidebar') ? 'Player X' : 'Player O';
            activatePowerup(powerupId, player);
        };
    });
    document.querySelectorAll('.powerup-button').forEach(button => {
        button.addEventListener('mouseenter', (event) => {
            const description = button.getAttribute('data-description');
            tooltip.textContent = description; // Set the tooltip text
            tooltip.style.display = 'block'; // Show the tooltip
        });
    
        button.addEventListener('mousemove', (event) => {
            // Position the tooltip near the cursor
            tooltip.style.left = `${event.pageX + 10}px`; // Offset by 10px to the right
            tooltip.style.top = `${event.pageY + 10}px`; // Offset by 10px below
        });
    
        button.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none'; // Hide the tooltip
        });
    });
}

function checkWinner(buttons) {
    const board = [
        [buttons[0].textContent, buttons[1].textContent, buttons[2].textContent],
        [buttons[3].textContent, buttons[4].textContent, buttons[5].textContent],
        [buttons[6].textContent, buttons[7].textContent, buttons[8].textContent]
    ];

    for (let i = 0; i < 3; i++) {
        // Check rows (horizontal)
        if (
            board[i][0] &&
            board[i][0] === board[i][1] &&
            board[i][1] === board[i][2]
        ) {
            const winnerSymbol = board[i][0];
            if (
                (winnerSymbol === 'X' && !x_horizontal_winnable) ||
                (winnerSymbol === 'O' && !o_horizontal_winnable)
            ) {
                console.log(`Horizontal win blocked for ${winnerSymbol}!`);
                continue; // Skip this row if the win is blocked
            }
            return winnerSymbol;
        }

        // Check columns (vertical)
        if (
            board[0][i] &&
            board[0][i] === board[1][i] &&
            board[1][i] === board[2][i]
        ) {
            const winnerSymbol = board[0][i];
            if (
                (winnerSymbol === 'X' && !x_vertical_winnable) ||
                (winnerSymbol === 'O' && !o_vertical_winnable)
            ) {
                console.log(`Vertical win blocked for ${winnerSymbol}!`);
                continue; // Skip this column if the win is blocked
            }
            return winnerSymbol;
        }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        const winnerSymbol = board[0][0];
        if (
            (winnerSymbol === 'X' && !x_diagonal_winnable) ||
            (winnerSymbol === 'O' && !o_diagonal_winnable)
        ) {
            console.log(`Diagonal win blocked for ${winnerSymbol}!`);
        } else {
            return winnerSymbol;
        }
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        const winnerSymbol = board[0][2];
        if (
            (winnerSymbol === 'X' && !x_diagonal_winnable) ||
            (winnerSymbol === 'O' && !o_diagonal_winnable)
        ) {
            console.log(`Diagonal win blocked for ${winnerSymbol}!`);
        } else {
            return winnerSymbol;
        }
    }

    // Tie check
    if (buttons.every(button => button.textContent !== '')) {
        return '/';
    }

    return '-';
}

function button_click(button, buttons, message, is_main_board) {
    let x_turn = is_main_board ? main_x_turn : sub_x_turn;

    // Check if the current player is under the influence
    if (!is_main_board && ((x_turn && x_underinfluence) || (!x_turn && o_underinfluence))) {
        const randomChance = Math.random();
        if (randomChance < 0.75) {
            console.log(`${x_turn ? 'Player X' : 'Player O'} chose the wrong cell due to Forced Alcohol!`);

            // Find an empty cell and redirect the move
            const emptyCells = buttons.filter(btn => btn.textContent === '');
            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                randomCell.textContent = x_turn ? 'X' : 'O'; // Set the symbol for the current player
                randomCell.style.backgroundColor = x_turn ? 'hsl(10, 100%, 80%)' : 'hsl(63, 100%, 80%)'; // Highlight the cell
                randomCell.style.transition = 'background-color 0.5s ease';
                randomCell.disabled = true; // Disable the button after use
                
                // Handle Player X's saved turn
                if (!is_main_board && playerXSavedTurn) {
                    sub_x_turn = true; // Allow Player X to take another turn
                    message.textContent = 'Player X\'s extra turn!';
                }
                // Handle Player O's saved turn
                else if (!is_main_board && playerOSavedTurn) {
                    sub_x_turn = false; // Allow Player O to take another turn
                    message.textContent = 'Player O\'s extra turn!';
                }
                else {
                    sub_x_turn = !sub_x_turn; // Alternate turns
                    message.textContent = x_turn ? 'Player O\'s turn' : 'Player X\'s turn'; // Update the message
                }
                let winner = checkWinner(buttons);
                if (winner == '/') {
                    message.textContent = 'Tie! Resetting the sub-board in 3 seconds...';
                    setTimeout(() => {
                        resetSubBoard();
                        sub_x_turn = sub_x_turn_reset;
                        if (sub_x_turn) {
                            sub_message.textContent = 'Player X\'s turn';
                        } else {
                            sub_message.textContent = 'Player O\'s turn';
                        }
                    }, 3000);
                } else if (winner != '-') {
                    message.textContent = `${winner} wins the sub-board! Returning to the main board in 3 seconds...`;
                    buttons.forEach(button => button.disabled = true);

                    // Delay the transition back to the main board by 3 seconds
                    setTimeout(() => {
                        toMainBoard(winner);
                        resetSubBoard();
                    }, 3000);
                }

                // Update power-up availability after the turn
                if (!is_main_board) {
                    updatePowerupAvailability();
                }
                return
            }
        }
    }

    // Normal turn logic
    if (x_turn) {
        button.textContent = 'X';
        message.textContent = 'Player O\'s turn';

        // Handle Player X's saved turn
        if (!is_main_board && playerXSavedTurn) {
            sub_x_turn = true; // Allow Player X to take another turn
            message.textContent = 'Player X\'s extra turn!';
        }
    } else {
        button.textContent = 'O';
        message.textContent = 'Player X\'s turn';

        // Handle Player O's saved turn
        if (!is_main_board && playerOSavedTurn) {
            sub_x_turn = false; // Allow Player O to take another turn
            message.textContent = 'Player O\'s extra turn!';
        }
    }

    if (is_main_board) {
        main_x_turn = !main_x_turn;
    } else {
        if (sub_x_turn && playerXSavedTurn) {
            playerXSavedTurn = false;
        } else if (!sub_x_turn && playerOSavedTurn) {
            playerOSavedTurn = false;
        } else {
            sub_x_turn = !sub_x_turn;
        }
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
            } else {
                sub_message.textContent = 'Player O\'s turn';
            }
        }, 3000);
    } else if (winner != '-') {
        message.textContent = `${winner} wins the sub-board! Returning to the main board in 3 seconds...`;
        buttons.forEach(button => button.disabled = true);

        // Delay the transition back to the main board by 3 seconds
        setTimeout(() => {
            toMainBoard(winner);
            resetSubBoard();
        }, 3000);
    }

    // Update power-up availability after the turn
    if (!is_main_board) {
        updatePowerupAvailability();
    }
}

function resetMainBoard() {
    main_buttons.forEach(button => {
        button.textContent = '';
        button.disabled = false;
        button.style.backgroundColor = '';
        button.style.transition = 'background-color 0.5s ease';
    });

    // Reset turn to Player X by default
    main_x_turn = true;
    reset.style.display = 'none';
    main_message.textContent = 'Player X, choose a cell';

    // Reset all variables related to buffs, debuffs, and first-turn rounds
    x_horizontal_winnable = true;
    x_vertical_winnable = true;
    x_diagonal_winnable = true;
    o_horizontal_winnable = true;
    o_vertical_winnable = true;
    o_diagonal_winnable = true;
    x_overprotective = false;
    o_overprotective = false;
    x_first_turn_rounds = 0;
    o_first_turn_rounds = 0;
    playerXSavedTurn = false;
    playerOSavedTurn = false;

    // Reset influence flags
    x_underinfluence = false;
    o_underinfluence = false;

    // Grant random power-ups to both players
    grantPowerups();
}

function resetSubBoard() {
    sub_buttons.forEach(button => {
        button.textContent = '';
        button.disabled = false;
        button.style.backgroundColor = '';
        button.style.transition = 'background-color 0.5s ease';
    });
}

function toMainBoard(sub_winner) {
    hide_powerups();
    sub_board.style.display = 'none';
    main_board.style.display = 'block';
    current_cell.textContent = sub_winner;
    current_cell.disabled = true;
    current_cell.style.backgroundColor = current_cell.textContent === 'X' ? 'hsl(10, 100%, 80%)' : 'hsl(63, 100.00%, 80%)';
    current_cell.style.transition = 'background-color 0.5s ease';

    // Check if High Stakes is active
    if (high_stakes_activated) {
        console.log('High Stakes round ended!');
    
        // Grant 3 additional power-ups to the winner
        const winnerSidebar = sub_winner === 'X' ? leftSidebar : rightSidebar;
        const additionalPowerups = getRandomPowerups(3, ['powerup-high-stakes']); // Exclude High Stakes power-up
        additionalPowerups.forEach(powerup => {
            const button = document.createElement('button');
            button.classList.add('powerup-button');
            button.id = powerup.id;
            button.setAttribute('data-description', powerup.description);
            button.innerHTML = `<img src="res/${powerup.id}.png" alt="${powerup.name}"><span>${powerup.name}</span>`;
            winnerSidebar.appendChild(button);
        });
    
        console.log(`${sub_winner === 'X' ? 'Player X' : 'Player O'} has been granted 3 additional power-ups!`);
    
        // Re-attach event listeners to all power-up buttons
        attachPowerupEventListeners();
    
        // Grant the winner the first turn for the next round
        main_x_turn = sub_winner === 'X';
    
        // Reset High Stakes flag
        high_stakes_activated = false;
        background.style.background = 'linear-gradient(to bottom, rgb(53, 175, 241), rgb(36, 188, 127))'; // Reset background color
    } else {
        // Determine who takes the first turn for the next round
        if (x_first_turn_rounds > 0) {
            main_x_turn = true; // Player X takes the first turn
            x_first_turn_rounds--; // Decrease the counter
        } else if (o_first_turn_rounds > 0) {
            main_x_turn = false; // Player O takes the first turn
            o_first_turn_rounds--; // Decrease the counter
        } else {
            main_x_turn = !main_x_turn; // Alternate turns by default
        }
    }

    // Update the main board message
    if (main_x_turn) {
        main_message.textContent = 'Player X, choose a cell';
    } else {
        main_message.textContent = 'Player O, choose a cell';
    }

    // Check for a winner on the main board
    let winner = checkWinner(main_buttons);
    if (winner == '/') {
        main_message.textContent = 'Tie!';
        reset.style.display = 'block';
    } else if (winner != '-') {
        main_message.textContent = winner + ' wins!';
        main_buttons.forEach(button => button.disabled = true);
        reset.style.display = 'block';
    }

    // Reset saved turns
    playerXSavedTurn = false;
    playerOSavedTurn = false;

    x_horizontal_winnable = true;
    x_vertical_winnable = true;
    x_diagonal_winnable = true;
    x_underinfluence = false;

    o_horizontal_winnable = true;
    o_vertical_winnable = true;
    o_diagonal_winnable = true;
    o_underinfluence = false;
}

function toSubBoard(button) {
    show_powerups();
    sub_board.style.display = 'block';
    main_board.style.display = 'none';
    current_cell = button;
    sub_x_turn = main_x_turn;
    sub_x_turn_reset = sub_x_turn;
    if (sub_x_turn) {
        sub_message.textContent = 'Player X\'s turn';
    } else {
        sub_message.textContent = 'Player O\'s turn';
    }

    // Enable power-ups for the current player
    updatePowerupAvailability();
}

main_buttons.forEach(button => {
    button.onclick = function() {toSubBoard(button); };
});

sub_buttons.forEach(button => {
    button.onclick = function() {button_click(button, sub_buttons, sub_message, false); };
});

function hide_powerups() {
    leftSidebar.style.display = 'none';
    rightSidebar.style.display = 'none';
}
function show_powerups() {
    leftSidebar.style.display = 'block';
    rightSidebar.style.display = 'block';
}

grantPowerups();
hide_powerups();
reset.onclick = function() {resetMainBoard(); }

// Get the tooltip element
const tooltip = document.getElementById('tooltip');

// Add event listeners to all power-up buttons
document.querySelectorAll('.powerup-button').forEach(button => {
    button.addEventListener('mouseenter', (event) => {
        const description = button.getAttribute('data-description');
        tooltip.textContent = description; // Set the tooltip text
        tooltip.style.display = 'block'; // Show the tooltip
    });

    button.addEventListener('mousemove', (event) => {
        // Position the tooltip near the cursor
        tooltip.style.left = `${event.pageX + 10}px`; // Offset by 10px to the right
        tooltip.style.top = `${event.pageY + 10}px`; // Offset by 10px below
    });

    button.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none'; // Hide the tooltip
    });
});

// Add flags to track saved turns for both players
let playerXSavedTurn = false;
let playerOSavedTurn = false;

// Function to handle power-up effects
function activatePowerup(powerupId, player) {
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector(`#${powerupId}`);

    if (!powerupButton) {
        console.log(`Power-up ${powerupId} not found for ${player}`);
        return;
    }

    // Execute the power-up effect
    switch (powerupId) {
        case 'powerup-save-current-turn':
            saveCurrentTurn(player);
            break;
        case 'powerup-eraser':
            eraser(player);
            break;
        case 'powerup-ctrl-a-del':
            ctrlADel(player);
            break;
        case 'powerup-block-horizontal':
            blockHorizontal(player);
            break;
        case 'powerup-block-vertical':
            blockVertical(player);
            break;
        case 'powerup-block-diagonal':
            blockDiagonal(player);
            break;
        case 'powerup-milk-bucket':
            milkBucket(player);
            break;
        case 'powerup-override':
            override(player);
            break;
        case 'powerup-automatic-win':
            automaticWin(player);
            break;
        case 'powerup-thievery':
            thievery(player);
            break;
        case 'powerup-over-protective':
            overProtective(player);
            break;
        case 'powerup-high-stakes':
            highStakes(player);
            break;
        case 'powerup-forced-alcohol':
            forcedAlcohol(player);
            break;
        default:
            console.log('Unknown power-up:', powerupId);
            return;
    }

    // Remove the power-up button after use
    powerupButton.remove();
    console.log(`${player} used and consumed ${powerupId}`);
}

// Add event listeners to power-up buttons
document.querySelectorAll('.powerup-button').forEach(button => {
    button.addEventListener('click', () => {
        const powerupId = button.id;
        const player = button.closest('#left-sidebar') ? 'Player X' : 'Player O';
        activatePowerup(powerupId, player);
    });
});

function updatePowerupAvailability() {
    const isPlayerXTurn = sub_x_turn;

    // Enable Player X's power-ups if it's their turn, otherwise disable them
    document.querySelectorAll('#left-sidebar .powerup-button').forEach(button => {
        button.disabled = !isPlayerXTurn; // Disable if it's not Player X's turn
        button.style.opacity = isPlayerXTurn ? '1' : '0.5'; // Dim the buttons when inactive
    });

    // Enable Player O's power-ups if it's their turn, otherwise disable them
    document.querySelectorAll('#right-sidebar .powerup-button').forEach(button => {
        button.disabled = isPlayerXTurn; // Disable if it's not Player O's turn
        button.style.opacity = isPlayerXTurn ? '0.5' : '1'; // Dim the buttons when inactive
    });
}

// Power-up functionalities (updated to work on the sub-board)
function saveCurrentTurn(player) {
    console.log(`${player} activated Save Current Turn!`);

    if (player === 'Player X') {
        playerXSavedTurn = true; // Mark that Player X has saved their turn
        sub_x_turn = false; // Skip Player X's current turn
        sub_message.textContent = 'Player O\'s turn'; // Update the message for Player O's turn
    } else {
        playerOSavedTurn = true; // Mark that Player O has saved their turn
        sub_x_turn = true; // Skip Player O's current turn
        sub_message.textContent = 'Player X\'s turn'; // Update the message for Player X's turn
    }
}

function eraser(player) {
    console.log(`${player} activated Eraser!`);

    // Determine the highlight color based on the current player
    const highlightColor = player === 'Player X' ? 'hsl(10, 100%, 80%)' : 'hsl(63, 100%, 80%)';

    // Highlight occupied cells on the sub-board to indicate they can be erased
    sub_buttons.forEach(button => {
        if (button.textContent !== '') {
            button.style.backgroundColor = highlightColor; // Highlight the cell
            button.disabled = false; // Enable the button for erasing

            // Add a one-time click event to erase the cell
            button.addEventListener(
                'click',
                function eraseCell() {
                    button.textContent = ''; // Clear the cell
                    button.style.backgroundColor = ''; // Reset the background color
                    sub_buttons.forEach(button => {
                        button.onclick = function() {button_click(button, sub_buttons, sub_message, false); };
                        if(button.textContent !== '') {
                            button.disabled = true; // Disable the button if it's not empty
                            if (button.textContent === 'X') {
                                button.style.backgroundColor = 'hsl(10, 100%, 80%)'; // Highlight for Player X
                            } else {
                                button.style.backgroundColor = 'hsl(63, 100%, 80%)'; // Highlight for Player O
                            }
                        }
                        else {
                            button.disabled = false; // Enable the button if it's empty
                        }
                    });
                    console.log(`${player} erased a cell!`);

                    // Remove the event listener after use
                    button.removeEventListener('click', eraseCell);

                    // Consume the power-up
                    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
                    const powerupButton = sidebar.querySelector('#powerup-eraser');
                    if (powerupButton) {
                        powerupButton.remove();
                        console.log(`${player} consumed the Eraser power-up.`);
                    }

                    // Allow the current player to continue their turn
                    sub_message.textContent = `${player}'s turn`;
                    sub_x_turn = player === 'Player X'; // Set the turn based on the player
                },
                { once: true } // Ensure the event listener is triggered only once
            );
        }
    });
}

function ctrlADel(player) {
    console.log(`${player} activated Ctrl + A + Del!`);
    // Clear all cells on the sub-board and give the player the first turn
    sub_buttons.forEach(button => {
        button.textContent = '';
        button.disabled = false;
        button.style.backgroundColor = '';
    });
    sub_x_turn = player === 'Player X';
    sub_message.textContent = `${player} has the first turn!`;
}

function blockHorizontal(player) {
    console.log(`${player} activated Block Horizontal!`);

    // Check if the opponent is immune to debuffs
    if ((player === 'Player X' && o_overprotective) || (player === 'Player O' && x_overprotective)) {
        console.log(`Block Horizontal failed because the opponent is immune to debuffs!`);
        return;
    }

    // Set the opponent's horizontal winnable flag to false
    if (player === 'Player X') {
        o_horizontal_winnable = false; // Block Player O from winning horizontally
    } else {
        x_horizontal_winnable = false; // Block Player X from winning horizontally
    }

    console.log(`${player} blocked horizontal wins for the opponent!`);

    // Consume the power-up
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector('#powerup-block-horizontal');
    if (powerupButton) {
        powerupButton.remove();
        console.log(`${player} consumed the Block Horizontal power-up.`);
    }
}

function blockVertical(player) {
    console.log(`${player} activated Block Vertical!`);

    // Check if the opponent is immune to debuffs
    if ((player === 'Player X' && o_overprotective) || (player === 'Player O' && x_overprotective)) {
        console.log(`Block Vertical failed because the opponent is immune to debuffs!`);
        return;
    }

    // Set the opponent's vertical winnable flag to false
    if (player === 'Player X') {
        o_vertical_winnable = false; // Block Player O from winning vertically
    } else {
        x_vertical_winnable = false; // Block Player X from winning vertically
    }

    console.log(`${player} blocked vertical wins for the opponent!`);

    // Consume the power-up
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector('#powerup-block-vertical');
    if (powerupButton) {
        powerupButton.remove();
        console.log(`${player} consumed the Block Vertical power-up.`);
    }
}

function blockDiagonal(player) {
    console.log(`${player} activated Block Diagonal!`);

    // Check if the opponent is immune to debuffs
    if ((player === 'Player X' && o_overprotective) || (player === 'Player O' && x_overprotective)) {
        console.log(`Block Diagonal failed because the opponent is immune to debuffs!`);
        return;
    }

    // Set the opponent's diagonal winnable flag to false
    if (player === 'Player X') {
        o_diagonal_winnable = false; // Block Player O from winning diagonally
    } else {
        x_diagonal_winnable = false; // Block Player X from winning diagonally
    }

    console.log(`${player} blocked diagonal wins for the opponent!`);

    // Consume the power-up
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector('#powerup-block-diagonal');
    if (powerupButton) {
        powerupButton.remove();
        console.log(`${player} consumed the Block Diagonal power-up.`);
    }
}

function milkBucket(player) {
    console.log(`${player} activated Milk Bucket!`);

    // Remove all buffs and debuffs for the player
    if (player === 'Player X') {
        x_horizontal_winnable = true;
        x_vertical_winnable = true;
        x_diagonal_winnable = true;
        x_overprotective = false; // Remove Over Protective buff
        x_underinfluence = false; // Remove Forced Alcohol debuff
        x_first_turn_rounds = 0; // Reset first-turn rounds
    } else {
        o_horizontal_winnable = true;
        o_vertical_winnable = true;
        o_diagonal_winnable = true;
        o_overprotective = false; // Remove Over Protective buff
        o_underinfluence = false; // Remove Forced Alcohol debuff
        o_first_turn_rounds = 0; // Reset first-turn rounds
    }

    console.log(`${player} removed all buffs and debuffs!`);

    // Consume the Milk Bucket power-up
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector('#powerup-milk-bucket');
    if (powerupButton) {
        powerupButton.remove();
        console.log(`${player} consumed the Milk Bucket power-up.`);
    }
}

function override(player) {
    console.log(`${player} activated override!`);

    // Determine the highlight color based on the current player
    const highlightColor = player === 'Player X' ? 'hsl(10, 100%, 80%)' : 'hsl(63, 100%, 80%)';

    // Highlight occupied cells on the sub-board to indicate they can be erased
    sub_buttons.forEach(button => {
        if (button.textContent !== '') {
            button.style.backgroundColor = highlightColor; // Highlight the cell
            button.disabled = false; // Enable the button for erasing

            // Add a one-time click event to erase the cell
            button.addEventListener(
                'click',
                function overrideCell() {
                    if(player === 'Player X') {
                        button.textContent = 'X'; // Override with Player X's symbol
                        button.style.backgroundColor = 'hsl(10, 100%, 80%)'; // Highlight for Player X
                    }
                    else {
                        button.textContent = 'O'; // Override with Player O's symbol
                        button.style.backgroundColor = 'hsl(63, 100%, 80%)'; // Highlight for Player O
                    }
                    sub_buttons.forEach(button => {
                        button.onclick = function() {button_click(button, sub_buttons, sub_message, false); };
                        if(button.textContent !== '') {
                            button.disabled = true; // Disable the button if it's not empty
                            if (button.textContent === 'X') {
                                button.style.backgroundColor = 'hsl(10, 100%, 80%)'; // Highlight for Player X
                            } else {
                                button.style.backgroundColor = 'hsl(63, 100%, 80%)'; // Highlight for Player O
                            }
                        }
                        else {
                            button.disabled = false; // Enable the button if it's empty
                        }
                    });
                    console.log(`${player} override a cell!`);

                    // Remove the event listener after use
                    button.removeEventListener('click', overrideCell);

                    // Consume the power-up
                    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
                    const powerupButton = sidebar.querySelector('#powerup-override');
                    if (powerupButton) {
                        powerupButton.remove();
                        console.log(`${player} consumed the Override power-up.`);
                    }
                },
                { once: true } // Ensure the event listener is triggered only once
            );
        }
    });
}

function automaticWin(player) {
    if(high_stakes_activated) {
        console.log(`${player} can't use Automatic Win during High Stakes!`);
        return; // Prevent activation during High Stakes
    }
    console.log(`${player} activated Automatic Win!`);

    // Automatically declare the player as the winner of the current sub-board
    sub_message.textContent = `${player} wins the sub-board! Returning to the main board in 3 seconds...`;
    sub_buttons.forEach(button => button.disabled = true);

    // Delay the transition back to the main board by 3 seconds
    setTimeout(() => {
        toMainBoard(player === 'Player X' ? 'X' : 'O');
        resetSubBoard();
    }, 3000);

    // Consume the power-up
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector('#powerup-automatic-win');
    if (powerupButton) {
        powerupButton.remove();
        console.log(`${player} consumed the Automatic Win power-up.`);
    }
}

function thievery(player) {
    console.log(`${player} activated Thievery!`);

    // Determine the opponent's sidebar and the current player's sidebar
    const opponentSidebar = player === 'Player X' ? '#right-sidebar' : '#left-sidebar';
    const currentSidebar = player === 'Player X' ? leftSidebar : rightSidebar;

    // Get all power-ups from the opponent's sidebar
    const opponentPowerups = document.querySelectorAll(`${opponentSidebar} .powerup-button`);
    if (opponentPowerups.length > 0) {
        // Randomly select a power-up to steal
        const stolenPowerup = opponentPowerups[Math.floor(Math.random() * opponentPowerups.length)];

        // Remove the stolen power-up from the opponent's sidebar
        stolenPowerup.remove();

        // Add the stolen power-up to the current player's sidebar
        currentSidebar.appendChild(stolenPowerup);

        console.log(`${player} stole ${stolenPowerup.id} and added it to their power-ups!`);
    } else {
        console.log(`${player} tried to steal a power-up, but the opponent has none!`);
    }

    // Consume the Thievery power-up
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector('#powerup-thievery');
    if (powerupButton) {
        powerupButton.remove();
        console.log(`${player} consumed the Thievery power-up.`);
    }
}

function overProtective(player) {
    if(overprotective_activated) {
        console.log(`${player} already activated Over Protective!`);
        return; // Prevent reactivation
    }
    console.log(`${player} activated Over Protective!`);

    // Grant immunity to debuffs for the player
    if (player === 'Player X') {
        x_overprotective = true;
        o_first_turn_rounds = 3; // Opponent (Player O) takes the first turn for the next 3 rounds
    } else {
        o_overprotective = true;
        x_first_turn_rounds = 3; // Opponent (Player X) takes the first turn for the next 3 rounds
    }

    console.log(`${player} is now immune to debuffs for the rest of the match!`);
    console.log(`The opponent will take the first turn for the next 3 rounds.`);

    // Consume the Over Protective power-up
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector('#powerup-over-protective');
    if (powerupButton) {
        powerupButton.remove();
        console.log(`${player} consumed the Over Protective power-up.`);
    }
    overprotective_activated = true; // Set the flag to prevent reactivation
}

function highStakes(player) {
    if(high_stakes_activated) {
        console.log(`${player} already activated High Stakes!`);
        return; // Prevent reactivation
    }
    high_stakes_activated = true; // Set the flag to prevent reactivation
    console.log(`${player} activated High Stakes!`);

    // Remove only debuffs for both players
    x_underinfluence = false; // Remove Forced Alcohol debuff for Player X
    o_underinfluence = false; // Remove Forced Alcohol debuff for Player O

    // Grant a "Milk Bucket" power-up to both players
    const milkBucketPowerup = powerups.find(powerup => powerup.id === 'powerup-milk-bucket');
    if (milkBucketPowerup) {
        // Add to Player X's sidebar
        const playerXButton = document.createElement('button');
        playerXButton.classList.add('powerup-button');
        playerXButton.id = milkBucketPowerup.id;
        playerXButton.setAttribute('data-description', milkBucketPowerup.description);
        playerXButton.innerHTML = `<img src="res/${milkBucketPowerup.id}.png" alt="${milkBucketPowerup.name}"><span>${milkBucketPowerup.name}</span>`;
        leftSidebar.appendChild(playerXButton);

        // Add to Player O's sidebar
        const playerOButton = document.createElement('button');
        playerOButton.classList.add('powerup-button');
        playerOButton.id = milkBucketPowerup.id;
        playerOButton.setAttribute('data-description', milkBucketPowerup.description);
        playerOButton.innerHTML = `<img src="res/${milkBucketPowerup.id}.png" alt="${milkBucketPowerup.name}"><span>${milkBucketPowerup.name}</span>`;
        rightSidebar.appendChild(playerOButton);

        console.log('Both players have been granted a Milk Bucket power-up.');

        // Re-attach event listeners to all power-up buttons
        attachPowerupEventListeners();
    }

    updatePowerupAvailability(); // Update power-up availability for both players

    background.style.background = 'linear-gradient(to bottom, rgb(216, 29, 29), rgb(234, 95, 9))';
    console.log('High Stakes round activated!');

    // Consume the High Stakes power-up
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector('#powerup-high-stakes');
    if (powerupButton) {
        powerupButton.remove();
        console.log(`${player} consumed the High Stakes power-up.`);
    }
}

function forcedAlcohol(player) {
    console.log(`${player} activated Forced Alcohol!`);

    // Set the opponent under the influence
    if (player === 'Player X') {
        o_underinfluence = true; // Player O is under the influence
    } else {
        x_underinfluence = true; // Player X is under the influence
    }

    console.log(`${player} activated Forced Alcohol! Opponent is now under the influence.`);

    // Consume the Forced Alcohol power-up
    const sidebar = player === 'Player X' ? leftSidebar : rightSidebar;
    const powerupButton = sidebar.querySelector('#powerup-forced-alcohol');
    if (powerupButton) {
        powerupButton.remove();
        console.log(`${player} consumed the Forced Alcohol power-up.`);
    }
}