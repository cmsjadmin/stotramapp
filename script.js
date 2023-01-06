let menu = document.querySelector('#side-menu');
let sideBar = document.querySelector('.side-bar');
let box = document.querySelector('.gallery .box');
let sideBarbox = document.querySelectorAll('.side-bar .box');
let sideBarbox22 = document.querySelector('.side-bar #signinfirst_box22');
let storam_container = document.querySelector('.gallery .storam-container');
let signinout = document.querySelector('#auth-button');
let bottombtn = document.querySelector('#bottombtn');
window.onload = handleClientLoad;
const element = document.getElementById("id01");

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
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        signinButton.onclick = handleSignin;
        signoutButton.onclick = handleSignout;
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

function updateSigninStatus(isSignedIn){
    if(isSignedIn) {
        signinButton.style.display = 'none';
        signoutButton.style.display = 'block';
        loadClient().then(execute);
        // button.classList.remove('active');
        sideBarbox22.classList.remove('active');
        sideBarbox.forEach(add => add.classList.add('active'));
    } else {
        signinButton.style.display = 'block';
        signoutButton.style.display = 'none';
        loadClient().then(execute);
        // button.classList.add('active');
        // sideBarbox22.classList.add('active');
        // sideBarbox.forEach(remove => remove.classList.remove('active'));
    }
}

function handleSignin() {
    gapi.auth2.getAuthInstance().signIn();
    langBtn.forEach(remove => remove.classList.remove('active'));
    categoryBtn.forEach(remove => remove.classList.remove('active'));
}

function handleSignout() {
    gapi.auth2.getAuthInstance().signOut();
    langBtn.forEach(remove => remove.classList.remove('active'));
    categoryBtn.forEach(remove => remove.classList.remove('active'));
}

var expandContainer = document.querySelector('.expand-container');
var expandContainerUl = document.querySelector('.expand-container ul');
var listContainer = document.querySelector('.storam-container ul');

function displayFiles(response) {
    // Handle the results here (response.result has the parsed body).
    gdapifiles = response.result.files;
    if(gdapifiles && gdapifiles.length > 0){
        listContainer.innerHTML = '';
        for(var i=0; i < gdapifiles.length; i++){
            listContainer.innerHTML += `
            
            <li data-id="${gdapifiles[i].id}" data-name="${gdapifiles[i].id}">
            <span>
                <a href="${gdapifiles[i].webViewLink}">"${gdapifiles[i].name}"</a>
            </span>
            </li>
            
            `;
        } 
    } else {
        listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
    }
}
function execute() {
    return gapi.client.drive.files.list({
        includeItemsFromAllDrives: true,
        includeTeamDriveItems: false,
        supportsAllDrives: true,
        supportsTeamDrives: false,
        'q': "'1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D' in parents",
        fields: 'files(id, name, webViewLink, description)'
    })
        .then(function(response) {
                result = response;
                displayFiles(result); 

                console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
}

function searchfiles() {
    document.querySelector('#search-box').oninput = () => {
        var value = document.querySelector('#search-box').value.toString();
    return gapi.client.drive.files.list({
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        q: `name contains "${value}" and "1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D" in parents`, 
        fields: 'files(id, name, webViewLink, description)'
    }).then(function(response) {
        if(value == ''){
            element.innerHTML = `Search Stotram: `;
        } else {
            displayFiles(response);
            element.innerHTML = `Search: ${value}`;
            langBtn.forEach(remove => remove.classList.remove('active'));
            categoryBtn.forEach(remove => remove.classList.remove('active'));
            console.log("Search Response", response);
        }
    }),
    function(err) { console.error("Execute error", err);};
}
}

menu.classList.toggle('fa-times');
sideBar.classList.toggle('active');
box.classList.toggle('active');
storam_container.classList.toggle('active');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    sideBar.classList.toggle('active');
    box.classList.toggle('active');
    storam_container.classList.toggle('active');
};

let categoryBtn = document.querySelectorAll('.category .btn');
let langBtn = document.querySelectorAll('.lang .btn');

var dataLang;
var dataCata;

categoryBtn.forEach(btn =>{
    btn.onclick = () => {
        categoryBtn.forEach(remove => remove.classList.remove('active'));
        btn.classList.add('active');
        dataCata = btn.getAttribute('data-category');
        console.log("Cata Button Click - dataLang dataCata ", dataLang, dataCata);
        if(dataLang == null) {
            console.log("datalang is null");
            return gapi.client.drive.files.list({
                includeItemsFromAllDrives: true, 
                supportsAllDrives: true,
                q: `name contains "${dataCata}" and "1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D" in parents`,
                fields: 'files(id, name, webViewLink, description)'
            }).then(function(response){
                displayFiles(response);
                element.innerHTML = `Search: ${dataCata}`;
                console.log("Search Response", response);
            }),
            function(err) {console.error("Execute error", err);};
        }
        else {
            return gapi.client.drive.files.list({
                includeItemsFromAllDrives: true, 
                supportsAllDrives: true,
                q: `name contains "${dataCata}" and name contains "${dataLang}" and "1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D" in parents`,
                fields: 'files(id, name, webViewLink, description)'
            }).then(function(response){
                displayFiles(response);
                element.innerHTML = `Search: ${dataLang} and ${dataCata}`;
                console.log("Search Response", response);
            }),
            function(err) {console.error("Execute error", err);};
        }
        
        
       
    }
});



langBtn.forEach(btn =>{
    btn.onclick = () => {
        langBtn.forEach(remove => remove.classList.remove('active'));
        dataLang = btn.getAttribute('data-lang');
        btn.classList.add('active');
        console.log("Lang Button Click - dataLang dataCata ", dataLang, dataCata);
        if(dataCata == null) {
            console.log("datalang is null");
            return gapi.client.drive.files.list({
                includeItemsFromAllDrives: true, 
                supportsAllDrives: true,
                q: `name contains "${dataLang}" and "1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D" in parents`,
                fields: 'files(id, name, webViewLink, description)'
            }).then(function(response){
                displayFiles(response);
                element.innerHTML = `Search: ${dataLang}`;
                console.log("Search Response", response);
            }),
            function(err) {console.error("Execute error", err);};
        }
        else {
            return gapi.client.drive.files.list({
                includeItemsFromAllDrives: true, 
                supportsAllDrives: true,
                q: `name contains "${dataLang}" and name contains "${dataCata}" and "1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D" in parents`,
                fields: 'files(id, name, webViewLink, description)'
            }).then(function(response){
                displayFiles(response);
                element.innerHTML = `Search: ${dataLang} and ${dataCata}`;
                console.log("Search Response", response);
            }),
            function(err) {console.error("Execute error", err);};
        }
    }
});

let reset = document.querySelector('.reset');

reset.onclick = () => {
    langBtn.forEach(remove => remove.classList.remove('active'));
    categoryBtn.forEach(remove => remove.classList.remove('active'));
    loadClient().then(execute);
    dataCata = null;
    dataLang = null;
    console.log("Reset Button Click - dataLang dataCata ", dataLang, dataCata);
    element.innerHTML = `Search Stotram: `;
}

let sideBarResults = document.querySelector('.results');

sideBarResults.onclick = () => {
    menu.classList.toggle('fa-times');
    sideBar.classList.toggle('active');
    box.classList.toggle('active');
    storam_container.classList.toggle('active');
}

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