// Load all games from games.json
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

      // Add particle explosion on hover
      card.addEventListener("mouseenter", () => {
        createParticles(card);
      });

      list.appendChild(card);
    });
  });

// Search bar filter
document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll(".game-card").forEach(card => {
    const name = card.querySelector("p").textContent.toLowerCase();
    card.style.display = name.includes(term) ? "" : "none";
  });
});

// PARTICLE EXPLOSION FUNCTION
function createParticles(card) {
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";

    // Random starting position inside the card
    const x = Math.random() * card.offsetWidth;
    const y = Math.random() * card.offsetHeight;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    card.appendChild(particle);

    // Random outward direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 40;

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    // Animate particle
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

    // Remove particle after animation
    setTimeout(() => particle.remove(), 700);
  }
}
