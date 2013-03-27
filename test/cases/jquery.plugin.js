;
// ![description]

<!js 
    // multiple javascript code here
    var funcs = ['foo', 'bar'];
!>

(function( $ ) {
  $.fn.![pluginname] = function() {

    <!js for(var func in funcs) {!>
    $.fn.!!func = function() {
        return $('.' + !!func);
    };
    <!js } !>

  };
})( jQuery );