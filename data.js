
function getGroups() {
    
    let dropdown = document.getElementById('groups');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Group';

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;
    
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://augur.osshealth.io:5000/api/unstable/repo-groups", true);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            
            let option;
            for (let i = 0; i < data.length; i++) {
              option = document.createElement('option');
              option.text = data[i].rg_name;
              option.value = data[i].repo_group_id;
              dropdown.add(option);
            }
            
        } 
    };


    xhttp.send();
}

function getRepo() {
    var e = document.getElementById("groups");
    var group = e.options[e.selectedIndex].value;
    console.log(group);
    
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


function getData() {
    var e = document.getElementById("groups");
    var group = e.options[e.selectedIndex].value;
    console.log(group);
    
    var e = document.getElementById("repos");
    var repo = e.options[e.selectedIndex].value;
    console.log(repo);
    
    getCommitData(group, repo);
    getPRData(group, repo);
    getLineData(group, repo);
    
}

function getCommitData(group, repo) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://augur.osshealth.io:5000/api/unstable/repo-groups/" + group + "/repos/" + repo + "/top-committers?threshold=.95", true);
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            
            let commits = []
            for (let i = 0; i < data.length; i++) {
                commits.push(data[i].commits);
            }
            console.log(commits);
        } 
    };


    xhttp.send();
}

function getPRData(group) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://augur.osshealth.io:5000/api/unstable/repo-groups/" + group + "/pull-request-acceptance-rate", true);
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            
            let rates = []
            for (let i = 0; i < data.length; i++) {
                rates.push(data[i].rate);
            }
            console.log(rates);
        } 
    };

    xhttp.send();
   
}

function getLineData(group, repo) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://augur.osshealth.io:5000/api/unstable/repo-groups/" + group + "/repos/" + repo + "/code-changes-lines?period=month", true);
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data);
            
            let lines = []
            for (let i = 0; i < data.length; i++) {
                lines.push(data[i].added);
                lines.push(-1 * data[i].removed);
            }
            console.log(lines);
        } 
    };

    xhttp.send();
   
}

