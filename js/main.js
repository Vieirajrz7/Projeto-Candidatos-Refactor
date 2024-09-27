// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
          console.log('Falha ao registrar o Service Worker:', error);
        });
    });
}


let selectCidades = document.querySelector('#cidades');
let listaCidades = [];

function criarOptionsCidades(cidade) {
    let option = document.createElement('option');
    option.value = cidade;
    option.textContent = cidade;
    return option;
}

function criarPerfilCand(candidato) {
    // Variáveis de elementos do perfil
    const perfilDiv = document.createElement('div');
    const foto = document.createElement('img');
    const nomeUrna = document.createElement('span');
    const numeroUrna = document.createElement('span');
    const nomeCompleto = document.createElement('span');
    const cidade = document.createElement('span');
    const partido = document.createElement('span');
    
    // Definindo id dos elementos do perfil
    nomeUrna.id = 'nomeUrna';
    numeroUrna.id = 'numeroUrna';
    nomeCompleto.id = 'nomeCompleto';
    cidade.id = 'cidade';
    partido.id = 'partidoSigla';
    
    // Escrevendo os dados nas variaveis
    foto.src = candidato.linkFoto;
    nomeUrna.textContent = candidato.nomeUrna.toUpperCase();
    numeroUrna.textContent = candidato.numUrna;
    cidade.textContent = candidato.cidade;
    partido.textContent = `${candidato.partido} - ${candidato.siglaPartido.toUpperCase()}`;
    
    // Expressão Regular para deixar as primeiras letras maiusculas do NomeCompleto
    capitalize = candidato.nomeCompleto.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
    nomeCompleto.textContent = capitalize;

    const temInstagram = !!candidato.instagram;
    const temFacebook = !!candidato.facebook;
    const isUnique = temInstagram !== temFacebook;

    verificaRedesSociais(perfilDiv, 'instagram', '../images/instagram.svg', candidato.instagram, isUnique);
    verificaRedesSociais(perfilDiv, 'facebook', '../images/facebook.svg', candidato.facebook, isUnique);
    if (!candidato.facebook) {

    }

    // Joga os dados tudo dentro da div 'perfildiv'
    perfilDiv.appendChild(foto);
    perfilDiv.appendChild(nomeUrna);
    perfilDiv.appendChild(numeroUrna);
    perfilDiv.appendChild(nomeCompleto);
    perfilDiv.appendChild(cidade);
    perfilDiv.appendChild(partido);
    
    return perfilDiv;
}

function verificaRedesSociais(perfilDiv, redeSocial, imgSrc, linkHref, isUnique) {
    if (linkHref) {   
        const link = document.createElement('a');
        const img = document.createElement('img');
        img.id = redeSocial
        img.src = imgSrc;
        link.href = linkHref;
        link.target = '_blank';
        
        if (isUnique) {
            img.id = 'uniqueIcon'
        }
        link.appendChild(img);
        perfilDiv.appendChild(link);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    fetch("./candidatos.json").then((response) => {
        response.json().then((dados) => {

            const cidadesSet = new Set();
            
            // Criando a lista de cidades unicas
            dados.candidatos.forEach((candidato) => {
                if (candidato.cidade) {
                    cidadesSet.add(candidato.cidade);
                }
            });
            listaCidades = Array.from(cidadesSet)

            listaCidades.sort((a, b) => a.localeCompare(b)); // Ordena as cidades por ordem alfabética, ignorando os acentos

            // Passa por todas as cidades e cria as options do select
            listaCidades.forEach(cidade => {
                selectCidades.appendChild(criarOptionsCidades(cidade));
            })
                    
            // Evento escutando dentro do select
            selectCidades.addEventListener('change',() => {
                let divCandidatos = document.querySelector('.candidatos');
                        
                // Pega os candidados com base no valor do select
                const candidatosFiltrados = dados.candidatos.filter(candidato => candidato.cidade === selectCidades.value);

                // Função para ordenar os candidatos em ordem alfabética
                candidatosFiltrados.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
    
                divCandidatos.innerHTML = ''; // Limpando as div para atualizar os dados exibidos

                // Itereando por cada candidato
                candidatosFiltrados.forEach((candidato) => {
                    divCandidatos.appendChild(criarPerfilCand(candidato));
                })
            })
        })
    })
})