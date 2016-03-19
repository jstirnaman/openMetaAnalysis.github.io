var citation_bias = '&lt;?xml version=\"1.0\" encoding=\"UTF-8\"?&gt;<br>&lt;included&gt;<br>';

$(document).ready(function(){

    $("#submitbutton").on("click", function(){
        //disable the button to prevent multiple clicks
		$("#submitbutton").prop( "disabled", true );
		$("#status").html("<i>searching...</i>")
		
		//Get list of IDs based on search terms
		$.getJSON('http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json',{ 
			term : $("#input").val(),
			format: "json"
			})
		.done(function(data){
			var ids = data.esearchresult.idlist;
			var publications = [];
			iterateJSON(ids, publications);
			$("#submitbutton").prop( "disabled", false );
		});	
	$("#hints").show()
	});

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
	
function iterateJSON(idlist, publications) {
	var id = idlist.pop();
	// test with http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=11850928,11482001&format=json
	$.getJSON('http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='+id+'&retmode=json', 
	function(summary){

        var citation = "<span style='color:red;font-weight:bold'>&lt;!-- start of a new study --&gt;<br>";

        //for(author in summary.result[id].authors){
        //    citation+=summary.result[id].authors[author].name+', ';
        //}
        //citation+=' \"'+summary.result[id].title+'\" <i>'+summary.result[id].fulljournalname+'</i> '+summary.result[id].volume+'.'+summary.result[id].issue+' ('+summary.result[id].pubdate+'): '+summary.result[id].pages+'.';

		var studyname = summary.result[id].authors[0].name;
		studyname = studyname.substring(0, studyname.indexOf(" "));

		var pubyear = summary.result[id].pubdate
		if (pubyear.indexOf(" ") > 1){
			pubyear = pubyear.substring(0, pubyear.indexOf(" "));
			}

        	citation+= "&lt;study&gt;<br>&lt;citation  year=\"" + pubyear + "\" pmid=\"" + summary.result[id].uid + '\" trialregistration=\"\" journal_abbrev=\"' + summary.result[id].source + '\"&gt;' + studyname + "&lt;/citation&gt;</span><br>"
		if ($("#type_intervention").is(":checked")){
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
		if ($("#type_diagnosis").is(":checked")){
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

		citation+= "&lt;/study&gt;<br>"

        //publications.push(citation);
        publications += citation;

        if(idlist.length!=0){
		iterateJSON(idlist, publications);
        }else{
		//editor.setValue(publications)
		$("#editor").html(citation_bias + publications + '&lt;!-- Leave this bottom line --\><br>&lt;/included&gt;')
        }
    });
}
	
	
})

