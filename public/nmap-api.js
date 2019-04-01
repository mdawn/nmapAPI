function updateScanResults() {
    var ip = document.getElementById('ip-input').value;
    fetch('/api/nmaps/' + ip).then(function(response) {
        return response.text();
    }).then(function(responseText) {
        console.log(responseText);
        document.getElementById('scan-results').innerText = responseText;
    });
}

document.getElementById('scanned-ip-button').onclick = updateScanResults;