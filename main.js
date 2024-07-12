const buttons = document.querySelectorAll('.guildButton');

selectedGuild = "aráchnes";

function storeButtonValue(event) {
  buttonValue = event.target.value;
  localStorage.setItem('selectedGuild', buttonValue);
  window.location.href = "/ar-chnes-full-webapp/bank.html";
}

buttons.forEach(button => {
  button.addEventListener('click', storeButtonValue);
});
