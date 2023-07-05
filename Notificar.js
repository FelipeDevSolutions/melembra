const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const player = require('play-sound')(opts = {});


// Caminho completo para o arquivo de áudio
const audioFilePath = path.resolve('C:\\Users\\felip\\OneDrive\\Documentos\\Projetos VS Code Studio\\Notificar java\\Nova requisição Base Laboratórios - FX.mp3');

// Variáveis adicionais para controlar a reprodução do áudio
let reproduzirAudio = false;
let ultimoValorReproduzido = null;

(async () => {
  // Definir o caminho do executável do Chromium
  process.env['PLAYWRIGHT_CHROMIUM_PATH'] = 'C:\\Users\\felip\\AppData\\Local\\ms-playwright\\chromium-1067\\chrome-win\\chrome.exe';

  // Inicializar o navegador e abrir uma nova página
  const browser = await chromium.launch({ headless: false }); // Defina headless: true se quiser que o navegador seja executado em segundo plano
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navegar para a página de login
  await page.goto('https://unimedfortaleza.neovero.com/login');

  // Preencher os campos de login
  await page.fill('input[type="text"]', 'gestor.unimed');
  await page.fill('input[type="password"]', 'unimed');

  // Clicar no botão de login
  await page.click('button[type="submit"]');

  // Aguardar o carregamento da segunda página
  await page.waitForTimeout(10000); // Você pode ajustar esse tempo de espera se necessário

  // Aguardar o redirecionamento para a página principal
  await page.waitForSelector('[data-empresaid="4"]', { state: 'visible' });
  await page.click('[data-empresaid="4"]');

  // Aguardar o carregamento da segunda página
  await page.waitForTimeout(10000); // Você pode ajustar esse tempo de espera se necessário

  // Navegar para o painel desejado
  await page.goto('https://unimedfortaleza.neovero.com/dashboards?id=11&fullscreen=S&mobile=N');
  await page.waitForTimeout(10000);


  let qtdRequisicao = null;

  // Loop principal
  while (true) {
    // Localizar o elemento
    const elementos = await page.$$('.dx-flex-card-layout-row-element.dx-carditem-default-color.dx-flex-card-layout-row-element-DataItem1-0_0');

    if (elementos.length > 2) {
      const novoQtdRequisicao = await elementos[2].textContent();

      // Verificar se houve uma alteração na variável qtdRequisicao
      if (novoQtdRequisicao !== qtdRequisicao) {
        qtdRequisicao = novoQtdRequisicao;

        if (novoQtdRequisicao !== '0' && await elementos[2].isVisible()) {
          if (ultimoValorReproduzido === null || parseInt(novoQtdRequisicao) > parseInt(ultimoValorReproduzido)) {
            reproduzirAudio = true;
          } else {
            reproduzirAudio = false;
          }
        } else {
          reproduzirAudio = false;
        }

        console.log(qtdRequisicao);

        if (reproduzirAudio) {
            // Reproduzir o áudio usando a biblioteca play-sound
            player.play(audioFilePath, (err) => {
              if (err) {
                console.error('Erro ao reproduzir o áudio:', err);
              } else {
                ultimoValorReproduzido = novoQtdRequisicao;
              }
            });
          }
          
      }
    }

    await page.waitForTimeout(3000); // Aguardar 3 segundos antes de verificar novamente

    // Passar o mouse sobre a div "edge-menu"
    const divMenu = await page.$('.edge-menu');
    if (divMenu) {
      await divMenu.hover();
    } else {
      console.log('A div "edge-menu" não foi encontrada.');
    }

    // Aguardar um tempo para que a div "edge-menu" seja exibida
    await page.waitForTimeout(3000);

    // Clicar no elemento com o ID "atualizar"
    const elementoAtualizar = await page.$('//*[@id="atualizar"]');
    if (elementoAtualizar) {
      await elementoAtualizar.scrollIntoViewIfNeeded();
      await elementoAtualizar.waitForElementState('visible');
      await elementoAtualizar.click();
      await page.waitForTimeout(20000);
    } else if (!elementos || !(await elementos[2].isVisible())) {
      const elementoAtualizar = await page.$('//*[@id="atualizar"]');
      if (elementoAtualizar) {
        await elementoAtualizar.scrollIntoViewIfNeeded();
        await elementoAtualizar.waitForElementState('visible');
        await elementoAtualizar.click();
        await page.waitForTimeout(20000);
      } else {
        console.log('O elemento "atualizar" não foi encontrado.');
      }
    } else {
      console.log('O elemento "atualizar" não foi encontrado.');
    }
  }

  await browser.close();
})();
