const axios = require('axios')
const cheerio = require('cheerio')

async function getRecyclingLocations(what, where) {
  const url = `https://search.earth911.com/?what=${what}&where=${where}`
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const locations = []
    $('.result-item.location').each((index, element) => {
      const name = $(element).find('h2.title a').text().trim()
      const address1 = $(element).find('.address1').text().trim()
      const address2 = $(element).find('.address2').text().trim()
      const address3 = $(element).find('.address3').text().trim()
      const phone = $(element).find('.phone').text().trim()

      const items = []
      $(element).find('.result-materials .matched.material').each((i, itemElement) => {
        items.push($(itemElement).text().trim())
      })

      locations.push({ name, address1, address2, address3, phone, recyclable_items: items })
    })

    return locations
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

// Example usage:
getRecyclingLocations('plastic', '10012')
  .then(recyclingLocations => {
    recyclingLocations.forEach(location => {
      console.log(`Name: ${location.name}`)
      console.log(`Address: ${location.address1}, ${location.address2}, ${location.address3}`)
      console.log(`Phone: ${location.phone}`)
      console.log('Recyclable Items:')
      location.recyclable_items.forEach(item => {
        console.log(` - ${item}`)
      })
      console.log('---------------')
    })
  })
  .catch(error => {
    console.error('Error:', error)
  })

  