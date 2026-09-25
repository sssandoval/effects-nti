// Adicione novos efeitos aqui: { title: "nome exibido", url: "link do embed do iframe" }
const sounds = [
    { title: "Faahhhhhh", url: "https://www.myinstants.com/instant/faahhhhhh-72237/embed/" },
    { title: "Risada Atumalaca", url: "https://www.myinstants.com/instant/risada-atumalaca-vai-dar-namoro-7385/embed/" },
    { title: "Huuu nooo cremoso", url: "https://www.myinstants.com/instant/huuunooo-e-muito-cremoso-9280/embed/" },
    { title: "Tiao Lepo", url: "https://www.myinstants.com/instant/tiao-lepo-23975/embed/" },
    { title: "Que papelão hein?", url: "https://www.myinstants.com/instant/que-papelao-hein-efeito-sonoro-63472/embed/" },
    { title: "Ele gosta", url: "https://www.myinstants.com/instant/ele-gosta-1026/embed/" },
    { title: "Sua mãe sabe", url: "https://www.myinstants.com/instant/sua-mae-sabe-que-voce-gosta-de-rapazes-80078/embed/" },
    { title: "Rapaz Xaropinho", url: "https://www.myinstants.com/instant/rapaz-xaropinho-ratinho-20505/embed/" },
    { title: "Vixi Ratinho", url: "https://www.myinstants.com/instant/vixi-ratinho-77320/embed/" },
    { title: "Jesus Ratinho", url: "https://www.myinstants.com/instant/jesus-ratinho-34815/embed/" },
    { title: "LEPO", url: "https://www.myinstants.com/instant/tiao-tiaaafo-lipo-47843/embed/" },
    { title: "Som do Uber", url: "https://www.myinstants.com/instant/uber-eats-56602/embed/" },
    { title: "Moreninha Covarde", url: "https://www.myinstants.com/instant/moreninha-covarde-15755/embed/" },
    { title: "Tu sai de problema", url: "https://www.myinstants.com/instant/tu-sai-de-problema-24807/embed/" },
    { title: "Ta bom vc fala demais", url: "https://www.myinstants.com/instant/ta-bom-vc-fala-demais-90980/embed/" },
    { title: "Me mata de uma vez", url: "https://www.myinstants.com/instant/me-mata-de-uma-vez-trio-parada-dura-572/embed/" },
    { title: "Quem é esse rocambole?", url: "https://www.myinstants.com/instant/quem-e-esse-rocambole-38513/embed/" },
    { title: "Goofy Slip", url: "https://www.myinstants.com/instant/goofy-slip-37065/embed/" },
    { title: "Boiola", url: "https://www.myinstants.com/instant/aperte-o-botao/embed/" },
    { title: "Byd Unico Poluente", url: "https://www.myinstants.com/instant/byd-unico-poluente-fumaca-de-rosca-10493/embed/" },
    { title: "Tome Rodrigo Faro", url: "https://www.myinstants.com/instant/tome-rodrigo-faro-31061/embed/" },
    { title: "Som Inentendível Rodrigo Faro", url: "https://www.myinstants.com/instant/som-inentendivel-rodrigo-faro-88868/embed/" },
    { title: "AAAL", url: "https://www.myinstants.com/instant/aaal-41211/embed/" },
    { title: "Aiaiai Rodrigo Faro", url: "https://www.myinstants.com/instant/aiaiai-rodrigo-faro-70691/embed/" },
    { title: "Aii Mâmãe", url: "https://www.myinstants.com/instant/aii-mamae-56629/embed/" },
    { title: "E Brincadeira Hein Rodrigo Faro", url: "https://www.myinstants.com/instant/e-brincadeira-hein-rodrigo-faro-25623/embed/" },
    { title: "Ch3ga", url: "https://www.myinstants.com/instant/ch3ga-14693/embed/" },
    { title: "Demais Rodrigo Faro", url: "https://www.myinstants.com/instant/demais-rodrigo-faro-39618/embed/" },
    { title: "Que isso meu filho calma Rodrigo Faro", url: "https://www.myinstants.com/instant/que-isso-meu-filho-calma-rodrigo-faro-48922/embed/" },
    { title: "UI Rodrigo Faro", url: "https://www.myinstants.com/instant/ui-rodrigo-faro-92457/embed/" },
    { title: "Parei Família e Máfia", url: "https://www.myinstants.com/instant/parei-familia-e-mafia-80250/embed/" }
];

/* ==========================================================================
   Configuração
   ========================================================================== */

const STORAGE_KEYS = { favorites: "effects-nti:favorites", recent: "effects-nti:recent" };
const MAX_RECENT = 12;
const PLAYING_FEEDBACK_MS = 4000; // tempo do destaque verde-água + equalizador
const STOP_AVAILABLE_MS = 12000;  // tempo em que o botão "Parar" fica disponível

/* ==========================================================================
   Estado persistido (favoritos e recentes, por URL do efeito)
   ========================================================================== */

function loadList(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveList(key, list) {
    try {
        localStorage.setItem(key, JSON.stringify(list));
    } catch {
        // sem armazenamento disponível (aba anônima etc.): segue só em memória
    }
}

const favorites = new Set(loadList(STORAGE_KEYS.favorites));
let recent = loadList(STORAGE_KEYS.recent);

const state = { query: "", filter: "all" };

/* ==========================================================================
   Elementos
   ========================================================================== */

const board = document.getElementById("board");
const searchInput = document.getElementById("search");
const searchClear = document.getElementById("search-clear");
const filterButtons = Array.from(document.querySelectorAll(".filter"));
const resultInfo = document.getElementById("result-info");
const stopAllButton = document.getElementById("stop-all");
const emptyState = document.getElementById("empty-state");
const emptyTitle = document.getElementById("empty-title");
const emptyText = document.getElementById("empty-text");
const emptyAction = document.getElementById("empty-action");
const counts = {
    all: document.getElementById("count-all"),
    favorites: document.getElementById("count-favorites"),
    recent: document.getElementById("count-recent")
};

// busca sem diferenciar acentos nem maiúsculas: "mae" encontra "Mãe"
const normalize = text => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/* ==========================================================================
   Criação dos pads
   ========================================================================== */

const STAR_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>';
const STOP_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';

let hoveredPad = null;

const pads = sounds.map((sound, index) => {
    const number = String(index + 1).padStart(2, "0");

    const card = document.createElement("article");
    card.className = "pad";
    card.style.setProperty("--i", index);
    card.innerHTML = `
        <div class="pad-head">
            <span class="pad-number">${number}</span>
            <span class="pad-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <button type="button" class="pad-stop" hidden>${STOP_ICON}</button>
            <button type="button" class="fav-btn" aria-pressed="false">${STAR_ICON}</button>
        </div>
        <h2 class="pad-title"></h2>
        <div class="pad-screen is-loading">
            <div class="pad-button"></div>
        </div>
    `;

    const title = card.querySelector(".pad-title");
    title.textContent = sound.title;
    title.title = sound.title;

    const favButton = card.querySelector(".fav-btn");
    const screen = card.querySelector(".pad-screen");
    const stopButton = card.querySelector(".pad-stop");
    stopButton.title = "Parar";
    stopButton.setAttribute("aria-label", `Parar ${sound.title}`);

    const iframe = document.createElement("iframe");
    iframe.src = sound.url;
    iframe.title = `Tocar ${sound.title}`;
    iframe.width = "115";
    iframe.height = "150";
    iframe.scrolling = "no";
    iframe.loading = "lazy";
    iframe.addEventListener("load", () => screen.classList.remove("is-loading"));
    card.querySelector(".pad-button").appendChild(iframe);

    board.appendChild(card);

    const pad = {
        sound,
        card,
        iframe,
        screen,
        favButton,
        stopButton,
        search: normalize(`${number} ${sound.title}`),
        active: false,
        feedbackTimer: null,
        releaseTimer: null
    };

    favButton.addEventListener("click", () => toggleFavorite(pad));
    stopButton.addEventListener("click", () => stopPad(pad));
    card.addEventListener("pointerenter", () => { hoveredPad = pad; });
    card.addEventListener("pointerleave", () => { if (hoveredPad === pad) hoveredPad = null; });

    updateFavoriteButton(pad);
    return pad;
});

/* ==========================================================================
   Favoritos
   ========================================================================== */

function updateFavoriteButton(pad) {
    const isFav = favorites.has(pad.sound.url);
    pad.card.classList.toggle("is-favorite", isFav);
    pad.favButton.setAttribute("aria-pressed", String(isFav));
    pad.favButton.setAttribute("aria-label", `${isFav ? "Remover dos" : "Adicionar aos"} favoritos: ${pad.sound.title}`);
    pad.favButton.title = isFav ? "Remover dos favoritos" : "Adicionar aos favoritos";
}

function toggleFavorite(pad) {
    const url = pad.sound.url;
    if (favorites.has(url)) favorites.delete(url);
    else favorites.add(url);

    saveList(STORAGE_KEYS.favorites, [...favorites]);
    updateFavoriteButton(pad);
    pad.favButton.classList.remove("pop");
    void pad.favButton.offsetWidth; // reinicia a animação
    pad.favButton.classList.add("pop");
    render();
}

/* ==========================================================================
   Reprodução
   O áudio toca dentro do iframe (outro domínio), então a página não "ouve"
   o clique. Detectamos quando o foco sai da página para o iframe sob o
   cursor — o que acontece no clique — e usamos isso para o feedback visual,
   o histórico de recentes e para poder parar o som (recarregando o iframe).
   ========================================================================== */

function markPlayed(pad) {
    pad.active = true;
    pad.card.classList.add("is-playing", "is-active");
    pad.stopButton.hidden = false;

    // não dá para saber quando o som termina, então os estados expiram sozinhos
    clearTimeout(pad.feedbackTimer);
    clearTimeout(pad.releaseTimer);
    pad.feedbackTimer = setTimeout(() => pad.card.classList.remove("is-playing", "is-active"), PLAYING_FEEDBACK_MS);
    pad.releaseTimer = setTimeout(() => releasePad(pad), STOP_AVAILABLE_MS);

    recent = [pad.sound.url, ...recent.filter(url => url !== pad.sound.url)].slice(0, MAX_RECENT);
    saveList(STORAGE_KEYS.recent, recent);

    updateStopAll();
    render();
}

// volta o pad ao estado normal, sem mexer no áudio
function releasePad(pad) {
    pad.active = false;
    clearTimeout(pad.feedbackTimer);
    clearTimeout(pad.releaseTimer);
    pad.card.classList.remove("is-playing", "is-active");
    pad.stopButton.hidden = true;
    updateStopAll();
}

function stopPad(pad) {
    if (!pad.active) return;
    releasePad(pad);
    pad.screen.classList.add("is-loading");
    pad.iframe.src = pad.sound.url; // recarregar o embed interrompe o áudio
}

function stopAll() {
    pads.forEach(stopPad);
}

function updateStopAll() {
    const hasActive = pads.some(pad => pad.active);
    stopAllButton.disabled = !hasActive;
    stopAllButton.classList.toggle("has-active", hasActive);
}

window.addEventListener("blur", () => {
    setTimeout(() => {
        const pad = pads.find(p => p.iframe === document.activeElement);
        if (!pad || pad !== hoveredPad) return;
        markPlayed(pad);

        // devolve o foco à página para detectar o próximo clique no mesmo pad
        setTimeout(() => {
            if (document.activeElement === pad.iframe) {
                pad.iframe.blur();
                window.focus();
            }
        }, 400);
    }, 0);
});

stopAllButton.addEventListener("click", stopAll);

/* ==========================================================================
   Busca e filtros
   ========================================================================== */

function setFilter(filter) {
    state.filter = filter;
    filterButtons.forEach(button => {
        const isActive = button.dataset.filter === filter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });
    render();
}

function setQuery(value) {
    searchInput.value = value;
    state.query = normalize(value);
    searchClear.hidden = value.length === 0;
    render();
}

function render() {
    let visible = 0;

    pads.forEach(pad => {
        const url = pad.sound.url;
        const recentIndex = recent.indexOf(url);
        const inFilter =
            state.filter === "all" ||
            (state.filter === "favorites" && favorites.has(url)) ||
            (state.filter === "recent" && recentIndex !== -1);
        const matches = inFilter && pad.search.includes(state.query);

        pad.card.hidden = !matches;
        // em "Recentes" os pads aparecem do mais novo para o mais antigo
        pad.card.style.order = state.filter === "recent" ? recentIndex : "";
        if (matches) visible++;
    });

    counts.all.textContent = pads.length;
    counts.favorites.textContent = favorites.size;
    counts.recent.textContent = recent.length;

    resultInfo.textContent = state.query
        ? `${visible} de ${pads.length} efeitos`
        : `${visible} ${visible === 1 ? "efeito" : "efeitos"}`;

    renderEmptyState(visible);
}

function renderEmptyState(visible) {
    emptyState.hidden = visible > 0;
    if (visible > 0) return;

    if (state.query) {
        emptyTitle.textContent = `Nada encontrado para “${searchInput.value.trim()}”`;
        emptyText.textContent = "Confira a grafia ou tente uma palavra mais curta.";
        emptyAction.textContent = "Limpar busca";
    } else if (state.filter === "favorites") {
        emptyTitle.textContent = "Nenhum favorito ainda";
        emptyText.textContent = "Toque na estrela de um pad para deixá-lo sempre à mão aqui.";
        emptyAction.textContent = "Ver todos os efeitos";
    } else {
        emptyTitle.textContent = "Nada tocado ainda";
        emptyText.textContent = "Os efeitos que você tocar aparecem aqui, do mais recente ao mais antigo.";
        emptyAction.textContent = "Ver todos os efeitos";
    }
}

emptyAction.addEventListener("click", () => {
    if (state.query) setQuery("");
    else setFilter("all");
    searchInput.focus();
});

searchInput.addEventListener("input", () => setQuery(searchInput.value));

searchClear.addEventListener("click", () => {
    setQuery("");
    searchInput.focus();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
});

/* ==========================================================================
   Atalhos de teclado
   ========================================================================== */

document.addEventListener("keydown", event => {
    const typing = event.target === searchInput;

    if (event.key === "Escape" && typing) {
        if (searchInput.value) setQuery("");
        else searchInput.blur();
        return;
    }

    if (typing || event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === "/") {
        event.preventDefault();
        searchInput.focus();
        searchInput.select();
    } else if (event.key.toLowerCase() === "s") {
        stopAll();
    }
});

render();
