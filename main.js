const buttons = document.querySelectorAll('.guildButton');

let selectedGuild = "aráchnes";

function storeButtonValue(event) {
  const buttonValue = event.target.getAttribute('data-value');
  localStorage.setItem('selectedGuild', buttonValue);
  window.location.href = "/ar-chnes-full-webapp/bank.html"
}

buttons.forEach(button => {
  button.addEventListener('click', storeButtonValue);
});
