// api/qwen.js
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // 从环境变量中获取你的 API Key
  const apiKey = process.env.QWEN_API_KEY; 
  const { userMessage } = req.body;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  try {
    const qwenResponse = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: [{ role: 'user', content: userMessage }]
        }
      })
    });

    const data = await qwenResponse.json();

    // ⚠️ 关键：设置 CORS 头部，允许你的博客域名访问
    // 请将 'https://你的博客域名.com' 替换为你的真实域名
    const allowedOrigins = [
  	'https://luxynth.cn',
 	'http://101.37.162.122',   // 注意，如果你的IP是http，这里也需要用http
	'http://localhost:4000'  // 方便本地开发测试
];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
	res.setHeader('Access-Control-Allow-Origin', origin); 
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // 如果请求是预检请求 (OPTIONS)，直接返回 200
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    res.status(qwenResponse.status).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch from Qwen API.' });
  }
};
