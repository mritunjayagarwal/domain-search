(function(){
    $('#msbo').on('click', function(){
      $('body').toggleClass('msb-x');
    });
    if (window.innerWidth < 900) {
        $('body').addClass('msb-x');
    }
  }());