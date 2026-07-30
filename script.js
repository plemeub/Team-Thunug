// Load games
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

      // Particle explosion on hover
      card.addEventListener("mouseenter", () => {
        explodeParticles(card);
      });

      list.appendChild(card);
    });
  });

// Search filter
document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll(".game-card").forEach(card => {
    const name = card.querySelector("p").textContent.toLowerCase();
    card.style.display = name.includes(term) ? "" : "none";
  });
});

// Particle explosion function
function explodeParticles(card) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";

    // Random start position inside card
    const x = Math.random() * card.offsetWidth;
    const y = Math.random() * card.offsetHeight;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    card.appendChild(particle);

    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 60;

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    // Animate
    particle.animate(
      [
        { transform: "translate(0, 0)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
      ],
      {
        duration: 700,
        easing: "ease-out"
      }
    );

    // Remove after animation
    setTimeout(() => particle.remove(), 700);
  }
}
