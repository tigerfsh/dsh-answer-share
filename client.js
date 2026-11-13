window.__ModuleLoader__.load({
  id: '@fushouhai/dsh-session-copy-plus',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    let createPortal = null
    try {
      const reactDom = require('react-dom')
      createPortal = typeof reactDom.createPortal === 'function' ? reactDom.createPortal : null
    } catch {
      createPortal = null
    }

    /** Locale namespace for the plugin's action and toast strings. */
    const NS = 'answer-share'
    /** Portable document typography shared by the clipboard HTML and the PNG. */
    const BASE_STYLE = 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"PingFang SC","Microsoft YaHei",sans-serif;'
      + 'font-size:14px;line-height:1.7;color:#1f2328;word-break:break-word;'
    const MONO = 'ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono","Courier New",monospace'
    /** Maximum bitmap height; taller answers are scaled down to fit the canvas. */
    const MAX_BITMAP_HEIGHT = 24000
    /** Maximum inlined image bytes in one output. */
    const MAX_IMAGE_BYTES = 4 * 1024 * 1024

    /** User-facing strings, kept in sync with the locale/*.json dictionaries. */
    const DICTIONARIES = {
      zh: {
        "action.image": "复制回答为图片",
        "action.more": "更多复制方式",
        "menu.image": "复制为图片（默认）",
        "menu.html": "复制为富文本 HTML",
        "menu.download": "下载 PNG 图片",
        "toast.imageCopied": "已复制回答图片，可直接粘贴到钉钉",
        "toast.imageCopiedScaled": "已复制回答图片（内容较长，已等比缩小）",
        "toast.imageDownloaded": "已下载回答图片",
        "toast.htmlCopied": "已复制富文本，可粘贴到支持 HTML 的应用",
        "toast.textCopied": "已复制纯文本（当前浏览器不支持富文本剪贴板）",
        "toast.noAnswer": "没有找到这条回答的内容",
        "toast.failed": "复制失败：{reason}",
        "toast.unknownError": "发生未知错误",
        "error.imageFetchFailed": "无法加载回答中的图片",
        "error.imageTooLarge": "回答中的图片过大",
        "error.readFailed": "无法读取回答中的图片",
        "error.rasterizeFailed": "无法渲染这条回答",
        "error.emptyAnswer": "这条回答没有内容",
        "error.canvasUnavailable": "当前浏览器无法使用画布",
        "error.pngEncodingFailed": "无法生成 PNG 图片",
        "error.clipboardUnavailable": "当前浏览器无法使用剪贴板"
      },
      en: {
        "action.image": "Copy answer as image",
        "action.more": "More copy options",
        "menu.image": "Copy as image (default)",
        "menu.html": "Copy as rich-text HTML",
        "menu.download": "Download PNG image",
        "toast.imageCopied": "Answer image copied. Paste it into DingTalk.",
        "toast.imageCopiedScaled": "Answer image copied (scaled down for a very long answer).",
        "toast.imageDownloaded": "Answer image downloaded.",
        "toast.htmlCopied": "Rich text copied. Paste it into an HTML-aware editor.",
        "toast.textCopied": "Plain text copied (this browser has no rich-text clipboard).",
        "toast.noAnswer": "Could not find this answer's content.",
        "toast.failed": "Copy failed: {reason}",
        "toast.unknownError": "An unexpected error occurred.",
        "error.imageFetchFailed": "Could not load an image from the answer.",
        "error.imageTooLarge": "An image in the answer is too large.",
        "error.readFailed": "Could not read an image from the answer.",
        "error.rasterizeFailed": "Could not render the answer.",
        "error.emptyAnswer": "The answer is empty.",
        "error.canvasUnavailable": "Canvas is unavailable in this browser.",
        "error.pngEncodingFailed": "Could not generate the PNG image.",
        "error.clipboardUnavailable": "Clipboard is unavailable in this browser."
      },
      ja: {
        "action.image": "回答を画像としてコピー",
        "action.more": "その他のコピー方法",
        "menu.image": "画像としてコピー（既定）",
        "menu.html": "リッチテキスト HTML としてコピー",
        "menu.download": "PNG 画像をダウンロード",
        "toast.imageCopied": "回答画像をコピーしました。DingTalk に貼り付けられます。",
        "toast.imageCopiedScaled": "回答画像をコピーしました（長い回答のため縮小しています）。",
        "toast.imageDownloaded": "回答画像をダウンロードしました。",
        "toast.htmlCopied": "リッチテキストをコピーしました。HTML に対応したアプリに貼り付けられます。",
        "toast.textCopied": "プレーンテキストをコピーしました（このブラウザーはリッチテキストのクリップボードに対応していません）。",
        "toast.noAnswer": "この回答の内容が見つかりませんでした。",
        "toast.failed": "コピーに失敗しました：{reason}",
        "toast.unknownError": "予期しないエラーが発生しました。",
        "error.imageFetchFailed": "回答内の画像を読み込めませんでした。",
        "error.imageTooLarge": "回答内の画像が大きすぎます。",
        "error.readFailed": "回答内の画像を読み取れませんでした。",
        "error.rasterizeFailed": "回答を描画できませんでした。",
        "error.emptyAnswer": "回答が空です。",
        "error.canvasUnavailable": "このブラウザーでは Canvas を利用できません。",
        "error.pngEncodingFailed": "PNG 画像を生成できませんでした。",
        "error.clipboardUnavailable": "このブラウザーではクリップボードを利用できません。"
      },
      es: {
        "action.image": "Copiar respuesta como imagen",
        "action.more": "Más opciones de copia",
        "menu.image": "Copiar como imagen (predeterminado)",
        "menu.html": "Copiar como HTML con formato",
        "menu.download": "Descargar imagen PNG",
        "toast.imageCopied": "Imagen de la respuesta copiada. Pégala en DingTalk.",
        "toast.imageCopiedScaled": "Imagen de la respuesta copiada (reducida por ser una respuesta muy larga).",
        "toast.imageDownloaded": "Imagen de la respuesta descargada.",
        "toast.htmlCopied": "Texto enriquecido copiado. Pégalo en un editor compatible con HTML.",
        "toast.textCopied": "Texto sin formato copiado (este navegador no admite portapapeles con formato).",
        "toast.noAnswer": "No se encontró el contenido de esta respuesta.",
        "toast.failed": "Error al copiar: {reason}",
        "toast.unknownError": "Se produjo un error inesperado.",
        "error.imageFetchFailed": "No se pudo cargar una imagen de la respuesta.",
        "error.imageTooLarge": "Una imagen de la respuesta es demasiado grande.",
        "error.readFailed": "No se pudo leer una imagen de la respuesta.",
        "error.rasterizeFailed": "No se pudo renderizar la respuesta.",
        "error.emptyAnswer": "La respuesta está vacía.",
        "error.canvasUnavailable": "Canvas no está disponible en este navegador.",
        "error.pngEncodingFailed": "No se pudo generar la imagen PNG.",
        "error.clipboardUnavailable": "El portapapeles no está disponible en este navegador."
      },
      fr: {
        "action.image": "Copier la réponse en image",
        "action.more": "Plus d'options de copie",
        "menu.image": "Copier en image (par défaut)",
        "menu.html": "Copier en HTML enrichi",
        "menu.download": "Télécharger l'image PNG",
        "toast.imageCopied": "Image de la réponse copiée. Collez-la dans DingTalk.",
        "toast.imageCopiedScaled": "Image de la réponse copiée (réduite car la réponse est très longue).",
        "toast.imageDownloaded": "Image de la réponse téléchargée.",
        "toast.htmlCopied": "Texte enrichi copié. Collez-le dans un éditeur compatible HTML.",
        "toast.textCopied": "Texte brut copié (ce navigateur ne prend pas en charge le presse-papiers enrichi).",
        "toast.noAnswer": "Impossible de trouver le contenu de cette réponse.",
        "toast.failed": "Échec de la copie : {reason}",
        "toast.unknownError": "Une erreur inattendue s'est produite.",
        "error.imageFetchFailed": "Impossible de charger une image de la réponse.",
        "error.imageTooLarge": "Une image de la réponse est trop volumineuse.",
        "error.readFailed": "Impossible de lire une image de la réponse.",
        "error.rasterizeFailed": "Impossible d'afficher la réponse.",
        "error.emptyAnswer": "La réponse est vide.",
        "error.canvasUnavailable": "Canvas n'est pas disponible dans ce navigateur.",
        "error.pngEncodingFailed": "Impossible de générer l'image PNG.",
        "error.clipboardUnavailable": "Le presse-papiers n'est pas disponible dans ce navigateur."
      },
      de: {
        "action.image": "Antwort als Bild kopieren",
        "action.more": "Weitere Kopieroptionen",
        "menu.image": "Als Bild kopieren (Standard)",
        "menu.html": "Als Rich-Text-HTML kopieren",
        "menu.download": "PNG-Bild herunterladen",
        "toast.imageCopied": "Antwortbild kopiert. Füge es in DingTalk ein.",
        "toast.imageCopiedScaled": "Antwortbild kopiert (für eine sehr lange Antwort verkleinert).",
        "toast.imageDownloaded": "Antwortbild heruntergeladen.",
        "toast.htmlCopied": "Rich-Text kopiert. Füge ihn in einen HTML-fähigen Editor ein.",
        "toast.textCopied": "Nur Text kopiert (dieser Browser unterstützt keine Rich-Text-Zwischenablage).",
        "toast.noAnswer": "Der Inhalt dieser Antwort wurde nicht gefunden.",
        "toast.failed": "Kopieren fehlgeschlagen: {reason}",
        "toast.unknownError": "Ein unerwarteter Fehler ist aufgetreten.",
        "error.imageFetchFailed": "Ein Bild der Antwort konnte nicht geladen werden.",
        "error.imageTooLarge": "Ein Bild der Antwort ist zu groß.",
        "error.readFailed": "Ein Bild der Antwort konnte nicht gelesen werden.",
        "error.rasterizeFailed": "Die Antwort konnte nicht gerendert werden.",
        "error.emptyAnswer": "Die Antwort ist leer.",
        "error.canvasUnavailable": "Canvas ist in diesem Browser nicht verfügbar.",
        "error.pngEncodingFailed": "Das PNG-Bild konnte nicht erzeugt werden.",
        "error.clipboardUnavailable": "Die Zwischenablage ist in diesem Browser nicht verfügbar."
      },
      ru: {
        "action.image": "Скопировать ответ как изображение",
        "action.more": "Другие способы копирования",
        "menu.image": "Копировать как изображение (по умолчанию)",
        "menu.html": "Копировать как форматированный HTML",
        "menu.download": "Скачать PNG-изображение",
        "toast.imageCopied": "Изображение ответа скопировано. Вставьте его в DingTalk.",
        "toast.imageCopiedScaled": "Изображение ответа скопировано (уменьшено из-за большого размера ответа).",
        "toast.imageDownloaded": "Изображение ответа скачано.",
        "toast.htmlCopied": "Форматированный текст скопирован. Вставьте его в редактор с поддержкой HTML.",
        "toast.textCopied": "Скопирован простой текст (браузер не поддерживает форматированный буфер обмена).",
        "toast.noAnswer": "Не удалось найти содержимое этого ответа.",
        "toast.failed": "Не удалось скопировать: {reason}",
        "toast.unknownError": "Произошла непредвиденная ошибка.",
        "error.imageFetchFailed": "Не удалось загрузить изображение из ответа.",
        "error.imageTooLarge": "Изображение в ответе слишком большое.",
        "error.readFailed": "Не удалось прочитать изображение из ответа.",
        "error.rasterizeFailed": "Не удалось отрисовать ответ.",
        "error.emptyAnswer": "Ответ пуст.",
        "error.canvasUnavailable": "Canvas недоступен в этом браузере.",
        "error.pngEncodingFailed": "Не удалось создать PNG-изображение.",
        "error.clipboardUnavailable": "Буфер обмена недоступен в этом браузере."
      },
      pt: {
        "action.image": "Copiar resposta como imagem",
        "action.more": "Mais opções de cópia",
        "menu.image": "Copiar como imagem (padrão)",
        "menu.html": "Copiar como HTML formatado",
        "menu.download": "Baixar imagem PNG",
        "toast.imageCopied": "Imagem da resposta copiada. Cole no DingTalk.",
        "toast.imageCopiedScaled": "Imagem da resposta copiada (reduzida por ser uma resposta muito longa).",
        "toast.imageDownloaded": "Imagem da resposta baixada.",
        "toast.htmlCopied": "Texto formatado copiado. Cole em um editor compatível com HTML.",
        "toast.textCopied": "Texto simples copiado (este navegador não oferece suporte a área de transferência formatada).",
        "toast.noAnswer": "Não foi possível encontrar o conteúdo desta resposta.",
        "toast.failed": "Falha ao copiar: {reason}",
        "toast.unknownError": "Ocorreu um erro inesperado.",
        "error.imageFetchFailed": "Não foi possível carregar uma imagem da resposta.",
        "error.imageTooLarge": "Uma imagem da resposta é muito grande.",
        "error.readFailed": "Não foi possível ler uma imagem da resposta.",
        "error.rasterizeFailed": "Não foi possível renderizar a resposta.",
        "error.emptyAnswer": "A resposta está vazia.",
        "error.canvasUnavailable": "O Canvas não está disponível neste navegador.",
        "error.pngEncodingFailed": "Não foi possível gerar a imagem PNG.",
        "error.clipboardUnavailable": "A área de transferência não está disponível neste navegador."
      },
    }

    /** Host theme token styling for the action, menu, and toast. */
    const CSS = `
      .dsh-ans-share{display:inline-flex;align-items:center;gap:1px;position:relative;flex:0 0 auto}
      .dsh-ans-share-main,.dsh-ans-share-caret{display:inline-flex;align-items:center;justify-content:center;height:calc(28px + var(--dsh-content-font-delta,0px));padding:0;border:none;border-radius:var(--dsw-radius-sm,6px);background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;font:inherit}
      .dsh-ans-share-main{width:calc(28px + var(--dsh-content-font-delta,0px))}
      .dsh-ans-share-caret{width:15px;opacity:.72}
      .dsh-ans-share-main svg{width:calc(17px + var(--dsh-content-font-delta,0px));height:calc(17px + var(--dsh-content-font-delta,0px))}
      .dsh-ans-share-caret svg{width:11px;height:11px}
      .dsh-ans-share-main:hover,.dsh-ans-share-caret:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}
      .dsh-ans-share-main:focus-visible,.dsh-ans-share-caret:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
      .dsh-ans-share[data-busy] .dsh-ans-share-main,.dsh-ans-share[data-busy] .dsh-ans-share-caret{opacity:.45;cursor:default;pointer-events:none}
      .dsh-ans-menu{position:fixed;z-index:10000;min-width:204px;padding:5px;display:flex;flex-direction:column;gap:2px;background:var(--dsw-alias-bg-overlay,#fff);border:1px solid var(--dsw-alias-border-l1,#e5e7eb);border-radius:10px;box-shadow:0 10px 28px rgba(0,0,0,.16)}
      .dsh-ans-menu button{display:flex;align-items:center;width:100%;padding:8px 10px;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary,#111);font:inherit;font-size:13px;line-height:1.4;text-align:left;cursor:pointer}
      .dsh-ans-menu button:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06))}
      .dsh-ans-menu button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-1px}
      .dsh-ans-toast{position:fixed;left:50%;bottom:112px;z-index:10001;max-width:min(80vw,560px);padding:9px 14px;border-radius:8px;background:var(--dsw-alias-bg-overlay,#fff);border:1px solid var(--dsw-alias-border-l1,#e5e7eb);box-shadow:0 8px 24px rgba(0,0,0,.14);color:var(--dsw-alias-label-primary,#111);font-size:13px;line-height:1.5;transform:translateX(-50%);pointer-events:none}
      .dsh-ans-toast[data-tone="success"]{border-color:var(--dsw-alias-state-success-primary,#12805c)}
      .dsh-ans-toast[data-tone="warn"]{border-color:var(--dsw-alias-state-warn-primary,#b7791f)}
      .dsh-ans-toast[data-tone="error"]{border-color:var(--dsw-alias-state-error-primary,#d92d20);color:var(--dsw-alias-state-error-primary,#d92d20)}
    `

    /** Transient bottom-center feedback element; one at a time. */
    let toastElement = null
    let toastTimer = null

    function showToast(message, tone) {
      if (document.body === null) return
      if (toastElement === null) {
        toastElement = document.createElement('div')
        toastElement.className = 'dsh-ans-toast'
        toastElement.setAttribute('role', 'status')
        document.body.appendChild(toastElement)
      }
      toastElement.textContent = message
      toastElement.dataset.tone = tone ?? 'default'
      if (toastTimer !== null) clearTimeout(toastTimer)
      toastTimer = setTimeout(() => {
        toastTimer = null
        if (toastElement !== null) {
          toastElement.remove()
          toastElement = null
        }
      }, 2600)
    }

    function disposeToast() {
      if (toastTimer !== null) clearTimeout(toastTimer)
      toastTimer = null
      if (toastElement !== null) {
        toastElement.remove()
        toastElement = null
      }
    }

    /** An expected failure whose user-facing reason is a locale key. */
    class LocalizedError extends Error {
      constructor(key) {
        super(key)
        this.name = 'LocalizedError'
        this.localeKey = key
      }
    }

    /** Resolve a caught failure without leaking untranslated internal messages. */
    function errorReason(error, t) {
      if (error instanceof LocalizedError) return t(error.localeKey)
      console.error('[@fushouhai/dsh-session-copy-plus]', error)
      return t('toast.unknownError')
    }

    function nextFrame() {
      return new Promise((resolve) => {
        let settled = false
        const finish = () => {
          if (settled) return
          settled = true
          resolve()
        }
        if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => requestAnimationFrame(finish))
        setTimeout(finish, 80)
      })
    }

    /** Find the finalized answer flow item that owns the clicked/rendered action. */
    function findAnswerNode(from) {
      const turnTail = from.closest('[data-chat-flow-kind="turn-tail"]')
      if (turnTail === null) return null
      const flow = turnTail.closest('[data-slot="conversation.chat.flow"]')
        ?? turnTail.parentElement
        ?? document
      const turn = turnTail.getAttribute('data-chat-turn')
      const nodes = Array.from(flow.querySelectorAll('[data-chat-flow-kind="assistant-step"]'))
      const before = nodes.filter(node =>
        (node.compareDocumentPosition(turnTail) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0)
      const sameTurn = turn === null
        ? before
        : before.filter(node => node.getAttribute('data-chat-turn') === turn)
      const answers = sameTurn.filter(node => node.getAttribute('data-chat-group-part') !== 'reasoning')
      return answers[answers.length - 1] ?? sameTurn[sameTurn.length - 1] ?? null
    }

    function safeHref(value) {
      if (value === null) return null
      const href = value.trim()
      if (href === '') return null
      if (/^(https?:|mailto:)/i.test(href)) return href
      if (href.startsWith('#') || href.startsWith('/')) return href
      return null
    }

    /** Clone the answer, drop chat chrome, and keep only portable attributes. */
    function cleanClone(node) {
      const clone = node.cloneNode(true)
      const drop = [
        'button', '[role="button"]', '[data-variant="think"]', '[data-turn-process-inline]',
        '[data-shimmer-decoration]', '[aria-hidden="true"]', '[hidden]', 'input',
        'textarea', 'select', 'noscript',
      ]
      for (const selector of drop) {
        for (const element of Array.from(clone.querySelectorAll(selector))) element.remove()
      }
      // Code-block cards carry a banner and toolbar; keep only their code body.
      for (const card of Array.from(clone.querySelectorAll('.md-code-block'))) {
        const pre = card.querySelector('pre')
        if (pre === null) card.remove()
        else card.replaceWith(pre.cloneNode(true))
      }
      // Flatten code highlighting spans into plain code text.
      for (const pre of Array.from(clone.querySelectorAll('pre'))) {
        const fresh = document.createElement('pre')
        const code = document.createElement('code')
        code.textContent = pre.textContent ?? ''
        fresh.appendChild(code)
        pre.replaceWith(fresh)
      }
      // Keep only a small attribute whitelist.
      for (const element of Array.from(clone.querySelectorAll('*'))) {
        const tag = element.tagName
        // Diagrams and formulas are SVG/MathML trees; keep their native attributes.
        if (element.closest('svg') !== null || element.closest('math') !== null) continue
        const keep = {}
        if (tag === 'A') {
          const href = safeHref(element.getAttribute('href'))
          if (href !== null) keep.href = href
        } else if (tag === 'IMG') {
          const src = element.getAttribute('src')
          if (src !== null && src !== '') keep.src = src
          const alt = element.getAttribute('alt')
          if (alt !== null) keep.alt = alt
        } else if (tag === 'TD' || tag === 'TH') {
          for (const name of ['colspan', 'rowspan']) {
            const value = element.getAttribute(name)
            if (value !== null) keep[name] = value
          }
        } else if (tag === 'OL') {
          const start = element.getAttribute('start')
          if (start !== null) keep.start = start
        }
        for (const attribute of Array.from(element.attributes)) element.removeAttribute(attribute.name)
        for (const [name, value] of Object.entries(keep)) element.setAttribute(name, value)
      }
      for (const image of Array.from(clone.querySelectorAll('img'))) {
        if (image.getAttribute('src') === null) image.remove()
      }
      return clone
    }

    function blobToDataUrl(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new LocalizedError('error.readFailed'))
        reader.readAsDataURL(blob)
      })
    }

    /** Inline readable images so the clipboard HTML and PNG keep their pictures. */
    async function inlineImages(root) {
      const images = Array.from(root.querySelectorAll('img'))
      for (const image of images) {
        const src = image.getAttribute('src')
        if (src === null || src === '') {
          image.remove()
          continue
        }
        if (src.startsWith('data:')) continue
        try {
          const response = await fetch(src, { credentials: 'include' })
          if (!response.ok) throw new LocalizedError('error.imageFetchFailed')
          const blob = await response.blob()
          if (blob.size > MAX_IMAGE_BYTES) throw new LocalizedError('error.imageTooLarge')
          image.setAttribute('src', await blobToDataUrl(blob))
        } catch {
          image.remove()
        }
      }
    }

    function styleFor(tag, parentTag) {
      switch (tag) {
        case 'H1': return 'font-size:22px;font-weight:600;line-height:1.4;margin:20px 0 10px;color:#111827;'
        case 'H2': return 'font-size:19px;font-weight:600;line-height:1.45;margin:18px 0 8px;color:#111827;'
        case 'H3': return 'font-size:17px;font-weight:600;line-height:1.45;margin:16px 0 8px;color:#111827;'
        case 'H4': return 'font-size:15px;font-weight:600;line-height:1.5;margin:14px 0 6px;color:#111827;'
        case 'H5':
        case 'H6': return 'font-size:14px;font-weight:600;line-height:1.5;margin:12px 0 6px;color:#111827;'
        case 'P': return 'margin:8px 0;'
        case 'DIV': return 'margin:0;padding:0;'
        case 'UL':
        case 'OL': return 'margin:8px 0;padding-left:24px;'
        case 'LI': return 'margin:4px 0;'
        case 'PRE': return `margin:10px 0;padding:12px 14px;background:#f6f8fa;border:1px solid #e5e7eb;border-radius:8px;`
          + `white-space:pre-wrap;word-break:break-word;font-family:${MONO};font-size:13px;line-height:1.65;color:#24292f;`
        case 'CODE': return parentTag === 'PRE'
          ? `font-family:${MONO};font-size:13px;background:transparent;padding:0;border:none;color:inherit;`
          : `font-family:${MONO};font-size:13px;background:#f1f3f5;padding:1px 5px;border-radius:4px;color:#24292f;`
        case 'BLOCKQUOTE': return 'margin:8px 0;padding:6px 0 6px 12px;border-left:3px solid #d0d7de;color:#57606a;'
        case 'TABLE': return 'width:100%;border-collapse:collapse;table-layout:fixed;margin:10px 0;font-size:13px;'
        case 'THEAD':
        case 'TBODY':
        case 'TR': return 'margin:0;padding:0;'
        case 'TH': return 'border:1px solid #d0d7de;padding:6px 10px;background:#f6f8fa;font-weight:600;text-align:left;vertical-align:top;word-break:break-word;'
        case 'TD': return 'border:1px solid #d0d7de;padding:6px 10px;text-align:left;vertical-align:top;word-break:break-word;'
        case 'A': return 'color:#0969da;text-decoration:underline;'
        case 'STRONG': return 'font-weight:600;'
        case 'EM': return 'font-style:italic;'
        case 'HR': return 'border:none;border-top:1px solid #e5e7eb;margin:14px 0;'
        case 'IMG': return 'max-width:100%;height:auto;border-radius:6px;'
        case 'DETAILS': return 'margin:8px 0;'
        case 'SUMMARY': return 'font-weight:600;cursor:default;'
        case 'DEL':
        case 'S': return 'text-decoration:line-through;'
        case 'BR': return ''
        case 'SUP':
        case 'SUB': return 'font-size:11px;line-height:0;'
        default: return 'margin:0;padding:0;'
      }
    }

    function styleTree(root) {
      root.removeAttribute('style')
      const walk = (element, parentTag) => {
        if (element.closest('svg') !== null || element.closest('math') !== null) return
        const style = styleFor(element.tagName, parentTag)
        if (style === '') element.removeAttribute('style')
        else element.setAttribute('style', style)
        for (const child of Array.from(element.children)) walk(child, element.tagName)
      }
      for (const child of Array.from(root.children)) walk(child, root.tagName)
    }

    const BLOCK_TAGS = new Set([
      'P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'PRE',
      'BLOCKQUOTE', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'HR', 'DETAILS',
      'SUMMARY', 'FIGURE', 'FIGCAPTION', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER',
    ])

    /** Readable plain-text fallback without Markdown markers. */
    function plainTextOf(root) {
      let out = ''
      const walk = (node) => {
        if (node.nodeType === 3) {
          out += node.nodeValue ?? ''
          return
        }
        if (node.nodeType !== 1) return
        const tag = node.tagName
        if (tag === 'BR') {
          out += '\n'
          return
        }
        if (tag === 'PRE') {
          out += `\n${(node.textContent ?? '').replace(/\n+$/u, '')}\n`
          return
        }
        if (tag === 'TR') {
          const cells = Array.from(node.children).map(cell => (cell.textContent ?? '').trim())
          out += `\n${cells.join('\t')}`
          return
        }
        if (tag === 'LI') {
          if (out !== '' && !out.endsWith('\n')) out += '\n'
          out += '- '
          for (const child of Array.from(node.childNodes)) walk(child)
          out += '\n'
          return
        }
        const block = BLOCK_TAGS.has(tag)
        if (block && out !== '' && !out.endsWith('\n')) out += '\n'
        for (const child of Array.from(node.childNodes)) walk(child)
        if (block && !out.endsWith('\n')) out += '\n'
      }
      walk(root)
      return out.replace(/[ \t]+\n/gu, '\n').replace(/\n{3,}/gu, '\n\n').trim()
    }

    function wrapHtml(inner) {
      return `<div style="${BASE_STYLE}padding:2px 0;">${inner}</div>`
    }

    function loadImage(source) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new LocalizedError('error.rasterizeFailed'))
        image.src = source
      })
    }

    function canvasToBlob(canvas) {
      return new Promise((resolve) => canvas.toBlob(blob => resolve(blob), 'image/png'))
    }

    function pngFileName() {
      const now = new Date()
      const pad = value => String(value).padStart(2, '0')
      return `dsh-answer-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
        + `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.png`
    }

    function downloadBlob(blob, name) {
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = name
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

    /** Render one answer DOM into a long, white-background PNG. */
    async function renderAnswerPng(answerNode) {
      const clean = cleanClone(answerNode)
      await inlineImages(clean)
      styleTree(clean)

      const stage = document.createElement('div')
      stage.style.cssText = 'position:fixed;left:-12000px;top:0;width:900px;pointer-events:none;'
      const holder = document.createElement('div')
      holder.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
      holder.style.cssText = 'box-sizing:border-box;width:820px;padding:28px 32px;background:#ffffff;'
        + BASE_STYLE
      holder.appendChild(clean)
      stage.appendChild(holder)
      document.body.appendChild(stage)
      try {
        await nextFrame()
        const width = Math.ceil(holder.getBoundingClientRect().width)
        const height = Math.ceil(holder.scrollHeight)
        if (width < 2 || height < 2) throw new LocalizedError('error.emptyAnswer')
        const serialized = new XMLSerializer().serializeToString(holder)
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
          + `<foreignObject x="0" y="0" width="${width}" height="${height}">${serialized}</foreignObject></svg>`
        // A data URL keeps the rasterized image same-origin; blob URLs taint the canvas in Chrome.
        const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
        const image = await loadImage(source)
        let scale = 2
        if (height * scale > MAX_BITMAP_HEIGHT) scale = MAX_BITMAP_HEIGHT / height
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(width * scale))
        canvas.height = Math.max(1, Math.round(height * scale))
        const context = canvas.getContext('2d')
        if (context === null) throw new LocalizedError('error.canvasUnavailable')
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.setTransform(scale, 0, 0, scale, 0, 0)
        context.drawImage(image, 0, 0)
        const blob = await canvasToBlob(canvas)
        if (blob === null) throw new LocalizedError('error.pngEncodingFailed')
        return { blob, width, height, scaled: scale < 2 }
      } finally {
        stage.remove()
      }
    }

    async function copyAnswerImage(answerNode, t) {
      const rendered = renderAnswerPng(answerNode)
      if (navigator.clipboard?.write !== undefined && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([new ClipboardItem({
            'image/png': rendered.then(result => result.blob),
          })])
          const result = await rendered
          showToast(t(result.scaled ? 'toast.imageCopiedScaled' : 'toast.imageCopied'), 'success')
          return
        } catch {
          // Permission or clipboard support rejected the write; fall back to a download.
        }
      }
      const result = await rendered
      downloadBlob(result.blob, pngFileName())
      showToast(t('toast.imageDownloaded'), 'success')
    }

    async function downloadAnswerImage(answerNode, t) {
      const result = await renderAnswerPng(answerNode)
      downloadBlob(result.blob, pngFileName())
      showToast(t('toast.imageDownloaded'), 'success')
    }

    async function copyAnswerHtml(answerNode, t) {
      const clean = cleanClone(answerNode)
      await inlineImages(clean)
      styleTree(clean)
      const html = wrapHtml(clean.innerHTML)
      const text = plainTextOf(clean)
      if (navigator.clipboard?.write !== undefined && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([new ClipboardItem({
            'text/plain': new Blob([text], { type: 'text/plain' }),
            'text/html': new Blob([html], { type: 'text/html' }),
          })])
          showToast(t('toast.htmlCopied'), 'success')
          return
        } catch {
          // Fall through to a plain-text write.
        }
      }
      if (navigator.clipboard?.writeText === undefined) throw new LocalizedError('error.clipboardUnavailable')
      await navigator.clipboard.writeText(text)
      showToast(t('toast.textCopied'), 'warn')
    }

    /** Enhanced copy action: the usual overlapping-page copy mark with a red plus. */
    function EnhancedCopyIcon() {
      return h('svg', {
        viewBox: '0 0 20 20', width: 17, height: 17, fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
      h('g', { transform: 'translate(0 2.6) scale(.88)' },
        h('rect', { x: 1.52075, y: 4.07373, width: 10.3932, height: 10.3932, rx: 2 }),
        h('path', {
          d: 'M11.9792 1.53296C13.36 1.53296 14.4792 2.65225 14.4792 4.03296V9.42847C14.4792 10.3756 13.9521 11.1987 13.1755 11.6228V10.3298C13.3652 10.0787 13.4792 9.7674 13.4792 9.42847V4.03296C13.4792 3.20453 12.8077 2.53296 11.9792 2.53296H6.58374C6.27966 2.53301 5.99684 2.6235 5.7605 2.77905H4.42358C4.85652 2.03463 5.66056 1.53304 6.58374 1.53296H11.9792Z',
          fill: 'currentColor', stroke: 'none',
        })),
      h('path', {
        d: 'M15.75 2.55V6.85M13.6 4.7H17.9',
        stroke: '#E53935', strokeWidth: 2.05, strokeLinecap: 'round',
      }))
    }

    function CaretIcon() {
      return h('svg', {
        viewBox: '0 0 12 12', width: 11, height: 11, fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': 'true',
      }, h('path', { d: 'M2.5 4.5L6 8l3.5-3.5' }))
    }

    function AnswerShareAction(props) {
      const t = typeof props.t === 'function' ? props.t : key => DICTIONARIES.zh[key] ?? key
      const rootRef = React.useRef(null)
      const menuRef = React.useRef(null)
      const busyRef = React.useRef(false)
      const [busy, setBusy] = React.useState(false)
      const [menu, setMenu] = React.useState(null)

      React.useEffect(() => {
        if (menu === null) return undefined
        const onPointerDown = (event) => {
          if (rootRef.current?.contains(event.target) === true) return
          if (menuRef.current?.contains(event.target) === true) return
          setMenu(null)
        }
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setMenu(null)
        }
        document.addEventListener('pointerdown', onPointerDown, true)
        document.addEventListener('keydown', onKeyDown, true)
        return () => {
          document.removeEventListener('pointerdown', onPointerDown, true)
          document.removeEventListener('keydown', onKeyDown, true)
        }
      }, [menu])

      const run = async (kind) => {
        setMenu(null)
        if (busyRef.current) return
        const root = rootRef.current
        const answer = root === null ? null : findAnswerNode(root)
        if (answer === null) {
          showToast(t('toast.noAnswer'), 'warn')
          return
        }
        busyRef.current = true
        setBusy(true)
        try {
          if (kind === 'html') await copyAnswerHtml(answer, t)
          else if (kind === 'download') await downloadAnswerImage(answer, t)
          else await copyAnswerImage(answer, t)
        } catch (error) {
          showToast(t('toast.failed').replace('{reason}', errorReason(error, t)), 'error')
        } finally {
          busyRef.current = false
          setBusy(false)
        }
      }

      const openMenu = () => {
        const root = rootRef.current
        if (root === null) return
        const rect = root.getBoundingClientRect()
        const width = 204
        const height = 126
        const left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - width - 8))
        let top = rect.top - height - 8
        if (top < 8) top = Math.min(window.innerHeight - height - 8, rect.bottom + 8)
        setMenu({ left, top })
      }

      const menuItem = (kind, label) => h('button', {
        type: 'button',
        role: 'menuitem',
        onClick: () => { void run(kind) },
      }, label)

      const menuNode = menu === null ? null : h('div', {
        className: 'dsh-ans-menu',
        role: 'menu',
        ref: menuRef,
        style: { left: `${menu.left}px`, top: `${menu.top}px` },
      },
      menuItem('image', t('menu.image')),
      menuItem('html', t('menu.html')),
      menuItem('download', t('menu.download')))

      return h('span', {
        className: 'dsh-ans-share',
        ref: rootRef,
        'data-busy': busy || undefined,
      },
      h('button', {
        type: 'button',
        className: 'dsh-ans-share-main',
        title: t('action.image'),
        'aria-label': t('action.image'),
        onClick: () => { void run('image') },
      }, h(EnhancedCopyIcon)),
      h('button', {
        type: 'button',
        className: 'dsh-ans-share-caret',
        title: t('action.more'),
        'aria-label': t('action.more'),
        'aria-haspopup': 'menu',
        'aria-expanded': menu !== null,
        onClick: (event) => {
          event.preventDefault()
          event.stopPropagation()
          if (menu !== null) setMenu(null)
          else openMenu()
        },
      }, h(CaretIcon)),
      menuNode === null ? null : (createPortal === null ? menuNode : createPortal(menuNode, document.body)))
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, DICTIONARIES), '@fushouhai/dsh-session-copy-plus: dictionaries')
        ctx.effect(() => {
          const style = document.createElement('style')
          style.dataset.dshAnswerShare = ''
          style.textContent = CSS
          document.head.appendChild(style)
          return () => {
            style.remove()
            disposeToast()
          }
        }, '@fushouhai/dsh-session-copy-plus: styles and toast')
        ctx.slots.inject('conversation.chat.assistant-actions', () => ctx.slots.register({
          name: 'conversation.chat.assistant-actions',
          id: 'answer-share',
          order: 20,
          locale: NS,
          inject: sessionId => ({ sessionId }),
        }, AnswerShareAction))
      },
    }
  },
})
