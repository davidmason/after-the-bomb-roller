/**
 * Exposes a global function `rollStats` that will calculate rolls for
 * all starting statistics and display them in the element with id 'statsDisplay'
 */

function rollStats () {
  // console.log('rollStats()')
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
  print('<ul>\n')

  // IQ
  print('<li>real-world IQ value would be ' + (baseStats['IQ'] * 10) + '\n')
  if (baseStats['IQ'] >= 16) {
    print('<ul><li>add ' + (baseStats['IQ'] - 14) + '% to all skill percentages</li></ul>\n')
  }
  print('</li>\n')

  // ME
  if (baseStats['ME'] >= 16) {
    print('<li>+' + mePsionicSaveBonus(baseStats['ME']) + ' to save vs. psionic attack</li>\n')
    print('<li>+' + meInsanitySaveBonus(baseStats['ME']) + ' to save vs. insanity</li>\n')
  }


  print('</ul>')


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

  /* bonus value to save vs. psionic attacks for high M.E. values */
  function mePsionicSaveBonus (me) {
    if (me < 16) {
      return 0
    }
    return Math.floor((me - 14) / 2)
  }

  /* bonus value to save vs. insanity for high M.E. values */
  function meInsanitySaveBonus (me) {
    if (me < 16) {
      return 0
    }
    if (me < 20) {
      // 16,17 -> 1
      // 18,19 -> 2
      return Math.floor((me - 14) / 2)
    }
    return me - 17
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

    total++
    if (mePsionicSaveBonus(16) === 1) {
      pass++
    } else {
      fail++
      console.error('mePsionicSaveBonus for 16 should be +1 but was +' + mePsionicSaveBonus(16))
    }

    for (var i = 3; i < 16; i++) {
      checkMePsionicSaveBonus(i, 0)
    }
    checkMePsionicSaveBonus(16, 1)
    checkMePsionicSaveBonus(17, 1)
    checkMePsionicSaveBonus(18, 2)
    checkMePsionicSaveBonus(19, 2)
    checkMePsionicSaveBonus(20, 3)
    checkMePsionicSaveBonus(21, 3)
    checkMePsionicSaveBonus(22, 4)
    checkMePsionicSaveBonus(23, 4)
    checkMePsionicSaveBonus(24, 5)
    checkMePsionicSaveBonus(25, 5)
    checkMePsionicSaveBonus(26, 6)
    checkMePsionicSaveBonus(27, 6)
    checkMePsionicSaveBonus(28, 7)
    checkMePsionicSaveBonus(29, 7)
    checkMePsionicSaveBonus(30, 8)

    for (var i = 3; i < 16; i++) {
      checkMeInsanitySaveBonus(i, 0)
    }
    checkMeInsanitySaveBonus(16, 1)
    checkMeInsanitySaveBonus(17, 1)
    checkMeInsanitySaveBonus(18, 2)
    checkMeInsanitySaveBonus(19, 2)
    checkMeInsanitySaveBonus(20, 3)
    checkMeInsanitySaveBonus(21, 4)
    checkMeInsanitySaveBonus(22, 5)
    checkMeInsanitySaveBonus(23, 6)
    checkMeInsanitySaveBonus(24, 7)
    checkMeInsanitySaveBonus(25, 8)
    checkMeInsanitySaveBonus(26, 9)
    checkMeInsanitySaveBonus(27, 10)
    checkMeInsanitySaveBonus(28, 11)
    checkMeInsanitySaveBonus(29, 12)
    checkMeInsanitySaveBonus(30, 13)



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

    function checkMePsionicSaveBonus (meStat, expectedBonus) {
      total++
      var actual = mePsionicSaveBonus(meStat)
      if (actual === expectedBonus) {
        pass++
      } else {
        fail++
        console.error('mePsionicSaveBonus(' + meStat + ') should be +' + expectedBonus + ' but was +' + actual)
      }
    }

    function checkMeInsanitySaveBonus (meStat, expectedBonus) {
      total++
      var actual = meInsanitySaveBonus(meStat)
      if (actual === expectedBonus) {
        pass++
      } else {
        fail++
        console.error('meInsanitySaveBonus(' + meStat + ') should be +' + expectedBonus + ' but was +' + actual)
      }
    }
  }
}
