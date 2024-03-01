var disabledPlaces = [
  { section: 'balcon', row: 'c', place: 1 },
  { section: 'balcon', row: 'c', place: 2 },
  { section: 'balcon', row: 'd', place: 1 },
  { section: 'balcon', row: 'd', place: 2 },
  { section: 'balcon', row: 'd', place: 3 },
  { section: 'balcon', row: 'd', place: 4 },
  { section: 'balcon', row: 'c', place: 12 },
  { section: 'balcon', row: 'c', place: 13 },
  { section: 'balcon', row: 'c', place: 14 },
  { section: 'balcon', row: 'c', place: 15 },
  { section: 'balcon', row: 'c', place: 13 },
  { section: 'balcon', row: 'b', place: 11 },
  { section: 'balcon', row: 'b', place: 12 },
  { section: 'balcon', row: 'b', place: 13 },
  { section: 'balcon', row: 'b', place: 14 }
]

function declOfNum(number, titles) {  
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
}

$(window).on('load', () => {
  var checkedPlaces = []

  $.ajax({
    url: '/scheme.svg',
    dataType: 'html',
    type: 'GET',
    success: function(data) {
      var $data = $(data)

      disabledPlaces.forEach(place => {
        var cn = '.s-' + place.section
        if (place.row && place.place) {
          cn += '.r-' + place.row + '.p-' + place.place
        }
        $data.find(cn).addClass('disabled').html('<title>Место недоступно</title>')
      })

      $data.find('*[class*="s-"]:not(.disabled)').each(function() {
        var $this = $(this)
        var classes = $this.attr('class')
        var parts = (classes || '').split(' ').reduce((acc, part) => {
          var [ key, val ] = part.split('-')
          acc[key] = val
          return acc
        }, {})
        if (parts.r && parts.p) {
          $this.html('<title>Ряд ' + parts.r + ', место ' + parts.p + '</title>')
        }
        $this.on('click', function() {
          if ($(this).hasClass('active')) {
            checkedPlaces = checkedPlaces.filter(item => item.section !== parts.s && item.row !== parts.r && item.place !== parts.p)
          } else {
            checkedPlaces.push({ section: parts.s, row: parts.r, place: parts.p })
          }
          renderChecked(checkedPlaces)
          $(this).toggleClass('active')
        })
      })

      $('#scheme').html($data)
    }
  })
})

function renderChecked(list) {
  if (list.length === 0) {
    $('.cart-title').text('Места не выбраны')
    $('.cart-list').html('')
  } else {
    $('.cart-title').text('Выбрано ' + list.length + ' ' + declOfNum(list.length, ['место', 'места' , 'мест']))
    var html = list.map(item => '<li>Ряд ' + item.row + ', место ' + item.place + '</li>').join('')
    $('.cart-list').html(html)
  }
}