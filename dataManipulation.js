google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawGroupChart);
        
function drawGroupChart() {
            //http://augur.osshealth.io:5000/api/unstable/repo-groups/24/pull-request-acceptance-rate?group_by=month
    var group = document.getElementById("repoGroup").getAttribute("group");
    getPRData(group);
}

function getPRData(group) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://augur.osshealth.io:5000/api/unstable/repo-groups/" + group + "/pull-request-acceptance-rate", true);
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            
            let rates = [];
            rates.push(['Month', 'Rate']);
            for (let i = 0; i < data.length; i++) {
                rates.push([data[i].date.substring(0, 10), data[i].rate]);
            }
            console.log(rates);
            var prDataTable = google.visualization.arrayToDataTable(rates);
            var options = {'title': 'Pull Acceptance Rate', width: 1200, height: 500};
            var barChart = new google.visualization.ColumnChart(document.getElementById('barChart'));
            barChart.draw(prDataTable, options);
        } 
    };

    xhttp.send();
   
}

function getRepo() {
    var group = document.getElementById("repoGroup").getAttribute("group");    
     let dropdown = document.getElementById('repos');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Repo';

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;
    
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://augur.osshealth.io:5000/api/unstable/repo-groups/" + group + "/repos", true);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            
            let option;
            for (let i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].repo_name;
                option.value = data[i].repo_id;
                dropdown.add(option);
            }
            
        } 
    };


    xhttp.send();
}

function drawRepoChart() {
        
    var group = document.getElementById("repoGroup").getAttribute("group"); var e = document.getElementById("repos");
    var repo = e.options[e.selectedIndex].value;
    console.log(repo);
    
    getCommitData(group, repo);
    getLineData(group, repo);
    
}

function getCommitData(group, repo) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://augur.osshealth.io:5000/api/unstable/repo-groups/" + group + "/repos/" + repo + "/top-committers?threshold=.8", true);
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            
            let commits = []
            commits.push(['Email', 'Commits'])
            for (let i = 0; i < data.length; i++) {
                commits.push([data[i].email, data[i].commits]);
            }
            console.log(commits);
            commitData = google.visualization.arrayToDataTable(commits);
            var options = {'title':'Top Committers in hadoop-site', width:1200, height:650};
            var pieChart = new google.visualization.PieChart(
                document.getElementById('pieChart'));
                pieChart.draw(commitData, options);
           
        } 
    };


    xhttp.send();
}

function getLineData(group, repo) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://augur.osshealth.io:5000/api/unstable/repo-groups/" + group + "/repos/" + repo + "/code-changes?period=month", true);
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            
            let lines = []
            lines.push(['Month', 'Commits'])
            for (let i = 0; i < data.length; i++) {
                lines.push([data[i].date.substring(0, 10), data[i].commit_count]);
            }
            console.log(lines);
            lineData = google.visualization.arrayToDataTable(lines);
            var options = {'title':'Code Changes', width:1200, height:600};
            var lineChart = new google.visualization.LineChart(document.getElementById('lineChart'));
                lineChart.draw(lineData, options);
        } 
    };

    xhttp.send();
   
}

