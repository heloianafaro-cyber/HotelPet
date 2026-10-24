// 1. NAVEGAÇÃO
document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.sidebar nav a[data-page]');
    const pages = document.querySelectorAll('.page');

    function navegarPara(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const paginaAlvo = document.getElementById(pageId);
        if (paginaAlvo) paginaAlvo.classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) link.classList.add('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (evento) => {
            evento.preventDefault();
            navegarPara(link.dataset.page);
        });
    });

    navegarPara('dashboard');

    // 2. Normalizar texto
    function normalizar(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')                    // separa a letra do acento
            .replace(/[\u0300-\u036f]/g, '');    // remove os acentos
    }

    // 3. BUSCA EM TABELAS (Reservas e Usuários)
    function configurarBuscaTabela(inputId, tbodyId, vazioId) {
        const input  = document.getElementById(inputId);
        const tbody  = document.getElementById(tbodyId);
        const vazio  = document.getElementById(vazioId);

        if (!input || !tbody) return; // segurança: se não achou, para

        input.addEventListener('input', () => {
            const termo = normalizar(input.value.trim());
            const linhas = tbody.querySelectorAll('tr');
            let visiveis = 0;

            linhas.forEach(linha => {
                const textoDaLinha = normalizar(linha.textContent);
                const combina = textoDaLinha.includes(termo);
                linha.style.display = combina ? '' : 'none';
                if (combina) visiveis++;
            });

            // Mostra a mensagem se nada foi encontrado
            if (vazio) {
                vazio.style.display = visiveis === 0 ? 'block' : 'none';
            }
        });
    }

    // 4. BUSCA EM CARDS (Pets)
    function configurarBuscaPets() {
        const input = document.getElementById('busca-pet');
        const grid  = document.getElementById('grid-pets');
        const vazio = document.getElementById('vazio-pets');

        if (!input || !grid) return;

        input.addEventListener('input', () => {
            const termo = normalizar(input.value.trim());
            const cards = grid.querySelectorAll('.pet-card');
            let visiveis = 0;

            cards.forEach(card => {
                const textoDoCard = normalizar(card.textContent);
                const combina = textoDoCard.includes(termo);
                card.style.display = combina ? '' : 'none';
                if (combina) visiveis++;
            });

            if (vazio) {
                vazio.style.display = visiveis === 0 ? 'block' : 'none';
            }
        });
    }

    // 5. INICIALIZA TUDO
    configurarBuscaTabela('busca-reserva', 'tbody-reservas', 'vazio-reservas');
    configurarBuscaTabela('busca-usuario', 'tbody-usuarios', 'vazio-usuarios');
    configurarBuscaPets();
});