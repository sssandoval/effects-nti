// Adicione novos efeitos aqui: { title: "nome exibido", url: "link do embed do iframe" }
const sounds = [
    { title: "Faahhhhhh", url: "https://www.myinstants.com/instant/faahhhhhh-72237/embed/" },
    { title: "Risada Atumalaca", url: "https://www.myinstants.com/instant/risada-atumalaca-vai-dar-namoro-7385/embed/" },
    { title: "Huuu nooo cremoso", url: "https://www.myinstants.com/instant/huuunooo-e-muito-cremoso-9280/embed/" },
    { title: "Tiao Lepo", url: "https://www.myinstants.com/instant/tiao-lepo-23975/embed/" },
    { title: "Metal caindo", url: "https://www.myinstants.com/instant/metal-pipe-falling-sound-effect-7737/embed/" },
    { title: "Que papelão hein?", url: "https://www.myinstants.com/instant/que-papelao-hein-efeito-sonoro-63472/embed/" },
    { title: "Ele gosta", url: "https://www.myinstants.com/instant/ele-gosta-1026/embed/" },
    { title: "Sua mãe sabe", url: "https://www.myinstants.com/instant/sua-mae-sabe-que-voce-gosta-de-rapazes-80078/embed/" },
    { title: "Rapaz Xaropinho", url: "https://www.myinstants.com/instant/rapaz-xaropinho-ratinho-20505/embed/" },
    { title: "LEPO", url: "https://www.myinstants.com/instant/tiao-tiaaafo-lipo-47843/embed/" },
    { title: "Som do Uber", url: "https://www.myinstants.com/instant/uber-eats-56602/embed/" },
    { title: "Me mata de uma vez", url: "https://www.myinstants.com/instant/me-mata-de-uma-vez-trio-parada-dura-572/embed/" },
    { title: "Quem é esse rocambole?", url: "https://www.myinstants.com/instant/quem-e-esse-rocambole-38513/embed/" }
];

const board = document.getElementById("board");
const searchInput = document.getElementById("search");
const padCount = document.getElementById("pad-count");

sounds.forEach((sound, index) => {
    const card = document.createElement("div");
    card.className = "sound-card";
    card.dataset.title = sound.title.toLowerCase();

    const header = document.createElement("div");
    header.className = "pad-header";

    const number = document.createElement("span");
    number.className = "pad-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const dot = document.createElement("span");
    dot.className = "pad-dot";

    header.appendChild(number);
    header.appendChild(dot);

    const title = document.createElement("span");
    title.className = "sound-title";
    title.textContent = sound.title;

    const screen = document.createElement("div");
    screen.className = "pad-screen";

    const iframe = document.createElement("iframe");
    iframe.src = sound.url;
    iframe.width = "115";
    iframe.height = "165";
    iframe.frameBorder = "0";
    iframe.scrolling = "no";
    iframe.loading = "lazy";

    screen.appendChild(iframe);

    card.appendChild(header);
    card.appendChild(title);
    card.appendChild(screen);
    board.appendChild(card);
});

padCount.textContent = sounds.length;

const cards = Array.from(board.querySelectorAll(".sound-card"));

const noResults = document.createElement("p");
noResults.className = "no-results";
noResults.textContent = "nenhum efeito encontrado.";
noResults.style.display = "none";
board.appendChild(noResults);

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
        const matches = card.dataset.title.includes(query);
        card.classList.toggle("is-hidden", !matches);
        if (matches) visibleCount++;
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
});
