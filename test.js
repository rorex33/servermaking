window.onload = function(){
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            x = JSON.parse(request.responseText)
            console.log(x)
            if (x["status"] == 1) {
                alert("Данные получены")
            }
            if (x["status"] == 0)
            alert(x["error"])
        }
    };
    //url = prompt("url")
    //request.open('GET', url);
    //request.send();
}
//"http://localhost:3002/dirsize?ROOT=/home/ivan/Desktop&limit=1&sort=asc"