$().ready(function() {
  //click events
  $('form#tags input').click(function() {
    $posts = $('ul.posts');
    
    $('form#tags input:not(:checked)')
    .each(function() {
      tag = $(this).attr('value');
      $posts.find('li.'+tag).hide();
    });

    $checked = $('form#tags input:checked');
    if ($checked.length > 0) { 
      enabled = $('input:checked').map(function() {return $(this).attr('value') });
      window.location.hash = enabled.toArray().join(',');

      $('form#tags input:checked:not(:visible)').each(function() {
        tag = $(this).attr('value');
        $posts.find('li.'+tag).fadeIn(200);
      });
    } else {
      $posts.find('li').show();
      window.location.hash = '';
    }
  });


  //init from hash
  if (window.location.hash.length > 0) {
    tags = window.location.hash.replace('#', '').split(',')
    $('ul.posts li').hide()

    for (var tag in tags) {
      $('form#tags input[value=' + tags[tag] +']').each(function() {
        $(this).prop('checked', true);
      });
      $('ul.posts li.'+tags[tag]).fadeIn(200);
    };
  }

});
