$(document).ready(function(){
  publications = {};
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
    $.getJSON(
        'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json',
        { term : term, format: "json" }
      )

      // If successful, fetch summaries from the list of IDs 
      // e.g. http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=11850928,11482001&format=json
     .then(function(results) {
        $("#status").text("Searching...")
        return $.getJSON('http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' + results.esearchresult.idlist.join() + '&retmode=json') 
      })
      // Process summary results 
     .done(function(results) {
        $("#status").text("")
        $("#citation-select").prepend('<h4 id="search-results">Search Results</h4>')
        if (results.result) {
          $.each(citations(results.result, publications).citationsMarkdown,
            function(i, cite) {
              var elem_id = i + '-' + cite.uid
              var editor = $("#pico-editor").clone()
                .attr('id', elem_id)
              $(editor).appendTo("#pico-studies")
              $('#'+elem_id + ' .editor .editor-text').val(cite.markdown)
              $('#'+elem_id).show()
          })
        }
        else {
          pub_errors.push("Search was successful, but no results were found")
        }
      })
      .fail(function() {
        $("#status").text("")
        pub_errors.push("Pubmed search failed. Please try again.")
      })
      .always(function() {
        $("#submitbutton").prop( "disabled", false );
        $("#hints").show();
      });

      for(var err in pub_errors) {
        $("#flash").append( $("p.error", err) );
      }
  }); 

  function repoLinks() {
    //For gh-pages
    //Page history and edit
    var pagename = location.pathname.split('/').slice(-1);
    if (pagename.toString().length < 1) { pagename = "index.html" }
    $('footer').append("<div style='text-align:center'><a href='https://github.com/openMetaAnalysis/openMetaAnalysis.github.io/blob/master/" + pagename + "'>Edit this page</a> - <a href='https://github.com/openMetaAnalysis/openMetaAnalysis.github.io/commits/master/" + pagename + "'>Page history</a></div>")
  }

  repoLinks();
});
