// Dependencies
import axios from 'axios'

export let stats: any = {}

async function updateStats() {
  console.info('Started updating')
  const start = new Date()

  const voicyStats = (await axios.get(
    'https://pay.voicybot.com/statsfornikita'
  )).data
  stats.voicy = voicyStats

  const end = new Date()
  console.info(
    `Finished updating in ${(end.getTime() - start.getTime()) / 1000}s`
  )
}

let updating = false
updateStats()
setTimeout(async () => {
  if (updating) {
    return
  }
  try {
    updating = true
    await updateStats()
  } finally {
    updating = false
  }
}, 15 * 1000)
