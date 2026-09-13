/* sursa.js - RSA encryption/decryption logic using JSEncrypt - PB1-LQ1 */

var btn1024 = document.getElementById('btn1024');
var btn3072 = document.getElementById('btn3072');
var formError = document.getElementById('formError');

btn1024.addEventListener('click', function () {
  runRsaDemo(1024, 'result1024', btn1024);
});
btn3072.addEventListener('click', function () {
  runRsaDemo(3072, 'result3072', btn3072);
});

function getFormData() {
  var fullName = document.getElementById('fullName').value.trim();
  var dob = document.getElementById('dob').value;
  var yearLevel = document.getElementById('yearLevel').value;
  var gender = document.getElementById('gender').value;
  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value;

  if (!fullName || !dob || !yearLevel || !gender || !username || !password) {
    formError.textContent = 'Please fill out every field before encrypting.';
    return null;
  }

  formError.textContent = '';

  return {
    'Full Name': fullName,
    'Birth Date': dob,
    'Year Level': yearLevel,
    'Gender': gender,
    'Username': username,
    'Password': password
  };
}

function runRsaDemo(bitSize, resultId, button) {
  var data = getFormData();
  if (!data) { return; }

  var resultBox = document.getElementById(resultId);

  if (typeof JSEncrypt === 'undefined') {
    resultBox.innerHTML = '<p class="form-error">ERROR: JSEncrypt library did not load. Check your internet connection and refresh the page.</p>';
    return;
  }

  button.disabled = true;
  resultBox.innerHTML = '<p class="placeholder">Generating ' + bitSize + '-bit RSA key pair, please wait...</p>';

  setTimeout(function () {
    try {
      var crypt = new JSEncrypt({ default_key_size: bitSize });
      crypt.getKey();

      var publicKey = crypt.getPublicKey();
      var privateKey = crypt.getPrivateKey();

      var rows = [];
      var keys = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        var label = keys[i];
        var plainValue = data[label];

        var encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKey);
        var encrypted = encryptor.encrypt(String(plainValue));

        var decryptor = new JSEncrypt();
        decryptor.setPrivateKey(privateKey);
        var decrypted = encrypted ? decryptor.decrypt(encrypted) : null;

        rows.push({ label: label, encrypted: encrypted, decrypted: decrypted });
      }

      renderResult(resultBox, bitSize, publicKey, privateKey, rows);
    } catch (err) {
      resultBox.innerHTML = '<p class="form-error">ERROR: ' + err.message + '</p>';
      console.error(err);
    } finally {
      button.disabled = false;
    }
  }, 50);
}

function renderResult(container, bitSize, publicKey, privateKey, rows) {
  var html = '<h3>' + bitSize + '-bit RSA Result</h3>';

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var encVal = row.encrypted ? row.encrypted : 'Encryption failed';
    var decVal = (row.decrypted !== null) ? row.decrypted : 'N/A';

    html += '<div class="field-row">';
    html += '<span class="field-label">' + row.label + ':</span><br>';
    html += '<span class="crypto-text">' + encVal + '</span><br>';
    html += '<span class="decrypted-text">Decrypted: ' + decVal + '</span>';
    html += '</div>';
  }

  html += '<div class="key-box">';
  html += '<p class="key-label">Public Key:</p>';
  html += '<span class="crypto-text">' + publicKey + '</span>';
  html += '<p class="key-label">Private Key:</p>';
  html += '<span class="crypto-text">' + privateKey + '</span>';
  html += '</div>';

  container.innerHTML = html;
}
Compose
Write to Pamela Luis
