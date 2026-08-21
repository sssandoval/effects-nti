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
    { title: "Rapaz Xaropinho", url: "https://www.myinstants.com/instant/rapaz-xaropinho-ratinho-20505/embed/" }
];

const board = document.getElementById("board");

sounds.forEach(sound => {
    const card = document.createElement("div");
    card.className = "sound-card";

    const title = document.createElement("span");
    title.className = "sound-title";
    title.textContent = sound.title;

    const iframe = document.createElement("iframe");
    iframe.src = sound.url;
    iframe.width = "90";
    iframe.height = "130";
    iframe.frameBorder = "0";
    iframe.scrolling = "no";

    card.appendChild(title);
    card.appendChild(iframe);
    board.appendChild(card);
});
