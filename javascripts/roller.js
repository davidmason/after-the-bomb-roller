/**
 * Exposes a global function `rollStats` that will calculate rolls for
 * all starting statistics and display them in the element with id 'statsDisplay'
 */

function rollStats () {
  console.log('rollStats()')
  // test()
  var container = document.getElementById('statsDisplay')
  clear()

  print('<h4>Base stats (pp. 11-13)</h4>\n')

  var baseStats = {};
  ['IQ', 'ME', 'MA', 'PS', 'PP', 'PE', 'PB', 'Spd'].forEach(function (statName) {
    var rolls = rollsForBaseStat()
    baseStats[statName] = sum(rolls)
    println(statName + ': ' + baseStats[statName] + '    (' + rolls.join(', ') + ')')
  })

  // at this point I have baseStats with all the values


  /* Do all the rolls for a base stat calculation,
   * including any bonus rolls for high values
   */
  function rollsForBaseStat () {
    var rolls = [D6(), D6(), D6()]
    if (sum(rolls) >= 16) {
      rolls.push(D6())
      if (last(rolls) === 6) {
        rolls.push(D6())
      }
    }
    return rolls
  }

  /* remove all content from the container */
  function clear () {
    container.innerHTML = ''
  }

  /* add a line of text to the container */
  function print (text) {
    container.innerHTML = container.innerHTML + text
  }

  /* add a line of text to the container */
  function println (text) {
    container.innerHTML = container.innerHTML + text + '<br/>\n'
  }

  function D6 () {
    return rollNSidedDie(6)
  }

  function last (array) {
    return array[array.length - 1]
  }

  function rollNSidedDie (sides) {
    return Math.floor(Math.random() * (sides)) + 1;
  }

  function sum (array) {
    return array.reduce(function (acc, v) { return acc + v }, 0)
  }

  /* make sure all functions generate expected output */
  function test () {
    var pass = 0, fail = 0, total = 0
    var sidesToTest = [4, 6, 8, 10, 20]

    sidesToTest.forEach(function (sides) {
      for (var i = 0; i<50; i++) {
        checkRoll(sides, rollNSidedDie(sides))
      }
    })

    console.log('tested ' + total + ' pass:' + pass + ' fail: ' + fail)


    function checkRoll (sides, rolledNumber) {
      // console.log(sides + ' ' + rolledNumber)
      total++
      if (Number.isInteger(rolledNumber)) {
        pass++
      } else {
        fail++
        console.error('roll for ' + sides + '-sided die gave non-integer ' + rolledNumber)
      }

      total++
      if (rolledNumber >=1 && rolledNumber <= sides) {
        pass++
      } else {
        fail++
        console.error('roll for ' + sides + '-sided die gave out-of-range value ' + rolledNumber)
      }
    }
  }
}
