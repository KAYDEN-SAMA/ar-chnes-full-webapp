import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjuPHyoBchvfSf-FYXqXk4y2iwtekIHv0",
  authDomain: "arachnes-website.firebaseapp.com",
  databaseURL: "https://arachnes-website-default-rtdb.firebaseio.com",
  projectId: "arachnes-website",
  storageBucket: "arachnes-website.appspot.com",
  messagingSenderId: "598408301141",
  appId: "1:598408301141:web:06d254956c7fa87a1be2dc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

function fetchData() {
  const offersPath = ref(db, 'shop');
  get(offersPath).then((snapshot) => {
    const dataSection = document.getElementById("dataSection");
    if (snapshot.exists()) {
      const offers = snapshot.val();
      let offersHTML = '<h3>العروض المتوفرة</h3>';
      Object.keys(offers).forEach((offerId, index) => {
        const offer = offers[offerId];
        offersHTML += `
          <div class="offer-card">
            <div class="cover-div">
              <img src="${offer.cover}">
            </div>
            <div class="card-elements">
              <h4>${offer.title}</h4>
              <p>${offer.description}</p>
              <p>السعر: ${offer.price}</p>
              <button id="purchase-button-${index}" data-price="${offer.price}" data-title="${offer.title}">طلب العرض</button>
            </div>
          </div>`;
      });
      dataSection.innerHTML = offersHTML;
      attachPurchaseButtonEvents();
    } else {
      dataSection.textContent = "لا تتوفر اي عروض حاليا";
    }
  }).catch((error) => {
    console.error("Error fetching offers: ", error);
  });
}

function attachPurchaseButtonEvents() {
  const purchaseButtons = document.querySelectorAll('[id^="purchase-button-"]');
  purchaseButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const offerTitle = button.dataset.title;
      const phoneNumber = '+212608091101';
      const message = `مرحبا، أود طلب عرض: ${offerTitle}`;
      window.open(generateWhatsAppLink(phoneNumber, message), '_blank');
    });
  });
}

function generateWhatsAppLink(phoneNumber, message) {
  let encodedMessage = encodeURIComponent(message);
  let whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  return whatsappUrl;
}


window.onload = () => {
  fetchData();
}
