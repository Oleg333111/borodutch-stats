// Dependencies
import axios from 'axios'
import { getMT } from './mt'
import { getArbeitBot } from './arbeitbot'
import { getShieldy } from './shieldy'
import { getTemply } from './temply'

export let stats: any = {}

async function updateStats() {
  console.info('Started updating')
  const start = new Date()

  // + Temply
  stats.temply = await getTemply()
  // + Shieldy
  stats.shieldy = await getShieldy()
  // + Arbeitbot
  stats.arbeitbot = await getArbeitBot()
  // + Mamkin Trade
  stats.mt = await getMT()
  // + Voicy
  stats.voicy = {
    stats: (await axios.get('https://pay.voicybot.com/statsfornikita')).data,
    cloudflare: await cloudflareData('a2931825c44695714557a87d1ceb4699')
  }
  // + Fondu
  stats.fondu = await cloudflareData('1ec35cf14fe9fdcd97290a42af2deee8')
  // + Borodutch
  stats.borodutch = await cloudflareData('1f2511a68b81a60b7280ebbb3c61291d')
  // + Please no
  stats.pleaseno = await cloudflareData('40a2eeccaffd2df433952dc4ac924dde')
  // + Resetbot
  stats.resetbot = await cloudflareData('5310b8bd048921d0d433392061172c90')
  // + Golden borodutch
  console.log('Getting @golden_borodutch data')
  const goldenBorodutch = (await axios.get('https://t.me/golden_borodutch'))
    .data
  stats.goldenBorodutch = {
    subCount: parseInt(
      /<div class="tgme_page_extra">(.+) members/
        .exec(goldenBorodutch)[1]
        .replace(' ', ''),
      10
    )
  }
  console.log('Got @golden_borodutch data')
  // Randymbot
  // Banofbot
  // TLGCoin

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
  } catch (err) {
    console.error(err)
  } finally {
    updating = false
  }
}, 10 * 60 * 1000)

export async function cloudflareData(id: string) {
  console.log(`Getting Cloudflare data for ${id}`)
  const data = (await axios.get(
    `https://api.cloudflare.com/client/v4/zones/${id}/analytics/dashboard?since=-172800`,
    {
      headers: {
        'X-Auth-Key': process.env.CLOUDFLARE,
        'X-Auth-Email': 'backmeupplz@gmail.com'
      }
    }
  )).data
  const result = []
  for (const unit of data.result.timeseries) {
    result.push(unit.requests.all)
  }
  console.log(`Got Cloudflare data for ${id}`)
  return result
}
