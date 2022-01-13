#= require jquery
#= require popper
#= require bootstrap-sprockets
#= reauire vendors/glightbox.js
#= require slick.js
#= require blogs.js
#= require category.js

urlParam = (name) =>
  if results = new RegExp("[\?&]#{name}=([^&#]*)").exec(window.location.search)
    results[1]

if $('#key-highlight').length
  $(document).on 'ready', =>
    $("#key-highlight").modal()

if $('body.recent-work').length
  $(document).on 'click', 'a.desc-more', =>
    setTimeout =>
      a2a.init 'page'
    , 1000

  $(document).on 'ready', =>
    lighbox = GLightbox(
      selector: '.glightbox'
      descPosition: 'right'
      zoomable: true
      moreText: 'ดูรายละเอียด'
    )

    lighbox.on 'slide_after_load', =>
      a2a.init 'page'

    lighbox.on 'slide_changed', =>
      $slide = $('.gslide.loaded.current')
      $meta = $slide.find('.gslide-desc .meta')
      document.title = $meta.attr('data-title')
      history.pushState '', '', $meta.attr('data-url')

    focusWork = window.location.hash
    if focusWork
      lighbox.open($(focusWork)[0])

if $('.hero-slick').length
  $('.hero-slick').slick(
    autoplay: true,
    prevArrow: '<i class="slick-custom-prev far fa-chevron-left"></i>'
    nextArrow: '<i class="slick-custom-next far fa-chevron-right"></i>'
  )

if $('.awarded-slick').length
  $('.awarded-slick').slick(
    autoplay: true
    prevArrow: false
    nextArrow: false
    dots: true
  )

if $('.work-sale-button').length
  $.ajax(
    url: 'https://www.eventpop.me/e/12105.json'
    method: 'get'
    dataType: 'json'
    success: (data) ->
      ticketTypeStatuses = {}
      for ticketType in data.ticket_types
        ticketTypeStatuses["#{ticketType.id}"] = ticketType.selling_status

      $('.work-sale-button').each ->
        ticketTypeId = $(@).data('ticket-type-id')
        status = ticketTypeStatuses[ticketTypeId]

        if status == 'active' || status == 'not_selling'
          $(@).find('.btn-success').removeClass 'd-none'
        else if status == 'soft_sold_out'
          $(@).find('.btn-secondary').removeClass 'd-none'
        else if status == 'sold_out'
          $(@).find('.btn-danger').removeClass 'd-none'
        else
          $(@).hide()

        $(@).find('.loading').hide()
  )
