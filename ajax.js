const path1 = document.querySelector('.path1');
const path2 = document.querySelector('.path2');
const path3 = document.querySelector('.path3');
const path4 = document.querySelector('.path4');
const path5 = document.querySelector('.path5');

const dir1 = document.querySelector('.dir1');
const dir2 = document.querySelector('.dir2');
const dir3 = document.querySelector('.dir3');
const dir4 = document.querySelector('.dir4');
const dir5 = document.querySelector('.dir5');

const dir1text = document.querySelector('.dir1text');
const dir2text = document.querySelector('.dir2text');
const dir3text = document.querySelector('.dir3text');
const dir4text = document.querySelector('.dir4text');
const dir5text = document.querySelector('.dir5text');

const back = document.querySelector('.back');

const sortType = document.querySelector('.sort');

path1.onclick = reqData;
path2.onclick = reqData;
path3.onclick = reqData;
path4.onclick = reqData;
path5.onclick = reqData;

dir1.onclick = reqData1;
dir2.onclick = reqData1;
dir3.onclick = reqData1;
dir4.onclick = reqData1;
dir5.onclick = reqData1;

back.onclick = reqData2;

let globalPath =[]

function globalPathMaking(){
    let s = ""
    for (let i = 0; i < globalPath.length; i++) {
        if (globalPath[i]!=""){
            s+= globalPath[i]
        }
     }
    return s
}

function globalPathMaking2(){
    let s = ""
    for (let i = 0; i < globalPath.length-1; i++) {
        if (globalPath[i+1]!=""){
            s+= globalPath[i]
        }
     }
    return s
}

function globalPathMaking3(data){
    let s = ""
    for (let i = 0; i < globalPath.length-1; i++) {
        if (globalPath[i]==data){
            s+= globalPath[i]
            break
        }
        else{
            s+= globalPath[i]
        }
     }
    return s
}

function checking(data, i){
    //console.log(data["pathDirs"], i)
    if (data["pathDirs"][i] != undefined) return "/" + data["pathDirs"][i]
    return ""
}


function makeDirView(data, i){
    //console.log(data["dirs"].length, i)
    if (data["dirs"][i] != undefined) return "/" + data["dirs"][i]["name"]
    else return ""
}

function makeDirSize(data, i){
    //console.log(data["dirs"].length, i)
    if (data["dirs"][i] != undefined) return data["dirs"][i]["size"] + " mb"
    else return ""
}

function pathProccesing(data){
    a = JSON.parse(this.responseText)
    if (a["error"] != "None"){alert("Ошибка!")}
    else{
        path1.textContent = checking(a,0)
        globalPath[0] = path1.textContent
        dir1.textContent = makeDirView(a,0)
        dir1text.textContent = makeDirSize(a,0)

        path2.textContent = checking(a,1)
        globalPath[1] = path2.textContent
        dir2.textContent = makeDirView(a,1)
        dir2text.textContent = makeDirSize(a,1)

        path3.textContent = checking(a,2)
        globalPath[2] = path3.textContent
        dir3.textContent = makeDirView(a,2)
        dir3text.textContent = makeDirSize(a,2)

        path4.textContent = checking(a,3)
        globalPath[3] = path4.textContent
        dir4.textContent = makeDirView(a,3)
        dir4text.textContent = makeDirSize(a,3)

        path5.textContent = checking(a,4)
        globalPath[4] = path5.textContent
        dir5.textContent = makeDirView(a,4)
        dir5text.textContent = makeDirSize(a,4)
    }
}

function reqData(){
    if (this.textContent[0]!="/") url = "http://localhost:3002/dirsize?ROOT=/home&limit=1&sort=" + sortType.value
    else {
        console.log(this.textContent)
        url = "http://localhost:3002/dirsize?ROOT=" + globalPathMaking3(this.textContent) +"&limit=1&sort=" + sortType.value
    }
    console.log(url)
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load",pathProccesing)
    xhr.open("GET", url)
    xhr.send();
    console.log(xhr)
}

function reqData1(){
    console.log(globalPath)
    url = "http://localhost:3002/dirsize?ROOT=" + globalPathMaking() + this.textContent +"&limit=1&sort=" + sortType.value
    console.log(url)
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load",pathProccesing)
    xhr.open("GET", url)
    xhr.send();
    console.log(xhr)
}

function reqData2(){
    console.log(globalPath)
    url = "http://localhost:3002/dirsize?ROOT=" + globalPathMaking2() +"&limit=1&sort=" + sortType.value
    console.log(url)
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load",pathProccesing)
    xhr.open("GET", url)
    xhr.send();
    console.log(xhr)
}