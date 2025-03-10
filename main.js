async function recognize(base64, lang, options) {
    const { utils } = options;
    const { tauriFetch: fetch } = utils;
    const { apiKey, model = "mistral-ocr-latest" } = options.config;

    const requestPath = "https://api.mistral.ai/v1/ocr";

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }

    const body = {
        model,
        document: {
            type: "image_url",
            image_url: `data:image/jpeg;base64,${base64}`
        }
    }

    let res = await fetch(requestPath, {
        method: 'POST',
        url: requestPath,
        headers: headers,
        body: {
            type: "Json",
            payload: body
        }
    });

    if (res.ok) {
        let result = res.data;

        // 只提取第一个页面的markdown内容
        if (result.pages && result.pages.length > 0) {
            return result.pages[0].markdown;
        } else {
            return "无法识别文本内容";
        }
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}
