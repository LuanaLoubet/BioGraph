function Cy2Neo(config, graphId, sourceId, execId, urlSource) {
    function createEditor() {
		return CodeMirror.fromTextArea(document.getElementById(sourceId), {
		  parserfile: ["codemirror-cypher.js"],
		  path: "scripts",
		  stylesheet: "styles/codemirror-neo.css",
		  autoMatchParens: true,
		  lineNumbers: true,
		  enterMode: "keep",
		  value: "some value"
		});
    } 
	function initAlchemyConfig() {
		config.divSelector="#"+graphId;
		config.dataSource={nodes:[],edges:[]};
		config.forceLocked = false;
		config.alpha = 0.8;
		config.edgeTypes = "caption";
		alchemy.begin(config)
		return config;
	}
	config = initAlchemyConfig();
	var neo = new Neo(urlSource);
    //var editor = createEditor();
	$("#"+execId).click(function(evt) {
		try {

			evt.preventDefault();
			var e =  document.getElementById("SelectLabels");
           var value =  e.options[e.selectedIndex].value;
			var query =   "MATCH (n:"+value+") RETURN n LIMIT 50";
			console.log("Executing Query",query);
			neo.executeQuery(query,{},function(err,res) {
				res = res || {}
				var graph=res.graph;
				var labels = res.labels;
				config.nodeTypes = {type: labels};
				if (err) {
					alchemy.conf.warningMessage=JSON.stringify(err);
					alchemy.startGraph(null)
				} else {
					alchemy.startGraph(graph);
				}
			});
		} catch(e) {
			console.log(e);
		}
		return false;
	});





}


function getQueryElement(consulta,rGraph,rLabels) {
    try {
    	var neo = new Neo("http://pandora.lis.ic.unicamp.br:7474/db/data/");
        var query = consulta;
        console.log("Executing Query",query);
        neo.executeQuery(query,{},function(err,res) {
            res = res || {}
            var graph=res.graph;
            rGraph =  graph;
            var labels = res.labels;
            rLabels = res.table;


            var myDiv = document.getElementById("menu");
            var selectList = document.createElement("select");
            selectList.id = "SelectLabels";
            myDiv.appendChild(selectList);
            var i;
            var list= Array();
            for(i=0;i<rLabels.length;i++)
			{
                //var option = document.createElement("option");
                if(rLabels[i]["labelS(n)"].length==2) {
                	if($.inArray(rLabels[i]["labelS(n)"][1],list)<0)
					{
							list.push(rLabels[i]["labelS(n)"][1]);
					}
					if($.inArray(rLabels[i]["labelS(n)"][0],list)<0)
                    {
                        list.push(rLabels[i]["labelS(n)"][0]);
                    }
                		//option.value = rLabels[i]["labelS(n)"][1];
                    //option.text = rLabels[i]["labelS(n)"][1];
                    //selectList.appendChild(option);
                }
                if(rLabels[i]["labelS(n)"].length==1) {
                    if($.inArray(rLabels[i]["labelS(n)"][0],list)<0)
                    {
                        list.push(rLabels[i]["labelS(n)"][0]);
                    }
                }
			}
			for(i=0;i<list.length;i++)
			{
                var option = document.createElement("option");
                option.value = list[i];
                option.text = list[i];
                selectList.appendChild(option);
            }


            config.nodeTypes = {type: labels};
            if (err) {
                alchemy.conf.warningMessage=JSON.stringify(err);
                alchemy.startGraph(null)
            } else {
                alchemy.startGraph(graph);
            }
        });
    } catch(e) {
        console.log(e);
    }
    return false;
}
