/**
 * js
 * ==
 *
 * Склеивает *js*-файлы по deps'ам, сохраняет в виде `?.js`.
 * Не добавляет вокруг файлов обёртку с комменариями пути.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — 'js'.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb/techs/js'));
 * ```
 */
module.exports = require('../node_modules/enb/lib/build-flow').create()
    .name('js')
    .target('target', '?.js')
    .useFileList('js')
    .justJoinFiles()
    .createTech();
