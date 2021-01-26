import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Alert
} from 'react-native'

import { 
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed
} from './src/functions'

import params from './src/params'
import MineField from './src/components/MineField'
import Header from './src/components/Header'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const cols = params.getCollumnsAmount()
    const rows = params.getRowsAmount()
    return Math.ceil(cols * rows * params.difficultLevel)
  }

  createState = () => {
    const cols = params.getCollumnsAmount()
    const rows = params.getRowsAmount()
    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false
    }
  }

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hadExplosion(board)
    const won = wonGame(board)

    if (lost) {
      showMines(board)
      Alert.alert('Perdeu')
    }
    if (won) {
      Alert.alert('Parabéns, Você ganhou')
    }

    this.setState({ board, lost, won})
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if(won) {
      Alert.alert('Parabéns, Você venceu')
    }

    this.setState({ board, won })
  }


  render() {
    return (
      <View style={styles.container}>
        <Header flagsLeft={this.minesAmount()-flagsUsed(this.state.board)} onNewGame={()=>this.setState(this.createState())}/>     
        <View style={styles.board}>
          <MineField 
            board={this.state.board} 
            onOpenField={this.onOpenField}
            onSelectField={this.onSelectField}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
});


// (field) é o campo
// (filed mined) é o campo com a mina porem o nao da pra ver a mina 
// (field mined opened) é o campo aberto com uma mina e ela é visivel
// (field mined opened exploded) é o campo aberto com a mina que te fez perder jogo, com o fundo vermelho

// (field flag) é o campo com a bandeira