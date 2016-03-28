  function toPicoTable(studies) {
    studies.children('.pico-editor')
      .each(function(i, e) {
        if ($(e).find('.editor-chk input').prop('checked')) {
          $('#pico-table')
            .append(
              marked(
                $(e).find('.editor-text').val()
              )
            )
        }
    })
  } 

  function citations(publist, processed) {
    //processed.citationsSelect = []
    //processed.citationsPico = []
    processed.citationsMarkdown = []
    publist["uids"].forEach(function(uid) {
    //  processed.citationsSelect.push(citationSelect(publist[uid]));
    //  processed.citationsPico.push(citationPico(publist[uid]));
      processed.citationsMarkdown.push(citationMarkdown(publist[uid]));
    });
    return processed;
  }

  function citationMarkdown(publication) {
    var studyname = publication.authors.slice(0,3)
          .map(function(a) { return a.name.split(' ')[0] }).join(', ')
    var pubyear = publication.pubdate
    if (pubyear.indexOf(" ") > 1) {
      pubyear = pubyear.substring(0, pubyear.indexOf(" "));
    }
    publication.markdown = "#study\n" +
                 "##citation:\n" +
                  "*year=" + pubyear + "\n" +
                  "* pmid=" + publication.uid + "\n" +
                  "trialregistration" +
                  "journal_abbrev=" + publication.source +
                  "studyname" + studyname
    return publication;
  }

  function citationSelect(publication) {
    var authlist = publication.authors.slice(0,3)
          .map( function(a) { return a.name.split(' ')[0] }).join(', ')
    var authors = $('<span/>').addClass('authors')
          .text(authlist)
    var title = publication.title.trim().replace(/\.$/, '')
    if (title.length > 60) { title = title.substr(0, 60).trim().concat('..') }
    var title_el = $('<span/>').addClass('title').text(title)
    var pubyear = $('<span/>').addClass('pubyear').text(publication.pubdate)
    var src = $('<span/>').addClass('source').text(publication.source)
    var uid = $('<span/>').addClass('title').text(publication.uid)
    return $("<label/>").attr('id', "select_" + publication.uid)
             .append(authors)
             .append(pubyear)
             .append(title_el)
             .append(src)
             .append(uid)
             .prepend(
               $("<input/>")
                 .attr("value", publication.uid)
                 .attr("type", "checkbox")
             )
  }

  function citationPico(publication) {
    var citation = "!-- start of a new study --";
    var studyname = publication.authors.slice(0,3)
          .map(function(a) { return a.name.split(' ')[0] }).join(', ')
    var pubyear = publication.pubdate
  
    if (pubyear.indexOf(" ") > 1) {
      pubyear = pubyear.substring(0, pubyear.indexOf(" "));
    }
  
    citation+= "&lt;study&gt;<br>&lt;citation  year=\"" + pubyear +
               "\" pmid=\"" + publication.uid +
               '\" trialregistration=\"\" journal_abbrev=\"' + publication.source +
               '\"&gt;' + studyname + "&lt;/citation&gt;</span><br>"
  
    studyTypeTips();

    if ($("#type_intervention").is(":checked")) {
        citation+= String.fromCharCode(9) + "&nbsp;&lt;design&gt;<span style='background-color:yellow'>" + $("#box0").val() + "</span>&lt;/design&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;patients total=\"<span style='background-color:yellow'>__</span>\"&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;description&gt;<span style='background-color:yellow'>" + $("#box1").val()  + "</span>&lt;/description&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet&gt;<span style='background-color:yellow'>Mean age __ months</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;/patients&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;intervention&gt;<span style='background-color:yellow'>" + $("#box2").val() + "</span><br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet&gt;<span style='background-color:yellow'>Amount?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet&gt;<span style='background-color:yellow'>Frequency?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet&gt;<span style='background-color:yellow'>Duration?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;/intervention&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;comparison&gt;<span style='background-color:yellow'>" + $("#box3").val() + "</span><br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;/comparison&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;outcome&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet type='primary' url='http://pubmed.gov/delete_url_if_not_needed'&gt;<span style='background-color:yellow'>" + $("#box4").val() + " measured how and when</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet type='secondary'&gt;<span style='background-color:yellow'>Criteria used or how measured?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;/outcome&gt;<br>"
        $("#criteria").html("<a href=\"http://handbook.cochrane.org/chapter_8/table_8_5_d_criteria_for_judging_risk_of_bias_in_the_risk_of.htm\">Individual criteria for judging risk of bias</a> in a trial using the '<a href=\"http://handbook.cochrane.org/chapter_8/8_5_the_cochrane_collaborations_tool_for_assessing_risk_of_bias.htm\">Cochrane's Risk of bias tool</a>'</li></ul>")
    }
  
    if ($("#type_diagnosis").is(":checked")) {
        citation+= String.fromCharCode(9) + "&nbsp;&lt;design&gt;<span style='background-color:yellow'>" + $("#box0").val() + "</span>&lt;/design&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;patient_selection total=\"<span style='background-color:yellow'>__</span>\"&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;description&gt;<span style='background-color:yellow'>" + $("#box1").val()  + "</span>&lt;/description&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet&gt;<span style='background-color:yellow'>Consecutive enrollment</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet&gt;<span style='background-color:yellow'>Mean age __ months</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;/patient_selection&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;index_test&gt;<span style='background-color:yellow'>" + $("#box2").val() + "</span><br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet&gt;<span style='background-color:yellow'>Who interpreted?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet&gt;<span style='background-color:yellow'>Interpretation standardized?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;/index_test&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;reference_standard&gt;<span style='background-color:yellow'>" + $("#box3").val() + "</span><br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet type='primary'&gt;<span style='background-color:yellow'>Criteria or cutoffs used?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet type='secondary' &gt;<span style='background-color:yellow'>Who interpreted?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet type='secondary' url='http://pubmed.gov/delete_url_if_not_needed'&gt;<span style='background-color:yellow'>Interpretation standardized?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;/reference_standard&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;flow_timing&gt;<span style='background-color:yellow'>" + $("#box4").val() + "</span><br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;bullet&gt;<span style='background-color:yellow'>Other issues to note?</span>&lt;/bullet&gt;<br>"
        citation+= String.fromCharCode(9) + "&nbsp;&lt;/flow_timing&gt;<br>"
        $("#criteria").html("<a href=\"http://www.bris.ac.uk/quadas/quadas-2/\">Four criteria for judging risk of bias from QUADAS-2</a> (see Risk of bias row in the Table guided by the detailed criteria in the rows above)</li></ul>")
    }
    return citation += "&lt;/study&gt;<br>"
  }

  function studyTypeTips() {
  $(".type").on("click", function(){
    $("#labels").show()
    if ($("#type_intervention").is(":checked")){
      $("#box0label").html('Enter study design')
      $("#box0").attr("placeholder", "Enter randomized controlled trial?")
      $("#box1label").html('Patients')
      $("#box1").attr("placeholder", "Enter the condition being studied")
      $("#box2label").html('Intervention')
      $("#box2").attr("placeholder", "Enter the intervention being studied")
      $("#box3label").html('Comparison')
      $("#box3").attr("placeholder", "Enter placebo?")
      $("#box4label").html('Outcome')
      $("#box4").attr("placeholder", "Enter the primary outcome being studied (your can add secondaires later)")
    }
    if ($("#type_diagnosis").is(":checked")){
      $("#box0label").html('Enter study design')
      $("#box0").attr("placeholder", "Enter cross sectional study (be careful of case-control)?")
      $("#box1label").html('Patients')
      $("#box1").attr("placeholder", "Enter sndrome or condition being studied")
      $("#box2label").html('Index test')
      $("#box2").attr("placeholder", "Enter the index test (test/symptom/sign) being studied")
      $("#box3label").html('Reference test')
      $("#box3").attr("placeholder", "Enter the reference ('gold standard') test")
      $("#box4label").html('Flow and timing')
      $("#box4").attr("placeholder", "Enter something like 'index preceded reference test by x to x days'")
    }
  });
  }

