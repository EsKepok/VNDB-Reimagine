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

  // Format playtime
  let playTime = "Unknown";
  if (vn.length) {
    const hours = Math.floor(vn.length / 60);
    const minutes = vn.length % 60;
    
    // Determine length category
    let lengthCategory = "";
    if (vn.length <= 30) lengthCategory = "Very short";
    else if (vn.length <= 120) lengthCategory = "Short";
    else if (vn.length <= 300) lengthCategory = "Medium";
    else if (vn.length <= 600) lengthCategory = "Long";
    else lengthCategory = "Very long";
    
    playTime = `${lengthCategory} (${hours}h ${minutes}m)`;
  }

  // Format developers
  let developers = "Unknown";
  if (vn.developers && vn.developers.length > 0) {
    developers = vn.developers.map(dev => dev.name).join(", ");
  }

  resultDiv.innerHTML = `
    <div class="vn-detail-container">
      <div class="vn-image-container">
        <img id="vn_poster" src="${vn.image.url}" alt="${vn.title}">
      </div>
      <div class="vn-info-container">
        <h2>${vn.title}</h2>
        ${vn.aliases ? `<p class="vn-alias"><strong>Aliases:</strong> ${vn.aliases}</p>` : ''}
        <p><strong>Play Time:</strong> ${playTime}</p>
        <p><strong>Developer:</strong> ${developers}</p>
        <p><strong>ID:</strong> ${vn.id}</p>
      </div>
    </div>
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

// Mobile menu toggle
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.navbar-menu').classList.toggle('active');
});