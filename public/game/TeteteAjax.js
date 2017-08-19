// JavaScript source code
if (!window.XMLHttpRequest) {
    XMLHttpRequest = function () {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e) { }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e) { }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) { }
        throw new Error("This browser does not support XMLHttpRequest.");
    };
}
function doget(data, url, callback) {
    console.log("called doget");
    if (!url) return;
    if (!callback) callback = function (responsetext) { };
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if ((xhr.readyState === 4 && xhr.status === 0) || (xhr.readyState === 4 && xhr.status === 200)) {
			console.log("callback doget-1");
            callback(xhr.responseText);
        }
		console.log("callback doget-2");
    }
    xhr.send(data);
}
function dopost(data, url, callback) {
    if (!url) return;
    if (!callback) callback = function (responsetext) { };
    var xhr = new XMLHttpRequest();
    xhr.open("post", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if ((xhr.readyState === 4 && xhr.status === 0) || (xhr.readyState === 4 && xhr.status === 200)) {
            callback(xhr.responseText);
        }
    }
    xhr.send(data);
}