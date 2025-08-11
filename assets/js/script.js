// INDIA TOUR - simple site JS ( no backend)
// Data and page logic in one file so it runs by double-clicking index.html

// ---- data (edit later in assets/images names if you want images) ----
const DESTINATIONS = [
  {
    id: "goa",
    title: "Goa",
    short: "Beaches, nightlife and seafood.",
    details: "Relax on golden beaches, try local seafood, and enjoy a relaxed coastal vibe.Goa's beaches come alive at night with vibrant beach parties. Anjuna and Vagator beaches are famous for their full-moon parties and trance music festivals, creating a perfect vibe for party lovers. For a taste of glamour, try Goa's luxurious floating casinos on the Mandovi River, like Deltin Royale and Casino Pride.",
    price: 7999,
    img: "assets/images/destination-goa.jpg"
  },
  {
    id: "jaipur",
    title: "Jaipur (Pink City)",
    short: "Palaces, forts and handicrafts.",
    details: "Visit Amber Fort, City Palace and explore colourful bazaars.Its features of beautiful Architecture, Town Planning, Arts and Crafts, Culture, tourism have endowed it with uniqueness in India's urban character. Jaipur being capital of Rajasthan and one of the important cities of Golden Triangle is the focus of the socio-economic and political center of the State.",
    price: 5999,
    img: "assets/images/destination-jaipur.jpg"
  },
  {
    id: "manali",
    title: "Manali",
    short: "Mountains, snow and adventure.",
    details: "Trek, relax by rivers, and enjoy mountain views.A gift of the Himalayas to the world, Manali is a beautiful township nestled in the picturesque Beas River valley. It is a rustic enclave known for its cool climate and snow-capped mountains, offering respite to tourists escaping scorching heat of the plains.",
    price: 8999,
    img: "assets/images/destination-manali.jpg"
  },
  {
    id: "kerala",
    title: "Kerala Backwaters",
    short: "Houseboats and serene backwaters.",
    details: "Cruise on houseboats, taste Kerala cuisine and enjoy green landscapes.Connected by artificial canals, the backwaters form an economical means of transport, and a large local trade is carried on by inland navigation. Fishing, along with fish curing, is an important industry. Kerala backwaters have been used for centuries by the local people for transportation, fishing and agriculture.",
    price: 9999,
    img: "assets/images/destination-kerala.jpg"
  }
];

// ---- helper ----
function qs(id) { return document.getElementById(id); }
function getParam(k) { return new URLSearchParams(window.location.search).get(k); }

// ---- render popular on index.html ----
function renderPopular() {
  const container = qs('popular-list');
  if (!container) return;
  container.innerHTML = '';
  DESTINATIONS.slice(0,3).forEach(d => {
    const div = document.createElement('div');
    div.className = 'col-md-4';
    div.innerHTML = `
      <div class="card mb-3">
        <div style="height:160px; background:#f1f5f9; display:flex;align-items:center;justify-content:center;">
          <img src="${d.img}" alt="${d.title}" style="max-height:140px; object-fit:cover;">
        </div>
        <div class="card-body">
          <h5 class="card-title">${d.title}</h5>
          <p class="small-muted">${d.short}</p>
          <p><strong>From ₹${d.price}</strong></p>
          <a class="btn btn-sm btn-outline-primary" href="destination.html?id=${d.id}">View</a>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// ---- render all destinations ----
function renderAllDestinations() {
  const container = qs('destination-list');
  if (!container) return;
  container.innerHTML = '';
  DESTINATIONS.forEach(d => {
    const col = document.createElement('div');
    col.className = 'col-md-6 mb-3';
    col.innerHTML = `
      <div class="card h-100">
        <div class="row g-0">
          <div class="col-4">
            <div style="height:120px; display:flex;align-items:center;justify-content:center;background:#f1f5f9;">
              <img src="${d.img}" alt="${d.title}" style="max-height:110px;">
            </div>
          </div>
          <div class="col-8">
            <div class="card-body">
              <h5>${d.title}</h5>
              <p class="small-muted">${d.short}</p>
              <p><strong>From ₹${d.price}</strong></p>
              <a class="btn btn-sm btn-primary" href="destination.html?id=${d.id}">Details</a>
              <a class="btn btn-sm btn-outline-success" href="booking.html?id=${d.id}">Book</a>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// ---- render single destination detail ----
function renderDestinationDetail() {
  const container = qs('destination-detail');
  if (!container) return;
  const id = getParam('id');
  if (!id) { container.innerHTML = '<p class="text-danger">No destination selected.</p>'; return; }
  const d = DESTINATIONS.find(x => x.id === id);
  if (!d) { container.innerHTML = '<p class="text-danger">Destination not found.</p>'; return; }
  container.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <img src="${d.img}" alt="${d.title}" style="width:100%;height:300px;object-fit:cover;border-radius:6px;">
      </div>
      <div class="col-md-6">
        <h3>${d.title}</h3>
        <p class="small-muted">${d.short}</p>
        <p>${d.details}</p>
        <p><strong>From ₹${d.price}</strong></p>
        <a class="btn btn-primary" href="booking.html?id=${d.id}">Book Now</a>
      </div>
    </div>
  `;
}

// ---- booking logic ----
const STORAGE_KEY = 'india_tour_bookings';

function initBookingForm() {
  const form = qs('booking-form');
  if (!form) return;

  // Prefill destination if id provided
  const id = getParam('id');
  let dest = DESTINATIONS[0];
  if (id) {
    const found = DESTINATIONS.find(x => x.id === id);
    if (found) dest = found;
  }
  const destInput = qs('destination-input');
  if (destInput) destInput.value = dest.title;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = qs('name').value.trim();
    const email = qs('email').value.trim();
    const start = qs('start').value;
    const end = qs('end').value;
    const guests = qs('guests').value || 1;

    if (!name || !email || !start || !end) {
      qs('booking-msg').innerHTML = '<div class="alert alert-danger">Please fill all required fields.</div>';
      return;
    }
    if (new Date(end) < new Date(start)) {
      qs('booking-msg').innerHTML = '<div class="alert alert-danger">End date must be after start date.</div>';
      return;
    }

    const booking = {
      id: 'bk_' + Date.now(),
      name, email,
      destinationId: dest.id,
      destinationTitle: dest.title,
      start, end,
      guests: Number(guests),
      createdAt: new Date().toISOString()
    };

    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    arr.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

    qs('booking-msg').innerHTML = '<div class="alert alert-success">Booking saved locally. Open Admin to view/export.</div>';
    form.reset();
    if (destInput) destInput.value = dest.title; // keep destination shown
  });
}

// ---- admin page: show bookings, export, clear ----
function renderAdminBookings() {
  const tbody = qs('booking-table');
  if (!tbody) return;
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="small-muted">No bookings yet.</td></tr>';
    return;
  }
  list.slice().reverse().forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${b.id}</td>
      <td>${escapeHtml(b.name)}</td>
      <td>${escapeHtml(b.email)}</td>
      <td>${escapeHtml(b.destinationTitle)}</td>
      <td>${b.start}</td>
      <td>${b.end}</td>
      <td>${b.guests}</td>
      <td>${new Date(b.createdAt).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportBookings() {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const blob = new Blob([JSON.stringify(list, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'india_tour_bookings.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function clearBookings() {
  if (!confirm('Clear all bookings? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderAdminBookings();
}

// small escape to keep output safe (basic)
function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ---- initialize depending on page ----
document.addEventListener('DOMContentLoaded', function () {
  renderPopular();
  renderAllDestinations();
  renderDestinationDetail();
  initBookingForm();
  renderAdminBookings();

  const exportBtn = qs('export-btn');
  if (exportBtn) exportBtn.addEventListener('click', exportBookings);

  const clearBtn = qs('clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', clearBookings);

  const refreshBtn = qs('refresh-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', renderAdminBookings);
});
