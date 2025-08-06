$(document).ready(function() {
    /**
     * 
     */
    const $form = $('#qrcodeForm');
    const $nextBtn = $('#nextBtn');
    const $newQrCodeBtn = $('#newQrCodeBtn');
    const $qrcodePreview = $('#qrcodePreview');
    const $qrcodeContainer = $('#qrcodeContainer');
    const $loading = $('.loading');
    const $step1Tab = $('#step1-tab');
    const $step2Tab = $('#step2-tab');
    
    /** Inicializa os tooltips do Bootstrap */
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    /** Validação do formulário */
    $form.on('submit', function(e) {
        e.preventDefault();
        if (this.checkValidity()) {
            generateQRCode();
        }
        this.classList.add('was-validated');
    });
    
    /** Botão Próximo */
    $nextBtn.on('click', function() {
        const $btn = $(this);
        const form = $form[0];
        
        if (form.checkValidity()) {
            // Desabilita o botão e mostra o estado de carregamento
            $btn.prop('disabled', true);
            $btn.html('<span class="spinner-border spinner-border-sm icon-loading" role="status" aria-hidden="true"></span> Processando...');
            
            // Chama a função de gerar QR Code
            generateQRCode().finally(() => {
                // Restaura o botão após o processamento (tanto em caso de sucesso quanto de erro)
                $btn.prop('disabled', false);
                $btn.html('Próximo <i class="bi bi-arrow-right"></i>');
            });
        } else {
            // Adiciona a classe was-validated para mostrar as mensagens de validação
            form.classList.add('was-validated');
            // Rola até o primeiro campo inválido
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });
    
    // Variável para controlar se o QR Code foi gerado
    let qrCodeGenerated = false;

    // Previne a mudança manual para a aba de QR Code se não tiver sido gerado
    $step2Tab.on('click', function(e) {
        if (!qrCodeGenerated) {
            e.preventDefault();
            // Mostra a aba 1
            const tab = new bootstrap.Tab($step1Tab[0]);
            tab.show();
            
            // Mostra mensagem de erro
            Swal.fire({
                title: 'Atenção!',
                text: 'Por favor, preencha as informações e gere o QR Code primeiro.',
                icon: 'warning',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    });

    /** Botão Novo QR Code */
    $newQrCodeBtn.on('click', function() {
        // Volta para o passo 1
        const tab = new bootstrap.Tab($step1Tab[0]);
        tab.show();
        
        // Limpa os campos e reseta o estado
        $form[0].reset();
        $qrcodePreview.attr('src', '').hide();
        qrCodeGenerated = false;
    });
    
    /** Gera o QR Code */
    function generateQRCode() {
        return new Promise((resolve, reject) => {
            const linkPix = $('#linkPix').val().trim();
            const linkReferencia = $('#linkReferencia').val().trim();
            
            if (!linkPix || !linkReferencia) {
                Swal.fire({
                    title: 'Atenção!',
                    text: 'Por favor, preencha todos os campos obrigatórios.',
                    icon: 'warning',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                resolve(); // Resolve sem erro para permitir que o botão seja reativado
                return;
            }
            
            // Mostra o loading e esconde o container do QR Code
            $loading.show();
            $qrcodeContainer.hide();
            
            // Envia os dados para o servidor
            $.ajax({
                url: '/gerar-qrcode',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    linkPix: linkPix,
                    linkReferencia: linkReferencia
                }),
                success: function(response) {
                    if (response.success) {
                        // Esconde o loading e exibe o QR Code
                        $loading.hide();
                        $qrcodeContainer.show();
                        
                        // Define a imagem diretamente do base64
                        $qrcodePreview.attr('src', response.imageData).fadeIn();
                        
                        // Configura o botão de download para criar um link de download do base64
                        const downloadLink = document.createElement('a');
                        downloadLink.href = response.imageData;
                        downloadLink.download = 'qrcode-pix.jpg';
                        $('#downloadBtn').attr('href', response.imageData).attr('download', 'qrcode-pix.jpg');
                        
                        // Marca o passo 1 como concluído, atualiza o estado e vai para o passo 2
                        $step1Tab.addClass('completed');
                        qrCodeGenerated = true;
                        const tab = new bootstrap.Tab($step2Tab[0]);
                        tab.show();
                        
                        resolve(); // Resolve a Promise com sucesso
                    } else {
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Erro ao gerar o QR Code: ' + (response.error || 'Erro desconhecido'),
                            icon: 'error',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 5000,
                            timerProgressBar: true
                        });
                        $loading.hide();
                        resolve(); // Resolve mesmo em caso de erro para reativar o botão
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Erro na requisição:', error);
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Erro ao se comunicar com o servidor. Por favor, tente novamente.',
                        icon: 'error',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true
                    });
                    $loading.hide();
                    resolve(); // Resolve mesmo em caso de erro para reativar o botão
                }
            });
        });
    }
    
    // Inicialização
    $qrcodeContainer.hide();
});