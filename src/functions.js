//funcao para criar tabuleiro
const createBoard = (rows, columns) => {
    return Array(rows).fill(0).map((_, row) => {
        return Array(columns).fill(0).map((_, column) => {
            return {
                row: row,
                column: column,
                opened: false,
                flagged: false,
                mined: false,
                exploded: false,
                nearMines: 0
            }
        })
    })
}

//funcao para espalhar as minas
const spreadMines = (board, minesAmount) => {
  const rows = board.length
  const columns = board[0].length
  let minesPlanted = 0

  while (minesPlanted < minesAmount) {
      const rowSel = parseInt(Math.random() * rows, 10)
      const columnSel = parseInt(Math.random() * columns, 10)

      if (!board[rowSel][columnSel].mined) {
          board[rowSel][columnSel].mined = true
          minesPlanted++
      }
  }
}

//criar o tabuleiro ja com as minas plantadas
const createMinedBoard = (rows, columns, minesAmount) => {
    const board = createBoard(rows, columns)
    spreadMines(board, minesAmount)
    return board
}

//funcao para clonar um tabuleiro
const cloneBoard = board => {
    return board.map(rows => {
        return rows.map(field => {
            return { ...field }
        })
    })
}

//funcao para pegar os vizinho
const getNeighbors = (board, row, column) => {
    const neighbors = []
    const rows = [row - 1, row, row + 1]
    const columns = [column - 1, column, column + 1]
    rows.forEach(r => {
        columns.forEach(c => {
            const different = r || c !== column
            const validRow = r >=0 && r < board.length
            const validColumn = c >= 0 && c < board[0].length
            if (different && validRow && validColumn) {
                neighbors.push(board[r][c])
            }
        })
    })
    return neighbors
}

//funcao para ver se a vizinhaca e segura
const safeNeighborhood = (board, row, column) => {
    const safes = (result, neighbor) => result && !neighbor.mined
    return getNeighbors(board, row, column).reduce(safes, true)
}

//funcao para abrir um campo 
const openField = (board, row, column) => {
    const field = board[row][column]
    if ( !field.opened ) {
        field.opened = true
        if (field.mined) {
            field.exploded = true
        }
        else if (safeNeighborhood(board, row, column)){
            getNeighbors(board, row, column).forEach( n => openField(board, n.row, n.column))
        }
        else {
            const neighbors = getNeighbors(board, row, column)
            field.nearMines = neighbors.filter(n => n.mined).length
        }
    }
}

//funcao para percorrer toda a matriz
const fields = board => [].concat(...board)

//funcao para sabe se tem algum campo explodido
const hadExplosion = board => fields(board).filter(field => field.exploded).length > 0

//funcao para ver se tem algum campo pendente (sem abrir){(usada para ver se o usario ganhou ou nao o jogo)}
const pendding = field => (field.mined && !field.flagged) || (!field.mined && !field.opened)

//funcao de verificao de jogo, usada a pendding como apoio
const wonGame = board => fields(board).filter(pendding).length === 0

//funcao para mostrar as minas que existem no jogo
const showMines = board => fields(board).filter(field => field.mined).forEach(field => field.opened = true)

//funcao para marcar com a bandeira
const invertFlag = (board, row, column) => {
    const field = board[row][column]
    field.flagged = !field.flagged
}

//funcao que calcula quantas flags foram usadas no jogo
const flagsUsed = board => fields(board).filter(field => field.flagged).length

export { 
    createMinedBoard,
    cloneBoard,
    openField,
    hadExplosion,
    wonGame,
    showMines,
    invertFlag,
    flagsUsed
}