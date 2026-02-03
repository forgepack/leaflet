# 🗺️ _@forgepack/leaflet_


[![npm version](https://img.shields.io/npm/v/@forgepack/leaflet?color=blue)](https://www.npmjs.com/package/@forgepack/leaflet)
[![npm downloads](https://img.shields.io/npm/dm/@forgepack/leaflet)](https://www.npmjs.com/package/@forgepack/leaflet)
[![GitHub stars](https://img.shields.io/github/stars/forgepack/request?style=social)](https://github.com/forgepack/request)
[![license](https://img.shields.io/npm/l/@forgepack/leaflet)](https://github.com/forgepack/request/blob/main/LICENSE)

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-JS_Map_Library-199900?logo=leaflet)](https://leafletjs.com/)


[Documentation](https://forgepack.dev/packages/request) • [NPM Package](https://www.npmjs.com/package/@forgepack/leaflet) • [GitHub](https://github.com/forgepack/request) • [Report Bug](https://github.com/forgepack/request/issues)

## Description

A versatile toolkit for **geospatial data visualization and analysis**, designed to support real-time monitoring, decision-making, and interdisciplinary applications.  
Perfect for **maritime operations, hydrographic surveys, nautical charts, ship tracking, and marine navigation systems**.

### Necessary Tech stack:

|Name                 | Source | File name version		      |Link for download
|:-------------------:|-------:|---------------------------:|:-----------------
|`typescript`         |language|                            |https://www.typescriptlang.org/
|`node`			          | engine |node-v22.20.0-x64.msi			  |https://nodejs.org/en/download
|`visual studio code` |  IDE   |VSCodeUserSetup-x64-1.105.0	|https://code.visualstudio.com/docs

## 🌊 About Forgepack Leaflet

Developed by the **_Forgepack_** for advancing maritime research, hydrographic surveying, and oceanographic studies. This toolkit supports our mission to enhance marine navigation safety and promote sustainable ocean use.

![Alt Print 000](https://github.com/forgepack/leaflet/blob/main/src/image/print.png "Print 000")

## Sumary
* [Quick start](#quick-start)
* [Roadmap](#roadmap)
* [Developer setup](#developer-setup)
* [Git setup for developer](#git-setup-for-developer)
* [Contributing](#contributing)
* [Developers](#developers)
* [Licence](#licence)

## Quick start
Installation
```bash
npm install @forgepack/leaflet
```
basic usage
```javascript
import { MapComponent } from '@forgepack/leaflet';

function App() {
  return (
	<Map />
  );
}
```

## Roadmap
### 🚧 in development
- [x] hospedagem: vercel;
- [x] visualização de clusters de pontos;
- [x] visualização de linhas (rotas, conexões) no mapa;
- [x] visualização de imagens georeferenciadas;
- [x] visualização de polígonos (áreas, regiões) no mapa;
- [x] upload de dados (txt, CSV, GeoJSON, Shapefiles, KML/KMZ): em colunas de latitude/longitude;
- [x] cálculo de distâncias;
- [x] desenho derrota;
- [ ] lighthouses, tide stations, and ETA calculations
- [ ] ship Tracking - real-time vessel monitoring and trackin
- [ ] controle de opacidade da layer;
- [ ] integração com APIs de dados externos: AIS
- [ ] alertas de colisão baseados em rotas;
- [ ] otimização de rotas considerando correntes e clima;
- [ ] pontos coloridos por valor;
- [ ] popups com detalhes ao clicar;
- [ ] correntes marítimas com vetores animados;
- [ ] heatmaps (densidade de dados: população, temperatura, profundidade);
- [ ] painel lateral com estatísticas;
- [ ] gráficos sincronizados com o mapa (ao selecionar área, atualiza gráficos)
- [ ] pesquisa rápida
- [ ] filtros dinâmicos em tempo real;
- [ ] filtros por data, categoria, região;
- [ ] consultas espaciais ("dentro de", "próximo a");
- [ ] slider range da timeline para visualização de dados históricos
- [ ] exportação de visualização de imagens, relatórios [pdf, txt];

### 💡 in concept
- [ ] workspaces salvos na nuvem, privado ou compartilhado
- [ ] compartilhamento de visualizações via link
- [ ] anotações colaborativas no mapa
- [ ] salvar/recuperar workspace;
- [ ] compartilhamento de dashboards
- [ ] salvamento de configurações

## Developer setup
```bash
npm install tslib leaflet
npm install --save-dev @types/leaflet
npm install --save-dev rollup @rollup/plugin-url @rollup/plugin-typescript rollup-plugin-postcss 
```

## Complete Documentation

For detailed examples, usage guides, and API references, please visit:
**[Complete Documentation](./docs/README.md)**

# Developer usage

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone repository
git clone https://github.com/forgepack/leaflet.git
cd leaflet

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## **Author and Developers**
- GitHub: [Gadelha TI](https://github.com/gadelhati)
- Website: [forgepack.dev](https://forgepack.dev)

## **License**

This project is licensed under the **MIT License** - see the [MIT LICENSE]( https://choosealicense.com/licenses/mit/) file for details.

```txt
MIT License

Copyright (c) 2020 Jason Watmore

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

<div align="center">

**⭐ Did you like the project? Leave a star! ⭐**

Made with ❤️ by the Forgepack team

[Documentation](https://forgepack.dev/packages/leaflet) • [NPM](https://www.npmjs.com/package/@forgepack/leaflet) • [GitHub](https://github.com/forgepack/leaflet) • [Issues](https://github.com/forgepack/leaflet/issues)

</div>
