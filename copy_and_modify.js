const fs = require('fs');

const approvedDriveContent = fs.readFileSync('src/views/pages/Withdrawals/ApprovedWithdrawalsdrivesol.js', 'utf8');

const approvedTetrisContent = approvedDriveContent
  .replace(/drivesol/g, 'tetrissol')
  .replace(/Drivesol/g, 'Tetrissol')
  .replace(/drive/g, 'tetris')
  .replace(/Drive/g, 'Tetris')
  .replace(/carrace/g, 'tetris')
  .replace(/Carrace/g, 'Tetris')
  .replace(/CARRACE/g, 'TETRIS');

fs.writeFileSync('src/views/pages/Withdrawals/Approvedwithdrawalstetrissol.js', approvedTetrisContent);

const transferDriveContent = fs.readFileSync('src/views/pages/Withdrawals/TransferWithdrawalsdrivesol.js', 'utf8');

const transferTetrisContent = transferDriveContent
  .replace(/drivesol/g, 'tetrissol')
  .replace(/Drivesol/g, 'Tetrissol')
  .replace(/drive/g, 'tetris')
  .replace(/Drive/g, 'Tetris')
  .replace(/carrace/g, 'tetris')
  .replace(/Carrace/g, 'Tetris')
  .replace(/CARRACE/g, 'TETRIS');

fs.writeFileSync('src/views/pages/Withdrawals/Transferwithdrawalstetrissol.js', transferTetrisContent);

console.log('Created Tetris withdrawal files successfully');
