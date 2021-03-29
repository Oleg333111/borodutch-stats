import axios from 'axios'
import { createConnection } from 'mongoose'
import { getBotUsers, getBotUsersForSpeller } from './getBotUsers'
const Telegraf = require('telegraf')

export let userCount = {
  count: 36131554, // data on 2021-03-29 to initialize
}

export const userCountSeparate = {} as { [index: string]: number }

async function updateStats() {
  try {
    const start = new Date()
    let result = 0
    console.log('+ updating user count')
    // Golden borodutch
    console.log('+ getting golden borodutch stats')
    const goldenBorodutchUsers = await goldenBorodutch()
    result += goldenBorodutchUsers
    console.log(`+ result ${result}`)
    console.log(`+ got golden borodutch ${goldenBorodutchUsers}`)
    userCountSeparate.goldenBorodutch = goldenBorodutchUsers
    // Todorant
    console.log('+ getting todorant stats')
    const todorantUsers = await todorant()
    result += todorantUsers
    console.log(`+ result ${result}`)
    console.log(`+ got todorant ${todorantUsers}`)
    userCountSeparate.todorant = todorantUsers
    // Feedr
    console.log('+ getting feedr stats')
    const feedrUsers = await feedr()
    result += feedrUsers
    console.log(`+ result ${result}`)
    console.log(`+ got feedr ${feedrUsers}`)
    userCountSeparate.feedr = feedrUsers
    // MT
    console.log('+ getting mt stats')
    const mtUsers = await mt()
    result += mtUsers
    console.log(`+ result ${result}`)
    console.log(`+ got mt ${mtUsers}`)
    userCountSeparate.mt = mtUsers
    // Temply
    console.log('+ getting temply stats')
    const templyUsers = await temply()
    result += templyUsers
    console.log(`+ result ${result}`)
    console.log(`+ got temply ${templyUsers}`)
    userCountSeparate.temply = templyUsers
    // ArbeitBot
    console.log('+ getting arbeit_bot stats')
    const arbeitBotUsers = await arbeitBot()
    result += arbeitBotUsers
    console.log(`+ result ${result}`)
    console.log(`+ got arbeit_bot ${arbeitBotUsers}`)
    userCountSeparate.arbeitBot = arbeitBotUsers
    // Check my text bot
    const spellerUsers = await getBotUsersForSpeller(
      '@check_my_text_bot',
      process.env.CHECK_MY_TEXT_BOT,
      process.env.CHECK_MY_TEXT_BOT_TOKEN
    )
    result += spellerUsers
    console.log(`+ result ${result}`)
    userCountSeparate.speller = spellerUsers
    // Randy
    const randyUsers = await getBotUsers(
      '@randymbot',
      process.env.RANDYM,
      process.env.RANDYM_TOKEN,
      'chatId'
    )
    result += randyUsers
    console.log(`+ result ${result}`)
    userCountSeparate.randy = randyUsers
    // Banofbot
    const banofbotUsers = await getBotUsers(
      '@banofbot',
      process.env.BANOFBOT,
      process.env.BANOFBOT_TOKEN
    )
    result += banofbotUsers
    console.log(`+ result ${result}`)
    userCountSeparate.banofbot = banofbotUsers
    // TLGCoin
    const tlgcoinUsers = await getBotUsers(
      '@tlgcoin_bot',
      process.env.TLGCOIN,
      process.env.TLGCOIN_TOKEN,
      undefined,
      'users'
    )
    result += tlgcoinUsers
    console.log(`+ result ${result}`)
    userCountSeparate.tlgcoin = tlgcoinUsers
    // Shieldy
    const shieldyUsers = await getBotUsers(
      '@shieldy_bot',
      process.env.SHIELDY,
      process.env.SHIELDY_TOKEN
    )
    result += shieldyUsers
    console.log(`+ result ${result}`)
    userCountSeparate.shieldy = shieldyUsers
    // Voicy
    const voicyUsers = await getBotUsers(
      '@voicy_bot',
      process.env.VOICY,
      process.env.VOICY_TOKEN
    )
    result += voicyUsers
    console.log(`+ result ${result}`)
    userCountSeparate.voicy = voicyUsers
    // Result
    userCount.count = result
    const end = new Date()
    console.log(
      `+ got overall number of users ${result} in ${(
        (end.getTime() - start.getTime()) /
        1000 /
        60 /
        60
      ).toFixed(3)}h`
    )
    const bot = new Telegraf(process.env.TOKEN)
    bot.telegram.sendMessage(
      process.env.ADMIN,
      `got overall number of users ${result} in ${(
        (end.getTime() - start.getTime()) /
        1000 /
        60 /
        60
      ).toFixed(3)}h`
    )
  } catch (err) {
    const bot = new Telegraf(process.env.TOKEN)
    bot.telegram.sendMessage(
      process.env.ADMIN,
      `Could not calculate user count ${err.message}`
    )
  }
}

let updating = false
updateStats()
setInterval(async () => {
  if (updating) {
    return
  }
  try {
    updating = true
    await updateStats()
  } catch (err) {
    console.error(err)
  } finally {
    updating = false
  }
}, 24 * 60 * 60 * 1000)

async function goldenBorodutch() {
  try {
    const goldenBorodutch = (await axios.get('https://t.me/golden_borodutch'))
      .data
    return parseInt(
      /<div class="tgme_page_extra">(.+) members/
        .exec(goldenBorodutch)[1]
        .replace(' ', ''),
      10
    )
  } catch (err) {
    console.log(err)
  }
}

async function todorant() {
  const connection = await createConnection(process.env.TODORANT, {
    useNewUrlParser: true,
  })
  const User = connection.collection('users')
  const userCount = await User.find().count()
  await connection.close()
  return userCount
}

async function feedr() {
  const connection = await createConnection(process.env.FEEDR, {
    useNewUrlParser: true,
  })
  const User = connection.collection('users')
  const userCount = await User.find().count()
  await connection.close()
  return userCount
}

async function mt() {
  const connection = await createConnection(process.env.MT, {
    useNewUrlParser: true,
  })
  const User = connection.collection('users')
  const userCount = await User.find().count()
  await connection.close()
  return userCount
}

async function temply() {
  const connection = await createConnection(process.env.TEMPLY, {
    useNewUrlParser: true,
  })
  const User = connection.collection('users')
  const userCount = await User.find().count()
  await connection.close()
  return userCount
}

async function arbeitBot() {
  const connection = await createConnection(process.env.ARBEIT_BOT, {
    useNewUrlParser: true,
  })
  const User = connection.collection('users')
  const userCount = await User.find().count()
  await connection.close()
  return userCount
}
