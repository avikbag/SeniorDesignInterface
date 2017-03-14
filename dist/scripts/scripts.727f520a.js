"use strict";angular.module("interfaceApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","chart.js","ngMaterial","ngFileUpload"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/"})}]),angular.module("interfaceApp").controller("MainCtrl",["$scope","$http","$mdSidenav","stats","Upload",function(a,b,c,d,e){function f(a){return function(){c(a).toggle()}}a.job_labels=[],a.class_type=[],a.values=[],a.execTimes=[],a.area=[],a.power=[[],[]],a.powerSeries=["Dynamic read energy (nJ)","Dynamic write energy (nJ)"];var g=0,h="mockdata/job_output";a.reader=function(){console.log(a.file),i(a.file)};var i=function(b){var c="/sign-s3?file-name="+b.name+"&file-type="+b.type;d.fetch(c).then(function(b){a.signedRequest=b.data.signedRequest,console.log(b)}),j(b,a.signedRequest)},j=function(a,b){const c=new XMLHttpRequest;c.open("PUT",b),c.onreadystatechange=function(){4===c.readyState&&(200===c.status||alert("Could not get signed URL."))},c.send(a)};a.info=[];for(var k=0;6>k;k++)a.job_labels.push("job"+k),d.fetch(h+k+".json").then(function(b){var c=b.data.job_details.simulation_results.gem5.op_class;a.execTimes.push(b.data.job_details.simulation_results.gem5["execution time (s)"]),a.area.push(b.data.job_details.simulation_results.mcpat["Area (mm2)"]),a.power[0].push(b.data.job_details.simulation_results.mcpat["Dynamic read energy (nJ)"]),a.power[1].push(b.data.job_details.simulation_results.mcpat["Dynamic write energy (nJ)"]);var d=Object.keys(c);if(delete b.data.job_details.simulation_results,a.info.push(b),0==a.class_type.length){a.class_type.push.apply(a.class_type,d);for(var e=0;e<a.class_type.length;e++)a.values.push(Array(6).fill(-1))}for(var e=0;e<d.length;e++)a.values[e][g]=c[d[e]];g+=1});a.job_labelsRV=[],a.class_typeRV=[],a.valuesRV=[];for(var l=0,h="mockdata/job_output",k=0;6>k;k++)a.class_typeRV.push("job"+k),d.fetch(h+k+".json").then(function(b){var c=b.data.job_details.simulation_results.gem5.op_class,d=Object.keys(c);if(0==a.job_labelsRV.length){a.job_labelsRV.push.apply(a.job_labelsRV,d),a.job_labelsRV.pop();for(var e=0;6>e;e++)a.valuesRV.push(Array(6).fill(-1))}for(var e=0;e<d.length-1;e++)a.valuesRV[l][e]=c[d[e]];l+=1});a.options={title:{display:!0,text:"Op Code Distribution for each job output"},legend:{display:!0,position:"right",labels:{fontColor:"rgb(0, 0, 0)"}},scales:{yAxes:[{scaleLabel:{display:!0,labelString:"Instruction count"}}]}},a.optionsPow={title:{display:!0,text:"McPat power analysis from job outputs"},legend:{display:!0,position:"right",labels:{fontColor:"rgb(0, 0, 0)"}},scales:{yAxes:[{scaleLabel:{display:!0,labelString:"Power output in nJ"}}]}},a.optionsrv={title:{display:!0,text:"Op Code Distribution for each job output"},legend:{display:!0,position:"right",labels:{fontColor:"rgb(0, 0, 0)"}}},a.options1={title:{display:!0,text:"Op Code Distribution for each job output {0}"},legend:{display:!0,position:"right",labels:{fontColor:"rgb(0, 0, 0)"}}},a.options2={title:{display:!0,text:"Op Code Distribution for each job output"},legend:{display:!0,position:"right",labels:{fontColor:"rgb(0, 0, 0)"}}},a.options3={title:{display:!0,text:"Execution Time for each job output"},legend:{display:!1,position:"right",labels:{fontColor:"rgb(0, 0, 0)"}},scales:{yAxes:[{scaleLabel:{display:!0,labelString:"Execution time in seconds"}}],xAxes:[{scaleLabel:{display:!0,labelString:"Job execution iteration"}}]}},a.optionsrv={title:{display:!0,text:"Area mm2"},legend:{display:!0,position:"right",labels:{fontColor:"rgb(0, 0, 0)"}}},a.graphic=0,a.job0=0,a.job1=1,a.toggleLeft=f("left"),a.toggleRight=f("right")}]),angular.module("interfaceApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("interfaceApp").factory("stats",["$http",function(a){return{fetch:function(b){return a.get(b)},keep:function(b){return a.post(b)}}}]),angular.module("interfaceApp").directive("treemap",function(){var a;return a=angular.element('<div class="angular-treemap"/>'),{restrict:"A",scope:{treemap:"=",name:"&",detail:"&",colorlow:"@",colormid:"@",colorhigh:"@"},compile:function(b){return function(b){return b.append(a)}}(this),controller:function(b){return["$scope",function(b){return b.find_color_range=function(a){var c,d,e,f,g;if(a.color<b.state.min_color&&(b.state.min_color=a.color),a.color>b.state.max_color&&(b.state.max_color=a.color),a.children){for(f=a.children,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(b.find_color_range(c));return g}},b.resize=function(){return b.state.width=$(b.state.parent).width(),b.state.height=.6*b.state.width,b.state.host.attr({width:b.state.width,height:b.state.height+20}),b.treemap.dx=b.state.width,b.treemap.dy=b.state.height,b.state.x=d3.scale.linear().domain([0,b.state.width]).range([0,b.state.width]),b.state.y=d3.scale.linear().domain([0,b.state.height]).range([0,b.state.height]),b.layout(b.treemap),b.state.svg.selectAll("rect.parent").call(function(a){return function(a){return b.rect(a)}}(this)),b.state.svg.selectAll("text.js-label").call(function(a){return function(a){return b.text(a)}}(this)),b.state.svg.selectAll("rect.child").call(function(a){return function(a){return b.rect(a)}}(this))},b.accumulate=function(a){return a.children?a.value=a.children.reduce(function(a){return function(a,c){return a+b.accumulate(c)}}(this),0):a.value},b.layout=function(a){var c,d,e,f,g;if(a.children){for(b.state.treemap.nodes({children:a.children}),f=a.children,g=[],d=0,e=f.length;e>d;d++)c=f[d],c.x=a.x+c.x*a.dx,c.y=a.y+c.y*a.dy,c.dx*=a.dx,c.dy*=a.dy,c.parent=a,g.push(b.layout(c));return g}},b.text=function(a){return a.attr({x:function(a){return b.state.x(a.x)+6},y:function(a){return b.state.y(a.y)+6}})},b.rect=function(a){return a.attr({fill:function(a){return b.state.color(a.color)},x:function(a){return b.state.x(a.x)+1},y:function(a){return b.state.y(a.y)+1},width:function(a){var c;return c=b.state.x(a.x+a.dx)-b.state.x(a.x)-2,c>=0?c:0},height:function(a){var c;return c=b.state.y(a.y+a.dy)-b.state.y(a.y)-2,c>=0?c:0}})},b.transition=function(a,c){var d,e,f;if(!b.state.transitioning&&a)return b.state.transitioning=!0,d=b.display(a),e=c.transition().duration(750),f=d.transition().duration(750),b.state.x.domain([a.x,a.x+a.dx]),b.state.y.domain([a.y,a.y+a.dy]),b.state.svg.style("shape-rendering",null),b.state.svg.selectAll(".depth").sort(function(a,b){return a.depth-b.depth}),d.selectAll("text").style("fill-opacity",0),e.selectAll("text").call(function(a){return b.text(a).style("fill-opacity",0)}),f.selectAll("text").call(function(a){return b.text(a).style("fill-opacity",1)}),e.selectAll("rect").call(function(a){return b.rect(a)}),f.selectAll("rect").call(function(a){return b.rect(a)}),e.remove().each("end",function(){return b.state.svg.style("shape-rendering","crispEdges"),b.state.transitioning=!1})},b.display=function(a){var c,d;return d=b.state.svg.insert("g",".grandparent").datum(a).attr("class","depth"),b.state.grandparent.datum(a.parent).on("click",function(a){return b.transition(a,d)}).select("text").text(b.formatName(a)),c=d.selectAll("g").data(a.children).enter().append("g"),c.filter(function(a){return a.children}).classed("children",!0).on("click",function(a){return b.transition(a,d)}),c.filter(function(a){return!a.children}).classed("children",!0).on("click",function(a){return b.curNode=a,b.$apply("detail({node:curNode})")}),c.selectAll(".child").data(function(a){return a.children||[a]}).enter().append("rect").attr("class","child").call(function(a){return b.rect(a)}),c.append("rect").attr("class","parent").style({"fill-opacity":.1,stroke:"black","stroke-width":"1","stroke-opacity":"0.8"}).call(function(a){return b.rect(a)}).append("title").text(function(a){return b.state.formatNumber(a.value)}),c.append("text").attr("class","js-label").attr("dy",".75em").text(function(a){return b.curName=a.name,b.name?b.$eval("name({name:curName})"):a.name}).call(function(a){return b.text(a)}),c},b.formatName=function(a){return a.parent?b.formatName(a.parent)+"."+a.name:a.name},b.state={margin:{left:0,top:20},parent:a},b.state.width=$(a).width(),b.state.height=.6*b.state.width,b.state.ratio=b.state.height/b.state.width*.5*(1+Math.sqrt(5)),b.$watch("treemap",function(a,c){var d;if(a!==c&&c)return $(b.state.parent).empty(),b.state.min_color=1e4,b.state.max_color=-1e4,b.find_color_range(b.treemap),d=[b.state.min_color,b.state.min_color+(b.state.max_color-b.state.min_color)/2,b.state.max_color],null==b.colorlow&&(b.colorlow="red"),null==b.colormid&&(b.colormid="white"),null==b.colorhigh&&(b.colorhigh="green"),b.state.color=d3.scale.linear().domain(d).range([b.colorlow,b.colormid,b.colorhigh]),b.state.treemap=d3.layout.treemap().children(function(a,b){return b?null:a.children}).sort(function(a,b){return a.value-b.value}).ratio(b.state.ratio).round(!1).sticky(!1),b.state.host=d3.select(b.state.parent[0]).append("svg"),b.state.svg=b.state.host.append("g").attr("transform","translate("+b.state.margin.left+","+b.state.margin.top+")").style("shape-rendering","crispEdges"),b.state.grandparent=b.state.svg.append("g").attr("class","grandparent"),b.state.grandparent.append("rect").attr({y:-b.state.margin.top,width:"100%",height:b.state.margin.top+5}),b.state.grandparent.append("text").attr({x:6,y:6-b.state.margin.top,dy:"0.75em"}),b.treemap.x=b.treemap.y=0,b.treemap.depth=0,b.state.transitioning=void 0,b.state.formatNumber=d3.format(",d"),b.treemap.dx=b.state.width,b.treemap.dy=b.state.height,b.state.x=d3.scale.linear().domain([0,b.state.width]).range([0,b.state.width]),b.state.y=d3.scale.linear().domain([0,b.state.height]).range([0,b.state.height]),b.accumulate(b.treemap),b.layout(b.treemap),b.display(b.treemap),b.resize()})}]}(this)}}),angular.module("interfaceApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/main.html","<script>/*\n      Function to carry out the actual PUT request to S3 using the signed request from the app.\n    */\n    function uploadFile(file, signedRequest, url){\n      const xhr = new XMLHttpRequest();\n      xhr.open('PUT', signedRequest);\n      xhr.onreadystatechange = () => {\n        if(xhr.readyState === 4){\n          if(xhr.status === 200){\n            <!--document.getElementById('preview').src = url;-->\n            <!--document.getElementById('avatar-url').value = url;-->\n          }\n          else{\n            alert('Could not upload file.');\n          }\n        }\n      };\n      xhr.send(file);\n    }\n    /*\n      Function to get the temporary signed request from the app.\n      If request successful, continue to upload the file using this signed\n      request.\n    */\n    var test;\n    function getSignedRequest(file){\n      const xhr = new XMLHttpRequest();\n      xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);\n      xhr.onreadystatechange = () => {\n        if(xhr.readyState === 4){\n          if(xhr.status === 200){\n            const response = JSON.parse(xhr.responseText);\n            test = response.url;\n            console.log(\"variable tester \" + test);\n            uploadFile(file, response.signedRequest, response.url);\n          }\n          else{\n            alert('Could not get signed URL.');\n          }\n        }\n      };\n      xhr.send();\n    }\n    /*\n     Function called when file input updated. If there is a file selected, then\n     start upload procedure by asking for a signed request from the app.\n    */\n    function initUpload(){\n      const files = document.getElementById('file-input').files;\n      const file = files[0];\n      if(file == null){\n        return alert('No file selected.');\n      }\n      getSignedRequest(file);\n    }\n    /*\n     Bind listeners when the page loads.\n    */\n    (() => {\n        document.getElementById('file-input').onchange = initUpload;\n"+'    })();</script> <!--Upload on form submit or button click--> <!--<form ng-app="fileUpload" name="form">--> <!--Single Image with validations--> <!--<md-button class="md-raised md-primary" ngf-select ng-model="file" name="file" ngf-pattern="\'.pdf\'"--> <!--ngf-accept="\'pdf/*\'" >Select</md-button>--> <!--<button type="submit" ng-click="reader()">submit</button>--> <!--</form>--> <div class="container"> <md-sidenav class="md-sidenav-right" md-component-id="right" md-disable-backdrop md-whiteframe="4"> <md-toolbar class="md-accent" style="height: 7vh"> <div layout="row"> <h3 flex style="margin-left:10px"> Job Details </h3> <md-button class="md-raised md-primary md-fab" ng-click="toggleRight()"> <md-tooltip md-direction="left"> Close side nav </md-tooltip> <md-icon md-font-library="material-icons"> close </md-icon> </md-button> </div> </md-toolbar> <md-content> <md-content layout-margin> </md-content> </md-content> <md-subheader class="md-no-sticky"><h4 style="color: #388E3C">Current Active</h4></md-subheader> <md-list-item class="secondary-button-padding md-list-item-text" ng-click="null" layout="row" ng-repeat="detail in info"> <div layout="column"> <h5>{{detail.data.job_details.job_name}} </h5> <p>{{detail.data.job_details.job_timestamp}}</p> </div> <md-button class="md-secondary md-icon-button" ng-click="doSecondaryAction($event)"> <md-icon md-font-library="material-icons"> delete_forever </md-icon> </md-button> </md-list-item> </md-sidenav> <md-content class="md-padding"> <md-tabs class="md-primary" md-dynamic-height md-border-bottom> <md-tab id="tab1"> <md-tab-label>Op Code Distribution</md-tab-label> <md-tab-body> <div flex layout="row" layout-align="end center"> <md-radio-group flex ng-model="graphic" layout="row" style="margin:20px"> <md-radio-button ng-model="graphic" value="0" class="md-primary">Top level overview</md-radio-button> <md-radio-button ng-model="graphic" value="1"> Radar View </md-radio-button> <md-radio-button ng-model="graphic" value="2"> Op Code Comparison </md-radio-button> </md-radio-group> <md-button class="md-raised md-accent" ng-click="toggleRight()"> <md-tooltip md-direction="top"> Job Details </md-tooltip> <md-icon md-font-library="material-icons"> menu </md-icon> </md-button> <md-button class="md-fab md-hue-2 md-mini" ngf-select="reader()" ng-model="file" name="file" ngf-pattern="\'.pdf\'" ngf-accept="\'pdf/*\'"> <md-tooltip md-direction="top"> Job output file upload </md-tooltip> <md-icon md-font-library="material-icons"> file_upload </md-icon> </md-button> </div> <div ng-show="graphic == 0"> <canvas id="bar" class="chart chart-bar" chart-data="values" chart-labels="job_labels" chart-series="class_type" chart-options="options"></canvas></div> <div ng-show="graphic == 1"> <canvas id="radar" class="chart chart-radar" chart-data="valuesRV" chart-labels="job_labelsRV" chart-series="class_typeRV" chart-options="optionsrv"></canvas></div> <div ng-show="graphic == 2"> <div layout="row"> <div flex style="margin-left: 10px; margin-right: 10px"> <md-select placeholder="Choose Job for comparison" ng-model="job0"> <md-option ng-value="$index" ng-repeat="job0 in job_labels">{{job0}}</md-option> </md-select> <canvas id="pie" class="chart chart-pie" chart-data="valuesRV[job0]" chart-labels="job_labelsRV" chart-series="class_type" chart-options="options2"></canvas> </div> <div flex style="margin-left: 10px; margin-right: 10px"> <md-select placeholder="Choose Job for comparison" ng-model="job1"> <md-option ng-value="$index" ng-repeat="job1 in job_labels">{{job1}}</md-option> </md-select> <canvas id="pie" class="chart chart-pie" chart-data="valuesRV[job1]" chart-labels="job_labelsRV" chart-series="class_type" chart-options="options2"> </canvas> </div> </div> </div> </md-tab-body> </md-tab> <md-tab id="tab2"> <md-tab-label>Execution Times</md-tab-label> <md-tab-body> <div flex layout="row" layout-align="end center"> <md-button class="md-raised md-accent" ng-click="toggleRight()"> <md-tooltip md-direction="top"> Job Details </md-tooltip> <md-icon md-font-library="material-icons"> menu </md-icon></md-button> </div> <canvas id="bar" class="chart chart-bar" chart-data="execTimes" chart-labels="job_labels" chart-options="options3"> </canvas> </md-tab-body> </md-tab> <md-tab id="tab3"> <md-tab-label>Area</md-tab-label> <md-tab-body> <div flex layout="row" layout-align="end center"> <md-button class="md-raised md-accent" ng-click="toggleRight()"> <md-tooltip md-direction="top"> Job Details </md-tooltip> <md-icon md-font-library="material-icons"> menu </md-icon></md-button> </div> <canvas id="polar-area" class="chart chart-polar-area" chart-data="area" chart-labels="job_labels" chart-options="optionsrv"> </canvas> </md-tab-body> </md-tab> <md-tab id="tab4"> <md-tab-label>Power</md-tab-label> <md-tab-body> <div flex layout="row" layout-align="end"> <md-button class="md-raised md-accent" ng-click="toggleRight()"> <md-tooltip md-direction="top"> Job Details </md-tooltip> <md-icon md-font-library="material-icons"> menu </md-icon></md-button> </div> <canvas id="bar" class="chart chart-bar" chart-data="power" chart-labels="job_labels" chart-series="powerSeries" chart-options="optionsPow"> </canvas> </md-tab-body> </md-tab> </md-tabs> </md-content> </div>')}]);