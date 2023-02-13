let menu = document.querySelector('#side-menu');
let root = document.querySelector(':root');
let sideBar = document.querySelector('.side-bar');
let box = document.querySelector('.gallery .box');
let sideBarbox = document.querySelectorAll('.side-bar .box');
let sideBarbox22 = document.querySelector('.side-bar #signinfirst_box22');
let storam_container = document.querySelector('.gallery .storam-container');
let settings = document.querySelector('#settings');
let signinout = document.querySelector('#auth-button');
let bottombtn = document.querySelector('#bottombtn');
window.onload = handleClientLoad;
const element = document.getElementById("id01");
const check = document.getElementById("check");

var gdapifiles;
const CLIENT_ID = '834163430589-vde6a02tetqs1sde9i1pv6ehdq0bu101.apps.googleusercontent.com'
const CLIENT_SECRET = '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';
const API_KEY = 'AIzaSyArqfsy-sKUv9XNrT6akLUvpm_U6-pVpMo';
const SCOPES = 'https://www.googleapis.com/auth/drive';
const DRIVE_ID = '1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D';
var signinButton = document.getElementsByClassName('signin')[0];
var signoutButton = document.getElementsByClassName('signout')[0];
let tokenClient;
let gapiInited = false;
let gisInited = false;

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient(){
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        driveId: DRIVE_ID,
        plugin_name: "Stotram Test APP"
    }).then(function(){
        loadClient().then(execute);
    }, function(error){
        console.error(error);
    })
}

function loadClient() {
    gapi.client.setApiKey("AIzaSyArqfsy-sKUv9XNrT6akLUvpm_U6-pVpMo");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

var expandContainer = document.querySelector('.expand-container');
var expandContainerUl = document.querySelector('.expand-container ul');
var listContainer = document.querySelector('.storam-container ul');

function clearList() {
    listContainer.innerHTML = ' ';
}

function execute() {
    return gapi.client.drive.files.list({
        includeItemsFromAllDrives: true,
        includeTeamDriveItems: false,
        supportsAllDrives: true,
        supportsTeamDrives: false,
        'q': "mimeType='application/pdf' and '1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D' in parents",
        fields: 'files(id, name, webViewLink)'
    })
    .then(function(response) {
        result = response;
        displayFiles(result); 
        const gallery = document.getElementsByClassName('gallery');
        document.getElementById("loader").style.display = "none";
        document.getElementById('side-menu').style.display = "block";
        showsideBar();
        for (let i = 0; i < gallery.length; i++) {
            gallery[i].style.display = "block";
        }
        console.log("Response", response);
    },
    function(err) { console.error("Execute error", err); });
}

function displayFiles(response, clear=true) {
    // Handle the results here (response.result has the parsed body).
    gdapifiles = response.result.files;
    if(gdapifiles && gdapifiles.length > 0){
        if(clear)
            listContainer.innerHTML = '';
        for(var i=0; i < gdapifiles.length; i++){
            listContainer.innerHTML += `
            
            <li data-id="${gdapifiles[i].id}" data-name="${gdapifiles[i].id}">
            <span>
                <a href="${gdapifiles[i].webViewLink}">"${gdapifiles[i].name.split(".pdf")[0]}"</a>
            </span>
            </li>
            
            `;
        } 
    } else {
        listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
    }
}

const map1 = new Map([
    ['Guru', '1A8zAr9WoXFX-Mt5NeqdusXZHUCDtwP5E'],
    ['Shiva', '1u2v706mDX5NHMyswikomMxUOQnk_YDzp'],
    ['Bhagavad Geeta', '1zxN8U4BkDdcWkG65FS5IvIuzJ_TsEGcp']
]);

let debounce = true;
let previousSearchValue = "";

function searchfiles() {
    count=0;
    document.querySelector('#search-box').oninput = () => {
        var searchvalue = document.querySelector('#search-box').value.toString();
        console.log("searchvalue=%s", searchvalue);
    
        document.getElementById("loader").style.display = "block";

        searchInFolder(searchvalue);
        
        element.innerHTML = `Search: ${searchvalue}`;
    }
}

function searchInFolder(searchvalue) {
    var promises = []
    for (let [folderName, folderId] of map1.entries()) {
        promises.push(gapi.client.drive.files.list({
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: `mimeType='application/pdf' and name contains "${searchvalue}" and "${folderId}" in parents`, 
            fields: 'files(id, name, webViewLink)'
        }))
    }
    Promise.all(promises.map(p => p.then(r => r))).then(function(responses) {
        if(searchvalue.length == 0 || searchvalue == "") {
            clearList();
            listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
            element.innerHTML = `Search Stotram: ${searchvalue}`;
            document.getElementById("loader").style.display = "none";
        } else {
            var combinedResults = responses.reduce((allFiles, currentFiles) => allFiles.concat(currentFiles.result.files), []);
            displayFiles({ result: { files: combinedResults } });
            langBtn.forEach(remove => remove.classList.remove('active'));
            categoryBtn.forEach(remove => remove.classList.remove('active'));
            document.getElementById("loader").style.display = "none";
        }
    });
}

function showsideBar() {
    menu.classList.toggle('fa-arrow-right');
    menu.classList.toggle('fa-house');
    sideBar.classList.toggle('active');
    box.classList.toggle('active');
    storam_container.classList.toggle('active');
}

menu.onclick = () => {
    showsideBar()
};

settings.onclick = () => {
    settings.classList.add("loading");
    setTimeout(() => {
        settings.classList.remove("loading");
        sideBarbox.forEach(toggle => toggle.classList.toggle('active'));
    }, 500);
};

let categoryBtn = document.querySelectorAll('.category .btn');
let langBtn = document.querySelectorAll('.lang .btn');
let darkBtn = document.querySelectorAll('.dark_mode .btn');

var dataLang;
var dataCata;


categoryBtn.forEach(btn =>{
    btn.onclick = () => {
        categoryBtn.forEach(remove => remove.classList.remove('active'));
        btn.classList.add('active');
        dataCata = btn.getAttribute('data-category');
        var dataCataID = map1.get(dataCata);
        console.log("Cata Button Click - dataLang dataCata ", dataLang, dataCata);
        if(dataLang == null) {
            console.log("datalang is null");
            if(dataCataID != dataCata) {
                element.innerHTML = `Search: ${dataCata}`;
                listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
            }
            return gapi.client.drive.files.list({
                includeItemsFromAllDrives: true, 
                supportsAllDrives: true,
                q: `mimeType='application/pdf' and "${dataCataID}" in parents`,
                fields: 'files(id, name, webViewLink)'
            }).then(function(response){
                console.log("DataCata=%s DataCataID=%s", dataCata, dataCataID);
                displayFiles(response);
                element.innerHTML = `Search: ${dataCata}`;
                console.log("Search Response", response);
            }),
            function(err) {console.error("Execute error", err); clearList();};
        }
        else {
            if(dataCataID != dataCata) {
                element.innerHTML = `Search: ${dataLang} and ${dataCata}`;
                listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
            }
            return gapi.client.drive.files.list({
                includeItemsFromAllDrives: true, 
                supportsAllDrives: true,
                q: `mimeType='application/pdf' and name contains "${dataLang}" and "${dataCataID}" in parents`,
                fields: 'files(id, name, webViewLink)'
            }).then(function(response){
                displayFiles(response);
                element.innerHTML = `Search: ${dataLang} and ${dataCata}`;
                console.log("Search Response", response);
            }),
            function(err) {console.error("Execute error", err); clearList();};
        }
        
        
       
    }
});



langBtn.forEach(btn =>{
    btn.onclick = () => {
        langBtn.forEach(remove => remove.classList.remove('active'));
        clearList();
        dataLang = btn.getAttribute('data-lang');
        btn.classList.add('active');
        var dataCataID = map1.get(dataCata);
        console.log("Lang Button Click - dataLang=%s", dataLang);
        var fileList;
        if(dataCata == null) {
            console.log("dataCata is null");
            map1.forEach(function(value, key) {
                if(dataCataID != dataCata) {
                    element.innerHTML = `Search: ${dataLang} and ${dataCata}`;
                    listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
                }
                return gapi.client.drive.files.list({
                    includeItemsFromAllDrives: true, 
                    supportsAllDrives: true,
                    includeTeamDriveItems: true,
                    q: `mimeType='application/pdf' and name contains "${dataLang}" and "${value}" in parents`,
                    fields: 'files(id, name, webViewLink)',
                    spaces: 'drive'
                }).then(function(response){
                    displayFiles(response, false);
                    element.innerHTML = `Search: ${dataLang}`;  
                    console.log("Search Response", response);
                }),
                function(err) {console.error("Execute error", err); clearList();};
            });
            
        }
        else {
            clearList();
            if(dataCataID != dataCata) {
                element.innerHTML = `Search: ${dataLang} and ${dataCata}`;
                listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
            }
            return gapi.client.drive.files.list({
                includeItemsFromAllDrives: true, 
                supportsAllDrives: true,
                q: `mimeType='application/pdf' and name contains "${dataLang}" and "${dataCataID}" in parents`,
                fields: 'files(id, name, webViewLink)'
            }).then(function(response){
                console.log("DataLang=%s DataCataID=%s", dataLang, dataCataID);
                clearList();
                displayFiles(response);
                element.innerHTML = `Search: ${dataLang} and ${dataCata}`;
                console.log("Search Response", response);
            }),
            function(err) {console.error("Execute error", err); clearList();};
        }
    }
});

let reset = document.querySelector('.reset');

reset.onclick = () => {
    var startY = sideBar.scrollTop;
    var endY = 0;
    var distance = Math.abs(endY - startY);
    var speed = 1;
    var step = distance / speed;
    var intervalId = setInterval(function() {
      startY = startY + (endY > startY ? step : -step);
      if (startY === endY) {
        clearInterval(intervalId);
      }
      sideBar.scrollTop = startY;
    }, 15);
    langBtn.forEach(remove => remove.classList.remove('active'));
    categoryBtn.forEach(remove => remove.classList.remove('active'));
    element.innerHTML = `Search Stotram: `;
    dataCata = null;
    dataLang = null;
    listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
}

darkBtn.forEach(btn => {
    btn.onclick = () => {
        darkBtn.forEach(remove => remove.classList.remove('active'));
        btn.classList.add('active');
    }
});

function bottomFunction() {
    sideBar.scrollTop = 100000;
}

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
})

document.onkeydown = function (e) {
    if(event.keyCode == 123){
        return false;
    }

    if(e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)){
        return false;
    }

    if(e.ctrlKey && e.keyCode == "U".charCodeAt(0)){
        return false;
    }
};

function setCookie(name, value, expires, path, domain, secure) {
    var cookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
    document.cookie = cookie;
}
  
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
    return null;
}

window.addEventListener("DOMContentLoaded", function(){
    var darkMode = getCookie("darkMode");
    if (darkMode === "true") {
        root.style.setProperty('--primary-color', 'black');
        root.style.setProperty('--secondary-color', 'white');
        check.checked = true;
    }
    document.getElementById('side-menu').style.display = "none";
    const gallery = document.getElementsByClassName('gallery');
    for (let i = 0; i < gallery.length; i++) {
        gallery[i].style.display = "none";
    }
});

if (getCookie("darkMode") === null) {
    setCookie("darkMode", "false", 9999);
}

function changeStatus() {
    var darkMode = getCookie("darkMode");
    if (darkMode === "true") {
        setCookie("darkMode", "false", 9999);
        window.location.reload(true);

        root.style.setProperty('--primary-color', 'white');
        root.style.setProperty('--secondary-color', 'black');
    } else {
        setCookie("darkMode", "true", 9999);
        window.location.reload(true);

        root.style.setProperty('--primary-color', 'black');
        root.style.setProperty('--secondary-color', 'white');
    }
}
