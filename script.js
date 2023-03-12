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
var folderContainer = document.querySelector('.category');

function clearList() {
    listContainer.innerHTML = ' ';
}
function searchfolder() {
    return gapi.client.drive.files.list({
        includeItemsFromAllDrives: true,
        includeTeamDriveItems: false,
        supportsAllDrives: true,
        supportsTeamDrives: false,
        q: `'1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)'
    }).then(function(response){
        console.log("RESPONSE", response);
        displayFolders(response);
    }), 
    function(err) { console.error("Execute error", err); };
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
        searchfolder();
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
    console.log(gdapifiles && gdapifiles.length);
    if(gdapifiles && gdapifiles.length > 0){
        if(clear)
            listContainer.innerHTML = '';
        for(var i=0; i < gdapifiles.length; i++){
            listContainer.innerHTML += `
            <li data-id="${gdapifiles[i].id}" data-name="${gdapifiles[i].id}">
            <span>
                <a href="${gdapifiles[i].webViewLink}">${gdapifiles[i].name.split(".pdf")[0]}</a>           
            </span>
            </li>
            `;
        } 
    } else {
        listContainer.innerHTML = '<div style="text-align: center;color: black;">No Files</div>'
        console.log(gdapifiles, gdapifiles.length);
    }
}

let categoryBtn2;


function displayFolders(response, clear=true) {
    // Handle the results here (response.result has the parsed body).
    var gdapifolders = response.result.files;
    if(gdapifolders && gdapifolders.length > 0){
        if(clear)
            folderContainer.innerHTML = '';

        let promises = [];

        for (var i = 0; i < gdapifolders.length; i++) {
            promises.push(gapi.client.drive.files.list({
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                q: `mimeType='image/jpeg' and "${gdapifolders[i].id}" in parents`,
                fields: 'files(name)'
            }).then(function (response) {
                if (response && response.result && response.result.files.length > 0) {
                    return `<img src="${response.result.files[0].name}"/>`;
                } else {
                    return '';
                }
            }));

            folderContainer.innerHTML += `
                <div data-category="${gdapifolders[i].name}" class="btn">${gdapifolders[i].name}</div>
            `;
            
            map1.set(gdapifolders[i].name, gdapifolders[i].id);
            }

            Promise.all(promises).then(function(imageTags) {
                for (var i = 0; i < gdapifolders.length; i++) {
                  if (imageTags[i] !== '') {
                    // Check if the image file exists in Github
                    const imgTag = document.createElement('div');
                    imgTag.innerHTML = imageTags[i];
                    const imageFile = imgTag.firstChild.getAttribute('src').split('/').pop();
                    const owner = 'cmsjadmin';
                    const repo = 'stotramapp';
                    const token = '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';
              
                    axios({
                      method: 'get',
                      url: `https://api.github.com/repos/${owner}/${repo}/contents/${imageFile}`,
                      headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/vnd.github.v3+json',
                      },
                    })
                      .then((response) => {
                        // If the file does not exist, upload it to Github
                        if (response.status === 404) {
                          // Get the URL of the image file from Google Drive
                          const fileId = response.result.files[i].id;
                          const accessToken = gapi.auth.getToken().access_token;
                          const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
                          const headers = { Authorization: `Bearer ${accessToken}` };
              
                          // Download the image file from the URL
                          axios.get(fileUrl, {
                            responseType: 'arraybuffer',
                            headers: headers,
                          })
                            .then((downloadResponse) => {
                              const fileContent = downloadResponse.data;
              
                              // Upload the image file to Github
                              axios({
                                method: 'put',
                                url: `https://api.github.com/repos/${owner}/${repo}/contents/${imageFile}`,
                                data: {
                                  message: 'upload image',
                                  content: fileContent.toString('base64'),
                                },
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  Accept: 'application/vnd.github.v3+json',
                                },
                              })
                                .then((response) => {
                                  console.log(`File ${response.data.content.name} uploaded to Github`);
                                })
                                .catch((error) => {
                                  console.error('Error uploading file to Github', error);
                                });
                            })
                            .catch((error) => {
                              console.error('Error downloading image file', error);
                            });
                        } else {
                          console.log(`File ${imageFile} already exists in Github`);
                        }
                      })
                      .catch((error) => {
                        console.error('Error checking file in Github', error);
                      });
                    } else {
                        console.log("HELLO ITS NOT THERE IN GOOGLE DRIVE FOLDER");
                    }
              
                  document.querySelector(`[data-category="${gdapifolders[i].name}"]`).innerHTML = `${imageTags[i]}${gdapifolders[i].name}`;
                }
            });                                                 

        categoryBtn2 = document.querySelectorAll('.category .btn');

        categoryBtn2.forEach(btn =>{
            btn.onclick = () => {
                categoryBtn2.forEach(remove => remove.classList.remove('active'));
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
                        document.getElementById("arrow-right").scrollIntoView();
                        displayFiles(response);
                        element.innerHTML = `Search: ${dataLang} and ${dataCata}`;
                        console.log("Search Response", response);
                    }),
                    function(err) {console.error("Execute error", err); clearList();};
                }
            }
        });

        // let reset = document.querySelector('.reset');

        // reset.onclick = () => {
        //     var startY = sideBar.scrollTop;
        //     var endY = 0;
        //     var distance = Math.abs(endY - startY);
        //     var speed = 1;
        //     var step = distance / speed;
        //     var intervalId = setInterval(function() {
        //     startY = startY + (endY > startY ? step : -step);
        //     if (startY === endY) {
        //         clearInterval(intervalId);
        //     }
        //     sideBar.scrollTop = startY;
        //     }, 15);
        //     langBtn.forEach(remove => remove.classList.remove('active'));
        //     categoryBtn2.forEach(remove => remove.classList.remove('active'));
        //     element.innerHTML = `Search Stotram: `;
        //     dataCata = null;
        //     dataLang = null;
        //     listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
        // }

    } else {
        folderContainer.innerHTML = '<div style="text-align: center;color: black;">No Categories Found!</div>'
    }
}

const map1 = new Map([
    ['Bhagavad Geeta', '1zxN8U4BkDdcWkG65FS5IvIuzJ_TsEGcp']
]);

let previousSearchValue = "";

// function searchfiles() {
//     count=0;
//     document.querySelector('#search-box').oninput = () => {
//         var searchvalue = document.querySelector('#search-box').value.toString();
//         console.log("searchvalue=%s", searchvalue);
    
//         document.getElementById("loader").style.display = "block";

//         searchInFolder(searchvalue);
        
//         element.innerHTML = `Search: ${searchvalue}`;
//     }
// }

// function searchInFolder(searchvalue) {
//     var promises = []
//     for (let [folderName, folderId] of map1.entries()) {
//         promises.push(gapi.client.drive.files.list({
//             includeItemsFromAllDrives: true,
//             supportsAllDrives: true,
//             q: `mimeType='application/pdf' and name contains "${searchvalue}" and "${folderId}" in parents`, 
//             fields: 'files(id, name, webViewLink)'
//         }))
//     }
//     Promise.all(promises.map(p => p.then(r => r))).then(function(responses) {
//         if(searchvalue.length == 0 || searchvalue == "") {
//             clearList();
//             listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
//             element.innerHTML = `Search Stotram: ${searchvalue}`;
//             document.getElementById("loader").style.display = "none";
//         } else {
//             var combinedResults = responses.reduce((allFiles, currentFiles) => allFiles.concat(currentFiles.result.files), []);
//             displayFiles({ result: { files: combinedResults } });
//             langBtn.forEach(remove => remove.classList.remove('active'));
//             categoryBtn.forEach(remove => remove.classList.remove('active'));
//             document.getElementById("loader").style.display = "none";
//         }
//     });
// }

function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    }
}

function searchfiles() {
    count=0;
    document.querySelector('#search-box').oninput = debounce(() => {
        var searchvalue = document.querySelector('#search-box').value.toString();
        console.log("searchvalue=%s", searchvalue);
        dataCata = null;
        dataLang = null;

        searchvalue = DOMPurify.sanitize(searchvalue);
    
        document.getElementById("loader").style.display = "block";

        searchInFolder(searchvalue);
        
        element.innerHTML = `Search: ${searchvalue}`;
    }, 200);
}

function searchInFolder(searchvalue) {
    if (!/^[a-z0-9\-]+$/i.test(searchvalue)) {
        clearList();
        listContainer.innerHTML = '<div style="text-align: center;">Search with only alphanumeric characters</div>'
        element.innerHTML = `Search Stotram: `;
        document.getElementById("loader").style.display = "none";
        langBtn.forEach(remove => remove.classList.remove('active'));
        categoryBtn2.forEach(remove => remove.classList.remove('active'));
        return;
    }
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
        if(searchvalue.length <= 2) {
            clearList();
            listContainer.innerHTML = '<div style="text-align: center;">Search for 3 or more letters</div>'
            element.innerHTML = `Search Stotram: `;
            document.getElementById("loader").style.display = "none";
            langBtn.forEach(remove => remove.classList.remove('active'));
            categoryBtn2.forEach(remove => remove.classList.remove('active'));
        } else if (!/^[a-z0-9\-]+$/i.test(searchvalue)) {
            var combinedResults = responses.reduce((allFiles, currentFiles) => allFiles.concat(currentFiles.result.files), []);
            displayFiles({ result: { files: combinedResults } });
            langBtn.forEach(remove => remove.classList.remove('active'));
            categoryBtn2.forEach(remove => remove.classList.remove('active'));
            document.getElementById("loader").style.display = "none";
        } else {
            var combinedResults = responses.reduce((allFiles, currentFiles) => allFiles.concat(currentFiles.result.files), []);
            displayFiles({ result: { files: combinedResults } });
            langBtn.forEach(remove => remove.classList.remove('active'));
            categoryBtn2.forEach(remove => remove.classList.remove('active'));
            document.getElementById("loader").style.display = "none";
        }                        
    });
}

function showsideBar() {
    menu.classList.toggle('hidden');
    sideBar.classList.toggle('active');
    box.classList.toggle('active');
    storam_container.classList.toggle('active');
}

menu.onclick = () => {
    showsideBar();
};

let resultmain = document.querySelector('.Results');


resultmain.onclick = () => {
    showsideBar();
};

settings.onclick = () => {
    settings.classList.add("loading");
    setTimeout(() => {
        settings.classList.remove("loading");
        sideBarbox.forEach(toggle => toggle.classList.toggle('active'));
    }, 500);
};

// detect if the user is on an iOS device
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isWindows = navigator.userAgent.indexOf('Windows') > -1;

// if (isIOS) {
//   // get a reference to the button element
//   var button = document.getElementById("check");
//   var DM = document.getElementById("DM");

//   // hide the button by setting the display property to "none"
//   DM.style.display = "none";
// }

// initialize EmailJS with your user ID
emailjs.init("GMrN3VFPndRw4lAu-");

var feedbackButton = document.getElementById("feedback-button");
var feedbackForm = document.getElementById("feedback-form");
var closeBtn = document.getElementById("close-btn");
var feedbackFormContent = document.getElementById("feedback-form-content");
var feedbackText = document.getElementById("feedback-text");

feedbackButton.addEventListener("click", function() {
  feedbackForm.style.display = "block";
});

closeBtn.addEventListener("click", function() {
  feedbackForm.style.display = "none";
});

feedbackFormContent.addEventListener("submit", function(event) {
    feedbackFormContent = DOMPurify.sanitize(feedbackFormContent);
    event.preventDefault();
    var feedback = feedbackText.value.trim();
    if (feedback !== "") { 
      sendFeedback(feedback);
      feedbackText.value = "";
      feedbackForm.style.display = "none";
    } else {
      alert("Please enter your feedback before submitting.");
    }
  });  

function sendFeedback(feedback) {
  var templateParams = {
    feedback: feedback,
    from_name: "CMSJ Stotram App User"
  };
  emailjs.send("service_91yx94m", "template_qcxpfof", templateParams)
    .then(function(response) {
      console.log("SUCCESS!", response.status, response.text);
      alert("Thanks for your feedback!");
    }, function(error) {
      console.log("FAILED...", error);
      alert("There was an error sending your feedback. Please try again later.");
    });
}

let categoryBtn = document.querySelectorAll('.category .btn');
let langBtn = document.querySelectorAll('.lang .btn');

var dataLang;
var dataCata;

langBtn.forEach(btn =>{
    btn.onclick = () => {
        langBtn.forEach(remove => remove.classList.remove('active'));
        clearList();
        dataLang = btn.getAttribute('data-lang');
        btn.classList.add('active');
        var dataCataID = map1.get(dataCata);
        console.log("Lang Button Click - dataLang=%s", dataLang);
        if(dataCata == null) {
            console.log("dataCata is null");
            map1.forEach(function(value, key) {
                if(dataCataID != dataCata) {
                    element.innerHTML = `Search: ${dataLang} and ${dataCata}`;
                }
                return gapi.client.drive.files.list({
                    includeItemsFromAllDrives: true, 
                    supportsAllDrives: true,
                    includeTeamDriveItems: true,
                    q: `mimeType='application/pdf' and name contains "${dataLang}" and "${value}" in parents`,
                    fields: 'files(id, name, webViewLink)',
                }).then(function(response){
                    if(response.result.files.length > 0) {
                        displayFiles(response, false);
                        element.innerHTML = `Search: ${dataLang}`;  
                        console.log("Search Response", response);
                    }
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
                document.getElementById("arrow-right").scrollIntoView();
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

var t= new Date();
panchang.calculate(t, function() {
    function alltime() {
        document.getElementById("day").innerHTML="Today is: " + panchang.Day.name;
        document.getElementById("tithi").innerHTML="Tithi is: " + panchang.Tithi.name;
        document.getElementById("nakshtra").innerHTML="Nakshatra is: " + panchang.Nakshatra.name;
        document.getElementById("karna").innerHTML="Karna is: " + panchang.Karna.name;
        document.getElementById("yoga").innerHTML="Yoga is: " + panchang.Yoga.name;
        document.getElementById("raasi").innerHTML="Raasi is: " + panchang.Raasi.name;
        document.getElementById("ayanamsa").innerHTML="Ayanamsa is: " + panchang.Ayanamsa.name;
    }

    // function updateTime(){
    //     var t = new Date();
    //     hours = t.getHours();
    //     minutes = t.getMinutes();
    //     if (hours == 12) {
    //         ampm = "PM";
    //     } else if (hours > 12) {
    //         hours = hours - 12;
    //         ampm = "PM";
    //     } else {
    //         ampm = "AM";
    //     }
    
    //     if (hours == 0) {
    //         hours = 12;
    //     }
    // }    

    // document.addEventListener("DOMContentLoaded", function() {
    //     setInterval(function(){
    //         updateTime();
    //     }, 1000);
    //     intervalId = setInterval(function(){
    //         document.getElementById("day").innerHTML = "Time is: " + hours + ":" + minutes + " " + ampm;
    //     }, 1000);
    //     clearInterval(intervalId);
    // });

    alltime()

    document.getElementById("tithi").addEventListener("click", function() {
        alltime()
        clearInterval(intervalId);
        document.getElementById("tithi").innerHTML = "Tithi start: " + panchang.Tithi.start + "<br><br>Tithi end: " + panchang.Tithi.end;
    });
    document.getElementById("nakshtra").addEventListener("click", function() {
        alltime()
        clearInterval(intervalId);
        document.getElementById("nakshtra").innerHTML = "Nakshtra start: " + panchang.Nakshatra.start + "<br><br>Nakshtra end: " + panchang.Nakshatra.end;
    });
    document.getElementById("karna").addEventListener("click", function() {
        alltime()
        clearInterval(intervalId);
        document.getElementById("karna").innerHTML = "Karna start: " + panchang.Karna.start + "<br><br>Karna end: " + panchang.Karna.end;
    });
    document.getElementById("yoga").addEventListener("click", function() {
        alltime()
        clearInterval(intervalId);
        document.getElementById("yoga").innerHTML = "Yoga start: " + panchang.Yoga.start + "<br><br>Yoga end: " + panchang.Yoga.end;
    });
    document.getElementById("day").addEventListener("click", function() {
        alltime()
        // intervalId = setInterval(function(){
        //     document.getElementById("day").innerHTML = "Time is: " + hours + ":" + minutes + " " + ampm;
        // }, 500);
    });
    document.getElementById("raasi").addEventListener("click", function() {
        alltime()
        clearInterval(intervalId);
    });
    document.getElementById("ayanamsa").addEventListener("click", function() {
        alltime()
        clearInterval(intervalId);
    });
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
    categoryBtn2.forEach(remove => remove.classList.remove('active'));
    element.innerHTML = `Search Stotram: `;
    dataCata = null;
    dataLang = null;
    listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
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


const htmlElement = document.getElementsByTagName('html')[0];
const bodyElement = document.body;

// Function to disable all stylesheets
function disableStylesheets() {
  var i, link;
  for (i = 0; (link = document.getElementsByTagName("link")[i]); i++) {
    if (link.getAttribute("rel").endsWith("stylesheet")) {
      link.disabled = true;
    }
  }
}

// Function to enable a specific stylesheet
function enableStylesheet(stylesheet) {
  var i, link;
  for (i = 0; (link = document.getElementsByTagName("link")[i]); i++) {
    if (link.getAttribute("href").endsWith(stylesheet)) {
      link.disabled = false;
    }
  }
}


let darkMODEButton = document.querySelectorAll('.DARKMODE .btn');

let activeDMButton = localStorage.getItem('data-DM');
if (activeDMButton == null) {
  activeDMButton = "Light";
  localStorage.setItem('data-DM', activeDMButton);
}


// Set the active button and corresponding CSS file
darkMODEButton.forEach(btn => {
    if (btn.getAttribute('data-DM') == activeDMButton) {
      btn.classList.add("active");
      if (activeDMButton == "Dark") {
        root.style.setProperty('--primary-color', 'black');
        root.style.setProperty('--secondary-color', 'white');
      } else {
        root.style.setProperty('--primary-color', 'white');
        root.style.setProperty('--secondary-color', 'black');
      }
    } else {
      btn.classList.remove("active");
    }
});

// Add click handlers to the dark mode buttons
darkMODEButton.forEach(btn => {
  btn.onclick = () => {
    darkMODEButton.forEach(remove => remove.classList.remove('active'));
    btn.classList.add("active");
    dataDM = btn.getAttribute('data-DM');
    if (dataDM == "Dark") {
        root.style.setProperty('--primary-color', 'black');
        root.style.setProperty('--secondary-color', 'white');
        localStorage.setItem("data-DM", "Dark");
    } else if (dataDM == "Light") {
        root.style.setProperty('--primary-color', 'white');
        root.style.setProperty('--secondary-color', 'black');
        localStorage.setItem("data-DM", "Light");
    } else {
        root.style.setProperty('--primary-color', 'white');
        root.style.setProperty('--secondary-color', 'black');
        localStorage.setItem("data-DM", "Light");
    }
  }
});


// function setCookie(name, value, expires, path, domain, secure) {
//     var cookie = name + "=" + escape(value) +
//       ((expires) ? "; expires=" + expires : "") +
//       ((path) ? "; path=" + path : "") +
//       ((domain) ? "; domain=" + domain : "") +
//       ((secure) ? "; secure" : "");
//     document.cookie = cookie;
// }
  
// function getCookie(name) {
//     var value = "; " + document.cookie;
//     var parts = value.split("; " + name + "=");
//     if (parts.length == 2) return parts.pop().split(";").shift();
//     return null;
// }

window.addEventListener("DOMContentLoaded", function(){
    document.getElementById('side-menu').style.display = "none";
    const gallery = document.getElementsByClassName('gallery');
    for (let i = 0; i < gallery.length; i++) {
        gallery[i].style.display = "none";
    }
});

// if (getCookie("darkMode") === null) {
//     setCookie("darkMode", "false", 9999);
// }

// function changeStatus() {
//     var darkMode = getCookie("darkMode");
//     if (darkMode === "true") {
//         setCookie("darkMode", "false", 9999);
//         window.location.reload(true);

//         root.style.setProperty('--primary-color', 'white');
//         root.style.setProperty('--secondary-color', 'black');
//     } else {
//         setCookie("darkMode", "true", 9999);
//         window.location.reload(true);
//         root.style.setProperty('--primary-color', 'black');
//         root.style.setProperty('--secondary-color', 'white');
//     }
// }