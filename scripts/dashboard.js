// Configuração do Supabase
const SUPABASE_URL = 'https://hwkzksxqxnbqjfeenvbp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3a3prc3hxeG5icWpmZWVudmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDY4NDQsImV4cCI6MjA2MTUyMjg0NH0.oFlDCK6Xy0KtC8ti_-xV1NZUGvT7IlzEaNxIDS9cbUk';

// Valores base
const RENT_VALUE = 1200.00;
const CONDOMINIUM_VALUE = 350.00;

// Inicializar o cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos DOM
const logoutButton = document.getElementById('logout-button');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const welcomeName = document.getElementById('welcome-name');
const welcomeRent = document.getElementById('welcome-rent');
const condominiumStatus = document.getElementById('condominium-status');
const rentStatus = document.getElementById('rent-status');
const discountText = document.getElementById('discount-text');
const accountSince = document.getElementById('account-since');
const profileAvatar = document.querySelector('.profile-avatar span');
const notificationBadge = document.querySelector('.notification-badge');
const downloadBoletoBtn = document.getElementById('download-boleto');
const reportIssueBtn = document.getElementById('report-issue');

// Verificar autenticação e buscar dados do usuário
async function checkAuth() {
    // Verificar se há um ID de usuário no sessionStorage
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
        // Se não houver userId no sessionStorage, redirecionar para a página de login
        window.location.href = 'index.html';
        return;
    }
    
    // Se houver usuário no sessionStorage, buscar os dados do banco
    await fetchUserData(userId);
}

// Buscar dados do usuário via Supabase
async function fetchUserData(userId) {
    try {
        // Obter os dados do usuário da tabela usuarios pelo ID
        const { data: user, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (userError) {
            console.error('Erro ao buscar dados do usuário:', userError);
            showNotification('Não foi possível carregar seus dados. Tente novamente mais tarde.');
            return;
        }
        
        if (user) {
            // Atualizar a interface com os dados do usuário
            updateDashboard(user);
        } else {
            console.error('Usuário não encontrado no banco de dados');
            showNotification('Perfil não encontrado. Entre em contato com o administrador.');
            // Redirecionar para login se o usuário não for encontrado
            sessionStorage.removeItem('userId');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao processar dados do usuário:', error);
        showNotification('Ocorreu um erro ao processar seus dados.');
    }
}

// Atualizar o dashboard com os dados do usuário
function updateDashboard(userData) {
    // Atualizar nome de boas-vindas
    const firstName = userData.nome.split(' ')[0];
    welcomeName.textContent = `Bem-vindo(a), ${firstName}!`;
    welcomeRent.textContent = `Aluguel: R$ ${RENT_VALUE.toFixed(2).replace('.', ',')}`;
    
    // Atualizar avatar com iniciais
    const nameParts = userData.nome.split(' ');
    const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
        : nameParts[0].substring(0, 2);
    profileAvatar.textContent = initials.toUpperCase();
    
    // Atualizar data de registro
    const registrationDate = new Date(userData.data_registro);
    const formattedDate = registrationDate.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    accountSince.textContent = `Morador desde: ${formattedDate}`;
    
    // Atualizar status de pagamentos
    updatePaymentStatus(condominiumStatus, userData.pendencia_condominio);
    updatePaymentStatus(rentStatus, userData.pendencia_aluguel);
    
    // Atualizar informações de desconto
    updateDiscountInfo(userData.desconto, userData.pendencia_aluguel);
    
    // Verificar se há pendências para exibir notificações
    const pendingPayments = (userData.pendencia_aluguel ? 1 : 0) + 
                            (userData.pendencia_condominio ? 1 : 0);
    
    if (pendingPayments > 0) {
        notificationBadge.textContent = pendingPayments;
        notificationBadge.style.display = 'flex';
    } else {
        notificationBadge.style.display = 'none';
    }
}

// Atualizar o status de pagamento
function updatePaymentStatus(element, hasPendency) {
    const statusBadge = element.querySelector('.status-badge');
    
    if (hasPendency) {
        statusBadge.textContent = 'PENDENTE';
        statusBadge.className = 'status-badge pending';
    } else {
        statusBadge.textContent = 'PAGO';
        statusBadge.className = 'status-badge paid';
    }
}

// Atualizar informações de desconto
function updateDiscountInfo(discountValue, hasPendencyRent) {
    if (discountValue > 0) {
        const targetPayment = hasPendencyRent ? 'aluguel' : 'condomínio';
        discountText.textContent = `R$ ${discountValue.toFixed(2).replace('.', ',')} de desconto no ${targetPayment}`;
    } else {
        discountText.textContent = 'Nenhum desconto aplicado no momento.';
    }
}

// Mostrar notificação no painel
function showNotification(message) {
    // Poderia ser implementada com uma biblioteca de toast ou uma notificação personalizada
    alert(message);
}

// Função para logout
function handleLogout() {
    // Limpar a sessão do usuário
    sessionStorage.removeItem('userId');
    
    // Redirecionar para a página de login
    window.location.href = 'index.html';
}

// Função para alternar o tema
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    updateThemeIcon();
    
    // Salvar a preferência de tema no localStorage
    const isDarkMode = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode);
}

// Atualizar o ícone do tema
function updateThemeIcon() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação ao carregar a página
    checkAuth();
    
    // Carregar preferência de tema do localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === 'false') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
    
    updateThemeIcon();
    
    // Adicionar eventos aos botões
    logoutButton.addEventListener('click', handleLogout);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Adicionar evento para botões de ação
    if (downloadBoletoBtn) {
        downloadBoletoBtn.addEventListener('click', () => {
            showNotification('Funcionalidade em desenvolvimento: Geração de boleto');
        });
    }
    
    if (reportIssueBtn) {
        reportIssueBtn.addEventListener('click', () => {
            showNotification('Funcionalidade em desenvolvimento: Relatório de problemas');
        });
    }
});