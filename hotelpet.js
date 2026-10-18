// 1. Espera o HTML carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // 2. Seleciona todos os links do menu que possuem o atributo data-page
    const navLinks = document.querySelectorAll('.sidebar nav a[data-page]');

    // 3. Seleciona todas as seções de página (Dashboard, Reservas, Pets...)
    const pages = document.querySelectorAll('.page');

    // 4. Função que faz a troca de páginas
    function navegarPara(pageId) {
        // Esconder todas as páginas (remove .active de todas)
        pages.forEach(page => page.classList.remove('active'));

        // Mostrar apenas a página alvo (adiciona .active)
        const paginaAlvo = document.getElementById(pageId);
        if (paginaAlvo) {
            paginaAlvo.classList.add('active');
        }

        // Atualizar o link ativo no menu
        navLinks.forEach(link => {
            link.classList.remove('active'); 
            if (link.dataset.page === pageId) {
                link.classList.add('active'); 
            }
        });
    }

    // 5. Adiciona o evento de clique em cada link do menu
    navLinks.forEach(link => {
        link.addEventListener('click', (evento) => {
            evento.preventDefault(); 

            const pageId = link.dataset.page; 
            navegarPara(pageId);
        });
    });

    // 6. Exibe o Dashboard como página inicial ao carregar
    navegarPara('dashboard');
});