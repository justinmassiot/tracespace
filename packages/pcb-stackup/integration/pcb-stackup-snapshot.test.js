// pcb-stackup render snapshot tests
'use strict'

const format = require('xml-formatter')
const snapshot = require('snap-shot-it')

const {getBoards} = require('@tracespace/fixtures')
const getBoardResults = require('./get-results')

const SIDES = ['top', 'bottom']
const BOARDS = getBoards.sync().filter(b => !b.skipSnapshot)

describe(`pcb-stackup :: integration snapshots`, function() {
  BOARDS.forEach((board, index) =>
    describe(board.name, function() {
      let boardResults

      before(function(done) {
        if (process.env.INTEGRATION !== '1') return this.skip()

        getBoardResults(board, (error, results) => {
          if (error) return done(error)
          boardResults = results
          done()
        })
      })

      SIDES.forEach(side =>
        it(`renders ${side}`, function() {
          const result = boardResults.specs.find(s => s.name === side)
          snapshot(format(result.render).split('\n'))
        })
      )
    })
  )
})
