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
    // ==========================================
    // 6. EDIÇÃO DE RESERVAS
    // ==========================================
    const modalReserva = document.getElementById('modal-reserva');
    const formReserva  = document.getElementById('form-reserva');
    let linhaReservaEmEdicao = null;   // guarda qual <tr> está sendo editada

    function abrirEdicaoReserva(botao) {
        // Encontra o <tr> que contém o botão clicado
        linhaReservaEmEdicao = botao.closest('tr');
        const cels = linhaReservaEmEdicao.querySelectorAll('td');

        // cels[0]=Pet, [1]=Dono, [2]=Check-in, [3]=Check-out, [4]=Status, [5]=Ações
        document.getElementById('form-reserva-pet').value      = cels[0].textContent.trim();
        document.getElementById('form-reserva-dono').value     = cels[1].textContent.trim();
        document.getElementById('form-reserva-checkin').value  = cels[2].textContent.trim();
        document.getElementById('form-reserva-checkout').value = cels[3].textContent.trim();

        // Descobre o status lendo a classe do <span class="status ...">
        const span = cels[4].querySelector('.status');
        const statusAtual = span.classList.contains('active')    ? 'active'
                          : span.classList.contains('pending')   ? 'pending'
                          : 'completed';
        document.getElementById('form-reserva-status').value = statusAtual;

        modalReserva.showModal();
    }

    formReserva.addEventListener('submit', (evento) => {
        evento.preventDefault();   // impede o reload da página

        const cels = linhaReservaEmEdicao.querySelectorAll('td');

        // 1. Atualiza os textos das células
        cels[0].textContent = document.getElementById('form-reserva-pet').value;
        cels[1].textContent = document.getElementById('form-reserva-dono').value;
        cels[2].textContent = document.getElementById('form-reserva-checkin').value;
        cels[3].textContent = document.getElementById('form-reserva-checkout').value;

        // 2. Atualiza o badge de status (classe + texto)
        const novoStatus = document.getElementById('form-reserva-status').value;
        const rotulos = { active: 'Ativa', pending: 'Pendente', completed: 'Finalizada' };
        const span = cels[4].querySelector('.status');
        span.className = 'status ' + novoStatus;
        span.textContent = rotulos[novoStatus];

        modalReserva.close();

        // 3. Se havia uma busca ativa, refiltra para refletir a mudança
        const busca = document.getElementById('busca-reserva');
        if (busca.value.trim() !== '') {
            busca.dispatchEvent(new Event('input'));
        }
    });

    document.getElementById('btn-cancelar-reserva')
        .addEventListener('click', () => modalReserva.close());

    // Liga cada botão ✏️ da tabela de reservas
    document.querySelectorAll('#tbody-reservas .btn-edit')
        .forEach(btn => btn.addEventListener('click', () => abrirEdicaoReserva(btn)));
            // ==========================================
    // 7. EDIÇÃO DE USUÁRIOS
    // ==========================================
    const modalUsuario = document.getElementById('modal-usuario');
    const formUsuario  = document.getElementById('form-usuario');
    let linhaUsuarioEmEdicao = null;

    function abrirEdicaoUsuario(botao) {
        linhaUsuarioEmEdicao = botao.closest('tr');
        const cels = linhaUsuarioEmEdicao.querySelectorAll('td');

        // cels[0]=Nome, [1]=E-mail, [2]=Função, [3]=Status, [4]=Ações
        document.getElementById('form-usuario-nome').value  = cels[0].textContent.trim();
        document.getElementById('form-usuario-email').value = cels[1].textContent.trim();

        // Descobre a função lendo a classe do <span class="role ...">
        const spanRole = cels[2].querySelector('.role');
        const roleAtual = spanRole.classList.contains('manager')  ? 'manager'
                        : spanRole.classList.contains('employee') ? 'employee'
                        : 'client';
        document.getElementById('form-usuario-role').value = roleAtual;

        // Descobre o status lendo a classe do <span class="status ...">
        const spanStatus = cels[3].querySelector('.status');
        document.getElementById('form-usuario-status').value =
            spanStatus.classList.contains('active') ? 'active' : 'inactive';

        modalUsuario.showModal();
    }

    formUsuario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const cels = linhaUsuarioEmEdicao.querySelectorAll('td');

        // Nome e e-mail
        cels[0].textContent = document.getElementById('form-usuario-nome').value;
        cels[1].textContent = document.getElementById('form-usuario-email').value;

        // Badge de função
        const novaRole = document.getElementById('form-usuario-role').value;
        const rotulosRole = { manager: 'Gerente', employee: 'Funcionário', client: 'Cliente' };
        const spanRole = cels[2].querySelector('.role');
        spanRole.className = 'role ' + novaRole;
        spanRole.textContent = rotulosRole[novaRole];

        // Badge de status
        const novoStatus = document.getElementById('form-usuario-status').value;
        const spanStatus = cels[3].querySelector('.status');
        spanStatus.className = 'status ' + novoStatus;
        spanStatus.textContent = novoStatus === 'active' ? 'Ativo' : 'Inativo';

        modalUsuario.close();

        const busca = document.getElementById('busca-usuario');
        if (busca.value.trim() !== '') {
            busca.dispatchEvent(new Event('input'));
        }
    });

    document.getElementById('btn-cancelar-usuario')
        .addEventListener('click', () => modalUsuario.close());

    document.querySelectorAll('#tbody-usuarios .btn-edit')
        .forEach(btn => btn.addEventListener('click', () => abrirEdicaoUsuario(btn)));
});