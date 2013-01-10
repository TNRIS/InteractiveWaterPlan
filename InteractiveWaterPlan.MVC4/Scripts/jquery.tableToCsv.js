(function($) {

   $.fn.tableToCSV = function() {

      var headers = [];
      var csv = '';

      this.find('th').each(function() {

          var $th = $(this);
          var text = $th.text();
          var header = '"' + text + '"';

          headers.push(header);

      });

      csv += headers.join(',') + "\n";

      this.find('tr').not('tr:first-child').each(function() {

         $(this).find('td').each(function() {

            var row = $(this).html();

            if(!$(this).is('td:last-child')) {

                row += ',';

            } else {

                row += "\n";

            }

            csv += row;
         });

      });

      return csv;

   };

})(jQuery);

/*
Usage Example:
$('#myButton').click(function() {

    var href = 'path/to/script.php?csv=';
    var data = $('#test').tableToCSV();
    
    // then use a data uri as in this answer:
    // http://stackoverflow.com/a/7588465/627420

  });
*/