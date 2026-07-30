fetch("games.json")
  .then(res => res.json())
  .then(games => {
    const list = document.getElementById("gameList");

    games.forEach(game => {
      const card = document.createElement("a");
      card.className = "game-card";
      card.href = `games/${game.slug}/`;

      card.innerHTML = `
        <img src="${game.thumbnail}" alt="${game.name}">
        <p>${game.name}</p>
      `;

      list.appendChild(card);
    });
  });

document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll(".game-card").forEach(card => {
    const name = card.querySelector("p").textContent.toLowerCase();
    card.style.display = name.includes(term) ? "" : "none";
  });
});
