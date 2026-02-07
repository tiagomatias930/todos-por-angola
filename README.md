# Nova Angola – GovTech Platform

Plataforma móvel desenvolvida com Expo e React Native que empodera cidadãos angolanos a reportar, validar e resolver desafios urbanos com apoio de inteligência artificial (Gemini). A solução integra funcionalidades de geolocalização, análise de imagens por IA, triagem de saúde e autenticação segura para fomentar ações comunitárias orientadas por dados em tempo real.

## Funcionalidades principais

- Mapa interativo que exibe áreas de risco com zonas destacadas por nível de confirmação comunitária.
- Pesquisa de endereços e centralização automática na localização atual do utilizador.
- Fluxo seguro de login, registo e confirmação via OTP antes de liberar ações sensíveis.
- Captura de imagens e envio de questionário contextual para registar novas áreas de risco.
- Painel modal com detalhes, imagens e botão de confirmação de cada ocorrência.
- Área de aprendizagem com chatbot simples para orientar utilizadores sobre boas práticas.

## Arquitetura tecnológica

- **Framework:** Expo (React Native + Expo Router) com TypeScript.
- **Gestão de estado local:** Hooks nativos (`useState`, `useEffect`) e `AsyncStorage` para persistir o token.
- **Serviços nativos:** `expo-location`, `expo-camera`, `expo-file-system`, `expo-media-library`.
- **UI:** `react-native-maps`, `lucide-react-native`, `@expo/vector-icons` e componentes próprios.
- **IA:** Google Gemini API para classificação de imagens e análise de sintomas de saúde.
- **Backend:** Supabase (PostgreSQL + Auth + Storage) para autenticação, upload de mídia, gestão de áreas de risco e perfis de utilizadores.

## Requisitos

- Node.js 18 LTS (ou superior compatível com Expo SDK 52).
- npm 8+ ou yarn 1.22+.
- Expo CLI (opcional, recomendado) instalado globalmente: `npm install -g expo-cli`.
- Android Studio, Xcode ou Expo Go para execução em dispositivos/emuladores.

## Como executar

```bash
git clone https://github.com/tiagomatias930/todos-por-angola.git
cd todos-por-angola/mapazzz
npm install
npx expo start
```

Use as teclas exibidas no terminal para abrir no Expo Go (`a` / `i`) ou emulador web (`w`).

### Scripts úteis

| Comando | Descrição |
| --- | --- |
| `npm run android` | Inicia o bundle no Expo e abre emulador Android configurado. |
| `npm run ios` | Inicia o bundle e abre simulador iOS (apenas macOS). |
| `npm run web` | Executa versão web experimental (React Native Web). |
| `npm test` | Roda testes com Jest Expo. |
| `npm run lint` | Executa validação estática com `expo lint`. |

## Configuração de APIs e chaves

- Os endpoints principais estão definidos diretamente nos módulos de ecrã: veja `API_URL` e rotas em `fetch` em [mapazzz/src/app/camera/index.tsx](mapazzz/src/app/camera/index.tsx), [mapazzz/src/app/Mapa/index.tsx](mapazzz/src/app/Mapa/index.tsx), [mapazzz/src/app/Login/index.tsx](mapazzz/src/app/Login/index.tsx) e [mapazzz/src/app/registo/index.tsx](mapazzz/src/app/registo/index.tsx).
- Para apontar para um backend próprio, substitua as URLs `https://bf40160dfbbd815a75c09a0c42a343c0.serveo.net/...` pelo domínio desejado ou extraia-as para variáveis de ambiente utilizando `expo-constants`.
- O token JWT do utilizador é persistido com a chave `BearerToken` via `AsyncStorage` e removido no logout.

## Fluxos de utilização

1. **Onboarding:** utilizador abre o app, visualiza tela inicial e acede ao mapa caso já possua sessão válida.
2. **Autenticação:** sem token, o utilizador é direcionado para o fluxo de login e OTP antes de poder reportar áreas de risco.
3. **Consulta de mapa:** mapa centraliza na localização atual, permite pesquisar bairros e visualizar detalhes em modal.
4. **Registo de risco:** botão central abre a câmara, recolhe foto e questionário, envia imagem ao servidor e cria nova área.
5. **Validação comunitária:** qualquer utilizador autenticado pode confirmar áreas existentes, incrementando o nível de risco exibido.
6. **Aprendizagem:** secção Aprender disponibiliza chatbot informativo com respostas rápidas predefinidas.

## Estrutura do projecto

```
mapazzz/
├─ app.json
├─ package.json
├─ assets/
│  └─ images/
├─ src/
│  ├─ app/
│  │  ├─ index.tsx
│  │  ├─ Mapa/
│  │  ├─ camera/
│  │  ├─ Login/
│  │  ├─ Otp/
│  │  ├─ registo/
│  │  └─ Aprender/
│  ├─ components/
│  │  ├─ Button/
│  │  ├─ Footer/
│  │  ├─ ImageViewer.tsx
│  │  └─ Questionario/
│  └─ context/
└─ tsconfig.json
```

## Testes e qualidade

- Execute `npm test` para validar componentes e lógica com Jest Expo.
- Utilize `npm run lint` antes de abrir PRs para garantir conformidade com regras do Expo.
- Ao desenvolver funcionalidades que consomem localização, teste em dispositivos físicos sempre que possível (permissões e sensores têm diferenças relevantes em emuladores).

## Próximos passos sugeridos

- Externalizar as URLs de API para ficheiros de configuração por ambiente.
- Implementar cache offline para exibição das áreas de risco sem conectividade.
- Automatizar workflows com Expo EAS para gerar builds de distribuição.
