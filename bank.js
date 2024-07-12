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

let selectedGuild = localStorage.getItem('selectedGuild') || "aráchnes";

const path = ref(db, 'guilds/' + selectedGuild);

const dataCountainer = document.getElementById("dataCountainer");

const loadingAnimation = dataCountainer.innerHTML;

async function searchUserByUsername(username) {
  try {
    const guildSnapshot = await get(ref(db, 'guilds/' + selectedGuild));
    if (guildSnapshot.exists()) {
      const guildData = guildSnapshot.val();
      for (const memberId in guildData) {
        if (guildData[memberId].username === username) {
          return {
            [memberId]: guildData[memberId]
          };
        }
      }
      return null;
    } else {
      return null;
    }
  } catch (error) {
    alert("حصل خطأ أثناء البحث عن العضو: ", error);
    return null;
  }
}

const header = document.getElementById("header");
const usernameSearchInput = document.getElementById("usernameSearchInput");
const searchButton = document.getElementById("searchButton");
const errorElm = document.getElementById("errorElm");

searchButton.addEventListener('click', () => {
  let usernameSearchValue = usernameSearchInput.value.trim();
  const arabicPattern = /^[\u0600-\u06FF\u0750-\u077F\s]+$/;

  if (usernameSearchValue === ""){
    errorElm.textContent = "أدخل اللقب أولا!";
    errorElm.style.display = "block";
    usernameSearchInput.classList.add('invalid');
    dataCountainer.innerHTML = loadingAnimation;
  } else if (!arabicPattern.test(usernameSearchValue)) {
    errorElm.textContent = "الرجاء إدخال اللقب باللغة العربية فقط";
    errorElm.style.display = "block";
    usernameSearchInput.classList.add('invalid');
    dataCountainer.innerHTML = loadingAnimation;
  } else {
    const loadingElement = document.getElementById("loadingElement");
    if (loadingElement){
      loadingElement.textContent = "جاري التحميل..."
    }
    
    errorElm.style.display = "none";
    usernameSearchInput.classList.remove('invalid');
    searchUserByUsername(usernameSearchValue)
      .then((user) => {
        if (user) {
          
          dataCountainer.innerHTML = "";
          
          const usernameElement = document.createElement("p");
          const rankElement = document.createElement("p");
          const balanceElement = document.createElement("p");
          const bagageElement = document.createElement("p");
          
          const memberId = Object.keys(user)[0];
          const userData = user[memberId];
          
          usernameElement.textContent = "اللقب: " + userData.username;
          rankElement.textContent = "الرتبة: " + userData.rank;
          balanceElement.textContent = "الرصيد: " + userData.balance;
          bagageElement.textContent = "السلعة: " + userData.bagage;
          
          if (userData.cover){
            const coverElement = document.getElementById("headerCover");
            
            coverElement.style.display = "block";

            coverElement.src = userData.cover;
            
          }
          
          dataCountainer.appendChild(usernameElement);
          dataCountainer.appendChild(rankElement);
          dataCountainer.appendChild(balanceElement);
          dataCountainer.appendChild(bagageElement);
          
        } else {
          errorElm.style.display = "block";
          errorElm.textContent = "لا يوجد عضو بهذا اللقب!";
          dataCountainer.innerHTML = loadingAnimation;
        }
      })
      .catch((error) => {
        console.error(error)
        alert('حصل خطأ!')
      });
  }
});
