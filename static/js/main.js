// function getVNInfo() {
//   const vnId = document.getElementById("vnIdInput").value.trim();
//   const homeContainer = document.getElementById("homeContainer");
//   const resultDiv = document.getElementById("result");
//   const vnList = document.getElementById("vnList");

//   resultDiv.innerHTML = "Loading...";
//   vnList.innerHTML = "";

//   fetch(`/vn-info?vn_id=${vnId}`)
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.results && data.results.length > 0) {
//         if (data.results.length === 1) {
//           showVNDetail(data.results[0]);
//         } else {
//           resultDiv.innerHTML = `<p>Ditemukan ${data.results.length} hasil, pilih salah satu:</p>`;
//           data.results.forEach((vn) => {
//             const li = document.createElement("li");
//             li.innerHTML = `<button style="background:#1e1e1e;border:1px solid #555;color:#EFFFFB;padding:0.5rem;margin:0.2rem;border-radius:4px;cursor:pointer;">${vn.title}</button>`;
//             li.onclick = () => showVNDetail(vn);
//             vnList.appendChild(li);
//           });
//         }
//       } else {
//         resultDiv.innerHTML = "<p>Tidak ditemukan.</p>";
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       resultDiv.innerHTML = '<div class="error-message">${error.message}</div>';
//     });
// }

// function showVNDetail(vn) {
//   const resultDiv = document.getElementById("result");
//   const vnList = document.getElementById("vnList");
//   vnList.innerHTML = "";

//   // Format playtime (existing code)
//   let playTime = "Unknown";
//   if (vn.length) {
//     const hours = Math.floor(vn.length / 60);
//     const minutes = vn.length % 60;
//     let lengthCategory = "";
//     if (vn.length <= 30) lengthCategory = "Very short";
//     else if (vn.length <= 120) lengthCategory = "Short";
//     else if (vn.length <= 300) lengthCategory = "Medium";
//     else if (vn.length <= 600) lengthCategory = "Long";
//     else lengthCategory = "Very long";
//     playTime = `${lengthCategory} (${hours}h ${minutes}m)`;
//   }

//   // Format developers (existing code)
//   let developers = "Unknown";
//   if (vn.developers && vn.developers.length > 0) {
//     developers = vn.developers.map(dev => dev.name).join(", ");
//   }

//   // Format description
//   let description = "No description available";
//   if (vn.description) {
//     // Basic formatting handling (you can enhance this further)
//     description = vn.description
//       .replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1" target="_blank">$2</a>')
//       .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
//       .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
//       .replace(/\n/g, '<br>');
//   }

//   resultDiv.innerHTML = `
//     <div class="vn-detail-container">
//       <div class="vn-image-container">
//         <img id="vn_poster" src="${vn.image.url}" alt="${vn.title}">
//       </div>
//       <div class="vn-info-container">
//         <h2>${vn.title}</h2>
//         ${vn.aliases ? `<p class="vn-alias"><strong>Aliases:</strong> ${vn.aliases}</p>` : ''}
//         <p><strong>Play Time:</strong> <span class="play-time">${playTime}</span></p>
//         <p><strong>Developer:</strong> ${developers}</p>
//         <p><strong>ID:</strong> ${vn.id}</p>
//         <div class="vn-description">
//           <h3>Description</h3>
//           <div class="description-content">${description}</div>
//         </div>
//       </div>
//     </div>
//   `;
// }
function getVNInfo() {
  const vnId = document.getElementById("vnIdInput").value.trim();
  const homeContainer = document.getElementById("homeContainer");
  const resultDiv = document.getElementById("result");
  const vnList = document.getElementById("vnList");

  // Start fade-out animation for home container
  homeContainer.style.opacity = '1';
  homeContainer.style.transition = 'opacity 0.3s ease';
  homeContainer.style.opacity = '0';
  
  // After fade-out completes, hide it and show loading
  setTimeout(() => {
    homeContainer.style.display = 'none';
    resultDiv.style.display = 'block';
    resultDiv.style.opacity = '0';
    resultDiv.innerHTML = '<div class="loading-spinner">Loading...</div>';
    
    // Start fade-in for result container
    setTimeout(() => {
      resultDiv.style.transition = 'opacity 0.3s ease';
      resultDiv.style.opacity = '1';
    }, 10);
    
    fetch(`/vn-info?vn_id=${vnId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          if (data.results.length === 1) {
            showVNDetail(data.results[0]);
          } else {
            resultDiv.innerHTML = `<p>Found ${data.results.length} result, please select one:</p>`;
            vnList.innerHTML = ''; // Clear the list
          
            // Use Set to remove duplicates by ID
            const uniqueResults = Array.from(new Set(data.results.map(vn => vn.id)))
              .map(id => data.results.find(vn => vn.id === id));
              
            data.results.forEach((vn) => {
              const li = document.createElement("li");
              li.innerHTML = `<button class="vn-option-btn">${vn.title}</button>`;
              li.addEventListener('click', () => showVNDetail(vn), { once: true });
              vnList.appendChild(li);
            });
            vnList.style.display = 'block';
            vnList.style.opacity = '1';
          }
        } else {
          resultDiv.innerHTML = "<p>Tidak ditemukan.</p>";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        resultDiv.innerHTML = '<div class="error-message">Terjadi kesalahan saat mengambil data.</div>';
      });
  }, 300); // Match this with the transition duration
}

function showVNDetail(vn) {
  const resultDiv = document.getElementById("result");
  const vnList = document.getElementById("vnList");
  
  // Fade out the list if visible
  if (vnList.style.display === 'block') {
    vnList.style.opacity = '0';
    setTimeout(() => {
      vnList.style.display = 'none';
      vnList.innerHTML = '';
    }, 300);
  }

  // Fade out current content
  resultDiv.style.opacity = '0';
  
  setTimeout(() => {
    // Format playtime
    let playTime = "Unknown";
    if (vn.length) {
      const hours = Math.floor(vn.length / 60);
      const minutes = vn.length % 60;
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

    // Format description
    let description = "No description available";
    if (vn.description) {
      description = vn.description
        .replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1" target="_blank">$2</a>')
        .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
        .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    }

    resultDiv.innerHTML = `
      <button onclick="returnToHome()" class="back-button">← Kembali ke Pencarian</button>
      <div class="vn-detail-container">
        <div class="vn-image-container">
          <img id="vn_poster" src="${vn.image.url}" alt="${vn.title}">
        </div>
        <div class="vn-info-container">
          <h2>${vn.title}</h2>
          ${vn.aliases ? `<p class="vn-alias"><strong>Aliases:</strong> ${vn.aliases}</p>` : ''}
          <p><strong>Play Time:</strong> <span class="play-time">${playTime}</span></p>
          <p><strong>Developer:</strong> ${developers}</p>
          <p><strong>ID:</strong> ${vn.id}</p>
          <div class="vn-description">
            <h3>Description</h3>
            <div class="description-content">${description}</div>
          </div>
        </div>
      </div>
    `;
    
    // Fade in new content
    setTimeout(() => {
      resultDiv.style.opacity = '1';
    }, 10);
  }, 300);
}

function returnToHome() {
  const homeContainer = document.getElementById("homeContainer");
  const resultDiv = document.getElementById("result");
  const vnList = document.getElementById("vnList");

  // Fade out results
  resultDiv.style.opacity = '0';
  vnList.style.opacity = '0';
  
  setTimeout(() => {
    resultDiv.style.display = 'none';
    vnList.style.display = 'none';
    
    // Show home container with fade in
    homeContainer.style.display = 'block';
    setTimeout(() => {
      homeContainer.style.opacity = '1';
    }, 10);
    
    // Clear input field
    document.getElementById("vnIdInput").value = '';
  }, 300);
}

// Enhanced formatting function
function formatDescription(text) {
  if (!text) return "No description available";
  
  return text
    .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
    .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
    .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
    .replace(/\[s\](.*?)\[\/s\]/g, '<s>$1</s>')
    .replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>')
    .replace(/\[spoiler\](.*?)\[\/spoiler\]/g, '<span class="spoiler">$1</span>')
    .replace(/\n/g, '<br>');
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

// Add this to your existing main.js
function loadTrendingVNs() {
  fetch('/vn-info?vn_id=popular')
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const grid = document.getElementById('trendingVNs');
        grid.innerHTML = '';
        
        data.results.slice(0, 6).forEach(vn => {
          const card = document.createElement('div');
          card.className = 'vn-card';
          card.innerHTML = `
            <img src="${vn.image.url}" alt="${vn.title}">
            <div class="vn-card-info">
              <div class="vn-card-title">${vn.title}</div>
              <div class="vn-card-developer">${vn.developers?.[0]?.name || 'Unknown'}</div>
            </div>
          `;
          card.onclick = () => showVNDetail(vn);
          grid.appendChild(card);
        });
      }
    })
    .catch(error => console.error('Error loading trending VNs:', error));
}

function fillExample(vnId) {
  document.getElementById('vnIdInput').value = vnId;
  getVNInfo();
}

// Call this when page loads
document.addEventListener("DOMContentLoaded", function() {
  loadTrendingVNs();
  
  const input = document.getElementById("vnIdInput");
  input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      getVNInfo();
    }
  });
});