$(document).ready(function(){
  publications = [];
  var pub_errors = [];
  $("#submitbutton").on("click", function(){
    var term = $("#input").val();
    if (term==null || term=="") {
      alert("Please enter a search term");
      return false;
    }

    // disable the button to prevent multiple clicks
    $("#submitbutton").prop( "disabled", true )
    $("#status").html("<i>searching...</i>")
      
    // Chain request for result IDs with request for citation records.
    // Get list of IDs based on search terms
    $.getJSON('http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json', { term : term, format: "json" })

    // Get results from a list of IDs 
    // e.g. http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=11850928,11482001&format=json
     .then(function(results) {
        return $.getJSON('http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' + results.esearchresult.idlist.join() + '&retmode=json') 
      })
     .done(function(results) {
        if (results.result) {
          citations(results.result, publications);
        }
      })
      .fail(function() {
        pub_errors.push("Pubmed search failed. Please try again.")
        for(var err in pub_errors) {
          $("#flash").append( $("div.error", err) );
        }
      })
      .always(function() {
        $("#submitbutton").prop( "disabled", false );
        $("#hints").show();
      });
  }); 
});
