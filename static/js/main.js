function getVNInfo() {
  const vnId = document.getElementById("vnIdInput").value.trim();
  const resultDiv = document.getElementById("result");
  const vnList = document.getElementById("vnList");

  resultDiv.innerHTML = "Loading...";
  vnList.innerHTML = "";

  fetch(`/vn-info?vn_id=${vnId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        if (data.results.length === 1) {
          showVNDetail(data.results[0]);
        } else {
          resultDiv.innerHTML = `<p>Ditemukan ${data.results.length} hasil, pilih salah satu:</p>`;
          data.results.forEach((vn) => {
            const li = document.createElement("li");
            li.innerHTML = `<button style="background:#1e1e1e;border:1px solid #555;color:#EFFFFB;padding:0.5rem;margin:0.2rem;border-radius:4px;cursor:pointer;">${vn.title}</button>`;
            li.onclick = () => showVNDetail(vn);
            vnList.appendChild(li);
          });
        }
      } else {
        resultDiv.innerHTML = "<p>Tidak ditemukan.</p>";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      resultDiv.innerHTML = "<p>Terjadi kesalahan saat mengambil data.</p>";
    });
}

function showVNDetail(vn) {
  const resultDiv = document.getElementById("result");
  const vnList = document.getElementById("vnList");
  vnList.innerHTML = "";

  resultDiv.innerHTML = `
        <h2>${vn.title}</h2>
        <p><strong>ID:</strong> ${vn.id}</p>
        <img src="${vn.image.url}" alt="${vn.title}">
    `;
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("vnIdInput");
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      getVNInfo();
    }
  });
});
